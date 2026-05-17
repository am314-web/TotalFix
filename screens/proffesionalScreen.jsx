import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import {
    Award,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    Heart,
    Share2,
    ShieldCheck,
    Star,
    Wrench,
    Zap
} from "lucide-react-native";
import AppBottomTab from "../components/AppBottomTab";
import { useState } from "react";
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

export default function ProfessionalProfileScreen({ onBack, onBook }) {
  const [isFavorite, setIsFavorite] = useState(false);

  // --- SPECIALIST MOCK METRICS ---
  const skills = [
    "Split AC Service",
    "Window AC",
    "Gas Charging",
    "Inverter AC Repair",
    "Leak Fixes",
  ];

  return (
    <View style={s.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* RICH BRAND BACKDROP GRAPHIC */}
      <View style={s.heroGraphicContainer}>
        <LinearGradient
          colors={[C.p4, C.dark]}
          style={StyleSheet.absoluteFill}
        />
        <View
          style={[
            s.ambientOrb,
            {
              top: -sc(20),
              right: -sc(40),
              backgroundColor: "rgba(140, 127, 255, 0.35)",
            },
          ]}
        />
        <View
          style={[
            s.ambientOrb,
            {
              bottom: -sc(50),
              left: -sc(30),
              backgroundColor: "rgba(91, 76, 240, 0.25)",
            },
          ]}
        />
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        {/* NAV HEADERS */}
        <View style={s.header}>
          <TouchableOpacity
            style={s.glassCircleBtn}
            onPress={onBack}
            activeOpacity={0.75}
          >
            <ChevronLeft size={sc(20)} color={C.white} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={s.headerTitleText}>Expert Profile</Text>
          <TouchableOpacity style={s.glassCircleBtn} activeOpacity={0.75}>
            <Share2 size={sc(18)} color={C.white} strokeWidth={2.2} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scrollArea}
        >
          {/* EXPERT IDENTITY BRAND TILE */}
          <View style={s.identityCardWrapper}>
            <BlurView
              intensity={Platform.OS === "ios" ? 30 : 95}
              tint="light"
              style={s.identityGlassCard}
            >
              <View style={s.avatarContainer}>
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=300",
                  }}
                  style={s.heroAvatar}
                />
                <View style={s.verifiedBadge}>
                  <CheckCircle2
                    size={sc(16)}
                    color={C.white}
                    fill={C.success}
                    strokeWidth={1}
                  />
                </View>
              </View>

              <View style={s.identityMeta}>
                <View style={s.tagBadge}>
                  <Text style={s.tagBadgeText}>Verified Pro</Text>
                </View>
                <Text style={s.expertName}>Rahul Sharma</Text>
                <Text style={s.expertSub}>Senior AC Systems Engineer</Text>
                <View style={s.ratingRow}>
                  <Star size={14} color="#F59E0B" fill="#F59E0B" />
                  <Text style={s.ratingText}>
                    4.9 <Text style={s.ratingCount}>(412 reviews)</Text>
                  </Text>
                </View>
              </View>
            </BlurView>
          </View>

          {/* DYNAMIC PERFORMANCE METRICS STRIP */}
          <View style={s.metricsContainer}>
            {[
              { label: "Experience", value: "8+ Yrs", icon: Award },
              { label: "Jobs Done", value: "1.2k+", icon: Wrench },
              { label: "Response", value: "35 Min", icon: Clock },
            ].map((metric, i) => {
              const Icon = metric.icon;
              return (
                <View key={i} style={s.metricWrapper}>
                  <BlurView
                    intensity={25}
                    tint="light"
                    style={s.metricGlassBox}
                  >
                    <Icon size={sc(16)} color={C.p1} />
                    <Text style={s.metricValue}>{metric.value}</Text>
                    <Text style={s.metricLabel}>{metric.label}</Text>
                  </BlurView>
                </View>
              );
            })}
          </View>

          {/* BACKGROUND DETAILS WHITE SURFACE CONTAINER */}
          <View style={s.detailsWhiteSurface}>
            <View style={s.pullHandle} />

            {/* DESCRIPTION BRIEF */}
            <Text style={s.surfaceSectionTitle}>About Expert</Text>
            <Text style={s.aboutBodyParagraph}>
              Rahul is an industry-certified HVAC technician specializing in
              complex multi-split residential systems and high-efficiency
              inverter models. Known for precise diagnostics, clean cable runs,
              and zero hidden overheads.
            </Text>

            {/* CAPABILITIES CHIP CLUSTER */}
            <Text style={s.surfaceSectionTitle}>Specializations</Text>
            <View style={s.skillsCluster}>
              {skills.map((skill, index) => (
                <View key={index} style={s.skillChip}>
                  <Zap
                    size={12}
                    color={C.p2}
                    fill={C.p1}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={s.skillChipText}>{skill}</Text>
                </View>
              ))}
            </View>

            {/* TRUST INDICATOR NODES */}
            <Text style={s.surfaceSectionTitle}>Safety & Guarantees</Text>
            <View style={s.guaranteeRow}>
              <View style={s.guaranteeNode}>
                <ShieldCheck size={20} color={C.p2} />
                <View style={{ flex: 1 }}>
                  <Text style={s.guaranteeTitle}>₹10,000 Insurance Cover</Text>
                  <Text style={s.guaranteeDesc}>
                    Any incidental workspace damage is natively insured under
                    corporate coverage layers.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* HIGH-CONVERSION FIXED BOOKING BAR BAR */}
        <BlurView intensity={90} tint="light" style={s.stickyFooter}>
          <TouchableOpacity
            style={s.favoriteBtn}
            onPress={() => setIsFavorite(!isFavorite)}
            activeOpacity={0.8}
          >
            <Heart
              size={sc(22)}
              color={isFavorite ? C.error || "#EF4444" : C.p2}
              fill={isFavorite ? C.error || "#EF4444" : "transparent"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={s.bookActionBtn}
            onPress={onBook}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[C.p1, C.p2]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={s.bookBtnGradient}
            >
              <Text style={s.bookBtnText}>Book Appointment</Text>
              <ChevronRight size={18} color={C.white} strokeWidth={2.5} />
            </LinearGradient>
          </TouchableOpacity>
        </BlurView>
      </SafeAreaView>
      <AppBottomTab />
    </View>
  );
}

// ─── STYLES CORE SHEET ──────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.white },
  heroGraphicContainer: {
    ...StyleSheet.absoluteFillObject,
    height: height * 0.42,
  },
  ambientOrb: {
    position: "absolute",
    width: sc(200),
    height: sc(200),
    borderRadius: sc(100),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 10 : 20,
    height: 60,
    zIndex: 10,
  },
  headerTitleText: {
    fontSize: sc(16),
    fontWeight: "800",
    color: C.white,
    letterSpacing: -0.3,
  },
  glassCircleBtn: {
    width: sc(40),
    height: sc(40),
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  scrollArea: { paddingTop: 15 },

  // Identity Card Architecture
  identityCardWrapper: {
    paddingHorizontal: 24,
    marginBottom: 15,
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  identityGlassCard: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    alignItems: "center",
  },
  avatarContainer: { position: "relative" },
  heroAvatar: {
    width: sc(76),
    height: sc(76),
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
  },
  verifiedBadge: { position: "absolute", bottom: -2, right: -2 },
  identityMeta: { flex: 1, marginLeft: 18 },
  tagBadge: {
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  tagBadgeText: {
    fontSize: 9,
    fontWeight: "900",
    color: C.success,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  expertName: {
    fontSize: sc(19),
    fontWeight: "900",
    color: C.white,
    letterSpacing: -0.4,
  },
  expertSub: {
    fontSize: sc(12),
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
    fontWeight: "600",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  ratingText: { fontSize: sc(12), fontWeight: "800", color: C.white },
  ratingCount: { fontWeight: "500", color: "rgba(255,255,255,0.5)" },

  // Metrics Strips
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 25,
  },
  metricWrapper: {
    width: "31%",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  metricGlassBox: {
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    gap: 4,
  },
  metricValue: {
    fontSize: sc(14),
    fontWeight: "900",
    color: C.white,
    marginTop: 2,
  },
  metricLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.5)",
    fontWeight: "700",
    textTransform: "uppercase",
  },

  // Details Base Layout Surface
  disabledScrollPad: { paddingBottom: 120 },
  detailsWhiteSurface: {
    minHeight: height * 0.6,
    backgroundColor: C.offWhite,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingBottom: 140,
  },
  pullHandle: {
    width: 40,
    height: 4,
    backgroundColor: C.inputBorder,
    borderRadius: 2,
    alignSelf: "center",
    marginVertical: 16,
  },
  surfaceSectionTitle: {
    fontSize: sc(15),
    fontWeight: "900",
    color: C.textDark,
    marginTop: 20,
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  aboutBodyParagraph: {
    fontSize: sc(13),
    color: C.labelGray,
    lineHeight: sc(20),
    fontWeight: "500",
  },

  // Skills Cluster Chips
  skillsCluster: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  skillChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.inputBorder,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  skillChipText: { fontSize: sc(12), fontWeight: "700", color: C.textDark },

  // Guarantee Sections
  guaranteeRow: { marginTop: 4 },
  guaranteeNode: {
    flexDirection: "row",
    gap: 14,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.inputBorder,
    padding: 16,
    borderRadius: 20,
  },
  guaranteeTitle: { fontSize: sc(14), fontWeight: "800", color: C.textDark },
  guaranteeDesc: {
    fontSize: sc(12),
    color: C.labelGray,
    lineHeight: 18,
    marginTop: 4,
    fontWeight: "500",
  },

  // Floating Conversion Bar
  stickyFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === "ios" ? 35 : 20,
    paddingTop: 15,
    backgroundColor: "rgba(255,255,255,0.75)",
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(238,235,255,0.6)",
  },
  favoriteBtn: {
    width: sc(52),
    height: sc(52),
    borderRadius: 16,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.inputBorder,
    justifyContent: "center",
    alignItems: "center",
  },
  bookActionBtn: {
    flex: 1,
    height: sc(52),
    borderRadius: 18,
    overflow: "hidden",
    elevation: 4,
    shadowColor: C.p2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  bookBtnGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  bookBtnText: {
    color: C.white,
    fontSize: sc(15),
    fontWeight: "900",
    letterSpacing: -0.1,
  },
});
