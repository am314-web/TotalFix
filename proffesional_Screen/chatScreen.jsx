import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Image,
  TextInput,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import {
  ChevronLeft,
  Search,
  MessageCircle,
  Phone,
  Info,
  Plus,
  Smile,
  Send,
  Check,
  CheckCheck,
  Mic,
  Play,
  Image as ImageIcon,
  User,
  MapPin,
} from "lucide-react-native";
import AppBottomTab from "../components/AppBottomTab";

const { width, height } = Dimensions.get("window");
const sc = (n) => (width / 390) * n;

// ─── DESIGN TOKENS ───────────────────────────────────────────
const C = {
  p1: "#8C7FFF",
  p2: "#5B4CF0",
  p3: "#3D2EC0",
  p4: "#1B108E",
  dark: "#150C72",
  white: "#FFFFFF",
  offWhite: "#F8F7FF",
  inputBg: "#F4F2FF",
  inputBorder: "#E8E5FF",
  labelGray: "#8B8BA7",
  textDark: "#1A1740",
  textMuted: "#B0B0C8",
};

// ─── PROVIDER-SIDE MOCK CHAT LIST ────────────────────────────
const CHATS = [
  {
    id: "1",
    name: "Alok Mourya",
    role: "Client • Order #AC-9921",
    avatar: "https://i.pravatar.cc/150?u=alok",
    lastMessage: "Please let me know once you cross the Iscon cross roads...",
    time: "2 min",
    unread: 1,
    online: true,
  },
  {
    id: "2",
    name: "Amit Patel",
    role: "Client • Order #AC-9874",
    avatar: "https://i.pravatar.cc/150?u=amit",
    lastMessage: "The outdoor unit is installed on the balcony grill.",
    time: "45 min",
    unread: 0,
    online: false,
  },
  {
    id: "3",
    name: "Support Desk",
    role: "Platform Ops Compliance",
    avatar: "https://i.pravatar.cc/150?u=support",
    lastMessage: "Your payout for this week has been verified and released.",
    time: "2 hours",
    unread: 0,
    online: true,
  },
];

// ─── ACTIVE CONVERSATION STATE WITH ALOK MOURYA ──────────────
const CONVERSATION = [
  { id: "m1", type: "received", text: "Hello Rahul, are you on your way for the AC service? Split AC Jet cleaning.", time: "2:15 PM" },
  { id: "m2", type: "sent", text: "Yes Alok, loading the jet pump equipment. Will leave from Vastrapur hub in 5 mins.", time: "2:18 PM", status: "read" },
  { id: "m3", type: "sent", isAudio: true, duration: "00:45", time: "2:19 PM", status: "read" },
  { id: "m4", type: "received", text: "Perfect. Please let me know once you cross the Iscon cross roads, thank you!", time: "2:22 PM" },
];

export default function ChatScreenApp() {
  const [viewState, setViewState] = useState("inbox"); // "inbox" or "conversation"
  const [activeUser, setActiveUser] = useState(null);
  const [inputText, setInputText] = useState("");

  // ─── VIEW 1: MESSAGES FEED (INBOX) ─────────────────────────
  const renderInboxScreen = () => (
    <SafeAreaView style={{ flex: 1 }}>
      {/* HEADER */}
      <View style={s.inboxHeader}>
        <Text style={s.largeTitle}>Client Chats</Text>
        <TouchableOpacity style={s.circleBarBtn} activeOpacity={0.75}>
          <Search size={sc(20)} color={C.textDark} strokeWidth={2.2} />
        </TouchableOpacity>
      </View>

      {/* CHATS ITERATION SCROLL */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.inboxScroll}>
        {CHATS.map((chat) => (
          <TouchableOpacity
            key={chat.id}
            activeOpacity={0.85}
            onPress={() => {
              setActiveUser(chat);
              setViewState("conversation");
            }}
            style={s.chatRowWrapper}
          >
            <BlurView intensity={Platform.OS === 'ios' ? 45 : 95} tint="light" style={s.inboxGlassCard}>
              <View style={s.avatarContainer}>
                <Image source={{ uri: chat.avatar }} style={s.feedAvatar} />
                {chat.online && <View style={s.onlineIndicator} />}
              </View>

              <View style={s.chatBodyDetails}>
                <View style={s.chatMetaRow}>
                  <Text style={s.profileNameText} numberOfLines={1}>{chat.name}</Text>
                  <Text style={s.metaTimeText}>{chat.time}</Text>
                </View>
                <Text style={s.proRoleText}>{chat.role}</Text>
                <Text style={s.lastMessageSnippet} numberOfLines={1}>{chat.lastMessage}</Text>
              </View>

              {chat.unread > 0 && (
                <LinearGradient colors={[C.p1, C.p2]} style={s.unreadBadge}>
                  <Text style={s.unreadCountText}>{chat.unread}</Text>
                </LinearGradient>
              )}
            </BlurView>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );

  // ─── VIEW 2: ACTIVE CLIENT CONVERSATION CONSOLE ─────────────
  const renderConversationScreen = () => (
    <SafeAreaView style={{ flex: 1 }}>
      {/* HEADER BAR PANEL */}
      <View style={s.convoHeader}>
        <TouchableOpacity style={s.iconHeaderBtn} onPress={() => setViewState("inbox")} activeOpacity={0.75}>
          <ChevronLeft size={sc(22)} color={C.textDark} strokeWidth={2.5} />
        </TouchableOpacity>

        <View style={s.headerMetaProfile}>
          <Text style={s.convoHeaderTitle}>{activeUser?.name || "Alok Mourya"}</Text>
          <Text style={s.convoHeaderSub}>{activeUser?.role || "Client • Order #AC-9921"}</Text>
        </View>

        <TouchableOpacity style={s.iconHeaderBtn} activeOpacity={0.75}>
          <Phone size={sc(18)} color={C.textDark} strokeWidth={2.2} />
        </TouchableOpacity>
      </View>

      {/* MESSAGE CONSOLE TRAIL FEED */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.convoScrollArea}>
        <View style={s.dateIndicatorWrap}>
          <BlurView intensity={50} tint="light" style={s.datePill}>
            <Text style={s.datePillText}>Active Booking Thread</Text>
          </BlurView>
        </View>

        {CONVERSATION.map((msg) => {
          const isSent = msg.type === "sent";
          return (
            <View key={msg.id} style={[s.msgBubbleWrapper, isSent ? s.msgAlignRight : s.msgAlignLeft]}>
              {msg.isAudio ? (
                /* VOICE AUDIOPACK HOUSING */
                <BlurView intensity={90} tint="light" style={s.audioNodeCard}>
                  <TouchableOpacity style={s.audioPlayBtn}>
                    <LinearGradient colors={[C.p1, C.p2]} style={s.audioPlayGrad}>
                      <Play size={12} color={C.white} fill={C.white} style={{ marginLeft: 2 }} />
                    </LinearGradient>
                  </TouchableOpacity>
                  <View style={s.waveContainer}>
                    {[4, 18, 12, 24, 8, 16, 22, 10, 14, 6, 20, 12, 16, 4, 10].map((h, idx) => (
                      <View key={idx} style={[s.waveBar, { height: sc(h) }]} />
                    ))}
                  </View>
                  <Text style={s.audioDurationText}>{msg.duration}</Text>
                </BlurView>
              ) : (
                /* STANDALONE TEXT BUBBLE */
                <View style={[s.msgTextBubble, isSent ? s.bubbleSentBg : s.bubbleReceivedBg]}>
                  <Text style={[s.msgBodyText, isSent ? s.textWhiteColor : s.textDarkColor]}>
                    {msg.text}
                  </Text>
                </View>
              )}
              <View style={[s.msgTimestampRow, isSent && { justifyContent: "flex-end" }]}>
                <Text style={s.msgTimestampText}>{msg.time}</Text>
                {isSent && msg.status === "read" && <CheckCheck size={14} color={C.p2} style={{ marginLeft: 4 }} />}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* DOCK BAR KEYBOARD INPUT CONSOLE */}
      <View style={s.inputConsoleDock}>
        <BlurView intensity={Platform.OS === 'ios' ? 45 : 95} tint="light" style={s.consoleGlassFrame}>
          <TouchableOpacity style={s.consoleActionBtn} activeOpacity={0.7}>
            <Plus size={sc(20)} color={C.p2} strokeWidth={2.5} />
          </TouchableOpacity>

          <TextInput
            placeholder="Send update to client..."
            placeholderTextColor={C.textMuted}
            value={inputText}
            onChangeText={setInputText}
            style={s.textEntryBar}
          />

          <TouchableOpacity style={s.consoleActionBtn} activeOpacity={0.7}>
            <ImageIcon size={sc(18)} color={C.labelGray} strokeWidth={2} />
          </TouchableOpacity>

          {inputText.trim().length > 0 ? (
            <TouchableOpacity style={s.sendExecutionBtn} activeOpacity={0.8}>
              <LinearGradient colors={[C.p1, C.p2]} style={s.sendBtnGrad}>
                <Send size={14} color={C.white} />
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={s.consoleActionBtn} activeOpacity={0.7}>
              <Mic size={sc(20)} color={C.p2} strokeWidth={2} />
            </TouchableOpacity>
          )}
        </BlurView>
      </View>
    </SafeAreaView>
  );

  return (
    <View style={s.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <LinearGradient colors={["#F4F3FF", "#FDFDFF"]} style={StyleSheet.absoluteFill} />

      {/* AMBIENT RADIAL GLASS BLOBS */}
      <View style={[s.ambientOrb, { top: -sc(40), left: -sc(40), backgroundColor: "rgba(140, 127, 255, 0.14)" }]} />
      <View style={[s.ambientOrb, { bottom: height * 0.2, right: -sc(60), backgroundColor: "rgba(91, 76, 240, 0.1)" }]} />

      {viewState === "inbox" ? renderInboxScreen() : renderConversationScreen()}
      <AppBottomTab />
    </View>
  );
}

// ─── ARCHITECTURAL CORE DESIGN SYSTEM MAPPINGS ───────────────
const s = StyleSheet.create({
  container: { flex: 1 },
  ambientOrb: { position: "absolute", width: sc(280), height: sc(280), borderRadius: sc(140) },
  
  // INBOX CONSOLE LAYOUT
  inboxHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 10 : 20, marginBottom: 15 },
  largeTitle: { fontSize: sc(26), fontWeight: "900", color: C.textDark, letterSpacing: -0.6 },
  circleBarBtn: { width: sc(40), height: sc(40), borderRadius: 14, backgroundColor: C.white, borderWidth: 1, borderColor: C.inputBorder, justifyContent: "center", alignItems: "center", elevation: 1 },
  inboxScroll: { paddingHorizontal: 24, paddingBottom: 120, paddingTop: 5 },
  chatRowWrapper: { marginBottom: 14, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)', elevation: 3, shadowColor: C.p3, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12 },
  inboxGlassCard: { flexDirection: "row", padding: 16, backgroundColor: "rgba(255, 255, 255, 0.45)", alignItems: "center" },
  avatarContainer: { position: "relative" },
  feedAvatar: { width: sc(52), height: sc(52), borderRadius: 18, backgroundColor: C.inputBg, borderWidth: 1, borderColor: C.inputBorder },
  onlineIndicator: { position: "absolute", bottom: -2, right: -2, width: 14, height: 14, borderRadius: 7, backgroundColor: C.success, borderWidth: 2.5, borderColor: C.white },
  chatBodyDetails: { flex: 1, marginLeft: 14, marginRight: 8 },
  chatMetaRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  profileNameText: { fontSize: sc(15), fontWeight: "800", color: C.textDark, flex: 1, marginRight: 10, letterSpacing: -0.1 },
  metaTimeText: { fontSize: sc(11), color: C.labelGray, fontWeight: "700" },
  proRoleText: { fontSize: sc(11), fontWeight: "800", color: C.p2, textTransform: "uppercase", marginTop: 2, letterSpacing: 0.3 },
  lastMessageSnippet: { fontSize: sc(13), color: C.labelGray, marginTop: 4, fontWeight: "600" },
  unreadBadge: { width: 20, height: 20, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  unreadCountText: { color: C.white, fontSize: 10, fontWeight: "900" },

  // ACTIVE FEED WINDOW ARCHITECTURE
  convoHeader: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "rgba(232, 229, 255, 0.6)" },
  iconHeaderBtn: { width: sc(40), height: sc(40), borderRadius: 12, justifyContent: "center", alignItems: "center" },
  headerMetaProfile: { flex: 1, alignItems: "center", paddingHorizontal: 10 },
  convoHeaderTitle: { fontSize: sc(16), fontWeight: "800", color: C.textDark, letterSpacing: -0.2 },
  convoHeaderSub: { fontSize: sc(11), color: C.labelGray, fontWeight: "700", textTransform: "uppercase", marginTop: 2, letterSpacing: 0.3 },
  convoScrollArea: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 140 },
  dateIndicatorWrap: { alignItems: "center", marginBottom: 24 },
  datePill: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 12, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.65)", borderWidth: 1, borderColor: "rgba(255,255,255,0.5)" },
  datePillText: { fontSize: sc(11), color: C.p2, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.5 },
  
  // MESSAGE BUBBLES
  msgBubbleWrapper: { maxWidth: "80%", marginBottom: 18 },
  msgAlignLeft: { alignSelf: "flex-start" },
  msgAlignRight: { alignSelf: "flex-end" },
  msgTextBubble: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20 },
  bubbleReceivedBg: { backgroundColor: C.white, borderTopLeftRadius: 4, borderWidth: 1, borderColor: C.inputBorder },
  bubbleSentBg: { backgroundColor: C.p2, borderTopRightRadius: 4 },
  msgBodyText: { fontSize: sc(14), lineHeight: sc(21), fontWeight: "600" },
  textWhiteColor: { color: C.white },
  textDarkColor: { color: C.textDark },
  msgTimestampRow: { flexDirection: "row", alignItems: "center", marginTop: 4, paddingHorizontal: 4 },
  msgTimestampText: { fontSize: sc(10), color: C.labelGray, fontWeight: "600" },

  // AUDIO RECORDING METADATA INTERFACE
  audioNodeCard: { flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 20, borderTopLeftRadius: 4, backgroundColor: "rgba(255,255,255,0.65)", borderWidth: 1, borderColor: "rgba(255,255,255,0.7)", overflow: "hidden" },
  audioPlayBtn: { width: 32, height: 32, borderRadius: 16, overflow: "hidden" },
  audioPlayGrad: { flex: 1, justifyContent: "center", alignItems: "center" },
  waveContainer: { flexDirection: "row", alignItems: "center", gap: 3, marginHorizontal: 12, height: 30 },
  waveBar: { width: 2, backgroundColor: C.p2, borderRadius: 1 },
  audioDurationText: { fontSize: sc(11), color: C.textDark, fontWeight: "800" },

  // SYSTEM CONTROL CONSOLE BAR
  inputConsoleDock: { position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingBottom: Platform.OS === 'ios' ? 35 : 20, paddingTop: 12, backgroundColor: "transparent" },
  consoleGlassFrame: { flexDirection: "row", alignItems: "center", padding: 6, borderRadius: 22, backgroundColor: "rgba(255, 255, 255, 0.65)", borderWidth: 1, borderColor: "rgba(255,255,255,0.8)" },
  consoleActionBtn: { width: sc(36), height: sc(36), justifyContent: "center", alignItems: "center" },
  textEntryBar: { flex: 1, height: sc(40), paddingHorizontal: 10, fontSize: sc(14), color: C.textDark, fontWeight: "600" },
  sendExecutionBtn: { width: sc(36), height: sc(36), borderRadius: 12, overflow: "hidden" },
  sendBtnGrad: { flex: 1, justifyContent: "center", alignItems: "center" }
});