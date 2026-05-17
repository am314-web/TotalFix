import React, { useState, useEffect } from "react";
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
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import {
  ChevronLeft,
  Clock,
  Camera,
  CheckCircle2,
  Plus,
  Minus,
  Zap,
  UserCheck,
  Circle,
  Package,
  Activity,
  User,
  MapPin,
  Play,
  Pause
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
  success: "#22C55E",
};

export default function ProJobProgressScreen() {
  const [currentView, setCurrentView] = useState("progress"); // progress, amendment
  const [seconds, setSeconds] = useState(1642); 
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // --- JOB CHECKLIST TRACKING STATES ---
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Safety gear & uniform compliance checked", done: true },
    { id: 2, text: "Pre-service AC temperature & current log metrics recorded", done: true },
    { id: 3, text: "Jet cleaning foam layer uniformly applied", done: false },
  ]);

  // --- PHOTO STATUS CODES ---
  const [beforePhoto, setBeforePhoto] = useState("done"); 
  const [afterPhoto, setAfterPhoto] = useState("empty");

  // --- SPARE PARTS & EXTRA AMENDMENTS STATES ---
  const [spareQty, setSpareQty] = useState(0);
  const [extraCost, setExtraCost] = useState(0); 
  const [isApproved, setIsApproved] = useState(false);

  // Live StopWatch Engine Loop
  useEffect(() => {
    let timer;
    if (isTimerRunning) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  const formatTimer = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs > 0 ? hrs + ":" : ""}${mins < 10 ? "0" + mins : mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  const toggleChecklist = (id) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const SectionLabel = ({ label, rightAction, onActionPress }) => (
    <View style={s.sectionLabelRow}>
      <Text style={s.sectionLabelText}>{label}</Text>
      {rightAction && (
        <TouchableOpacity onPress={onActionPress}>
          <Text style={s.sectionActionText}>{rightAction}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // ─── VIEW 1: ACTIVE JOB PROGRESS PANEL ───────────────────────
  const renderProgressView = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollArea}>
      
      {/* LIVE TIMER HUB */}
      <View style={s.timerWrapper}>
        <BlurView intensity={Platform.OS === 'ios' ? 45 : 95} tint="light" style={s.timerGlassBlock}>
          <View style={s.timerMetaHeader}>
            <Activity size={14} color={C.p2} />
            <Text style={s.timerHeaderTitle}>ORDER SERVICE ELAPSED TIME</Text>
          </View>
          <Text style={s.timerValueText}>{formatTimer(seconds)}</Text>
          
          <TouchableOpacity 
            style={[s.timerControlToggleBtn, !isTimerRunning && { borderColor: C.success }]} 
            onPress={() => setIsTimerRunning(!isTimerRunning)}
            activeOpacity={0.8}
          >
            {isTimerRunning ? (
              <>
                <Pause size={12} color="#EF4444" fill="#EF4444" />
                <Text style={[s.timerToggleText, { color: "#EF4444" }]}>Pause Timer</Text>
              </>
            ) : (
              <>
                <Play size={12} color={C.success} fill={C.success} />
                <Text style={[s.timerToggleText, { color: C.success }]}>Resume Session</Text>
              </>
            )}
          </TouchableOpacity>
        </BlurView>
      </View>

      {/* BEFORE / AFTER VISUAL COMPLIANCE VAULT */}
      <SectionLabel label="Visual Evidence Audit" />
      <View style={s.photoRowContainer}>
        {/* Before Photo Box */}
        <TouchableOpacity style={s.photoTouchNode} activeOpacity={0.8}>
          <BlurView intensity={85} tint="light" style={[s.photoGlassBox, beforePhoto === "done" && s.photoActiveGlass]}>
            {beforePhoto === "done" ? (
              <>
                <Image source={{ uri: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=200" }} style={s.capturedImage} />
                <LinearGradient colors={[C.p1, C.p2]} style={s.photoStatusIndicator}>
                  <CheckCircle2 size={10} color={C.white} />
                </LinearGradient>
                <Text style={s.photoFloatingLabel}>Pre-Service Frame</Text>
              </>
            ) : (
              <>
                <View style={s.cameraIconBox}><Camera size={16} color={C.p2} /></View>
                <Text style={s.photoBoxText}>Before Photo</Text>
              </>
            )}
          </BlurView>
        </TouchableOpacity>

        {/* After Photo Box */}
        <TouchableOpacity style={s.photoTouchNode} activeOpacity={0.8} onPress={() => setAfterPhoto("done")}>
          <BlurView intensity={85} tint="light" style={[s.photoGlassBox, afterPhoto === "done" && s.photoActiveGlass]}>
            {afterPhoto === "done" ? (
              <>
                <Image source={{ uri: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=200" }} style={s.capturedImage} />
                <LinearGradient colors={[C.p1, C.p2]} style={s.photoStatusIndicator}>
                  <CheckCircle2 size={10} color={C.white} />
                </LinearGradient>
                <Text style={s.photoFloatingLabel}>Post-Service Frame</Text>
              </>
            ) : (
              <>
                <View style={s.cameraIconBox}><Camera size={16} color={C.labelGray} /></View>
                <Text style={[s.photoBoxText, { color: C.labelGray }]}>After Photo</Text>
              </>
            )}
          </BlurView>
        </TouchableOpacity>
      </View>

      {/* JOB PROCEDURE CHECKLIST MATRIX */}
      <SectionLabel label="Task Checkpoints" />
      <View style={s.checklistCardWrapper}>
        <BlurView intensity={90} tint="light" style={s.checklistGlassBlock}>
          {checklist.map((item, index) => {
            const isDone = item.done;
            return (
              <TouchableOpacity 
                key={item.id} 
                style={[s.checkRowItem, isDone && s.checkRowItemActive, index > 0 && s.itemBorderTop]} 
                activeOpacity={0.75} 
                onPress={() => toggleChecklist(item.id)}
              >
                <View style={[s.checkboxOuterShell, isDone && { borderColor: C.p2 }]}>
                  {isDone && <CheckCircle2 size={16} color={C.p2} fill={C.inputBg} />}
                </View>
                <Text style={[s.checkItemText, isDone && s.checkItemTextDone]}>{item.text}</Text>
              </TouchableOpacity>
            );
          })}
        </BlurView>
      </View>

      {/* NAV TO AMENDMENT TRIGGER BUTTON */}
      <TouchableOpacity style={s.dashedActionBtn} activeOpacity={0.75} onPress={() => setCurrentView("amendment")}>
        <Plus size={14} color={C.p2} style={{ marginRight: 6 }} />
        <Text style={s.dashedActionText}>Modify Bill / Add Spares & Labors</Text>
      </TouchableOpacity>

      <TouchableOpacity style={s.solidCtaBtn} activeOpacity={0.85} onPress={() => alert("Job close out initialized safely.")}>
        <LinearGradient colors={[C.p1, C.p2]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.ctaBtnGradient}>
          <Text style={s.ctaBtnText}>Complete Workspace Session</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );

  // ─── VIEW 2: SPARE PARTS & COST AMENDMENT CONSOLE ───────────
  const renderAmendmentView = () => {
    const totalExtra = (spareQty * 450) + Number(extraCost || 0);

    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollArea}>
        <Text style={s.subViewDescription}>Amend the running order ledger configuration for real-time customer transparency.</Text>

        {/* Spare parts count adjuster card */}
        <SectionLabel label="Component Allocation" />
        <View style={s.amendCardWrapper}>
          <BlurView intensity={95} tint="light" style={s.amendGlassCard}>
            <View style={s.spareIconContainer}><Package size={sc(16)} color={C.p2} /></View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={s.amendItemTitle}>Capacitor (45 mFD)</Text>
              <Text style={s.amendItemSub}>Standard retail markup: ₹450.00</Text>
            </View>
            <View style={s.qtyAdjusterContainer}>
              <TouchableOpacity style={s.qtyCircleBtn} onPress={() => spareQty > 0 && setSpareQty(spareQty - 1)}><Minus size={11} color={C.p2} /></TouchableOpacity>
              <Text style={s.qtyDisplayValText}>{spareQty}</Text>
              <TouchableOpacity style={s.qtyCircleBtn} onPress={() => setSpareQty(spareQty + 1)}><Plus size={11} color={C.p2} /></TouchableOpacity>
            </View>
          </BlurView>
        </View>

        {/* Additional service cost inputs */}
        <SectionLabel label="Supplemental Labor Charges" />
        <View style={s.amendCardWrapper}>
          <BlurView intensity={95} tint="light" style={[s.amendGlassCard, { paddingVertical: 12 }]}>
            <View style={s.spareIconContainer}><Zap size={sc(15)} color={C.p2} /></View>
            <Text style={s.extraLabelTextField}>Extra Drainage / Copper Pipe Extension</Text>
            <TouchableOpacity style={[s.priceOptionBtn, extraCost === 250 && s.priceOptionBtnActive]} onPress={() => setExtraCost(extraCost === 250 ? 0 : 250)}>
              <Text style={[s.priceOptionText, extraCost === 250 && { color: C.p2, fontWeight: "800" }]}>+₹250</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.priceOptionBtn, extraCost === 500 && s.priceOptionBtnActive]} onPress={() => setExtraCost(extraCost === 500 ? 0 : 500)}>
              <Text style={[s.priceOptionText, extraCost === 500 && { color: C.p2, fontWeight: "800" }]}>+₹500</Text>
            </TouchableOpacity>
          </BlurView>
        </View>

        {/* Customer validation sign off loop panel */}
        <SectionLabel label="Client Verification Audit" />
        <TouchableOpacity style={s.amendCardWrapper} activeOpacity={0.85} onPress={() => setIsApproved(!isApproved)}>
          <BlurView intensity={95} tint="light" style={[s.amendGlassCard, isApproved && { borderColor: C.success }]}>
            <View style={[s.spareIconContainer, isApproved && { backgroundColor: "rgba(34,197,94,0.08)", borderColor: "rgba(34,197,94,0.2)" }]}><UserCheck size={sc(16)} color={isApproved ? C.success : C.labelGray} /></View>
            <View style={{ flex: 1, marginLeft: 14, marginRight: 10 }}>
              <Text style={s.approvalNoticeTitle}>Secure Customer Consent</Text>
              <Text style={s.approvalNoticeBodyText}>Authorize runtime bill updates of ₹{totalExtra} before sealing invoice ledger.</Text>
            </View>
            {isApproved ? (
              <LinearGradient colors={["#34D399", C.success]} style={s.badgeCheckSuccess}><CheckCircle2 size={12} color={C.white} /></LinearGradient>
            ) : (
              <View style={s.badgeCheckEmpty} />
            )}
          </BlurView>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[s.solidCtaBtn, { marginTop: sc(20) }]} 
          activeOpacity={0.85} 
          onPress={() => {
            if (isApproved) {
              alert("Order matrix altered successfully.");
              setCurrentView("progress");
            } else {
              alert("Verification signature required before application update.");
            }
          }}
        >
          <LinearGradient colors={[C.p1, C.p2]} style={s.ctaBtnGradient}>
            <Text style={s.ctaBtnText}>Apply Amendments Matrix</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  return (
    <View style={s.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <LinearGradient colors={["#F4F3FF", "#FDFDFF"]} style={StyleSheet.absoluteFill} />

      {/* RADIAL AMBIENT BACKGROUND GLOW BLOBS */}
      <View style={[s.ambientOrb, { top: -sc(40), left: -sc(40), backgroundColor: "rgba(140, 127, 255, 0.16)" }]} />
      <View style={[s.ambientOrb, { bottom: height * 0.15, right: -sc(60), backgroundColor: "rgba(91, 76, 240, 0.1)" }]} />

      <SafeAreaView style={{ flex: 1 }}>
        {/* VIEW NAVIGATION TOP BAR */}
        <View style={s.header}>
          {currentView !== "progress" ? (
            <TouchableOpacity style={s.circleBarBtn} onPress={() => setCurrentView("progress")} activeOpacity={0.75}>
              <ChevronLeft size={sc(20)} color={C.textDark} strokeWidth={2.5} />
            </TouchableOpacity>
          ) : (
            <View style={[s.circleBarBtn, { opacity: 0 }]} />
          )}
          <Text style={s.headerTitleText}>{currentView === "progress" ? "Job Session Monitor" : "Invoice Amendment Console"}</Text>
          <View style={[s.circleBarBtn, { opacity: 0 }]} />
        </View>

        {/* WORKSPACE PORTAL DISPATCH ROUTER SWITCH */}
        {currentView === "progress" ? renderProgressView() : renderAmendmentView()}
      </SafeAreaView>
      <AppBottomTab />
    </View>
  );
}

// ─── MASTER SYSTEM CORE DESIGN STYLE SHEET MAPPINGS ───────────
const s = StyleSheet.create({
  container: { flex: 1 },
  ambientOrb: { position: "absolute", width: sc(260), height: sc(260), borderRadius: sc(130), opacity: 0.8 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 10 : 20, marginBottom: 15 },
  circleBarBtn: { width: sc(40), height: sc(40), borderRadius: 14, backgroundColor: C.white, borderWidth: 1, borderColor: C.inputBorder, justifyContent: "center", alignItems: "center", elevation: 1 },
  headerTitleText: { fontSize: sc(17), fontWeight: "900", color: C.textDark, letterSpacing: -0.4 },
  scrollArea: { paddingHorizontal: 24, paddingBottom: 120, paddingTop: 5 },
  
  // Group Labels Layout
  sectionLabelRow: { paddingHorizontal: 4, marginTop: 24, marginBottom: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionLabelText: { fontSize: 12, fontWeight: "800", color: C.labelGray, textTransform: "uppercase", letterSpacing: 1 },
  sectionActionText: { fontSize: 13, fontWeight: "700", color: C.p2, letterSpacing: -0.1 },
  subViewDescription: { fontSize: sc(12), color: C.labelGray, paddingHorizontal: 4, marginBottom: 20, lineHeight: 18, fontWeight: "500" },

  // Live Timer Bounding Box Configurations
  timerWrapper: { marginBottom: 5, borderRadius: 28, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)', elevation: 3, shadowColor: C.p3, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12 },
  timerGlassBlock: { padding: 20, backgroundColor: "rgba(255, 255, 255, 0.45)", alignItems: "center" },
  timerMetaHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 },
  timerHeaderTitle: { fontSize: 10, fontWeight: "900", color: C.p2, letterSpacing: 0.8 },
  timerValueText: { fontSize: sc(36), fontWeight: "900", color: C.textDark, letterSpacing: -0.6 },
  timerControlToggleBtn: { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1, borderColor: C.inputBorder, backgroundColor: C.white, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, marginTop: 14, elevation: 1 },
  timerToggleText: { fontSize: 11, fontWeight: "800" },

  // Visual Evidence Management Box
  photoRowContainer: { flexDirection: "row", justifyContent: "space-between", gap: 14 },
  photoTouchNode: { flex: 1, height: sc(115), borderRadius: 24, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.7)", elevation: 3, shadowColor: C.p3, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10 },
  photoGlassBox: { flex: 1, backgroundColor: "rgba(255, 255, 255, 0.45)", justifyContent: "center", alignItems: "center", gap: 8 },
  photoActiveGlass: { borderPadding: 0 },
  cameraIconBox: { width: 34, height: 34, borderRadius: 10, backgroundColor: C.white, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: C.inputBorder },
  photoBoxText: { fontSize: sc(12), fontWeight: "800", color: C.textDark, letterSpacing: -0.1 },
  capturedImage: { width: "100%", height: "100%", borderRadius: 22 },
  photoStatusIndicator: { position: "absolute", top: 8, right: 8, width: 20, height: 20, borderRadius: 10, justifyContent: "center", alignItems: "center", elevation: 2 },
  photoFloatingLabel: { position: "absolute", bottom: 8, left: 10, backgroundColor: "rgba(26,23,64,0.75)", color: C.white, fontSize: 9, fontWeight: "800", paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6, overflow: "hidden" },

  // Micro Checkpoint Configurations
  checklistCardWrapper: { borderRadius: 24, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.7)", elevation: 3, shadowColor: C.p3, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12 },
  checklistGlassBlock: { padding: 4, backgroundColor: "rgba(255, 255, 255, 0.45)" },
  checkRowItem: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  checkRowItemActive: { backgroundColor: "rgba(91,76,240,0.02)" },
  itemBorderTop: { borderTopWidth: 1, borderTopColor: "rgba(232, 229, 255, 0.5)" },
  checkboxOuterShell: { width: 18, height: 18, borderRadius: 5, borderWidth: 1.5, borderColor: C.inputBorder, justifyContent: "center", alignItems: "center" },
  checkItemText: { fontSize: sc(13), fontWeight: "700", color: C.textDark, flex: 1, letterSpacing: -0.1 },
  checkItemTextDone: { color: C.labelGray, textDecorationLine: "line-through", fontWeight: "500" },

  // Runtime Invoice Modifiers
  amendCardWrapper: { marginBottom: 15, borderRadius: 28, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.7)", elevation: 3, shadowColor: C.p3, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12 },
  amendGlassCard: { flexDirection: "row", padding: 16, backgroundColor: "rgba(255, 255, 255, 0.45)", alignItems: "center" },
  spareIconContainer: { width: sc(36), height: sc(36), borderRadius: 11, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: C.inputBorder, backgroundColor: C.white },
  amendItemTitle: { fontSize: sc(14), fontWeight: "800", color: C.textDark, letterSpacing: -0.1 },
  amendItemSub: { fontSize: sc(11), color: C.labelGray, marginTop: 3, fontWeight: "600" },
  qtyAdjusterContainer: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: C.white, padding: 4, borderRadius: 12, borderWidth: 1, borderColor: C.inputBorder },
  qtyCircleBtn: { width: 24, height: 24, borderRadius: 7, backgroundColor: C.inputBg, justifyContent: "center", alignItems: "center" },
  qtyDisplayValText: { fontSize: sc(13), fontWeight: "900", color: C.p2 },
  extraLabelTextField: { flex: 1, fontSize: sc(13), fontWeight: "700", color: C.textDark, marginLeft: 14, letterSpacing: -0.1 },
  priceOptionBtn: { backgroundColor: C.white, borderWidth: 1, borderColor: C.inputBorder, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, marginLeft: 6 },
  priceOptionBtnActive: { borderColor: C.p2, backgroundColor: C.inputBg },
  priceOptionText: { fontSize: 11, fontWeight: "700", color: C.textDark },
  approvalNoticeTitle: { fontSize: sc(14), fontWeight: "800", color: C.textDark, letterSpacing: -0.1 },
  approvalNoticeBodyText: { fontSize: sc(12), color: C.labelGray, fontWeight: "500", marginTop: 2, lineHeight: 16 },
  badgeCheckEmpty: { width: 18, height: 18, borderRadius: 6, borderWidth: 1.5, borderColor: C.inputBorder },
  badgeCheckSuccess: { width: 18, height: 18, borderRadius: 6, justifyContent: "center", alignItems: "center" },

  // Global Structural CTA Frameworks
  solidCtaBtn: { height: sc(54), borderRadius: 18, overflow: "hidden", elevation: 4, shadowColor: C.p2, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, marginTop: 20 },
  ctaBtnGradient: { flex: 1, justifyContent: "center", alignItems: "center" },
  ctaBtnText: { color: C.white, fontSize: sc(15), fontWeight: "900", letterSpacing: -0.1 },
  dashedActionBtn: { flexDirection: "row", justifyContent: "center", alignItems: "center", borderStyle: "dashed", borderWidth: 1.5, borderColor: C.p1, backgroundColor: "rgba(140, 127, 255, 0.04)", padding: 16, borderRadius: 22, marginTop: 14, marginHorizontal: 4 },
  dashedActionText: { fontSize: sc(13), color: C.p2, fontWeight: "800" },
});