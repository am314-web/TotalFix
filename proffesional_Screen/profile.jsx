import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

// ─── THE CRITIC'S PALETTE ─────────────────────────────────────
const C = {
  // Deep space contrast layer to elevate glass surfaces
  bgGradient: ["#0B0826", "#120D3D", "#07051A"],

  // Neon accents for volumetric glass reflections
  glassPill: "rgba(255, 255, 255, 0.07)",
  glassCard: "rgba(255, 255, 255, 0.05)",
  glassBorder: "rgba(255, 255, 255, 0.12)",
  glassBorderActive: "rgba(140, 127, 255, 0.4)",

  // High-fidelity typography vectors
  textPrimary: "#FFFFFF",
  textSecondary: "#9E9AA7",
  textMuted: "#625F70",

  // Vivid interactive highlights
  neonBrand: "#8C7FFF",
  neonCyan: "#06B6D4",
  neonAmber: "#F59E0B",
  neonGreen: "#10B981",

  // Premium Gradients
  brandGlow: ["#8C7FFF", "#5B4CF0"],
  darkGlow: ["#1B108E", "#3D2EC0"],
  successGlow: ["#10B981", "#059669"],
  offlineGlow: ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"],
};

export default function PremiumProfessionalProfile() {
  // Nested Router Emulation State ('dashboard' vs 'publicView')
  const [nestedScreen, setScreenView] = useState("dashboard");
  const [isOnline, setIsOnline] = useState(true);

  const proData = {
    name: "Alok Mourya",
    category: "Senior System Architect",
    rating: "4.9",
    totalReviews: "142",
    experience: "5+ Years",
    jobsDone: "1,240+",
    walletBalance: "₹14,850",
    skills: [
      "System Architecture",
      "React Native Core",
      "PostgreSQL Engine",
      "Realtime WebSockets",
    ],
    recentReviews: [
      {
        name: "Rahul Sharma",
        text: "Architected our deployment framework flawlessly. Pure genius.",
        rate: "5.0",
      },
      {
        name: "Anita Patel",
        text: "Unparalleled execution speed. Cleanest architectural code base I have reviewed.",
        rate: "4.9",
      },
    ],
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* IMMERSIVE BACKDROP LAYER */}
      <LinearGradient
        colors={C.bgGradient}
        style={StyleSheet.absoluteFillObject}
      />

      {/* NEON TANGIBLE GLOW NODES */}
      <View style={styles.neonOrb1} />
      <View style={styles.neonOrb2} />
      <View style={styles.neonOrb3} />

      <SafeAreaView style={{ flex: 1 }}>
        {/* APP HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Professional Console</Text>

          {/* GLASS SEGMENT NAVIGATION RAMP */}
          <BlurView intensity={20} tint="dark" style={styles.segmentedRamp}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setScreenView("dashboard")}
              style={[
                styles.rampBtn,
                nestedScreen === "dashboard" && styles.rampBtnActive,
              ]}
            >
              {nestedScreen === "dashboard" && (
                <LinearGradient
                  colors={C.brandGlow}
                  style={StyleSheet.absoluteFillObject}
                />
              )}
              <Text
                style={[
                  styles.rampText,
                  nestedScreen === "dashboard" && styles.rampTextActive,
                ]}
              >
                Dashboard
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setScreenView("publicView")}
              style={[
                styles.rampBtn,
                nestedScreen === "publicView" && styles.rampBtnActive,
              ]}
            >
              {nestedScreen === "publicView" && (
                <LinearGradient
                  colors={C.brandGlow}
                  style={StyleSheet.absoluteFillObject}
                />
              )}
              <Text
                style={[
                  styles.rampText,
                  nestedScreen === "publicView" && styles.rampTextActive,
                ]}
              >
                Public Profile
              </Text>
            </TouchableOpacity>
          </BlurView>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollBody}
        >
          {/* HERO PROFILE GLASS CARD */}
          <BlurView intensity={30} tint="light" style={styles.heroGlassCard}>
            <View style={styles.avatarLayoutRow}>
              <View style={styles.avatarGlassContainer}>
                <Text style={styles.avatarEmoji}>👑</Text>
                <View
                  style={[
                    styles.statusPulseNode,
                    { backgroundColor: isOnline ? C.neonGreen : C.textMuted },
                  ]}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 18 }}>
                <Text style={styles.proNameText}>{proData.name}</Text>
                <Text style={styles.proCategoryText}>{proData.category}</Text>
                <View style={styles.ratingBadgeRow}>
                  <Text style={{ color: C.neonAmber, fontSize: 12 }}>★ </Text>
                  <Text style={styles.ratingText}>
                    {proData.rating}{" "}
                    <Text style={{ color: C.textMuted }}>
                      ({proData.totalReviews} verified checks)
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
          </BlurView>

          {/* ─── SUBSCREEN LAYER 1: MANAGEMENT DASHBOARD ─── */}
          {nestedScreen === "dashboard" && (
            <View style={styles.viewSwitchAnimationWrapper}>
              {/* LIVE OPERATION REGULATION SYSTEM */}
              <BlurView
                intensity={15}
                tint="light"
                style={styles.dutyGlassCard}
              >
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={styles.cardHeadingTitle}>Operation Mode</Text>
                  <Text style={styles.cardSubTextBody}>
                    {isOnline
                      ? "Broadcasting live tracking matrix channels to local nodes"
                      : "Console offline · delta channel stream suspended"}
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setIsOnline(!isOnline)}
                >
                  <LinearGradient
                    colors={isOnline ? C.successGlow : C.offlineGlow}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.toggleSwitchPill}
                  >
                    <Text
                      style={[
                        styles.toggleSwitchText,
                        !isOnline && { color: C.textSecondary },
                      ]}
                    >
                      {isOnline ? "ACTIVE" : "STANDBY"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </BlurView>

              {/* HIGH-FIDELITY WALLET CONTAINER */}
              <SectionLabel icon="⚡" label="Financial Escrow Matrix" />
              <LinearGradient
                colors={C.darkGlow}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.walletPremiumCard}
              >
                <View style={styles.glassReflectionOverlay} />
                <View>
                  <Text style={styles.walletCardLabel}>
                    Available Clearance Balance
                  </Text>
                  <Text style={styles.walletBalanceValueString}>
                    {proData.walletBalance}
                  </Text>
                </View>
                <TouchableOpacity activeOpacity={0.8}>
                  <BlurView
                    intensity={40}
                    tint="light"
                    style={styles.glassActionBtn}
                  >
                    <Text style={styles.glassActionBtnText}>Disburse</Text>
                  </BlurView>
                </TouchableOpacity>
              </LinearGradient>

              {/* PERFORMANCE STATISTICS INTERFACE */}
              <SectionLabel icon="📊" label="System Telemetry" />
              <View style={styles.telemetryGridRow}>
                <BlurView
                  intensity={15}
                  tint="light"
                  style={styles.telemetryMetricSquare}
                >
                  <Text
                    style={[styles.metricValueString, { color: C.neonCyan }]}
                  >
                    {proData.jobsDone}
                  </Text>
                  <Text style={styles.metricLabelSubString}>
                    Completed Pipelines
                  </Text>
                </BlurView>
                <BlurView
                  intensity={15}
                  tint="light"
                  style={styles.telemetryMetricSquare}
                >
                  <Text
                    style={[styles.metricValueString, { color: C.neonBrand }]}
                  >
                    {proData.experience}
                  </Text>
                  <Text style={styles.metricLabelSubString}>
                    Uptime Lifecycle
                  </Text>
                </BlurView>
              </View>

              {/* ADMINISTRATIVE ACCESS HUB */}
              <SectionLabel icon="⚙️" label="Control Directives" />
              <GlassConsoleLink
                icon="🧬"
                label="Modify Structural Data Fields"
              />
              <GlassConsoleLink
                icon="💎"
                label="Calibrate Standard Rates Model"
              />
              <GlassConsoleLink
                icon="🛡️"
                label="Verify Identity Signatures & Token Keys"
              />
            </View>
          )}

          {/* ─── SUBSCREEN LAYER 2: DESIGN SHOWCASE VIEW ─── */}
          {nestedScreen === "publicView" && (
            <View style={styles.viewSwitchAnimationWrapper}>
              {/* COMPREHENSIVE BIOGRAPHY PROFILE SUMMARY */}
              <SectionLabel icon="📜" label="Executive Abstract" />
              <BlurView
                intensity={15}
                tint="light"
                style={styles.abstractGlassCard}
              >
                <Text style={styles.abstractParagraphBodyText}>
                  Senior computing engineer specialized in crafting
                  high-efficiency software architectures and native client
                  runtime instances. Expert in performance mapping across cloud
                  relational database engines.
                </Text>
              </BlurView>

              {/* RATE PARAMETERS CONSOLE SUMMARY */}
              <SectionLabel icon="🏷️" label="Value Mapping Model" />
              <BlurView
                intensity={15}
                tint="light"
                style={styles.rateBadgeStripRow}
              >
                <Text style={styles.rateStripLeftLabel}>
                  Base Computation Cost
                </Text>
                <Text style={styles.rateStripRightAmount}>
                  {proData.hourlyRate}
                </Text>
              </BlurView>

              {/* SKILLS TAG ARRAYS CHIPS MATRIX */}
              <SectionLabel
                icon="🚀"
                label="Engine Architecture Proficiencies"
              />
              <View style={styles.skillsTagWrapperContainerFlexBox}>
                {proData.skills.map((skill, i) => (
                  <BlurView
                    key={i}
                    intensity={30}
                    tint="light"
                    style={styles.skillMicroChipCard}
                  >
                    <Text style={styles.skillMicroChipStringText}>
                      ◆ {skill}
                    </Text>
                  </BlurView>
                ))}
              </View>

              {/* CLIENT REVIEW REPUTATION LOGS */}
              <SectionLabel icon="✦" label="Verified Review Attestations" />
              {proData.recentReviews.map((review, i) => (
                <BlurView
                  key={i}
                  intensity={15}
                  tint="light"
                  style={styles.reputationLogCardBox}
                >
                  <View style={styles.reputationLogHeaderSplitRow}>
                    <Text style={styles.reputationReviewerNameTitle}>
                      {review.name}
                    </Text>
                    <Text style={styles.reputationReviewerRatingValue}>
                      ★ {review.rate}
                    </Text>
                  </View>
                  <Text style={styles.reputationReviewBodyTextString}>
                    "{review.text}"
                  </Text>
                </BlurView>
              ))}
            </View>
          )}
          <View style={{ height: 120 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─── TRANSLATED REUSABLE CONSOLE UI PARTS ─────────────────────
const SectionLabel = ({ icon, label }) => (
  <View style={styles.labelSectionWrapperRow}>
    <Text style={styles.labelSectionIconTextValue}>{icon}</Text>
    <Text style={styles.labelSectionTextLabelString}>{label}</Text>
  </View>
);

const GlassConsoleLink = ({ icon, label }) => (
  <BlurView intensity={15} tint="light" style={styles.consoleLinkRowBar}>
    <View style={styles.consoleLinkIconWrapperBox}>
      <Text style={{ fontSize: 15, color: "#FFF" }}>{icon}</Text>
    </View>
    <Text style={styles.consoleLinkLabelTextString}>{label}</Text>
    <Text style={styles.consoleLinkArrowIndicatorSymbol}>›</Text>
  </BlurView>
);

// ─── STYLES ARCHITECTURE SHEET SCHEMA ─────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#07051A" },

  // Tangible Layer Blobs for Backlighting Glass surfaces
  neonOrb1: {
    position: "absolute",
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: "rgba(140, 127, 255, 0.08)",
    top: -80,
    left: -90,
  },
  neonOrb2: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(6, 182, 212, 0.05)",
    bottom: 120,
    right: -60,
  },
  neonOrb3: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(245, 158, 11, 0.04)",
    top: height * 0.35,
    left: width * 0.4,
  },

  header: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 6 },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: C.textPrimary,
    letterSpacing: -0.3,
    textAlign: "center",
  },

  // Segment Navigation Styling Control
  segmentedRamp: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    padding: 4,
    borderRadius: 16,
    marginTop: 18,
    borderWidth: 1,
    borderColor: C.glassBorder,
    overflow: "hidden",
  },
  rampBtn: {
    flex: 1,
    paddingVertical: 11,
    alignItems: "center",
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  rampBtnActive: {
    shadowColor: C.neonBrand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  rampText: { fontSize: 13, fontWeight: "600", color: C.textSecondary },
  rampTextActive: { color: C.textPrimary, fontWeight: "800" },

  scrollBody: { paddingHorizontal: 24, paddingTop: 22 },

  // Main Glass Card Geometry
  heroGlassCard: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: C.glassBorder,
    backgroundColor: C.glassCard,
    overflow: "hidden",
    marginBottom: 14,
  },
  avatarLayoutRow: { flexDirection: "row", alignItems: "center" },
  avatarGlassContainer: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderWidth: 1,
    borderColor: C.glassBorder,
  },
  avatarEmoji: { fontSize: 30 },
  statusPulseNode: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2.5,
    borderColor: "#07051A",
  },
  proNameText: {
    fontSize: 20,
    fontWeight: "800",
    color: C.textPrimary,
    letterSpacing: -0.2,
  },
  proCategoryText: {
    fontSize: 13,
    color: C.neonBrand,
    marginTop: 2,
    fontWeight: "700",
  },
  ratingBadgeRow: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  ratingText: { fontSize: 12, fontWeight: "700", color: C.textPrimary },

  labelSectionWrapperRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 26,
    marginBottom: 12,
  },
  labelSectionIconTextValue: { fontSize: 14, marginRight: 8 },
  labelSectionTextLabelString: {
    fontSize: 11,
    fontWeight: "800",
    color: C.textSecondary,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },

  viewSwitchAnimationWrapper: { width: "100%" },

  // Management Dash Modules Style Design
  dutyGlassCard: {
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.glassBorder,
    backgroundColor: C.glassCard,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardHeadingTitle: { fontSize: 14, fontWeight: "800", color: C.textPrimary },
  cardSubTextBody: {
    fontSize: 11,
    color: C.textSecondary,
    marginTop: 3,
    lineHeight: 16,
  },
  toggleSwitchPill: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  toggleSwitchText: {
    color: C.textPrimary,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  walletPremiumCard: {
    borderRadius: 24,
    padding: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    overflow: "hidden",
    shadowColor: C.p3,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 6,
  },
  glassReflectionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  walletCardLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.65)",
    fontWeight: "500",
  },
  walletBalanceValueString: {
    fontSize: 28,
    fontWeight: "900",
    color: C.textPrimary,
    marginTop: 2,
    letterSpacing: -0.5,
  },
  glassActionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  glassActionBtnText: { color: C.textPrimary, fontSize: 13, fontWeight: "800" },

  telemetryGridRow: { flexDirection: "row", gap: 12 },
  telemetryMetricSquare: {
    flex: 1,
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.glassBorder,
    backgroundColor: C.glassCard,
    overflow: "hidden",
  },
  metricValueString: { fontSize: 26, fontWeight: "900", letterSpacing: -0.5 },
  metricLabelSubString: {
    fontSize: 12,
    color: C.textSecondary,
    marginTop: 5,
    fontWeight: "600",
  },

  consoleLinkRowBar: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.glassBorder,
    backgroundColor: C.glassCard,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  consoleLinkIconWrapperBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.glassBorder,
  },
  consoleLinkLabelTextString: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: C.textPrimary,
    marginLeft: 14,
  },
  consoleLinkArrowIndicatorSymbol: {
    fontSize: 18,
    color: C.textMuted,
    fontWeight: "600",
  },

  // Public Showcase Profiling Modules Design
  abstractGlassCard: {
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.glassBorder,
    backgroundColor: C.glassCard,
    overflow: "hidden",
  },
  abstractParagraphBodyText: {
    fontSize: 13,
    color: C.textSecondary,
    lineHeight: 22,
    fontWeight: "500",
  },
  rateBadgeStripRow: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.glassBorder,
    backgroundColor: C.glassCard,
    overflow: "hidden",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rateStripLeftLabel: { fontSize: 13, fontWeight: "600", color: C.textPrimary },
  rateStripRightAmount: { fontSize: 17, fontWeight: "800", color: C.neonCyan },

  skillsTagWrapperContainerFlexBox: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillMicroChipCard: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(140, 127, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(140, 127, 255, 0.15)",
    overflow: "hidden",
  },
  skillMicroChipStringText: {
    fontSize: 12,
    fontWeight: "700",
    color: C.neonBrand,
  },

  reputationLogCardBox: {
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.glassBorder,
    backgroundColor: C.glassCard,
    overflow: "hidden",
    marginBottom: 12,
  },
  reputationLogHeaderSplitRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reputationReviewerNameTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: C.textPrimary,
  },
  reputationReviewerRatingValue: {
    fontSize: 12,
    fontWeight: "700",
    color: C.neonAmber,
  },
  reputationReviewBodyTextString: {
    fontSize: 13,
    color: C.textSecondary,
    lineHeight: 20,
    fontStyle: "italic",
  },
});
