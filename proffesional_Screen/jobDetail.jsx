import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import {
    ChevronLeft,
    Clock,
    FileText,
    HelpCircle,
    MapPin,
    MessageSquare,
    Navigation,
    Phone,
    ShieldCheck,
    User,
    XCircle
} from "lucide-react-native";
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

export default function ProJobDetailsScreen({ onBack, onStartJob }) {
  const SectionLabel = ({ label }) => (
    <View style={s.sectionLabelRow}>
      <Text style={s.sectionLabelText}>{label}</Text>
    </View>
  );

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

      {/* RADIANT AMBIENT BACKDROP ORBS */}
      <View
        style={[
          s.glowOrb,
          {
            top: height * 0.05,
            right: -sc(50),
            backgroundColor: "rgba(140, 127, 255, 0.16)",
          },
        ]}
      />
      <View
        style={[
          s.glowOrb,
          {
            bottom: height * 0.2,
            left: -sc(60),
            backgroundColor: "rgba(91, 76, 240, 0.1)",
          },
        ]}
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* TOP INTERACTIVE APP HEADER BAR */}
        <View style={s.header}>
          <TouchableOpacity
            style={s.circleBarBtn}
            onPress={onBack}
            activeOpacity={0.75}
          >
            <ChevronLeft size={sc(20)} color={C.textDark} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={s.headerTitleText}>Service Breakdown</Text>
          <TouchableOpacity style={s.circleBarBtn} activeOpacity={0.75}>
            <HelpCircle size={sc(18)} color={C.textDark} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scrollArea}
        >
          {/* CLIENT IDENTITY SURFACE MODULE */}
          <View style={s.clientCardWrapper}>
            <BlurView
              intensity={Platform.OS === "ios" ? 45 : 95}
              tint="light"
              style={s.clientGlassCard}
            >
              <View style={s.clientUpperBlock}>
                <View style={s.clientIconAvatarBox}>
                  <User size={sc(22)} color={C.p2} />
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={s.orderIdLabelText}>ORDER ID: #JOB-9921</Text>
                  <Text style={s.clientNameText}>Alok Mourya</Text>
                  <Text style={s.serviceHeadingText}>
                    Split AC Jet Service • 2 Units
                  </Text>
                </View>
              </View>

              <View style={s.cardHorizontalDivider} />

              {/* Instant Comm Anchor Actions */}
              <View style={s.commActionRow}>
                <TouchableOpacity style={s.commActionBtn} activeOpacity={0.75}>
                  <Phone size={14} color={C.p2} style={{ marginRight: 6 }} />
                  <Text style={s.commActionText}>Voice Call</Text>
                </TouchableOpacity>
                <View style={s.verticalPipeDivider} />
                <TouchableOpacity style={s.commActionBtn} activeOpacity={0.75}>
                  <MessageSquare
                    size={14}
                    color={C.p2}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={s.commActionText}>Client Message</Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </View>

          {/* SERVICE LOGISTICS DATETIME & ADDRESS MATRICES */}
          <SectionLabel label="Execution Timings & Location" />
          <View style={s.infoCardWrapper}>
            <BlurView intensity={90} tint="light" style={s.infoGlassCard}>
              <View style={s.logisticsRowNode}>
                <View style={s.iconFrameAccent}>
                  <Clock size={14} color={C.p2} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.logisticsLabelTitle}>
                    Scheduled Dispatch window
                  </Text>
                  <Text style={s.logisticsValueBody}>
                    14:00 - 15:30 • Today (Saturday)
                  </Text>
                </View>
              </View>

              <View style={[s.logisticsRowNode, { marginTop: 16 }]}>
                <View style={s.iconFrameAccent}>
                  <MapPin size={14} color={C.p2} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.logisticsLabelTitle}>
                    Client Site Premises Address
                  </Text>
                  <Text style={s.logisticsValueBody} numberOfLines={2}>
                    B-402, Skyline Residency, Near Joggers Park, Satellite,
                    Ahmedabad, Gujarat
                  </Text>
                </View>
              </View>
            </BlurView>
          </View>

          {/* TRANSACTION PAYOUT SUMMARY ITEMIZATION */}
          <SectionLabel label="Settlement Earning Metrics" />
          <View style={s.infoCardWrapper}>
            <BlurView intensity={90} tint="light" style={s.infoGlassCard}>
              <View style={s.payoutItemizedLineRow}>
                <Text style={s.payoutItemLabelText}>
                  Base Labor Rate (2 Units Jet Service)
                </Text>
                <Text style={s.payoutValueItemText}>₹2,248.00</Text>
              </View>
              <View style={[s.payoutItemizedLineRow, { marginTop: 10 }]}>
                <Text style={s.payoutItemLabelText}>
                  Peak Weekend Incentive Bonus
                </Text>
                <Text style={[s.payoutValueItemText, { color: C.success }]}>
                  +₹400.00
                </Text>
              </View>

              <View style={s.cardHorizontalDivider} />

              <View style={s.payoutItemizedLineRow}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <FileText size={14} color={C.p2} />
                  <Text style={s.finalPayoutLabelBold}>
                    Net Estimated Job Earnings
                  </Text>
                </View>
                <Text style={s.finalPayoutPriceBold}>₹2,648.00</Text>
              </View>
            </BlurView>
          </View>

          {/* TRUST SECURITY BANNER NOTICE */}
          <View style={s.complianceNoticeRow}>
            <ShieldCheck
              size={16}
              color={C.labelGray}
              style={{ marginTop: 2 }}
            />
            <Text style={s.complianceNoticeBodyText}>
              Platform security protocol requires safety gear verification
              photos upon entry before order timers unlock.
            </Text>
          </View>

          {/* DUAL INTERACTIVE FOOTER SYSTEM CONTROL BUTTONS */}
          <View style={s.actionConsoleRow}>
            <TouchableOpacity style={s.declineActionBtn} activeOpacity={0.7}>
              <XCircle size={15} color="#EF4444" style={{ marginRight: 6 }} />
              <Text style={s.declineBtnText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.navigateActionBtn}
              onPress={onStartJob}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[C.p1, C.p2]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={s.navGradient}
              >
                <Navigation
                  size={14}
                  color={C.white}
                  fill={C.white}
                  style={{ marginRight: 6 }}
                />
                <Text style={s.navigateBtnText}>Navigate to Client</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
      <AppBottomTab />
    </View>
  );
}

// ─── MASTER SYSTEM CORE DESIGN STYLE SHEET MAPPINGS ───────────
const s = StyleSheet.create({
  container: { flex: 1 },
  glowOrb: {
    position: "absolute",
    width: sc(260),
    height: sc(260),
    borderRadius: sc(130),
    opacity: 0.8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 15,
  },
  circleBarBtn: {
    width: sc(40),
    height: sc(40),
    borderRadius: 14,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.inputBorder,
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
  },
  headerTitleText: {
    fontSize: sc(17),
    fontWeight: "900",
    color: C.textDark,
    letterSpacing: -0.4,
  },

  scrollArea: { paddingHorizontal: 24, paddingBottom: 140, paddingTop: 5 },

  // Custom Labels Grid
  sectionLabelRow: { paddingHorizontal: 4, marginTop: 22, marginBottom: 12 },
  sectionLabelText: {
    fontSize: 12,
    fontWeight: "800",
    color: C.labelGray,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  // Client Header Profile Card
  clientCardWrapper: {
    marginBottom: 5,
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
  clientGlassCard: {
    padding: 18,
    backgroundColor: "rgba(255, 255, 255, 0.45)",
  },
  clientUpperBlock: { flexDirection: "row", alignItems: "center" },
  clientIconAvatarBox: {
    width: sc(48),
    height: sc(48),
    borderRadius: 16,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.inputBorder,
    justifyContent: "center",
    alignItems: "center",
  },
  orderIdLabelText: {
    fontSize: 9,
    fontWeight: "900",
    color: C.p2,
    letterSpacing: 0.8,
  },
  clientNameText: {
    fontSize: sc(18),
    fontWeight: "900",
    color: C.textDark,
    letterSpacing: -0.3,
    marginTop: 2,
  },
  serviceHeadingText: {
    fontSize: sc(13),
    color: C.labelGray,
    fontWeight: "600",
    marginTop: 3,
  },
  cardHorizontalDivider: {
    height: 1,
    backgroundColor: "rgba(232, 229, 255, 0.7)",
    marginVertical: 14,
  },

  // Internal Communication Strip
  commActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  commActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },
  commActionText: {
    fontSize: sc(13),
    fontWeight: "800",
    color: C.p2,
    letterSpacing: -0.1,
  },
  verticalPipeDivider: {
    width: 1,
    height: sc(16),
    backgroundColor: "rgba(232, 229, 255, 0.8)",
  },

  // Logistics & Pricing Glass Tiles
  infoCardWrapper: {
    marginBottom: 12,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
    elevation: 2,
    shadowColor: C.p3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
  },
  infoGlassCard: { padding: 16, backgroundColor: "rgba(255, 255, 255, 0.45)" },
  logisticsRowNode: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  iconFrameAccent: {
    width: sc(28),
    height: sc(28),
    borderRadius: 9,
    backgroundColor: C.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.inputBorder,
  },
  logisticsLabelTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: C.labelGray,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  logisticsValueBody: {
    fontSize: sc(13),
    color: C.textDark,
    fontWeight: "700",
    marginTop: 4,
    lineHeight: 18,
  },

  // Financial Pricing Mechanics
  payoutItemizedLineRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  payoutItemLabelText: {
    fontSize: sc(13),
    color: C.labelGray,
    fontWeight: "600",
  },
  payoutValueItemText: {
    fontSize: sc(13),
    fontWeight: "700",
    color: C.textDark,
  },
  finalPayoutLabelBold: {
    fontSize: sc(14),
    fontWeight: "800",
    color: C.textDark,
    letterSpacing: -0.1,
  },
  finalPayoutPriceBold: {
    fontSize: sc(16),
    fontWeight: "900",
    color: C.p2,
    letterSpacing: -0.3,
  },

  // Guarantees Compliance Banner
  complianceNoticeRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 6,
    marginTop: 15,
    opacity: 0.8,
  },
  complianceNoticeBodyText: {
    fontSize: sc(11),
    color: C.labelGray,
    lineHeight: 16,
    flex: 1,
    fontWeight: "500",
  },

  // Active Bottom Control Actions
  actionConsoleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    gap: 12,
  },
  declineActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  declineBtnText: { color: "#EF4444", fontWeight: "800", fontSize: sc(14) },
  navigateActionBtn: {
    flex: 1,
    height: sc(48),
    borderRadius: 15,
    overflow: "hidden",
    elevation: 4,
    shadowColor: C.p2,
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  navGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  navigateBtnText: {
    color: C.white,
    fontWeight: "800",
    fontSize: sc(14),
    letterSpacing: -0.1,
  },
});
