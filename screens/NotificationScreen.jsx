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
  Platform,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Bell, Briefcase, CheckCircle2, MessageSquare, Sparkles, XCircle } from "lucide-react-native";
import AppBottomTab from "../components/AppBottomTab";
import { SESSION_KEY } from "../services/session";
import {
  clearNotificationEvents,
  deleteNotificationEvent,
  fetchNotificationEvents,
} from "../services/supabaseBookingService";
import { supabase } from "../services/supabase";
import { getUserAvatar } from "../services/profileAvatarService";

const { width, height } = Dimensions.get("window");
const sc = (n) => (width / 390) * n;

const C = {
  p1: "#8C7FFF",
  p2: "#5B4CF0",
  p3: "#3D2EC0",
  white: "#FFFFFF",
  inputBg: "#F4F2FF",
  inputBorder: "#E8E5FF",
  labelGray: "#8B8BA7",
  textDark: "#1A1740",
};

export default function NotificationScreen() {
  const [uid, setUid] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avatarMap, setAvatarMap] = useState({});

  const load = async (userId) => {
    const rows = await fetchNotificationEvents(userId);
    setNotifications(rows || []);
  };

  useEffect(() => {
    let mounted = true;
    let channel;

    const boot = async () => {
      try {
        setLoading(true);
        const raw = await AsyncStorage.getItem(SESSION_KEY);
        const session = raw ? JSON.parse(raw) : null;
        const userId = session?.uid || "";
        if (!userId) {
          setNotifications([]);
          return;
        }
        if (mounted) setUid(userId);
        await load(userId);
        const { data: bookingRows } = await supabase.from("bookings").select("id,professional_id").eq("client_id", userId);
        const map = {};
        for (const row of bookingRows || []) {
          if (!row?.professional_id) continue;
          try {
            map[row.id] = await getUserAvatar(row.professional_id, "professional");
          } catch {}
        }
        if (mounted) setAvatarMap(map);

        channel = supabase
          .channel(`client-notifications-${userId}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "notification_events",
              filter: `recipient_id=eq.${userId}`,
            },
            () => load(userId)
          )
          .subscribe();
      } catch (e) {
        console.error("Client notifications load failed:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    boot();
    return () => {
      mounted = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const onOpenNotification = async (item) => {
    try {
      await deleteNotificationEvent(item.id);
      setNotifications((prev) => prev.filter((n) => n.id !== item.id));
    } catch (e) {
      console.error("Delete notification failed:", e);
    }
  };

  const onClearAll = async () => {
    try {
      if (!uid) return;
      await clearNotificationEvents(uid);
      setNotifications([]);
    } catch (e) {
      console.error("Clear notifications failed:", e);
    }
  };

  const getIconMeta = (eventType) => {
    if (eventType === "job_accepted") return { Icon: CheckCircle2, bg: "rgba(5,150,105,0.1)", color: "#059669" };
    if (eventType === "job_declined") return { Icon: XCircle, bg: "rgba(220,38,38,0.1)", color: "#DC2626" };
    if (eventType === "chat_message") return { Icon: MessageSquare, bg: "rgba(91, 76, 240, 0.1)", color: C.p2 };
    return { Icon: Sparkles, bg: "rgba(140,127,255,0.1)", color: C.p3 };
  };

  return (
    <View style={s.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <LinearGradient colors={["#F4F3FF", "#FDFDFF"]} style={StyleSheet.absoluteFill} />
      <View style={[s.ambientOrb, { top: -sc(30), right: -sc(50), backgroundColor: "rgba(140, 127, 255, 0.14)" }]} />
      <View style={[s.ambientOrb, { bottom: height * 0.15, left: -sc(50), backgroundColor: "rgba(91, 76, 240, 0.1)" }]} />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={s.header}>
          <View style={s.headerTitleRow}>
            <Bell size={sc(22)} color={C.textDark} />
            <Text style={s.headerTitle}>Notifications</Text>
            {notifications.length > 0 && (
              <LinearGradient colors={[C.p1, C.p2]} style={s.badgeCount}>
                <Text style={s.badgeCountText}>{notifications.length}</Text>
              </LinearGradient>
            )}
          </View>
          <TouchableOpacity style={s.markReadBtn} onPress={onClearAll} activeOpacity={0.7}>
            <Text style={s.markReadText}>Clear</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollArea}>
          {loading ? (
            <View style={s.emptyState}><Text style={s.emptyTitle}>Loading updates...</Text></View>
          ) : notifications.length === 0 ? (
            <View style={s.emptyState}>
              <Text style={s.emptyTitle}>No notifications</Text>
              <Text style={s.emptySub}>New alerts will appear here and auto-remove when opened.</Text>
            </View>
          ) : (
            notifications.map((item) => {
              const meta = getIconMeta(item.event_type);
              const Icon = meta.Icon;
              return (
                <TouchableOpacity key={String(item.id)} style={s.cardOuterWrapper} activeOpacity={0.8} onPress={() => onOpenNotification(item)}>
                  <BlurView intensity={Platform.OS === "ios" ? 45 : 95} tint="light" style={s.glassCard}>
                    <View style={[s.iconBox, { backgroundColor: meta.bg }]}>
                      {avatarMap[item.booking_id] ? <Image source={{ uri: avatarMap[item.booking_id] }} style={s.nAvatar} /> : <Icon size={sc(18)} color={meta.color} strokeWidth={2.2} />}
                    </View>
                    <View style={s.contentBlock}>
                      <Text style={s.notifyTitle} numberOfLines={1}>{item.title}</Text>
                      <Text style={s.notifyDescription}>{item.body || "Tap to dismiss"}</Text>
                    </View>
                  </BlurView>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </SafeAreaView>
      <AppBottomTab />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  ambientOrb: { position: "absolute", width: sc(260), height: sc(260), borderRadius: sc(130) },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingTop: Platform.OS === "ios" ? 10 : 20, marginBottom: 15 },
  headerTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerTitle: { fontSize: sc(24), fontWeight: "900", color: C.textDark, letterSpacing: -0.5 },
  badgeCount: { minWidth: 20, height: 20, borderRadius: 10, paddingHorizontal: 6, justifyContent: "center", alignItems: "center" },
  badgeCountText: { color: C.white, fontSize: 10, fontWeight: "900" },
  markReadBtn: { paddingVertical: 8, paddingHorizontal: 4 },
  markReadText: { fontSize: sc(13), fontWeight: "700", color: C.p2 },
  scrollArea: { paddingHorizontal: 24, paddingBottom: 100, paddingTop: 5 },
  cardOuterWrapper: { marginBottom: 12, borderRadius: 24, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.7)", elevation: 2, shadowColor: C.p3, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.03, shadowRadius: 10 },
  glassCard: { flexDirection: "row", padding: 16, backgroundColor: "rgba(255, 255, 255, 0.45)", alignItems: "flex-start" },
  iconBox: { width: sc(44), height: sc(44), borderRadius: 14, justifyContent: "center", alignItems: "center" },
  nAvatar: { width: sc(44), height: sc(44), borderRadius: 14 },
  contentBlock: { flex: 1, marginLeft: 14, marginRight: 10 },
  notifyTitle: { fontSize: sc(14), fontWeight: "800", color: C.textDark, letterSpacing: -0.1 },
  notifyDescription: { fontSize: sc(12), color: C.labelGray, marginTop: 4, lineHeight: sc(18), fontWeight: "500" },
  emptyState: { paddingVertical: height * 0.12, alignItems: "center", paddingHorizontal: 36 },
  emptyTitle: { fontSize: sc(16), fontWeight: "800", color: C.textDark },
  emptySub: { fontSize: sc(12), color: C.labelGray, textAlign: "center", marginTop: 6, lineHeight: 18, fontWeight: "500" },
});
