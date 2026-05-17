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
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import {
  ChevronLeft,
  Bell,
  Wrench,
  Percent,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Sparkles,
  Briefcase,
  TrendingUp,
  FileCheck,
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

// ─── PROVIDER-SIDE MOCK NOTIFICATIONS ─────────────────────────
const NOTIFICATIONS = [
  {
    id: "1",
    timeframe: "Today",
    type: "new_job",
    icon: Briefcase,
    title: "New Booking Assigned! ⚡",
    description: "Split AC Jet Service x2 assigned for Alok Mourya at Satellite, Ahmedabad. Expected arrival: 14:00 today.",
    unread: true,
  },
  {
    id: "2",
    timeframe: "Today",
    type: "payout",
    icon: TrendingUp,
    title: "Incentive Credited Successfully",
    description: "Great job! A weekend peak-hour bonus of ₹250 has been added to your daily balance for completing Order #AC-9921.",
    unread: true,
  },
  {
    id: "3",
    timeframe: "Today",
    type: "chat",
    icon: MessageSquare,
    title: "Client message from Alok Mourya",
    description: "\"Please let me know once you cross the Iscon cross roads, thank you!\"",
    unread: false,
  },
  {
    id: "4",
    timeframe: "This week",
    type: "compliance",
    icon: FileCheck,
    title: "Document Verification Approved",
    description: "Your updated Trade License copy has been verified by the safety ops audit desk. Your premium badge remains active.",
    unread: false,
  },
  {
    id: "5",
    timeframe: "This week",
    type: "system",
    icon: Sparkles,
    title: "Partner App Upgrade v2.4",
    description: "Explore your enhanced worker dashboard optimized for tracking real-time client routes and instant digital invoices.",
    unread: false,
  },
];

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const sections = ["Today", "This week"];

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const getIconColors = (type) => {
    switch (type) {
      case "new_job": return { bg: "rgba(91, 76, 240, 0.1)", icon: C.p2 };
      case "payout": return { bg: "rgba(34, 197, 94, 0.1)", icon: "#22C55E" };
      case "chat": return { bg: "rgba(140, 127, 255, 0.1)", icon: C.p1 };
      case "compliance": return { bg: "rgba(5, 150, 105, 0.1)", icon: "#059669" };
      default: return { bg: C.inputBg, icon: C.p3 };
    }
  };

  return (
    <View style={s.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <LinearGradient colors={["#F4F3FF", "#FDFDFF"]} style={StyleSheet.absoluteFill} />

      {/* AMBIENT BLUR DECORATIONS */}
      <View style={[s.ambientOrb, { top: -sc(30), right: -sc(50), backgroundColor: "rgba(140, 127, 255, 0.14)" }]} />
      <View style={[s.ambientOrb, { bottom: height * 0.15, left: -sc(50), backgroundColor: "rgba(91, 76, 240, 0.1)" }]} />

      <SafeAreaView style={{ flex: 1 }}>
        {/* APP BAR HEADER */}
        <View style={s.header}>
          <TouchableOpacity style={s.circleBtn} activeOpacity={0.75}>
            <ChevronLeft size={sc(20)} color={C.textDark} strokeWidth={2.5} />
          </TouchableOpacity>
          <View style={s.headerTitleRow}>
            <Text style={s.headerTitle}>Notifications</Text>
            {notifications.filter(n => n.unread).length > 0 && (
              <LinearGradient colors={[C.p1, C.p2]} style={s.badgeCount}>
                <Text style={s.badgeCountText}>{notifications.filter(n => n.unread).length}</Text>
              </LinearGradient>
            )}
          </View>
          <TouchableOpacity style={s.markReadBtn} onPress={markAllRead} activeOpacity={0.7}>
            <Text style={s.markReadText}>Clear</Text>
          </TouchableOpacity>
        </View>

        {/* NOTIFICATIONS CONTAINER LIST */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollArea}>
          {sections.map((section) => {
            const sectionItems = notifications.filter(n => n.timeframe === section);
            if (sectionItems.length === 0) return null;

            return (
              <View key={section} style={s.sectionGroup}>
                <Text style={s.timeframeTitle}>{section}</Text>
                
                {sectionItems.map((item) => {
                  const colors = getIconColors(item.type);
                  const IconComponent = item.icon;

                  return (
                    <View key={item.id} style={s.cardOuterWrapper}>
                      <BlurView intensity={Platform.OS === 'ios' ? 45 : 95} tint="light" style={s.glassCard}>
                        <View style={[s.iconBox, { backgroundColor: colors.bg }]}>
                          <IconComponent size={sc(17)} color={colors.icon} strokeWidth={2.2} />
                        </View>

                        <View style={s.contentBlock}>
                          <Text style={s.notifyTitle} numberOfLines={1}>{item.title}</Text>
                          <Text style={s.notifyDescription}>{item.description}</Text>
                        </View>

                        {item.unread && <View style={s.unreadDot} />}
                      </BlurView>
                    </View>
                  );
                })}
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
      <AppBottomTab />
    </View>
  );
}

// ─── STYLES ARCHITECTURE ──────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1 },
  ambientOrb: { position: "absolute", width: sc(260), height: sc(260), borderRadius: sc(130) },
  
  // APP BAR SETUP
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 10 : 20, marginBottom: 15 },
  circleBtn: { width: sc(40), height: sc(40), borderRadius: 14, backgroundColor: C.white, borderWidth: 1, borderColor: C.inputBorder, justifyContent: "center", alignItems: "center", elevation: 1 },
  headerTitleRow: { flex: 1, flexDirection: "row", alignItems: "center", paddingLeft: 16, gap: 8 },
  headerTitle: { fontSize: sc(24), fontWeight: "900", color: C.textDark, letterSpacing: -0.5 },
  badgeCount: { minWidth: 20, height: 20, borderRadius: 10, paddingHorizontal: 6, justifyContent: "center", alignItems: "center" },
  badgeCountText: { color: C.white, fontSize: 10, fontWeight: "900" },
  markReadBtn: { paddingVertical: 8, paddingHorizontal: 4 },
  markReadText: { fontSize: sc(13), fontWeight: "700", color: C.p2 },

  // SCROLL FRAME & TIMEFRAME MARKERS
  scrollArea: { paddingHorizontal: 24, paddingBottom: 120, paddingTop: 5 },
  sectionGroup: { marginBottom: 25 },
  timeframeTitle: { fontSize: sc(12), fontWeight: "800", color: C.labelGray, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, marginLeft: 4 },
  
  // PREMIUM GLASS TILES
  cardOuterWrapper: { marginBottom: 12, borderRadius: 24, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.7)", elevation: 3, shadowColor: C.p3, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12 },
  glassCard: { flexDirection: "row", padding: 16, backgroundColor: "rgba(255, 255, 255, 0.45)", alignItems: "flex-start" },
  iconBox: { width: sc(40), height: sc(40), borderRadius: 12, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: C.inputBorder, backgroundColor: C.white },
  contentBlock: { flex: 1, marginLeft: 14, marginRight: 10 },
  notifyTitle: { fontSize: sc(14), fontWeight: "800", color: C.textDark, letterSpacing: -0.1 },
  notifyDescription: { fontSize: sc(12), color: C.labelGray, marginTop: 5, lineHeight: sc(18), fontWeight: "600" },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.p2, alignSelf: "center", marginTop: 4 }
});