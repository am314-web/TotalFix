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
  MoreVertical,
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

// ─── MOCK DATA ───────────────────────────────────────────────
const CHATS = [
  {
    id: "1",
    name: "Rahul Sharma",
    role: "AC Repair Expert",
    avatar: require("../assets/images/proffesional/electricianimage.png"),
    lastMessage: "I'm on my way home but I needed to stop by the hardware store...",
    time: "5 min",
    unread: 1,
    online: true,
  },
  {
    id: "2",
    name: "Suresh Verma",
    role: "Cleaning Specialist",
    avatar: require("../assets/images/proffesional/cleanerimage.png"),
    lastMessage: "I've completed the living room deep cleaning. What are you doing?",
    time: "15 min",
    unread: 0,
    online: false,
  },
  {
    id: "3",
    name: "Ankit Patel",
    role: "Electrical Engineer",
    avatar: require("../assets/images/proffesional/plumberimage.png"),
    lastMessage: "I'm working now. I'm making a deposit for our project materials.",
    time: "1 hour",
    unread: 0,
    online: true,
  },
  {
    id: "4",
    name: "Priya Desai",
    role: "Plumbing Technician",
    avatar: require("../assets/images/proffesional/beautician.png"),
    lastMessage: "Great seeing you. I have to go now. I'll talk to you later.",
    time: "5 hour",
    unread: 0,
    online: false,
  },
];

const CONVERSATION = [
  { id: "m1", type: "received", text: "I'm meeting a friend here for dinner. How about you? 😊", time: "5:30 PM" },
  { id: "m2", type: "received", isAudio: true, duration: "02:30", time: "5:45 PM" },
  { id: "m3", type: "sent", text: "I'm doing my homework, but I really need to take a break.", time: "5:48 PM", status: "read" },
  { id: "m4", type: "received", text: "On my way home but I needed to stop by the book store to buy a text book. 😎", time: "5:58 PM" },
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
        <Text style={s.largeTitle}>Messages</Text>
        <TouchableOpacity style={s.circleBarBtn} activeOpacity={0.75}>
          <Search size={sc(20)} color={C.textDark} strokeWidth={2.2} />
        </TouchableOpacity>
      </View>

      {/* FEED FEED */}
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
                <Image source={chat.avatar} style={s.feedAvatar} />
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

      {/* FLOATING ACTION ACTION */}
      <TouchableOpacity style={s.floatingFab} activeOpacity={0.85}>
        <LinearGradient colors={[C.p1, C.p3]} style={s.fabGradient}>
          <Plus size={sc(24)} color={C.white} strokeWidth={2.5} />
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );

  // ─── VIEW 2: ACTIVE CONVERSATION WINDOW ────────────────────
  const renderConversationScreen = () => (
    <SafeAreaView style={{ flex: 1 }}>
      {/* CHAT APPMAR */}
      <View style={s.convoHeader}>
        <TouchableOpacity style={s.iconHeaderBtn} onPress={() => setViewState("inbox")} activeOpacity={0.75}>
          <ChevronLeft size={sc(22)} color={C.textDark} strokeWidth={2.5} />
        </TouchableOpacity>

        <View style={s.headerMetaProfile}>
          <Text style={s.convoHeaderTitle}>{activeUser?.name || "Shane Martinez"}</Text>
          <Text style={s.convoHeaderSub}>{activeUser?.role || "AC Repair Expert"}</Text>
        </View>

        <TouchableOpacity style={s.iconHeaderBtn} activeOpacity={0.75}>
          <Info size={sc(20)} color={C.textDark} strokeWidth={2.2} />
        </TouchableOpacity>
      </View>

      {/* CHAT THREAD PORTAL */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.convoScrollArea}>
        <View style={s.dateIndicatorWrap}>
          <BlurView intensity={50} tint="light" style={s.datePill}>
            <Text style={s.datePillText}>Today</Text>
          </BlurView>
        </View>

        {CONVERSATION.map((msg) => {
          const isSent = msg.type === "sent";
          return (
            <View key={msg.id} style={[s.msgBubbleWrapper, isSent ? s.msgAlignRight : s.msgAlignLeft]}>
              {msg.isAudio ? (
                /* AUDIO LOGIC PANEL */
                <BlurView intensity={90} tint="light" style={s.audioNodeCard}>
                  <TouchableOpacity style={s.audioPlayBtn}>
                    <LinearGradient colors={[C.p1, C.p2]} style={s.audioPlayGrad}>
                      <Play size={12} color={C.white} fill={C.white} style={{ marginLeft: 2 }} />
                    </LinearGradient>
                  </TouchableOpacity>
                  {/* Mock Visualizer Waves */}
                  <View style={s.waveContainer}>
                    {[4, 18, 12, 24, 8, 16, 22, 10, 14, 6, 20, 12, 16, 4, 10].map((h, idx) => (
                      <View key={idx} style={[s.waveBar, { height: sc(h) }]} />
                    ))}
                  </View>
                  <Text style={s.audioDurationText}>{msg.duration}</Text>
                </BlurView>
              ) : (
                /* STANDALONE TEXT NODE */
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

      {/* SYSTEM DOCK CONSOLE INPUT */}
      <View style={s.inputConsoleDock}>
        <BlurView intensity={Platform.OS === 'ios' ? 45 : 95} tint="light" style={s.consoleGlassFrame}>
          <TouchableOpacity style={s.consoleActionBtn} activeOpacity={0.7}>
            <Plus size={sc(20)} color={C.p2} strokeWidth={2.5} />
          </TouchableOpacity>

          <TextInput
            placeholder="Message..."
            placeholderTextColor={C.textMuted}
            value={inputText}
            onChangeText={setInputText}
            style={s.textEntryBar}
          />

          <TouchableOpacity style={s.consoleActionBtn} activeOpacity={0.7}>
            <Smile size={sc(20)} color={C.labelGray} strokeWidth={2} />
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

      {/* GLASS DEPTH LAYERS */}
      <View style={[s.ambientOrb, { top: -sc(40), left: -sc(40), backgroundColor: "rgba(140, 127, 255, 0.14)" }]} />
      <View style={[s.ambientOrb, { bottom: height * 0.2, right: -sc(60), backgroundColor: "rgba(91, 76, 240, 0.1)" }]} />

      {viewState === "inbox" ? renderInboxScreen() : renderConversationScreen()}
      <AppBottomTab />
    </View>
  );
}

// ─── CORE LAYOUT ARCHITECTURAL STYLES ────────────────────────
const s = StyleSheet.create({
  container: { flex: 1 },
  ambientOrb: { position: "absolute", width: sc(280), height: sc(280), borderRadius: sc(140) },
  
  // INBOX UI CONFIGURATION
  inboxHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 10 : 20, marginBottom: 15 },
  largeTitle: { fontSize: sc(28), fontWeight: "900", color: C.textDark, letterSpacing: -0.6 },
  circleBarBtn: { width: sc(44), height: sc(44), borderRadius: 15, backgroundColor: C.white, borderWidth: 1, borderColor: C.inputBorder, justifyContent: "center", alignItems: "center" },
  inboxScroll: { paddingHorizontal: 24, paddingBottom: 120, paddingTop: 5 },
  chatRowWrapper: { marginBottom: 14, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)' },
  inboxGlassCard: { flexDirection: "row", padding: 16, backgroundColor: "rgba(255, 255, 255, 0.45)", alignItems: "center" },
  avatarContainer: { position: "relative" },
  feedAvatar: { width: sc(52), height: sc(52), borderRadius: 18, backgroundColor: C.inputBg },
  onlineIndicator: { position: "absolute", bottom: -2, right: -2, width: 14, height: 14, borderRadius: 7, backgroundColor: C.success, borderWidth: 2.5, borderColor: C.white },
  chatBodyDetails: { flex: 1, marginLeft: 14, marginRight: 8 },
  chatMetaRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  profileNameText: { fontSize: sc(15), fontWeight: "800", color: C.textDark, flex: 1, marginRight: 10 },
  metaTimeText: { fontSize: sc(11), color: C.labelGray, fontWeight: "600" },
  proRoleText: { fontSize: sc(11), fontWeight: "700", color: C.p2, textTransform: "uppercase", marginTop: 2, letterSpacing: 0.3 },
  lastMessageSnippet: { fontSize: sc(13), color: C.labelGray, marginTop: 4, fontWeight: "500" },
  unreadBadge: { width: 20, height: 20, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  unreadCountText: { color: C.white, fontSize: 10, fontWeight: "800" },
  floatingFab: { position: "absolute", bottom: 30, right: 24, width: sc(56), height: sc(56), borderRadius: 20, overflow: "hidden", elevation: 6 },
  fabGradient: { flex: 1, justifyContent: "center", alignItems: "center" },

  // ACTIVE CHAT VIEWPORT CONFIGURATION
  convoHeader: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 14, backgroundColor: "transparent", borderBottomWidth: 1, borderBottomColor: "rgba(232, 229, 255, 0.5)" },
  iconHeaderBtn: { width: sc(40), height: sc(40), borderRadius: 12, justifyContent: "center", alignItems: "center" },
  headerMetaProfile: { flex: 1, alignItems: "center", paddingHorizontal: 10 },
  convoHeaderTitle: { fontSize: sc(16), fontWeight: "800", color: C.textDark, letterSpacing: -0.2 },
  convoHeaderSub: { fontSize: sc(11), color: C.p2, fontWeight: "700", textTransform: "uppercase", marginTop: 2, letterSpacing: 0.3 },
  convoScrollArea: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 140 },
  dateIndicatorWrap: { alignItems: "center", marginBottom: 24 },
  datePill: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 12, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.6)" },
  datePillText: { fontSize: sc(11), color: C.labelGray, fontWeight: "700" },
  
  // BUBBLE STRUCTURAL RENDERING
  msgBubbleWrapper: { maxWidth: "80%", marginBottom: 18 },
  msgAlignLeft: { alignSelf: "flex-start" },
  msgAlignRight: { alignSelf: "flex-end" },
  msgTextBubble: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20 },
  bubbleReceivedBg: { backgroundColor: C.white, borderTopLeftRadius: 5, borderWidth: 1, borderColor: C.inputBorder },
  bubbleSentBg: { backgroundColor: C.p2, borderTopRightRadius: 5 },
  msgBodyText: { fontSize: sc(14), lineHeight: sc(21), fontWeight: "500" },
  textWhiteColor: { color: C.white },
  textDarkColor: { color: C.textDark },
  msgTimestampRow: { flexDirection: "row", alignItems: "center", marginTop: 4, paddingHorizontal: 4 },
  msgTimestampText: { fontSize: sc(10), color: C.labelGray, fontWeight: "500" },

  // AUDIO COMPONENT HOUSING
  audioNodeCard: { flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 20, borderTopLeftRadius: 5, backgroundColor: "rgba(255,255,255,0.6)", borderWidth: 1, borderColor: C.inputBorder, overflow: "hidden" },
  audioPlayBtn: { width: 32, height: 32, borderRadius: 16, overflow: "hidden" },
  audioPlayGrad: { flex: 1, justifyContent: "center", alignItems: "center" },
  waveContainer: { flexDirection: "row", alignItems: "center", gap: 3, marginHorizontal: 12, height: 30 },
  waveBar: { width: 2, backgroundColor: C.p2, borderRadius: 1 },
  audioDurationText: { fontSize: sc(11), color: C.textDark, fontWeight: "700" },

  // SYSTEM CONTROL INPUT CONSOLE
  inputConsoleDock: { position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingBottom: Platform.OS === 'ios' ? 35 : 20, paddingTop: 12, backgroundColor: "transparent" },
  consoleGlassFrame: { flexDirection: "row", alignItems: "center", padding: 6, borderRadius: 22, backgroundColor: "rgba(255, 255, 255, 0.55)", borderWidth: 1, borderColor: "rgba(255,255,255,0.7)" },
  consoleActionBtn: { width: sc(36), height: sc(36), justifyContent: "center", alignItems: "center" },
  textEntryBar: { flex: 1, height: sc(40), paddingHorizontal: 10, fontSize: sc(14), color: C.textDark, fontWeight: "500" },
  sendExecutionBtn: { width: sc(36), height: sc(36), borderRadius: 12, overflow: "hidden" },
  sendBtnGrad: { flex: 1, justifyContent: "center", alignItems: "center" }
});
