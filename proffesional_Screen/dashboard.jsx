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
  Switch,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import {
  Wrench,
  Clock,
  MapPin,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Briefcase,
  Power,
  ChevronRight,
  User,
  Sparkles,
  DollarSign,
} from "lucide-react-native";

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

// ─── MOCK ASSIGNED JOBS ───────────────────────────────────────
const ASSIGNED_JOBS = [
  {
    id: "JOB-9921",
    customer: "Alok Mourya",
    service: "Split AC Jet Service x2",
    payout: "₹2,648",
    time: "14:00 - 15:30 (Today)",
    address: "B-402, Skyline Residency, Satellite, Ahmedabad",
    type: "Premium Cleaning",
  },
  {
    id: "JOB-9874",
    customer: "Amit Patel",
    service: "AC Gas Top-up (R32)",
    payout: "₹850",
    time: "17:00 - 18:00 (Today)",
    address: "A-12, Green Acres, Vastrapur, Ahmedabad",
    type: "Repair",
  }
];

export default function ProWorkerDashboard() {
  const [isOnline, setIsOnline] = useState(true);

  const SectionLabel = ({ label, value }) => (
    <View style={s.sectionLabelRow}>
      <Text style={s.sectionLabelText}>{label}</Text>
      {value && <Text style={s.sectionValueText}>{value}</Text>}
    </View>
  );

  return (
    <View style={s.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <LinearGradient colors={["#F4F3FF", "#FDFDFF"]} style={StyleSheet.absoluteFill} />

      {/* LUXURY RADIANT BLUR ORBS FOR BACKDROP INTERACTION */}
      <View style={[s.glowOrb, { top: height * 0.08, left: -sc(60), backgroundColor: "rgba(140, 127, 255, 0.22)" }]} />
      <View style={[s.glowOrb, { top: height * 0.38, right: -sc(80), backgroundColor: "rgba(91, 76, 240, 0.14)" }]} />

      <SafeAreaView style={{ flex: 1 }}>
        
        {/* PREMIUM ACTION BAR DOCK */}
        <View style={s.header}>
          <View>
            <Text style={s.welcomeText}>Welcome back,</Text>
            <Text style={s.proNameText}>Rahul Sharma</Text>
          </View>
          
          {/* Custom Frosted Toggle Pill */}
          <BlurView intensity={Platform.OS === 'ios' ? 45 : 90} tint="light" style={[s.statusPillFrame, isOnline ? s.onlineBorder : s.offlineBorder]}>
            <View style={[s.miniStatusDot, { backgroundColor: isOnline ? C.success : C.labelGray }]} />
            <Text style={[s.statusPillText, { color: isOnline ? C.textDark : C.labelGray }]}>
              {isOnline ? "Online" : "Offline"}
            </Text>
            <Switch
              value={isOnline}
              onValueChange={setIsOnline}
              trackColor={{ false: "rgba(232, 229, 255, 0.5)", true: C.inputBg }}
              thumbColor={isOnline ? C.p2 : C.labelGray}
              style={s.switchTransform}
            />
          </BlurView>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollArea}>
          
          {/* EARNINGS METRICS HERO CARD */}
          <View style={s.metricsCardWrapper}>
            <BlurView intensity={Platform.OS === 'ios' ? 50 : 95} tint="light" style={s.metricsGlassCard}>
              <View style={s.earningsHeaderRow}>
                <View>
                  <Text style={s.earningsLabel}>Today's Earnings</Text>
                  <Text style={s.earningsValue}>₹3,498.00</Text>
                </View>
                <View style={s.trendBadge}>
                  <TrendingUp size={sc(12)} color={C.success} style={{ marginRight: 4 }} />
                  <Text style={s.trendText}>+12%</Text>
                </View>
              </View>
              
              <View style={s.metricsDivider} />

              <View style={s.subStatsGrid}>
                <View style={s.subStatItem}>
                  <View style={s.miniStatIconBox}><CheckCircle2 size={14} color={C.p2} /></View>
                  <Text style={s.subStatVal}>2 / 3</Text>
                  <Text style={s.subStatLabel}>Jobs Completed</Text>
                </View>
                <View style={s.verticalDivider} />
                <View style={s.subStatItem}>
                  <View style={s.miniStatIconBox}><Sparkles size={14} color="#F59E0B" fill="rgba(245,158,11,0.1)" /></View>
                  <Text style={s.subStatVal}>4.9 ★</Text>
                  <Text style={s.subStatLabel}>Avg Rating</Text>
                </View>
              </View>
            </BlurView>
          </View>

          {/* BOOKINGS LIST VIEW */}
          <SectionLabel label="Assigned Schedule" value={`${ASSIGNED_JOBS.length} Bookings Remaining`} />

          {isOnline ? (
            ASSIGNED_JOBS.map((job) => (
              <View key={job.id} style={s.jobCardWrapper}>
                <BlurView intensity={Platform.OS === 'ios' ? 45 : 95} tint="light" style={s.jobGlassCard}>
                  
                  {/* Card Main Info Block */}
                  <View style={s.jobCardHeader}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                      <View style={s.jobTypeTag}>
                        <Text style={s.jobTypeTagText}>{job.type}</Text>
                      </View>
                      <Text style={s.jobServiceTitle}>{job.service}</Text>
                      <View style={s.customerMetaRow}>
                        <User size={12} color={C.labelGray} />
                        <Text style={s.customerSubText}>{job.customer}</Text>
                      </View>
                    </View>
                    <View style={s.payoutBadgeFrame}>
                      <Text style={s.payoutBoldText}>{job.payout}</Text>
                    </View>
                  </View>

                  {/* Card Description Logistics Grid */}
                  <View style={s.jobLogisticsGroup}>
                    <View style={s.logisticRow}>
                      <View style={s.iconCellContainer}><Clock size={13} color={C.p2} /></View>
                      <Text style={s.logisticText}>{job.time}</Text>
                    </View>
                    <View style={s.logisticRow}>
                      <View style={s.iconCellContainer}><MapPin size={13} color={C.p2} /></View>
                      <Text style={s.logisticText} numberOfLines={1}>{job.address}</Text>
                    </View>
                  </View>

                  <View style={s.cardDividerLine} />

                  {/* Operational Interactive Action Row */}
                  <View style={s.cardActionsRow}>
                    <TouchableOpacity style={s.rejectBtn} activeOpacity={0.7}>
                      <XCircle size={15} color="#EF4444" style={{ marginRight: 6 }} />
                      <Text style={s.rejectBtnText}>Decline</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={s.acceptBtn} activeOpacity={0.85}>
                      <LinearGradient colors={[C.p1, C.p2]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.acceptGradient}>
                        <Text style={s.acceptBtnText}>Start Job</Text>
                        <ChevronRight size={14} color={C.white} strokeWidth={2.5} />
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>

                </BlurView>
              </View>
            ))
          ) : (
            /* OFF-STATE DISPLAY CONFIGURATION */
            <View style={s.offlinePlaceholderState}>
              <View style={s.emptyIconBoundary}>
                <Briefcase size={sc(32)} color={C.textMuted} />
              </View>
              <Text style={s.offlineStateTitle}>You are currently offline</Text>
              <Text style={s.offlineStateSub}>Toggle your console status to Online at the top of your dashboard to start receiving consumer service dispatches.</Text>
            </View>
          )}

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─── MASTER DESIGN SYSTEM STYLE MAPPINGS ───────────────────────
const s = StyleSheet.create({
  container: { flex: 1 },
  glowOrb: { position: "absolute", width: sc(260), height: sc(260), borderRadius: sc(130), opacity: 0.8 },
  
  // App Header Configurations
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 10 : 20, marginBottom: 10 },
  welcomeText: { fontSize: sc(12), color: C.labelGray, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.6 },
  proNameText: { fontSize: sc(24), fontWeight: "900", color: C.textDark, letterSpacing: -0.6, marginTop: 2 },
  statusPillFrame: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.45)", paddingLeft: 12, paddingRight: 6, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.7)" },
  onlineBorder: { borderColor: "rgba(34, 197, 94, 0.25)" },
  offlineBorder: { borderColor: C.inputBorder },
  miniStatusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusPillText: { fontSize: sc(13), fontWeight: "800", marginRight: 6, letterSpacing: -0.1 },
  switchTransform: { transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] },

  scrollArea: { paddingHorizontal: 24, paddingBottom: 120, paddingTop: 5 },
  
  // Section Group Markers
  sectionLabelRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 24, marginBottom: 12, paddingHorizontal: 4 },
  sectionLabelText: { fontSize: 12, fontWeight: "800", color: C.labelGray, textTransform: "uppercase", letterSpacing: 1 },
  sectionValueText: { fontSize: 12, fontWeight: "800", color: C.p2 },

  // Metrics Master Card
  metricsCardWrapper: { marginBottom: 5, borderRadius: 28, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)', elevation: 3, shadowColor: C.p3, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12 },
  metricsGlassCard: { padding: 20, backgroundColor: "rgba(255, 255, 255, 0.45)" },
  earningsHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  earningsLabel: { fontSize: sc(13), color: C.labelGray, fontWeight: "600" },
  earningsValue: { fontSize: sc(28), fontWeight: "900", color: C.textDark, marginTop: 2, letterSpacing: -0.6 },
  trendBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(34, 197, 94, 0.08)", paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: "rgba(34, 197, 94, 0.15)" },
  trendText: { fontSize: 11, fontWeight: "800", color: C.success },
  metricsDivider: { height: 1, backgroundColor: "rgba(232, 229, 255, 0.7)", marginVertical: 16 },
  subStatsGrid: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  subStatItem: { flex: 1, alignItems: "center" },
  miniStatIconBox: { width: 24, height: 24, borderRadius: 6, backgroundColor: C.white, justifyContent: "center", alignItems: "center", marginBottom: 6, borderWidth: 1, borderColor: C.inputBorder },
  subStatVal: { fontSize: sc(15), fontWeight: "900", color: C.textDark, letterSpacing: -0.2 },
  subStatLabel: { fontSize: 11, color: C.labelGray, marginTop: 2, fontWeight: "600" },
  verticalDivider: { width: 1, height: sc(32), backgroundColor: "rgba(232, 229, 255, 0.8)" },

  // Operational Scheduling Feeds
  jobCardWrapper: { marginBottom: 15, borderRadius: 28, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.7)", elevation: 3, shadowColor: C.p3, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12 },
  jobGlassCard: { padding: 18, backgroundColor: "rgba(255, 255, 255, 0.45)" },
  jobCardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  jobTypeTag: { backgroundColor: "rgba(91, 76, 240, 0.06)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: "flex-start", marginBottom: 6, borderWidth: 1, borderColor: "rgba(91, 76, 240, 0.1)" },
  jobTypeTagText: { fontSize: 9, fontWeight: "800", color: C.p2, textTransform: "uppercase", letterSpacing: 0.3 },
  jobServiceTitle: { fontSize: sc(15), fontWeight: "900", color: C.textDark, letterSpacing: -0.2 },
  customerMetaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  customerSubText: { fontSize: sc(13), color: C.labelGray, fontWeight: "600" },
  payoutBadgeFrame: { backgroundColor: C.white, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: C.inputBorder },
  payoutBoldText: { fontSize: sc(15), fontWeight: "900", color: C.p2, letterSpacing: -0.3 },
  jobLogisticsGroup: { gap: 10, marginVertical: 15 },
  logisticRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconCellContainer: { width: sc(26), height: sc(26), borderRadius: 8, backgroundColor: C.white, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: C.inputBorder },
  logisticText: { fontSize: sc(13), color: C.textDark, fontWeight: "600", opacity: 0.85 },
  cardDividerLine: { height: 1, backgroundColor: "rgba(232, 229, 255, 0.7)", marginBottom: 14 },
  
  // Interactive Controls Setup
  cardActionsRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rejectBtn: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 12 },
  rejectBtnText: { color: "#EF4444", fontWeight: "800", fontSize: sc(13) },
  acceptBtn: { width: width * 0.36, height: sc(44), borderRadius: 14, overflow: "hidden", elevation: 3, shadowColor: C.p2, shadowOpacity: 0.15, shadowRadius: 5 },
  acceptGradient: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4 },
  acceptBtnText: { color: C.white, fontWeight: "800", fontSize: sc(13) },

  // Zero-State Structural Handlers
  offlinePlaceholderState: { paddingVertical: height * 0.1, alignItems: "center", paddingHorizontal: 36 },
  emptyIconBoundary: { width: sc(64), height: sc(64), borderRadius: 22, backgroundColor: C.inputBg, justifyContent: "center", alignItems: "center", marginBottom: 16, borderWidth: 1, borderColor: C.inputBorder },
  offlineStateTitle: { fontSize: sc(16), fontWeight: "800", color: C.textDark },
  offlineStateSub: { fontSize: sc(12), color: C.labelGray, textAlign: "center", marginTop: 6, lineHeight: 18, fontWeight: "500" }
});