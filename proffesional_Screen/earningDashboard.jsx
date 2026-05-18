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
  SlidersHorizontal,
  ArrowUpRight,
  TrendingUp,
  Wallet,
  Calendar,
  Wrench,
  ChevronRight,
  ArrowDownLeft,
  Percent,
  TrendingDown,
  ArrowRightLeft,
} from "lucide-react-native";
import ProBottomTab from "../components/ProBottomTab";

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

// ─── TRANSACTIONS MOCK RECORDS ────────────────────────────────
const LEDGER_DATA = [
  {
    id: "TXN-4491",
    service: "Split AC Jet Service x2",
    amount: "+₹2,648.00",
    date: "Today, 15:30",
    client: "Alok Mourya",
    type: "credit",
  },
  {
    id: "TXN-4320",
    service: "AC Gas Top-up (R32)",
    amount: "+₹850.00",
    date: "Today, 11:15",
    client: "Amit Patel",
    type: "credit",
  },
  {
    id: "TXN-3911",
    service: "Weekly Platform Comm. Cut",
    amount: "-₹450.00",
    date: "14 May, 23:00",
    client: "Platform Wallet",
    type: "debit",
  },
  {
    id: "TXN-3850",
    service: "Window AC Service & Leak Fix",
    amount: "+₹1,150.00",
    date: "13 May, 12:45",
    client: "Priya Desai",
    type: "credit",
  },
];

export default function ProEarningsDashboard() {
  const [timeframe, setTimeframe] = useState("Weekly"); // Daily, Weekly, Monthly

  const SectionLabel = ({ label, rightAction }) => (
    <View style={s.sectionLabelRow}>
      <Text style={s.sectionLabelText}>{label}</Text>
      {rightAction && <Text style={s.sectionActionText}>{rightAction}</Text>}
    </View>
  );

  return (
    <View style={s.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <LinearGradient colors={["#F4F3FF", "#FDFDFF"]} style={StyleSheet.absoluteFill} />

      {/* LUXURY RADIANT GRADIENT BACKGROUND ORBS */}
      <View style={[s.glowOrb, { top: height * 0.04, left: -sc(60), backgroundColor: "rgba(140, 127, 255, 0.22)" }]} />
      <View style={[s.glowOrb, { top: height * 0.36, right: -sc(80), backgroundColor: "rgba(91, 76, 240, 0.14)" }]} />

      <SafeAreaView style={{ flex: 1 }}>
        {/* APP BAR HEADER */}
        <View style={s.header}>
          <Text style={s.headerTitleText}>Revenue Hub</Text>
          <TouchableOpacity style={s.circleBtnFrame} activeOpacity={0.75}>
            <SlidersHorizontal size={sc(18)} color={C.textDark} />
          </TouchableOpacity>
        </View>

        {/* TIME CONTROLLER SEGMENTS TAB BAR */}
        <View style={s.tabContainer}>
          <View style={s.tabBarBackground}>
            {["Daily", "Weekly", "Monthly"].map((tab) => {
              const isActive = timeframe === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setTimeframe(tab)}
                  activeOpacity={0.8}
                  style={[s.tabItem, isActive && s.tabItemActive]}
                >
                  <Text style={[s.tabItemText, isActive && s.tabItemTextActive]}>{tab}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollArea}>
          
          {/* MASTER TOTAL REVENUE GLASS TILE */}
          <View style={s.metricsCardWrapper}>
            <BlurView intensity={Platform.OS === 'ios' ? 45 : 95} tint="light" style={s.metricsGlassCard}>
              <View style={s.earningsHeaderRow}>
                <View>
                  <Text style={s.earningsLabel}>Total Settled Net Revenue</Text>
                  <Text style={s.earningsValue}>₹14,840.00</Text>
                </View>
                <View style={s.walletIconContainer}>
                  <Wallet size={sc(18)} color={C.p2} />
                </View>
              </View>

              <View style={s.metricsDivider} />

              {/* HIGH-FIDELITY HISTOGRAM COLUMN CHART */}
              <View style={s.chartPlaceholderArea}>
                <View style={s.chartBarsWrapper}>
                  {[35, 60, 45, 95, 55, 75, 40].map((h, i) => {
                    const isCurrentDay = i === 3; // Mocking current day spike
                    return (
                      <View key={i} style={s.chartColumnUnit}>
                        <LinearGradient 
                          colors={isCurrentDay ? [C.p1, C.p2] : ["rgba(140, 127, 255, 0.25)", "rgba(91, 76, 240, 0.15)"]} 
                          style={[s.chartBarFill, { height: sc(h) }]} 
                        />
                        <Text style={[s.chartDayLabel, isCurrentDay && { color: C.p2, fontWeight: "900" }]}>
                          {["M", "T", "W", "T", "F", "S", "S"][i]}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </BlurView>
          </View>

          {/* SECONDARY HIGH-DENSITY ITEM FINANCIAL INSIGHTS */}
          <View style={s.insightsGrid}>
            <View style={s.insightCardWrapper}>
              <BlurView intensity={90} tint="light" style={s.insightGlassCard}>
                <View style={s.insightMetaHeader}>
                  <View style={[s.miniIconBox, { backgroundColor: "rgba(34,197,94,0.08)", borderColor: "rgba(34,197,94,0.15)" }]}>
                    <ArrowDownLeft size={12} color={C.success} />
                  </View>
                  <View style={s.trendBadgeMini}>
                    <TrendingUp size={10} color={C.success} />
                    <Text style={s.trendTextMini}>+12%</Text>
                  </View>
                </View>
                <Text style={s.insightValue}>₹3,498.00</Text>
                <Text style={s.insightLabel}>Today's Payout</Text>
              </BlurView>
            </View>

            <View style={s.insightCardWrapper}>
              <BlurView intensity={90} tint="light" style={s.insightGlassCard}>
                <View style={s.insightMetaHeader}>
                  <View style={[s.miniIconBox, { backgroundColor: "rgba(91,76,240,0.08)", borderColor: "rgba(91,76,240,0.15)" }]}>
                    <Percent size={12} color={C.p2} />
                  </View>
                  <Text style={s.fixedCapLabel}>Platform Cut</Text>
                </View>
                <Text style={s.insightValue}>₹450.00</Text>
                <Text style={s.insightLabel}>Commission Fees</Text>
              </BlurView>
            </View>
          </View>

          {/* TRANSACTION LEDGER FEED MODULE */}
          <SectionLabel label="Recent Ledger Actions" rightAction="Statements" />

          {LEDGER_DATA.map((item) => {
            const isCredit = item.type === "credit";
            return (
              <View key={item.id} style={s.ledgerCardWrapper}>
                <BlurView intensity={90} tint="light" style={s.ledgerGlassCard}>
                  <View style={[s.ledgerIconFrame, isCredit ? s.bgSuccessTint : s.bgDebitTint]}>
                    {isCredit ? (
                      <ArrowDownLeft size={15} color={C.success} />
                    ) : (
                      <ArrowUpRight size={15} color="#EF4444" />
                    )}
                  </View>

                  <View style={s.ledgerMetaBlock}>
                    <Text style={s.ledgerServiceTitle} numberOfLines={1}>{item.service}</Text>
                    <Text style={s.ledgerSubText}>From: {item.client} • {item.date}</Text>
                  </View>

                  <View style={s.amountAlignmentBlock}>
                    <Text style={[s.ledgerAmountText, isCredit ? s.textSuccessColor : s.textDebitColor]}>
                      {item.amount}
                    </Text>
                    <Text style={s.ledgerIdText}>{item.id}</Text>
                  </View>
                </BlurView>
              </View>
            );
          })}

        </ScrollView>
      </SafeAreaView>
      <ProBottomTab />
    </View>
  );
}

// ─── MASTER SYSTEM DESIGN SYSTEM STYLE CONFIGS ────────────────
const s = StyleSheet.create({
  container: { flex: 1 },
  glowOrb: { position: "absolute", width: sc(260), height: sc(260), borderRadius: sc(130), opacity: 0.8 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingVertical: 15 },
  headerTitleText: { fontSize: sc(24), fontWeight: "900", color: C.textDark, letterSpacing: -0.6 },
  circleBtnFrame: { width: sc(42), height: sc(42), borderRadius: 14, backgroundColor: C.white, borderWidth: 1, borderColor: C.inputBorder, justifyContent: "center", alignItems: "center", elevation: 1 },
  
  // Custom Smooth Tab Controller Segment
  tabContainer: { paddingHorizontal: 24, marginBottom: 15 },
  tabBarBackground: { flexDirection: "row", backgroundColor: "rgba(244, 242, 255, 0.7)", borderRadius: 20, padding: 5, borderWidth: 1, borderColor: "rgba(232, 229, 255, 0.6)" },
  tabItem: { flex: 1, paddingVertical: 11, alignItems: "center", borderRadius: 15 },
  tabItemActive: { backgroundColor: C.white, elevation: 4, shadowColor: C.p2, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 6 },
  tabItemText: { fontSize: sc(13), fontWeight: "700", color: C.textMuted },
  tabItemTextActive: { color: C.p2, fontWeight: "800" },

  // Luxury Main Overview Card
  scrollArea: { paddingHorizontal: 24, paddingBottom: 120, paddingTop: 5 },
  metricsCardWrapper: { marginBottom: 15, borderRadius: 28, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)', elevation: 3, shadowColor: C.p3, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12 },
  metricsGlassCard: { padding: 20, backgroundColor: "rgba(255, 255, 255, 0.45)" },
  earningsHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  earningsLabel: { fontSize: sc(13), color: C.labelGray, fontWeight: "600" },
  earningsValue: { fontSize: sc(28), fontWeight: "900", color: C.textDark, marginTop: 2, letterSpacing: -0.6 },
  walletIconContainer: { width: 42, height: 42, borderRadius: 14, backgroundColor: C.white, borderWidth: 1, borderColor: C.inputBorder, justifyContent: "center", alignItems: "center" },
  metricsDivider: { height: 1, backgroundColor: "rgba(232, 229, 255, 0.7)", marginVertical: 16 },

  // Responsive Core Histogram Architecture
  chartPlaceholderArea: { height: sc(115), justifyContent: "flex-end", paddingTop: 5 },
  chartBarsWrapper: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", paddingHorizontal: 4 },
  chartColumnUnit: { alignItems: "center", width: "11%" },
  chartBarFill: { width: sc(8), borderRadius: 4, minHeight: 4 },
  chartDayLabel: { fontSize: 10, color: C.labelGray, fontWeight: "700", marginTop: 8 },

  // Double Grid Split Performance Cards
  insightsGrid: { flexDirection: "row", justifyContent: "space-between", gap: 12, marginBottom: 15 },
  insightCardWrapper: { flex: 1, borderRadius: 24, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.7)", elevation: 3, shadowColor: C.p3, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12 },
  insightGlassCard: { padding: 16, backgroundColor: "rgba(255, 255, 255, 0.45)" },
  insightMetaHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  miniIconBox: { width: 26, height: 26, borderRadius: 8, borderWidth: 1, justifyContent: "center", alignItems: "center", backgroundColor: C.white },
  trendBadgeMini: { flexDirection: "row", alignItems: "center", gap: 2, backgroundColor: "rgba(34,197,94,0.06)", paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6, borderWidth: 1, borderColor: "rgba(34,197,94,0.12)" },
  trendTextMini: { fontSize: 9, fontWeight: "800", color: C.success },
  fixedCapLabel: { fontSize: 9, fontWeight: "800", color: C.labelGray, textTransform: "uppercase", letterSpacing: 0.3 },
  insightValue: { fontSize: sc(16), fontWeight: "900", color: C.textDark, letterSpacing: -0.2 },
  insightLabel: { fontSize: 11, color: C.labelGray, fontWeight: "600", marginTop: 3 },

  // Systematic Transaction Feed Rows
  sectionLabelRow: { paddingHorizontal: 4, marginTop: 18, marginBottom: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionLabelText: { fontSize: 12, fontWeight: "800", color: C.labelGray, textTransform: "uppercase", letterSpacing: 1 },
  sectionActionText: { fontSize: 13, fontWeight: "700", color: C.p2, letterSpacing: -0.1 },
  ledgerCardWrapper: { marginBottom: 12, borderRadius: 24, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.7)", elevation: 3, shadowColor: C.p3, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12 },
  ledgerGlassCard: { flexDirection: "row", padding: 14, backgroundColor: "rgba(255, 255, 255, 0.45)", alignItems: "center" },
  ledgerIconFrame: { width: sc(36), height: sc(36), borderRadius: 11, justifyContent: "center", alignItems: "center", borderWidth: 1 },
  bgSuccessTint: { backgroundColor: "rgba(34,197,94,0.06)", borderColor: "rgba(34,197,94,0.15)" },
  bgDebitTint: { backgroundColor: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.15)" },
  ledgerMetaBlock: { flex: 1, marginLeft: 14, marginRight: 8 },
  ledgerServiceTitle: { fontSize: sc(14), fontWeight: "800", color: C.textDark, letterSpacing: -0.1 },
  ledgerSubText: { fontSize: sc(11), color: C.labelGray, marginTop: 4, fontWeight: "600" },
  amountAlignmentBlock: { alignItems: "flex-end" },
  ledgerAmountText: { fontSize: sc(14), fontWeight: "900", letterSpacing: -0.2 },
  textSuccessColor: { color: C.success },
  textDebitColor: { color: "#EF4444" },
  ledgerIdText: { fontSize: 9, fontWeight: "700", color: C.textMuted, marginTop: 3, textTransform: "uppercase" }
});
