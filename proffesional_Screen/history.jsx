import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import {
    Briefcase,
    Calendar,
    CheckCircle2,
    FileText,
    MapPin,
    SlidersHorizontal,
    User,
    XCircle
} from "lucide-react-native";
import { useState } from "react";
import {
    Dimensions,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
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
  success: "#22C55E",
};

// ─── HISTORICAL JOBS MOCK DATA ────────────────────────────────
const HISTORY_DATA = [
  {
    id: "JOB-9914",
    customer: "Alok Mourya",
    service: "Split AC Jet Service x2",
    payout: "₹2,648",
    date: "16 May 2026",
    time: "14:00 - 15:30",
    address: "B-402, Skyline Residency, Satellite, Ahmedabad",
    status: "Completed",
    type: "Premium Cleaning",
  },
  {
    id: "JOB-9860",
    customer: "Priya Desai",
    service: "Window AC Gas Charging",
    payout: "₹1,200",
    date: "14 May 2026",
    time: "11:00 - 12:30",
    address: "C-101, Green Park, Vastrapur, Ahmedabad",
    status: "Completed",
    type: "Gas Refill",
  },
  {
    id: "JOB-9742",
    customer: "Rajesh Mehta",
    service: "AC Installation & Wiring",
    payout: "₹1,850",
    date: "11 May 2026",
    time: "16:00 - 18:00",
    address: "42, Shanti Niketan, Bodakdev, Ahmedabad",
    status: "Declined",
    type: "Installation",
    reason: "Conflict with existing schedule",
  },
  {
    id: "JOB-9611",
    customer: "Suresh Verma",
    service: "Complete Compressor Diagnosis",
    payout: "₹650",
    date: "08 May 2026",
    time: "10:00 - 11:30",
    address: "F-303, Aarohi Crest, South Bopal, Ahmedabad",
    status: "Cancelled",
    type: "Diagnostics",
    reason: "Client cancelled before arrival",
  },
];

export default function ProHistoryScreen() {
  const [activeTab, setActiveTab] = useState("Completed"); // Completed, Declined, All

  // Filter dispatch handler
  const filteredJobs = HISTORY_DATA.filter((job) => {
    if (activeTab === "Completed") return job.status === "Completed";
    if (activeTab === "Declined")
      return job.status === "Declined" || job.status === "Cancelled";
    return true; // "All" tab maps everything
  });

  const renderHistoryCard = (job) => {
    const isSuccess = job.status === "Completed";

    return (
      <View key={job.id} style={s.cardOuterWrapper}>
        <BlurView
          intensity={Platform.OS === "ios" ? 45 : 95}
          tint="light"
          style={s.jobGlassCard}
        >
          {/* Card Upper Metric Header */}
          <View style={s.cardHeaderRow}>
            <View>
              <View style={s.jobTypeTag}>
                <Text style={s.jobTypeTagText}>{job.type}</Text>
              </View>
              <Text style={s.serviceTitleText}>{job.service}</Text>
              <View style={s.clientMetaRow}>
                <User size={12} color={C.labelGray} />
                <Text style={s.clientNameText}>Client: {job.customer}</Text>
              </View>
            </View>
            <View style={s.payoutContainer}>
              <Text style={s.payoutText}>{job.payout}</Text>
              <Text style={s.jobIdText}>{job.id}</Text>
            </View>
          </View>

          {/* Card Central Logistics Matrix */}
          <View style={s.logisticsGroup}>
            <View style={s.logisticItemRow}>
              <View style={s.iconBadgeFrame}>
                <Calendar size={13} color={C.p2} />
              </View>
              <Text style={s.logisticText}>
                {job.date} • {job.time}
              </Text>
            </View>
            <View style={s.logisticItemRow}>
              <View style={s.iconBadgeFrame}>
                <MapPin size={13} color={C.p2} />
              </View>
              <Text style={s.logisticText} numberOfLines={1}>
                {job.address}
              </Text>
            </View>
          </View>

          <View style={s.cardDividerLine} />

          {/* Card Semantic Status Bottom Footer */}
          <View style={s.cardStatusFooter}>
            {isSuccess ? (
              <View style={s.badgeSuccessFrame}>
                <CheckCircle2
                  size={14}
                  color="#047857"
                  fill="rgba(4, 120, 87, 0.1)"
                />
                <Text style={s.badgeSuccessText}>
                  Payout Settled Successfully
                </Text>
              </View>
            ) : (
              <View style={s.badgeErrorFrame}>
                <XCircle
                  size={14}
                  color="#B91C1C"
                  fill="rgba(185, 28, 28, 0.1)"
                />
                <View style={{ flex: 1 }}>
                  <Text style={s.badgeErrorText}>{job.status}</Text>
                  {job.reason && (
                    <Text style={s.reasonNoteText}>Reason: {job.reason}</Text>
                  )}
                </View>
              </View>
            )}

            {isSuccess && (
              <TouchableOpacity style={s.receiptLinkBtn} activeOpacity={0.7}>
                <FileText size={14} color={C.p2} />
                <Text style={s.receiptLinkText}>Statement</Text>
              </TouchableOpacity>
            )}
          </View>
        </BlurView>
      </View>
    );
  };

  return (
    <View style={s.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <LinearGradient
        colors={["#F4F3FF", "#FDFDFF"]}
        style={StyleSheet.absoluteFill}
      />

      {/* AMBIENT BACKGROUND LAYER CHROMATIC BLOBS */}
      <View
        style={[
          s.glowOrb,
          {
            top: -sc(20),
            right: -sc(40),
            backgroundColor: "rgba(140, 127, 255, 0.15)",
          },
        ]}
      />
      <View
        style={[
          s.glowOrb,
          {
            bottom: height * 0.15,
            left: -sc(50),
            backgroundColor: "rgba(91, 76, 240, 0.1)",
          },
        ]}
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* HEADER BAR APP BAR */}
        <View style={s.header}>
          <Text style={s.headerTitleText}>Job History</Text>
          <TouchableOpacity style={s.filterBtnFrame} activeOpacity={0.75}>
            <SlidersHorizontal size={sc(18)} color={C.textDark} />
          </TouchableOpacity>
        </View>

        {/* CUSTOM SMOOTH SELECTION SEGMENT CONTROL */}
        <View style={s.tabContainer}>
          <View style={s.tabBarBackground}>
            {["Completed", "Declined", "All Logs"].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  activeOpacity={0.8}
                  style={[s.tabItem, isActive && s.tabItemActive]}
                >
                  <Text
                    style={[s.tabItemText, isActive && s.tabItemTextActive]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* CARDS LIST FRAME SCROLL */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scrollArea}
        >
          {filteredJobs.length > 0 ? (
            filteredJobs.map(renderHistoryCard)
          ) : (
            <View style={s.emptyStateBox}>
              <View style={s.emptyIconWrapper}>
                <Briefcase size={sc(32)} color={C.textMuted} />
              </View>
              <Text style={s.emptyStateTitle}>
                No logs inside {activeTab.toLowerCase()}
              </Text>
              <Text style={s.emptyStateSub}>
                All historical updates matching this categorization matrix show
                up here automatically.
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
      <AppBottomTab />
    </View>
  );
}

// ─── LAYOUT METRIC STYLE DEFINITIONS ──────────────────────────
const s = StyleSheet.create({
  container: { flex: 1 },
  glowOrb: {
    position: "absolute",
    width: sc(260),
    height: sc(260),
    borderRadius: sc(130),
    opacity: 0.8,
  },

  // App Bar Configurations
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 10 : 20,
    marginBottom: 10,
  },
  headerTitleText: {
    fontSize: sc(26),
    fontWeight: "900",
    color: C.textDark,
    letterSpacing: -0.6,
  },
  filterBtnFrame: {
    width: sc(42),
    height: sc(42),
    borderRadius: 14,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.inputBorder,
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
  },

  // Custom Controlled Segments Tab Bar
  tabContainer: { paddingHorizontal: 24, marginBottom: 15 },
  tabBarBackground: {
    flexDirection: "row",
    backgroundColor: "rgba(244, 242, 255, 0.7)",
    borderRadius: 20,
    padding: 5,
    borderWidth: 1,
    borderColor: "rgba(232, 229, 255, 0.6)",
  },
  tabItem: {
    flex: 1,
    paddingVertical: 11,
    alignItems: "center",
    borderRadius: 15,
  },
  tabItemActive: {
    backgroundColor: C.white,
    elevation: 4,
    shadowColor: C.p2,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  tabItemText: { fontSize: sc(13), fontWeight: "700", color: C.textMuted },
  tabItemTextActive: { color: C.p2, fontWeight: "800" },

  // Premium Luxury Glass Card Architecture
  scrollArea: { paddingHorizontal: 24, paddingBottom: 120, paddingTop: 5 },
  cardOuterWrapper: {
    marginBottom: 15,
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
    elevation: 3,
    shadowColor: C.p3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
  },
  jobGlassCard: { padding: 18, backgroundColor: "rgba(255, 255, 255, 0.45)" },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  jobTypeTag: {
    backgroundColor: "rgba(91, 76, 240, 0.06)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "rgba(91, 76, 240, 0.1)",
  },
  jobTypeTagText: {
    fontSize: 9,
    fontWeight: "800",
    color: C.p2,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  serviceTitleText: {
    fontSize: sc(15),
    fontWeight: "900",
    color: C.textDark,
    letterSpacing: -0.2,
  },
  clientMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  clientNameText: { fontSize: sc(13), color: C.labelGray, fontWeight: "600" },
  payoutContainer: { alignItems: "flex-end" },
  payoutText: {
    fontSize: sc(16),
    fontWeight: "900",
    color: C.textDark,
    letterSpacing: -0.3,
  },
  jobIdText: {
    fontSize: 10,
    fontWeight: "700",
    color: C.textMuted,
    marginTop: 2,
    textTransform: "uppercase",
  },

  // Logistics Alignment Blocks
  logisticsGroup: { gap: 10, marginVertical: 15 },
  logisticItemRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconBadgeFrame: {
    width: sc(26),
    height: sc(26),
    borderRadius: 8,
    backgroundColor: C.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.inputBorder,
  },
  logisticText: {
    fontSize: sc(13),
    color: C.textDark,
    fontWeight: "600",
    opacity: 0.85,
  },
  cardDividerLine: {
    height: 1,
    backgroundColor: "rgba(232, 229, 255, 0.7)",
    marginBottom: 14,
  },

  // Footers / Status Badges Configurations
  cardStatusFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badgeSuccessFrame: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  badgeSuccessText: { color: "#047857", fontWeight: "800", fontSize: sc(11) },
  badgeErrorFrame: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FCA5A5",
    flex: 1,
    marginRight: 10,
  },
  badgeErrorText: {
    color: "#B91C1C",
    fontWeight: "800",
    fontSize: sc(11),
    textTransform: "capitalize",
  },
  reasonNoteText: {
    color: "#EF4444",
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },
  receiptLinkBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  receiptLinkText: { color: C.p2, fontWeight: "800", fontSize: sc(12) },

  // Fallbacks Empty Handling
  emptyStateBox: {
    paddingVertical: height * 0.12,
    alignItems: "center",
    paddingHorizontal: 36,
  },
  emptyIconWrapper: {
    width: sc(64),
    height: sc(64),
    borderRadius: 22,
    backgroundColor: C.inputBg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.inputBorder,
  },
  emptyStateTitle: { fontSize: sc(16), fontWeight: "800", color: C.textDark },
  emptyStateSub: {
    fontSize: sc(12),
    color: C.labelGray,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
    fontWeight: "500",
  },
});
