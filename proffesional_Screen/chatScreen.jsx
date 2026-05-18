import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronLeft, Send } from "lucide-react-native";
import { useLocalSearchParams } from "expo-router";
import ProBottomTab from "../components/ProBottomTab";
import { SESSION_KEY } from "../services/session";
import { supabase } from "../services/supabase";
import { createNotificationEvent } from "../services/supabaseBookingService";
import { getUserAvatar } from "../services/profileAvatarService";

const { width } = Dimensions.get("window");
const sc = (n) => (width / 390) * n;

const C = {
  p1: "#8C7FFF",
  p2: "#5B4CF0",
  textDark: "#1A1740",
  labelGray: "#8B8BA7",
  inputBorder: "#E8E5FF",
};
const CHAT_SEEN_KEY_PREFIX = "chat_seen_pro_";

export default function ChatScreenApp() {
  const params = useLocalSearchParams();
  const routeBookingId = params?.bookingId ? Number(params.bookingId) : null;

  const [uid, setUid] = useState("");
  const [inbox, setInbox] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [avatarMap, setAvatarMap] = useState({});
  const [unreadMap, setUnreadMap] = useState({});

  const getSeenKey = (userId) => `${CHAT_SEEN_KEY_PREFIX}${userId}`;

  const loadSeenMap = async (userId) => {
    try {
      const raw = await AsyncStorage.getItem(getSeenKey(userId));
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  const saveSeenMap = async (userId, seenMap) => {
    try {
      await AsyncStorage.setItem(getSeenKey(userId), JSON.stringify(seenMap || {}));
    } catch {}
  };

  useEffect(() => {
    let mounted = true;
    let channel;

    const load = async () => {
      const raw = await AsyncStorage.getItem(SESSION_KEY);
      const session = raw ? JSON.parse(raw) : null;
      const userId = session?.uid || "";
      if (!userId) return;
      if (mounted) setUid(userId);

      const { data: bookings } = await supabase
        .from("bookings")
        .select("id,professional_id,client_id,service_type,status,scheduled_date,scheduled_time")
        .eq("professional_id", userId)
        .in("status", ["accepted", "completed"])
        .order("created_at", { ascending: false });

      const rawList = bookings || [];
      const clientIds = Array.from(new Set(rawList.map((b) => b.client_id).filter(Boolean)));
      let clientNameMap = {};
      if (clientIds.length > 0) {
        const { data: profileRows } = await supabase
          .from("profiles")
          .select("id,name")
          .in("id", clientIds);
        for (const p of profileRows || []) {
          clientNameMap[p.id] = p.name || "Client";
        }
      }

      const list = rawList.map((b) => ({
        bookingId: b.id,
        peerId: b.client_id,
        title: clientNameMap[b.client_id] || "Client",
        subtitle: `${b.scheduled_date || "Date"} | ${b.scheduled_time || "Time"}`,
      }));

      const ids = rawList.map((b) => b.id);
      let incomingLatestMap = {};
      if (ids.length > 0) {
        const { data: incomingRows } = await supabase
          .from("chat_messages")
          .select("booking_id,created_at,sender_id")
          .in("booking_id", ids)
          .neq("sender_id", userId)
          .order("created_at", { ascending: false });
        for (const row of incomingRows || []) {
          if (!incomingLatestMap[row.booking_id]) incomingLatestMap[row.booking_id] = row.created_at;
        }
      }

      const seenMap = await loadSeenMap(userId);
      const nextUnreadMap = {};
      for (const row of list) {
        const latestIncoming = incomingLatestMap[row.bookingId];
        const seenAt = seenMap[String(row.bookingId)];
        nextUnreadMap[String(row.bookingId)] = Boolean(
          latestIncoming && (!seenAt || new Date(latestIncoming).getTime() > new Date(seenAt).getTime())
        );
      }

      if (mounted) {
        const map = {};
        for (const row of list) {
          map[row.peerId] = await getUserAvatar(row.peerId, "client");
        }
        setAvatarMap(map);
        setInbox(list);
        setUnreadMap(nextUnreadMap);
        if (routeBookingId) {
          const found = list.find((x) => x.bookingId === routeBookingId);
          if (found) setActive(found);
        }
      }
    };

    load();
    channel = supabase
      .channel("chat-pro-inbox-updates")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, () => load())
      .subscribe();
    return () => {
      mounted = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, [routeBookingId]);

  useEffect(() => {
    if (!active?.bookingId) return;

    let mounted = true;
    let channel;

    const loadThread = async () => {
      const { data } = await supabase
        .from("chat_messages")
        .select("id,booking_id,sender_id,receiver_id,message,created_at")
        .eq("booking_id", active.bookingId)
        .order("created_at", { ascending: true });
      if (mounted) setMessages(data || []);
    };

    loadThread();

    channel = supabase
      .channel(`chat-pro-${active.bookingId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_messages", filter: `booking_id=eq.${active.bookingId}` },
        () => loadThread()
      )
      .subscribe();

    return () => {
      mounted = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, [active?.bookingId]);

  useEffect(() => {
    const markSeen = async () => {
      if (!uid || !active?.bookingId) return;
      const seenMap = await loadSeenMap(uid);
      const nextSeenMap = {
        ...seenMap,
        [String(active.bookingId)]: new Date().toISOString(),
      };
      await saveSeenMap(uid, nextSeenMap);
      setUnreadMap((prev) => ({ ...prev, [String(active.bookingId)]: false }));
    };
    markSeen();
  }, [active?.bookingId, uid]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || !uid || !active?.bookingId || !active?.peerId) return;

    const { error } = await supabase.from("chat_messages").insert([
      {
        booking_id: active.bookingId,
        sender_id: uid,
        receiver_id: active.peerId,
        message: text,
      },
    ]);

    if (!error) {
      await createNotificationEvent({
        recipientId: active.peerId,
        eventType: "chat_message",
        title: "New message from professional",
        body: text,
        bookingId: active.bookingId,
      });
      setInput("");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <LinearGradient colors={["#F4F3FF", "#FDFDFF"]} style={StyleSheet.absoluteFill} />

      {!active ? (
        <SafeAreaView style={{ flex: 1 }}>
          <View style={s.header}><Text style={s.title}>Client Chats</Text></View>
          <ScrollView contentContainerStyle={s.scroll}>
            {inbox.map((item) => (
              <TouchableOpacity key={String(item.bookingId)} style={s.row} onPress={() => setActive(item)} activeOpacity={0.8}>
                <Image source={{ uri: avatarMap[item.peerId] }} style={s.avatar} />
                <View style={{ flex: 1 }}>
                <Text style={s.rowTitle}>{item.title}</Text>
                <Text style={s.rowSub}>{item.subtitle}</Text>
                </View>
                {unreadMap[String(item.bookingId)] ? <View style={s.unreadDot} /> : null}
              </TouchableOpacity>
            ))}
            {inbox.length === 0 ? <Text style={s.empty}>No accepted bookings for chat yet.</Text> : null}
          </ScrollView>
        </SafeAreaView>
      ) : (
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          <View style={s.topRow}>
            <TouchableOpacity onPress={() => setActive(null)} style={s.backBtn}><ChevronLeft size={20} color={C.textDark} /></TouchableOpacity>
            <Image source={{ uri: avatarMap[active?.peerId] }} style={s.headerAvatar} />
            <Text style={s.topTitle}>{active?.title || "Chat"}</Text>
            <View style={{ width: 40 }} />
          </View>
          <ScrollView contentContainerStyle={s.chatScroll}>
            {messages.map((m) => {
              const mine = m.sender_id === uid;
              return (
                <View key={String(m.id)} style={[s.msgWrap, mine ? s.right : s.left]}>
                  <View style={[s.msgBubble, mine ? s.sent : s.received]}>
                    <Text style={[s.msgTxt, mine && { color: "#fff" }]}>{m.message}</Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
          <View style={s.inputRow}>
            <TextInput value={input} onChangeText={setInput} placeholder="Type message" placeholderTextColor={C.labelGray} style={s.input} />
            <TouchableOpacity style={s.sendBtn} onPress={sendMessage} activeOpacity={0.8}>
              <LinearGradient colors={[C.p1, C.p2]} style={s.sendGrad}><Send size={14} color="#fff" /></LinearGradient>
            </TouchableOpacity>
          </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      )}
      <ProBottomTab />
    </View>
  );
}

const s = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: Platform.OS === "ios" ? 8 : 20, paddingBottom: 12 },
  title: { fontSize: sc(24), fontWeight: "900", color: C.textDark },
  scroll: { paddingHorizontal: 20, paddingBottom: 110, gap: 10 },
  row: { backgroundColor: "rgba(255,255,255,0.8)", borderWidth: 1, borderColor: C.inputBorder, borderRadius: 14, padding: 12, flexDirection: "row", gap: 10, alignItems: "center" },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#eee" },
  headerAvatar: { width: 30, height: 30, borderRadius: 15, marginRight: 8 },
  rowTitle: { fontSize: sc(13), fontWeight: "800", color: C.textDark },
  rowSub: { fontSize: sc(11), color: C.labelGray, marginTop: 2 },
  empty: { color: C.labelGray, textAlign: "center", marginTop: 20, fontWeight: "700" },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: Platform.OS === "ios" ? 8 : 20, paddingBottom: 10 },
  backBtn: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  topTitle: { fontSize: sc(14), fontWeight: "800", color: C.textDark, flex: 1, textAlign: "center" },
  chatScroll: { paddingHorizontal: 16, paddingBottom: 90 },
  msgWrap: { marginBottom: 10, maxWidth: "80%" },
  left: { alignSelf: "flex-start" },
  right: { alignSelf: "flex-end" },
  msgBubble: { paddingHorizontal: 12, paddingVertical: 9, borderRadius: 12 },
  received: { backgroundColor: "#fff", borderWidth: 1, borderColor: C.inputBorder },
  sent: { backgroundColor: C.p2 },
  msgTxt: { color: C.textDark, fontWeight: "600" },
  inputRow: { paddingHorizontal: 12, paddingBottom: 86, paddingTop: 8, flexDirection: "row", alignItems: "center", gap: 8 },
  input: { flex: 1, height: 46, borderRadius: 12, borderWidth: 1, borderColor: C.inputBorder, backgroundColor: "#fff", paddingHorizontal: 12, color: C.textDark },
  sendBtn: { width: 44, height: 44, borderRadius: 12, overflow: "hidden" },
  sendGrad: { flex: 1, alignItems: "center", justifyContent: "center" },
  unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#2563EB" },
});
