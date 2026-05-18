import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import {
    Camera,
    CheckCircle2,
    ChevronLeft,
    Circle,
    Clock,
    Minus,
    Package,
    Plus,
    UserCheck,
    Zap
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
    Dimensions,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
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

export default function ProJobProgressScreen() {
  const [currentView, setCurrentView] = useState("progress"); // progress, amendment
  const [seconds, setSeconds] = useState(1642); // 27 mins 22 secs mock start

  // --- JOB CHECKLIST TRACKING STATES ---
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Safety gear & mask equipped", done: true },
    { id: 2, text: "Pre-service AC diagnostics log run", done: true },
    { id: 3, text: "Jet cleaning foam layer applied", done: false },
  ]);

  // --- PHOTO STATUS CODES ---
  const [beforePhoto, setBeforePhoto] = useState("done"); // empty, done
  const [afterPhoto, setAfterPhoto] = useState("empty");

  // --- SPARE PARTS & EXTRA AMENDMENTS STATES ---
  const [spareQty, setSpareQty] = useState(0);
  const [extraCost, setExtraCost] = useState(0); // Additional service fees manually calculated
  const [isApproved, setIsApproved] = useState(false);

  // Live Operation Timer Engine
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs > 0 ? hrs + ":" : ""}${mins < 10 ? "0" + mins : mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  const toggleChecklist = (id) => {
    setChecklist(
      checklist.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item,
      ),
    );
  };

  // ─── VIEW 1: ACTIVE JOB PROGRESS PANEL ───────────────────────
  const renderProgressView = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={s.scrollArea}
    >
      {/* LIVE TIMER HUB */}
      <View style={s.timerWrapper}>
        <BlurView
          intensity={Platform.OS === "ios" ? 45 : 95}
          tint="light"
          style={s.timerGlassBlock}
        >
          <Clock size={sc(22)} color={C.p2} style={{ marginBottom: 6 }} />
          <Text style={s.timerValueText}>{formatTimer(seconds)}</Text>
          <Text style={s.timerSubLabel}>Active Session Duration</Text>
        </BlurView>
      </View>

      {/* BEFORE / AFTER VISUAL COMPLIANCE VAULT */}
      <SectionLabel label="Site Verification Photos" />
      <View style={s.photoRowContainer}>
        {/* Before Photo Box */}
        <TouchableOpacity style={s.photoTouchNode} activeOpacity={0.8}>
          <BlurView intensity={80} tint="light" style={s.photoGlassBox}>
            {beforePhoto === "done" ? (
              <>
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=150",
                  }}
                  style={s.capturedImage}
                />
                <View style={s.photoStatusIndicator}>
                  <CheckCircle2 size={12} color={C.white} fill={C.success} />
                </View>
              </>
            ) : (
              <>
                <Camera size={20} color={C.p2} />
                <Text style={s.photoBoxText}>Before Photo</Text>
              </>
            )}
          </BlurView>
        </TouchableOpacity>

        {/* After Photo Box */}
        <TouchableOpacity
          style={s.photoTouchNode}
          activeOpacity={0.8}
          onPress={() => setAfterPhoto("done")}
        >
          <BlurView intensity={80} tint="light" style={s.photoGlassBox}>
            {afterPhoto === "done" ? (
              <>
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=150",
                  }}
                  style={s.capturedImage}
                />
                <View style={s.photoStatusIndicator}>
                  <CheckCircle2 size={12} color={C.white} fill={C.success} />
                </View>
              </>
            ) : (
              <>
                <Camera size={20} color={C.textMuted} />
                <Text style={[s.photoBoxText, { color: C.labelGray }]}>
                  After Photo
                </Text>
              </>
            )}
          </BlurView>
        </TouchableOpacity>
      </View>

      {/* JOB PROCEDURE CHECKLIST MATRIX */}
      <SectionLabel label="Operational Checklist" />
      <View style={s.checklistCardWrapper}>
        <BlurView intensity={85} tint="light" style={s.checklistGlassBlock}>
          {checklist.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={s.checkRowItem}
              activeOpacity={0.75}
              onPress={() => toggleChecklist(item.id)}
            >
              {item.done ? (
                <CheckCircle2
                  size={18}
                  color={C.p2}
                  fill="rgba(91,76,240,0.06)"
                />
              ) : (
                <Circle size={18} color={C.inputBorder} />
              )}
              <Text style={[s.checkItemText, item.done && s.checkItemTextDone]}>
                {item.text}
              </Text>
            </TouchableOpacity>
          ))}
        </BlurView>
      </View>

      {/* NAV TO AMENDMENT TRIGGER BUTTON */}
      <TouchableOpacity
        style={s.dashedActionBtn}
        activeOpacity={0.75}
        onPress={() => setCurrentView("amendment")}
      >
        <Plus size={15} color={C.p2} style={{ marginRight: 8 }} />
        <Text style={s.dashedActionText}>Add Spares or Extra Services</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={s.solidCtaBtn}
        activeOpacity={0.85}
        onPress={() =>
          alert(
            "Job marked complete. Initializing close out ledger verification.",
          )
        }
      >
        <LinearGradient
          colors={[C.p1, C.p2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={s.ctaBtnGradient}
        >
          <Text style={s.ctaBtnText}>Complete & Close Out Job</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );

  // ─── VIEW 2: SPARE PARTS & COST AMENDMENT CONSOLE ───────────
  const renderAmendmentView = () => {
    const totalExtra = spareQty * 450 + Number(extraCost || 0);

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollArea}
      >
        <Text style={s.subViewDescription}>
          Amend the running order ledger layout for unexpected site resource
          consumption.
        </Text>

        {/* Spare parts count adjuster card */}
        <SectionLabel label="Spare Parts Mapping" />
        <View style={s.amendCardWrapper}>
          <BlurView intensity={85} tint="light" style={s.amendGlassCard}>
            <Package size={sc(20)} color={C.p2} />
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={s.amendItemTitle}>Capacitor (45 mFD)</Text>
              <Text style={s.amendItemSub}>Standard unit price: ₹450.00</Text>
            </View>
            <View style={s.qtyAdjusterContainer}>
              <TouchableOpacity
                style={s.qtyCircleBtn}
                onPress={() => spareQty > 0 && setSpareQty(spareQty - 1)}
              >
                <Minus size={12} color={C.p2} />
              </TouchableOpacity>
              <Text style={s.qtyDisplayValText}>{spareQty}</Text>
              <TouchableOpacity
                style={s.qtyCircleBtn}
                onPress={() => setSpareQty(spareQty + 1)}
              >
                <Plus size={12} color={C.p2} />
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>

        {/* Additional service cost inputs */}
        <SectionLabel label="Additional Service Labors" />
        <View style={s.amendCardWrapper}>
          <BlurView
            intensity={85}
            tint="light"
            style={[s.amendGlassCard, { paddingVertical: 12 }]}
          >
            <Zap size={sc(18)} color={C.p2} />
            <Text style={s.extraLabelTextField}>
              Extra Wiring/Drain pipe fix
            </Text>
            <TouchableOpacity
              style={[
                s.priceOptionBtn,
                extraCost === 250 && s.priceOptionBtnActive,
              ]}
              onPress={() => setExtraCost(extraCost === 250 ? 0 : 250)}
            >
              <Text
                style={[
                  s.priceOptionText,
                  extraCost === 250 && { color: C.p2 },
                ]}
              >
                +₹250
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                s.priceOptionBtn,
                extraCost === 500 && s.priceOptionBtnActive,
              ]}
              onPress={() => setExtraCost(extraCost === 500 ? 0 : 500)}
            >
              <Text
                style={[
                  s.priceOptionText,
                  extraCost === 500 && { color: C.p2 },
                ]}
              >
                +₹500
              </Text>
            </TouchableOpacity>
          </BlurView>
        </View>

        {/* Customer validation sign off loop panel */}
        <SectionLabel label="Customer Verification Loop" />
        <TouchableOpacity
          style={s.amendCardWrapper}
          activeOpacity={0.85}
          onPress={() => setIsApproved(!isApproved)}
        >
          <BlurView
            intensity={85}
            tint="light"
            style={[s.amendGlassCard, isApproved && { borderColor: C.success }]}
          >
            <UserCheck
              size={sc(18)}
              color={isApproved ? C.success : C.labelGray}
            />
            <Text style={s.approvalNoticeBodyText}>
              Secure explicit customer approval for ₹{totalExtra} adjustments
              before system locking.
            </Text>
            {isApproved ? (
              <View style={s.badgeCheckSuccess}>
                <CheckCircle2 size={16} color={C.success} />
              </View>
            ) : (
              <View style={s.badgeCheckEmpty} />
            )}
          </BlurView>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.solidCtaBtn, { marginTop: 30 }]}
          activeOpacity={0.85}
          onPress={() => {
            if (isApproved) {
              alert(
                "Running billing invoice configuration adjusted successfully.",
              );
              setCurrentView("progress");
            } else {
              alert(
                "Ledger amendments require consumer verification approval metrics.",
              );
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

  // --- SEGMENT LABEL UTILS ---
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

      {/* CHROMATIC BLOBS LAYER BLUR DEPTHS */}
      <View
        style={[
          s.ambientOrb,
          {
            top: -sc(40),
            left: -sc(40),
            backgroundColor: "rgba(140, 127, 255, 0.14)",
          },
        ]}
      />
      <View
        style={[
          s.ambientOrb,
          {
            bottom: height * 0.15,
            right: -sc(60),
            backgroundColor: "rgba(91, 76, 240, 0.1)",
          },
        ]}
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* APP RUNNING VIEW HEADER NAVIGATION BAR */}
        <View style={s.header}>
          {currentView !== "progress" ? (
            <TouchableOpacity
              style={s.circleBarBtn}
              onPress={() => setCurrentView("progress")}
              activeOpacity={0.75}
            >
              <ChevronLeft size={sc(20)} color={C.textDark} strokeWidth={2.5} />
            </TouchableOpacity>
          ) : (
            <View style={[s.circleBarBtn, { opacity: 0 }]} />
          )}
          <Text style={s.headerTitleText}>
            {currentView === "progress"
              ? "Active Execution View"
              : "Amend running Ledger"}
          </Text>
          <View style={[s.circleBarBtn, { opacity: 0 }]} />
        </View>

        {/* INTERACTIVE ECOSYSTEM SWITCH VIEWER */}
        {currentView === "progress"
          ? renderProgressView()
          : renderAmendmentView()}
      </SafeAreaView>
      <ProBottomTab />
    </View>
  );
}

// ─── MASTER METRIC CONSOLE STYLES LAYOUT SHEET ────────────────
const s = StyleSheet.create({
  container: { flex: 1 },
  ambientOrb: {
    position: "absolute",
    width: sc(280),
    height: sc(280),
    borderRadius: sc(140),
    opacity: 0.8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 10 : 20,
    marginBottom: 15,
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
  scrollArea: { paddingHorizontal: 24, paddingBottom: 120, paddingTop: 5 },
  sectionLabelRow: { paddingHorizontal: 4, marginTop: 22, marginBottom: 12 },
  sectionLabelText: {
    fontSize: 12,
    fontWeight: "800",
    color: C.labelGray,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  subViewDescription: {
    fontSize: sc(12),
    color: C.labelGray,
    paddingHorizontal: 4,
    marginBottom: 20,
    lineHeight: 18,
    fontWeight: "500",
  },

  // Active Timer Layout Nodes
  timerWrapper: {
    marginBottom: 10,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
    elevation: 3,
    shadowColor: C.p3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
  },
  timerGlassBlock: {
    padding: 22,
    backgroundColor: "rgba(255, 255, 255, 0.45)",
    alignItems: "center",
  },
  timerValueText: {
    fontSize: sc(36),
    fontWeight: "900",
    color: C.textDark,
    letterSpacing: -0.5,
  },
  timerSubLabel: {
    fontSize: sc(12),
    color: C.p2,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 4,
  },

  // Verification Site Photo Box
  photoRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
  },
  photoTouchNode: {
    flex: 1,
    height: sc(110),
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
    elevation: 2,
  },
  photoGlassBox: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  photoBoxText: { fontSize: sc(12), fontWeight: "800", color: C.p2 },
  capturedImage: { width: "100%", height: "100%", borderRadius: 20 },
  photoStatusIndicator: { position: "absolute", top: 8, right: 8 },

  // Checklist Interface
  checklistCardWrapper: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
    elevation: 2,
  },
  checklistGlassBlock: {
    padding: 6,
    backgroundColor: "rgba(255, 255, 255, 0.45)",
  },
  checkRowItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  checkItemText: {
    fontSize: sc(13),
    fontWeight: "700",
    color: C.textDark,
    flex: 1,
  },
  checkItemTextDone: {
    color: C.labelGray,
    textDecorationLine: "line-through",
    fontWeight: "500",
  },

  // Running Invoice Amendment Modifiers
  amendCardWrapper: {
    marginBottom: 12,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
    elevation: 3,
  },
  amendGlassCard: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.45)",
    alignItems: "center",
  },
  amendItemTitle: {
    fontSize: sc(14),
    fontWeight: "800",
    color: C.textDark,
    letterSpacing: -0.1,
  },
  amendItemSub: {
    fontSize: sc(11),
    color: C.labelGray,
    marginTop: 2,
    fontWeight: "600",
  },
  qtyAdjusterContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: C.white,
    padding: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.inputBorder,
  },
  qtyCircleBtn: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: C.inputBg,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyDisplayValText: { fontSize: sc(13), fontWeight: "900", color: C.p2 },
  extraLabelTextField: {
    flex: 1,
    fontSize: sc(13),
    fontWeight: "700",
    color: C.textDark,
    marginLeft: 12,
  },
  priceOptionBtn: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.inputBorder,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginLeft: 6,
  },
  priceOptionBtnActive: { borderColor: C.p2, backgroundColor: C.inputBg },
  priceOptionText: { fontSize: 11, fontWeight: "800", color: C.textDark },
  approvalNoticeBodyText: {
    flex: 1,
    fontSize: sc(12),
    color: C.textDark,
    marginLeft: 12,
    fontWeight: "600",
    lineHeight: 18,
  },
  badgeCheckEmpty: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: C.inputBorder,
  },
  badgeCheckSuccess: { padding: 2 },

  // Consolidated Auxiliary Global Buttons
  solidCtaBtn: {
    height: sc(52),
    borderRadius: 18,
    overflow: "hidden",
    elevation: 4,
    shadowColor: C.p2,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    marginTop: 24,
  },
  ctaBtnGradient: { flex: 1, justifyContent: "center", alignItems: "center" },
  ctaBtnText: {
    color: C.white,
    fontSize: sc(15),
    fontWeight: "900",
    letterSpacing: -0.1,
  },
  dashedActionBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 1.5,
    borderColor: C.p1,
    backgroundColor: "rgba(140, 127, 255, 0.04)",
    padding: 16,
    borderRadius: 22,
    marginTop: 14,
    marginHorizontal: 4,
  },
  dashedActionText: { fontSize: sc(13), color: C.p2, fontWeight: "800" },
});
