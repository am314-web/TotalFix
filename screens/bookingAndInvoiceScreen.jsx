import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SESSION_KEY } from "../services/session";
import {
  createBookingLog,
  createNotificationEvent,
  createJobRequest,
  fetchBookingById,
  fetchBookingLogsByBookingId,
} from "../services/supabaseBookingService";

const { width, height } = Dimensions.get("window");
const sc = (n) => (width / 390) * n;

// ─── DESIGN TOKENS ────────────────────────────────────────────
const C = {
  // Purples
  P: "#4A3AFF",
  P2: "#7B6FFF",
  P3: "#bfb3ff",
  P4: "#F7F6FF",
  // keep lowercase aliases because UI uses C.p1/C.p2/C.p3/C.p4 everywhere
  p1: "#4A3AFF",
  p2: "#7B6FFF",
  p3: "#bfb3ff",
  p4: "#F7F6FF",
  // Glass
  glass: "rgba(255,255,255,0.07)",
  glassBorder: "rgba(255,255,255,0.14)",
  glassMid: "rgba(255,255,255,0.11)",
  glassHeavy: "rgba(255,255,255,0.18)",
  // Text
  white: "#FFFFFF",
  white70: "rgba(255,255,255,0.70)",
  white50: "rgba(255,255,255,0.50)",
  white30: "rgba(255,255,255,0.30)",
  white15: "rgba(255,255,255,0.15)",
  // Accents
  success: "#34D399",
  successBg: "rgba(52,211,153,0.15)",
  amber: "#FCD34D",
  amberBg: "rgba(252,211,77,0.15)",
  rose: "#FB7185",
  sky: "#38BDF8",
  // Background blobs
  bg1: "#F3F4FF",
  bg2: "#dadada",
};

// ─── BACKGROUND ORBS (static decoration) ─────────────────────
const BG_ORBS = [
  { top: -80, left: -60, size: 260, color: "rgba(124,58,237,0.35)" },
  { top: 180, right: -80, size: 220, color: "rgba(167,139,250,0.20)" },
  { top: 480, left: -40, size: 180, color: "rgba(91,33,182,0.30)" },
  { top: 680, right: -50, size: 200, color: "rgba(59,7,100,0.40)" },
];

// ─── SERVICE DATA (UNTOUCHED) ─────────────────────────────────
export const serviceProblems = {
  plumber: [
    { title: "Tap Leakage Repair", price: "₹299" },
    { title: "Pipe Leakage Fix", price: "₹499" },
    { title: "Blocked Drain Cleaning", price: "₹699" },
    { title: "Bathroom Fitting Installation", price: "₹899" },
    { title: "Water Tank Repair", price: "₹1199" },
    { title: "Toilet Seat Installation", price: "₹799" },
    { title: "Kitchen Sink Repair", price: "₹599" },
    { title: "Water Motor Installation", price: "₹1499" },
    { title: "Shower Installation", price: "₹699" },
    { title: "Emergency Plumbing Service", price: "₹1999" },
  ],
  electrician: [
    { title: "Switch Board Repair", price: "₹299" },
    { title: "Fan Installation", price: "₹399" },
    { title: "Light Installation", price: "₹349" },
    { title: "Wiring Repair", price: "₹899" },
    { title: "Inverter Installation", price: "₹1499" },
    { title: "MCB Replacement", price: "₹599" },
    { title: "Door Bell Installation", price: "₹299" },
    { title: "AC Power Connection", price: "₹699" },
    { title: "Short Circuit Fix", price: "₹999" },
    { title: "Complete Home Electrical Checkup", price: "₹1999" },
  ],
  gardener: [
    { title: "Lawn Grass Cutting", price: "₹499" },
    { title: "Plant Maintenance", price: "₹399" },
    { title: "Garden Cleaning", price: "₹699" },
    { title: "Tree Trimming", price: "₹999" },
    { title: "New Plant Setup", price: "₹799" },
    { title: "Terrace Garden Setup", price: "₹2499" },
    { title: "Watering System Installation", price: "₹1499" },
    { title: "Landscape Decoration", price: "₹2999" },
    { title: "Soil Replacement", price: "₹899" },
    { title: "Garden Pest Control", price: "₹1199" },
  ],
  tailor: [
    { title: "Pant Alteration", price: "₹199" },
    { title: "Shirt Fitting", price: "₹249" },
    { title: "Blouse Stitching", price: "₹699" },
    { title: "Suit Stitching", price: "₹1499" },
    { title: "Lehenga Stitching", price: "₹2499" },
    { title: "Zip Replacement", price: "₹149" },
    { title: "Custom Dress Design", price: "₹2999" },
    { title: "Curtain Stitching", price: "₹799" },
    { title: "School Uniform Stitching", price: "₹999" },
    { title: "Wedding Dress Tailoring", price: "₹4999" },
  ],
  mechanic: [
    { title: "Bike Service", price: "₹699" },
    { title: "Car Engine Checkup", price: "₹1499" },
    { title: "Battery Replacement", price: "₹999" },
    { title: "Puncture Repair", price: "₹199" },
    { title: "Oil Change Service", price: "₹799" },
    { title: "Brake Repair", price: "₹899" },
    { title: "Chain Adjustment", price: "₹299" },
    { title: "AC Repair", price: "₹1999" },
    { title: "Vehicle Washing", price: "₹399" },
    { title: "Emergency Breakdown Support", price: "₹2499" },
  ],
  carpenter: [
    { title: "Furniture Repair", price: "₹699" },
    { title: "Door Installation", price: "₹999" },
    { title: "Wardrobe Assembly", price: "₹1499" },
    { title: "Modular Kitchen Work", price: "₹4999" },
    { title: "Wooden Bed Repair", price: "₹899" },
    { title: "Window Repair", price: "₹599" },
    { title: "TV Unit Installation", price: "₹1299" },
    { title: "Custom Shelf Design", price: "₹1999" },
    { title: "Table Assembly", price: "₹499" },
    { title: "Complete Interior Woodwork", price: "₹9999" },
  ],
  welder: [
    { title: "Gate Welding", price: "₹1499" },
    { title: "Window Grill Repair", price: "₹999" },
    { title: "Metal Furniture Welding", price: "₹1999" },
    { title: "Staircase Welding", price: "₹2999" },
    { title: "Iron Door Fabrication", price: "₹3999" },
    { title: "Pipe Welding", price: "₹899" },
    { title: "Roof Frame Welding", price: "₹4999" },
    { title: "Balcony Grill Setup", price: "₹2499" },
    { title: "Industrial Welding Work", price: "₹6999" },
    { title: "Emergency Welding Service", price: "₹2999" },
  ],
  painter: [
    { title: "Single Room Painting", price: "₹2499" },
    { title: "Wall Putty Service", price: "₹1499" },
    { title: "Texture Wall Design", price: "₹3999" },
    { title: "Exterior Painting", price: "₹7999" },
    { title: "Waterproof Coating", price: "₹2999" },
    { title: "Ceiling Painting", price: "₹1999" },
    { title: "Furniture Polish", price: "₹2499" },
    { title: "Full Home Painting", price: "₹14999" },
    { title: "Office Painting", price: "₹9999" },
    { title: "Premium Royal Finish", price: "₹19999" },
  ],
  laundry: [
    { title: "Regular Cloth Washing", price: "₹299" },
    { title: "Dry Cleaning", price: "₹499" },
    { title: "Steam Iron Service", price: "₹199" },
    { title: "Blanket Cleaning", price: "₹699" },
    { title: "Shoe Cleaning", price: "₹399" },
    { title: "Curtain Washing", price: "₹799" },
    { title: "Stain Removal", price: "₹599" },
    { title: "Sofa Cover Cleaning", price: "₹899" },
    { title: "Doorstep Pickup & Delivery", price: "₹149" },
    { title: "Premium Fabric Care", price: "₹1299" },
  ],
  cleaner: [
    { title: "Bathroom Deep Cleaning", price: "₹799" },
    { title: "Kitchen Deep Cleaning", price: "₹999" },
    { title: "Full Home Cleaning", price: "₹2999" },
    { title: "Sofa Cleaning", price: "₹699" },
    { title: "Carpet Cleaning", price: "₹899" },
    { title: "Office Cleaning", price: "₹4999" },
    { title: "Window Cleaning", price: "₹599" },
    { title: "Water Tank Cleaning", price: "₹1499" },
    { title: "Sanitization Service", price: "₹1199" },
    { title: "Post Construction Cleaning", price: "₹5999" },
  ],
  security: [
    { title: "Residential Security Guard", price: "₹14999" },
    { title: "Office Security Service", price: "₹19999" },
    { title: "Event Security", price: "₹9999" },
    { title: "Night Guard Service", price: "₹12999" },
    { title: "VIP Protection", price: "₹49999" },
    { title: "Apartment Security", price: "₹24999" },
    { title: "CCTV Monitoring", price: "₹7999" },
    { title: "Parking Security", price: "₹8999" },
    { title: "Warehouse Security", price: "₹29999" },
    { title: "24/7 Security Team", price: "₹59999" },
  ],
};

// ─── CONSTANTS ────────────────────────────────────────────────
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DOWS = ["S", "M", "T", "W", "T", "F", "S"];
const TIME_SLOTS = [
  "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00",
];
const SERVICE_ICONS = {
  plumber: "🔧", electrician: "⚡", carpenter: "🪚", painter: "🖌️",
  cleaner: "🧹", welder: "🔩", security: "🛡️", tailor: "✂️",
  mechanic: "⚙️", gardener: "🌿", laundry: "👕",
};
const SERVICE_COLORS = {
  plumber: ["#3B82F6", "#1D4ED8"],
  electrician: ["#F59E0B", "#D97706"],
  carpenter: ["#A16207", "#78350F"],
  painter: ["#EC4899", "#DB2777"],
  cleaner: ["#10B981", "#059669"],
  welder: ["#9CA3AF", "#4B5563"],
  security: ["#6D28D9", "#3B0764"],
  tailor: ["#8B5CF6", "#5B21B6"],
  mechanic: ["#EF4444", "#B91C1C"],
  gardener: ["#22C55E", "#15803D"],
  laundry: ["#06B6D4", "#0891B2"],
};

const parsePrice = (str) => parseInt((str || "0").replace(/[^0-9]/g, ""), 10) || 0;
const normalizeServiceType = (rawType) => {
  const key = String(rawType || "").trim().toLowerCase().replace(/\s+/g, "");
  const aliases = {
    plumber: "plumber",
    plumbing: "plumber",
    electrician: "electrician",
    electric: "electrician",
    electrical: "electrician",
    electerician: "electrician",
    carpenter: "carpenter",
    carpentry: "carpenter",
    painter: "painter",
    painting: "painter",
    cleaner: "cleaner",
    cleaning: "cleaner",
    welder: "welder",
    welding: "welder",
    security: "security",
    tailor: "tailor",
    tailoring: "tailor",
    mechanic: "mechanic",
    gardener: "gardener",
    gardening: "gardener",
    laundry: "laundry",
  };
  return aliases[key] || "plumber";
};
const parseImageUrls = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value !== "string") return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch {}
  return value
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
};

// ─── SHARED: BACKGROUND ───────────────────────────────────────
const AppBackground = ({ children }) => (
  <View style={s.appBg}>
    <LinearGradient
      colors={[C.bg1, "#1A0A3E", C.bg2]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
    {/* Decorative orbs */}
    {BG_ORBS.map((orb, i) => (
      <View
        key={i}
        style={[
          s.orb,
          {
            width: orb.size,
            height: orb.size,
            borderRadius: orb.size / 2,
            backgroundColor: orb.color,
            top: orb.top,
            left: orb.left,
            right: orb.right,
          },
        ]}
      />
    ))}
    {children}
  </View>
);

// ─── SHARED: GLASS CARD ───────────────────────────────────────
const GlassCard = ({ children, style, intensity = 18 }) => (
  <BlurView intensity={intensity} tint="dark" style={[s.glassCard, style]}>
    <View style={[StyleSheet.absoluteFill, s.glassInner]} />
    {children}
  </BlurView>
);

// ─── SHARED: TOP BAR ─────────────────────────────────────────
const TopBar = ({ title, onBack, rightSlot }) => (
  <View style={s.topBar}>
    {onBack ? (
      <TouchableOpacity onPress={onBack} activeOpacity={0.75} style={s.topBarBtn}>
        <BlurView intensity={20} tint="dark" style={s.topBarBtnInner}>
          <Text style={s.topBarBtnIcon}>‹</Text>
        </BlurView>
      </TouchableOpacity>
    ) : (
      <View style={{ width: sc(42) }} />
    )}
    <Text style={s.topBarTitle}>{title}</Text>
    {rightSlot ? (
      rightSlot
    ) : (
      <View style={{ width: sc(42) }} />
    )}
  </View>
);

// ─── SHARED: PROGRESS STEPS ──────────────────────────────────
const ProgressSteps = ({ current }) => {
  const steps = ["Schedule", "Details", "Review"];
  return (
    <View style={s.progressWrap}>
      {steps.map((label, i) => (
        <View key={i} style={s.progressItem}>
          <View style={s.progressStepRow}>
            <LinearGradient
              colors={
                i < current
                  ? [C.success, "#16A34A"]
                  : i === current
                    ? [C.p1, C.p3]
                    : ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.06)"]
              }
              style={[
                s.progressDot,
                { width: i === current ? sc(28) : sc(22), height: i === current ? sc(28) : sc(22) },
              ]}
            >
              <Text style={[s.progressDotTxt, { fontSize: i === current ? sc(11) : sc(10) }]}>
                {i < current ? "✓" : String(i + 1)}
              </Text>
            </LinearGradient>
          </View>
          <Text style={[s.progressLabel, i === current && { color: C.p1, fontWeight: "700" }]}>
            {label}
          </Text>
          {i < steps.length - 1 && (
            <View
              style={[
                s.progressLine,
                i < current && { backgroundColor: C.p1 },
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );
};

// ─── SHARED: SECTION LABEL ────────────────────────────────────
const SectionLabel = ({ icon, label }) => (
  <View style={s.sectionLabelRow}>
    {icon ? <Text style={{ fontSize: sc(14), marginRight: 6 }}>{icon}</Text> : null}
    <Text style={s.sectionLabelTxt}>{label}</Text>
  </View>
);

// ─── SHARED: GRADIENT BUTTON ──────────────────────────────────
const GradBtn = ({ onPress, children, disabled, colors, style }) => (
  <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.85} style={style}>
    <LinearGradient
      colors={disabled ? ["rgba(255,255,255,0.08)", "rgba(255,255,255,0.04)"] : (colors || [C.p1, C.p3])}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={s.gradBtn}
    >
      {children}
    </LinearGradient>
  </TouchableOpacity>
);

// ══════════════════════════════════════════════════════════════
// SCREEN 0 — BOOK APPOINTMENT (Calendar)
// ══════════════════════════════════════════════════════════════
const BookAppointment = ({ onNext }) => {
  const insets = useSafeAreaInsets();
  const [calMonth, setCalMonth] = useState(4); // May
  const [calYear] = useState(2026);
  const [selectedDay, setSelectedDay] = useState(16);
  const [selectedTime, setSelectedTime] = useState("14:00");

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDow = new Date(calYear, calMonth, 1).getDay();
  const today = new Date();

  return (
    <AppBackground>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={{ flex: 1, paddingTop: insets.top }}>
        <TopBar title="Book Appointment" />
        <ProgressSteps current={0} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: sc(20), paddingBottom: sc(160) }}
        >
          {/* ── Calendar Card ── */}
          <GlassCard style={s.calCard}>
            {/* Month nav */}
            <View style={s.calHeader}>
              <TouchableOpacity
                onPress={() => setCalMonth((m) => Math.max(0, m - 1))}
                activeOpacity={0.75}
                style={s.calNavBtn}
              >
                <BlurView intensity={15} tint="dark" style={s.calNavInner}>
                  <Text style={s.calNavTxt}>‹</Text>
                </BlurView>
              </TouchableOpacity>
              <Text style={s.calMonthTxt}>{MONTHS[calMonth]} {calYear}</Text>
              <TouchableOpacity
                onPress={() => setCalMonth((m) => Math.min(11, m + 1))}
                activeOpacity={0.75}
                style={s.calNavBtn}
              >
                <BlurView intensity={15} tint="dark" style={s.calNavInner}>
                  <Text style={s.calNavTxt}>›</Text>
                </BlurView>
              </TouchableOpacity>
            </View>

            {/* Day headers */}
            <View style={s.calDowRow}>
              {DOWS.map((d, i) => (
                <Text key={i} style={s.calDow}>{d}</Text>
              ))}
            </View>

            {/* Grid */}
            <View style={s.calGrid}>
              {Array(firstDow).fill(null).map((_, i) => (
                <View key={`e${i}`} style={s.calCell} />
              ))}
              {Array(daysInMonth).fill(null).map((_, i) => {
                const day = i + 1;
                const isSel = day === selectedDay;
                const isPast = new Date(calYear, calMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                return (
                  <TouchableOpacity
                    key={day}
                    onPress={() => !isPast && setSelectedDay(day)}
                    activeOpacity={0.75}
                    style={s.calCell}
                  >
                    {isSel ? (
                      <LinearGradient colors={[C.p1, C.p3]} style={s.calDaySelected}>
                        <Text style={[s.calDayTxt, { color: C.white, fontWeight: "800" }]}>{day}</Text>
                      </LinearGradient>
                    ) : (
                      <Text style={[s.calDayTxt, isPast && { color: C.white30 }]}>{day}</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </GlassCard>

          {/* Selected date pill */}
          {selectedDay != null && (
            <View style={s.datePillRow}>
              <BlurView intensity={22} tint="dark" style={s.datePill}>
                <View style={s.datePillInner}>
                  <Text style={{ fontSize: sc(14) }}>📅</Text>
                  <Text style={s.datePillTxt}>
                    {MONTHS[calMonth]} {selectedDay}, {calYear}
                  </Text>
                </View>
              </BlurView>
            </View>
          )}

          {/* Time slots */}
          <SectionLabel icon="🕐" label="Select Arrival Time" />
          <View style={s.timeGrid}>
            {TIME_SLOTS.map((t) => {
              const active = t === selectedTime;
              return active ? (
                <TouchableOpacity
                  key={t}
                  onPress={() => setSelectedTime(t)}
                  activeOpacity={0.8}
                  style={s.timeSlotWrap}
                >
                  <LinearGradient colors={[C.p2, C.p3]} style={s.timeSlotGrad}>
                    <Text style={[s.timeSlotTxt, { color: C.white, fontWeight: "700" }]}>{t}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  key={t}
                  onPress={() => setSelectedTime(t)}
                  activeOpacity={0.75}
                  style={s.timeSlotWrap}
                >
                  <BlurView intensity={14} tint="dark" style={s.timeSlotBlur}>
                    <View style={s.timeSlotGlassInner}>
                      <Text style={s.timeSlotTxt}>{t}</Text>
                    </View>
                  </BlurView>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* CTA */}
        <BlurView intensity={30} tint="dark" style={[s.ctaZone, { paddingBottom: insets.bottom + sc(16) }]}>
          <View style={s.ctaZoneBorder} />
          <GradBtn
            onPress={() => onNext({ selectedDay, calMonth, calYear, selectedTime })}
            colors={[C.p1, C.p3]}
            style={{ width: "100%" }}
          >
            <Text style={{ fontSize: sc(16), marginRight: 4 }}>📅</Text>
            <Text style={s.ctaBtnTxt}>Continue</Text>
            <View style={s.ctaBadge}>
              <Text style={s.ctaBadgeTxt}>{MONTHS[calMonth].slice(0, 3)} {selectedDay} · {selectedTime}</Text>
            </View>
          </GradBtn>
        </BlurView>
      </View>
    </AppBackground>
  );
};

// ══════════════════════════════════════════════════════════════
// SCREEN 1 — SERVICE DETAILS
// ══════════════════════════════════════════════════════════════
const ServiceDetails = ({ serviceType = "plumber", scheduleInfo, onBack, onNext }) => {
  const insets = useSafeAreaInsets();
  const [images, setImages] = useState([]);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const problems = serviceProblems[serviceType] || [];
  const svcColors = SERVICE_COLORS[serviceType] || [C.p1, C.p3];
  const svcIcon = SERVICE_ICONS[serviceType] || "🛠️";
  const totalNum = selectedProblems.reduce((s, p) => s + parsePrice(p.price), 0);
  const canContinue = selectedProblems.length > 0 && location.trim().length > 0;

  const { selectedDay, calMonth, calYear, selectedTime } = scheduleInfo;
  const dateStr = `${MONTHS[calMonth].slice(0, 3)} ${selectedDay}, ${calYear}`;
  const endHour = String(Number(selectedTime.split(":")[0]) + 1).padStart(2, "0");

  const FILTERS = ["All", "Repair", "Installation", "Cleaning", "Emergency"];
  const filtered =
    activeFilter === "All"
      ? problems
      : problems.filter((p) =>
        p.title.toLowerCase().includes(activeFilter.toLowerCase())
      );

  const toggleProblem = (item) =>
    setSelectedProblems((prev) =>
      prev.find((p) => p.title === item.title)
        ? prev.filter((p) => p.title !== item.title)
        : [...prev, item]
    );

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please allow access to photos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImages((prev) => [...prev, ...result.assets]);
    }
  };

  const captureImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please allow camera access.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled) {
      setImages((prev) => [...prev, ...result.assets]);
    }
  };

  return (
    <AppBackground>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={{ flex: 1, paddingTop: insets.top }}>
        <TopBar title="Service Details" onBack={onBack} />
        <ProgressSteps current={1} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: sc(20), paddingBottom: sc(170) }}
        >
          {/* Service Hero */}
          <LinearGradient
            colors={[svcColors[0] + "EE", svcColors[1] + "FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.heroCard}
          >
            <View style={s.heroBlobTL} />
            <View style={s.heroBlobBR} />
            <View style={s.heroIconWrap}>
              <Text style={{ fontSize: sc(28) }}>{svcIcon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.heroLabel}>BOOKING FOR</Text>
              <Text style={s.heroTitle}>{serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} Service</Text>
              <Text style={s.heroSub}>📅 {dateStr}  🕐 {selectedTime}–{endHour}:00</Text>
            </View>
            <BlurView intensity={20} tint="dark" style={s.heroStep}>
              <Text style={s.heroStepLabel}>STEP</Text>
              <Text style={s.heroStepNum}>2/3</Text>
            </BlurView>
          </LinearGradient>

          {/* Upload Photos */}
          <SectionLabel icon="📸" label="Upload Problem Photos" />
          {images.length === 0 ? (
            <GlassCard style={s.uploadCard}>
              <Text style={{ fontSize: sc(32), textAlign: "center", marginBottom: sc(8) }}>📷</Text>
              <Text style={s.uploadTitle}>Upload or Capture Photo</Text>
              <Text style={s.uploadSub}>Help the technician understand the issue</Text>
              <View style={s.uploadBtnRow}>
                <TouchableOpacity onPress={pickImage} activeOpacity={0.8} style={{ flex: 1 }}>
                  <BlurView intensity={20} tint="dark" style={s.uploadBtnGlass}>
                    <Text style={s.uploadBtnTxt}>📁 Browse</Text>
                  </BlurView>
                </TouchableOpacity>
                <TouchableOpacity onPress={captureImage} activeOpacity={0.8} style={{ flex: 1 }}>
                  <LinearGradient colors={[C.p1, C.p3]} style={s.uploadBtnGrad}>
                    <Text style={[s.uploadBtnTxt, { color: C.white }]}>📸 Camera</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </GlassCard>
          ) : (
            <View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: "row", gap: sc(10), paddingRight: sc(4) }}>
                  {images.map((img, i) => (
                    <View key={i} style={s.thumbWrap}>
                      <Image source={{ uri: img.uri }} style={s.thumb} />
                      <TouchableOpacity
                        onPress={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                        style={s.thumbRemove}
                      >
                        <Text style={{ color: C.white, fontSize: sc(10), fontWeight: "900" }}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                  <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
                    <BlurView intensity={18} tint="dark" style={s.thumbAdd}>
                      <Text style={{ color: C.p1, fontSize: sc(24) }}>+</Text>
                      <Text style={{ color: C.p1, fontSize: sc(9), fontWeight: "800" }}>ADD</Text>
                    </BlurView>
                  </TouchableOpacity>
                </View>
              </ScrollView>
              <Text style={s.photoCountTxt}>✓ {images.length} photo{images.length > 1 ? "s" : ""} ready</Text>
            </View>
          )}

          {/* Problem Selection */}
          <SectionLabel icon="🔍" label="Select Problem(s)" />

          {/* Filter chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: sc(12) }}>
            <View style={{ flexDirection: "row", gap: sc(8), paddingRight: sc(4) }}>
              {FILTERS.map((f) => {
                const active = f === activeFilter;
                return active ? (
                  <TouchableOpacity key={f} onPress={() => setActiveFilter(f)} activeOpacity={0.8}>
                    <LinearGradient colors={[C.p1, C.p2]} style={s.filterChipActive}>
                      <Text style={[s.filterChipTxt, { color: C.white, fontWeight: "700" }]}>{f}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity key={f} onPress={() => setActiveFilter(f)} activeOpacity={0.75}>
                    <BlurView intensity={14} tint="dark" style={s.filterChip}>
                      <View style={s.filterChipInner}>
                        <Text style={s.filterChipTxt}>{f}</Text>
                      </View>
                    </BlurView>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Problem items */}
          {filtered.map((item, i) => {
            const sel = !!selectedProblems.find((p) => p.title === item.title);
            return (
              <TouchableOpacity
                key={i}
                onPress={() => toggleProblem(item)}
                activeOpacity={0.8}
                style={{ marginBottom: sc(8) }}
              >
                {sel ? (
                  <LinearGradient
                    colors={["rgba(167,139,250,0.22)", "rgba(91,33,182,0.18)"]}
                    style={s.problemItemSelected}
                  >
                    <View style={s.problemCheckActive}>
                      <Text style={{ color: C.white, fontSize: sc(11), fontWeight: "900" }}>✓</Text>
                    </View>
                    <Text style={[s.problemTitleTxt, { color: C.p1 }]}>{item.title}</Text>
                    <Text style={[s.problemPriceTxt, { color: C.p1 }]}>{item.price}</Text>
                  </LinearGradient>
                ) : (
                  <BlurView intensity={14} tint="dark" style={s.problemItem}>
                    <View style={s.problemItemInner}>
                      <View style={s.problemCheck} />
                      <Text style={s.problemTitleTxt}>{item.title}</Text>
                      <Text style={s.problemPriceTxt}>{item.price}</Text>
                    </View>
                  </BlurView>
                )}
              </TouchableOpacity>
            );
          })}

          {/* Live total */}
          {selectedProblems.length > 0 && (
            <LinearGradient colors={[C.p2, C.p4]} style={s.totalStrip}>
              <View style={{ flex: 1 }}>
                <Text style={s.totalStripLabel}>
                  {selectedProblems.length} service{selectedProblems.length > 1 ? "s" : ""} selected
                </Text>
                <Text style={s.totalStripSubs} numberOfLines={1}>
                  {selectedProblems.map((p) => p.title).join(", ")}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={s.totalStripSubLabel}>Subtotal</Text>
                <Text style={s.totalStripAmt}>₹{totalNum.toLocaleString()}</Text>
              </View>
            </LinearGradient>
          )}

          {/* Location */}
          <SectionLabel icon="📍" label="Your Location" />
          <GlassCard style={{ padding: sc(16) }}>
            <View style={s.locationRow}>
              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder="Enter full address…"
                placeholderTextColor={C.white30}
                style={s.locationInput}
              />
              <TouchableOpacity
                onPress={() => setLocation("B-402, Skyline Residency, Ahmedabad")}
                activeOpacity={0.8}
              >
                <LinearGradient colors={[C.p1, C.p3]} style={s.gpsBtn}>
                  <Text style={s.gpsBtnTxt}>📡 GPS</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            {location.trim().length > 0 && (
              <View style={s.mapMock}>
                <View style={s.mapGrid} />
                <View style={{ alignItems: "center" }}>
                  <Text style={{ fontSize: sc(20) }}>📍</Text>
                  <Text style={{ fontSize: sc(11), color: C.p1, fontWeight: "700" }}>Location Pinned</Text>
                </View>
              </View>
            )}
          </GlassCard>

          {/* Notes */}
          <SectionLabel icon="📝" label="Additional Notes" />
          <GlassCard style={{ padding: sc(16) }}>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Describe the issue in detail…"
              placeholderTextColor={C.white30}
              multiline
              numberOfLines={3}
              maxLength={300}
              style={s.notesInput}
            />
            <Text style={s.notesCount}>{notes.length}/300</Text>
          </GlassCard>

          {/* Validation */}
          {!canContinue && (
            <BlurView intensity={14} tint="dark" style={s.validationHint}>
              <View style={s.validationHintInner}>
                <Text style={s.validationTxt}>
                  {selectedProblems.length === 0 ? "⚠️ Select at least one problem.  " : ""}
                  {location.trim().length === 0 ? "⚠️ Enter your service address." : ""}
                </Text>
              </View>
            </BlurView>
          )}
        </ScrollView>

        {/* CTA */}
        <BlurView intensity={30} tint="dark" style={[s.ctaZone, { paddingBottom: insets.bottom + sc(16) }]}>
          <View style={s.ctaZoneBorder} />
          {canContinue && (
            <View style={s.ctaMiniRow}>
              <Text style={s.ctaMiniLabel}>{selectedProblems.length} service{selectedProblems.length > 1 ? "s" : ""}</Text>
              <Text style={s.ctaMiniAmt}>₹{totalNum.toLocaleString()}</Text>
            </View>
          )}
          <GradBtn
            onPress={() =>
              canContinue && onNext({ selectedProblems, images, location, notes, totalNum })
            }
            disabled={!canContinue}
            colors={[C.p1, C.p3]}
            style={{ width: "100%" }}
          >
            {canContinue ? (
              <>
                <Text style={s.ctaBtnTxt}>Review Order</Text>
                <View style={s.ctaBadge}>
                  <Text style={s.ctaBadgeTxt}>₹{totalNum.toLocaleString()}</Text>
                </View>
                <Text style={{ color: C.white, fontSize: sc(18), marginLeft: 4 }}>›</Text>
              </>
            ) : (
              <Text style={[s.ctaBtnTxt, { color: C.white50 }]}>Select problems & address</Text>
            )}
          </GradBtn>
        </BlurView>
      </View>
    </AppBackground>
  );
};

// ══════════════════════════════════════════════════════════════
// SCREEN 2 — REVIEW ORDER
// ══════════════════════════════════════════════════════════════
const ReviewOrder = ({ serviceType = "plumber", scheduleInfo, detailsInfo, onBack, onConfirm }) => {
  const insets = useSafeAreaInsets();
  const [qty, setQty] = useState(1);
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [insertedBooking, setInsertedBooking] = useState(null);
  const [bookingLogs, setBookingLogs] = useState([]);

  const svcIcon = SERVICE_ICONS[serviceType] || "🛠️";
  const svcColors = SERVICE_COLORS[serviceType] || [C.p1, C.p3];
  const { selectedDay, calMonth, calYear, selectedTime } = scheduleInfo;
  const { selectedProblems, location, notes, images } = detailsInfo;

  const dateStr = `${MONTHS[calMonth]} ${selectedDay}, ${calYear}`;
  const endHour = String(Number(selectedTime.split(":")[0]) + 1).padStart(2, "0");
  const itemTotal = selectedProblems.reduce((s, p) => s + parsePrice(p.price) * qty, 0);
  const platformFee = 50;
  const gst = Math.round(itemTotal * 0.18);
  const discount = itemTotal >= 1000 ? 500 : 0;
  const grandTotal = itemTotal + platformFee + gst - discount;

  const handleConfirmBooking = async () => {
    if (submitting) return;
    try {
      setSubmitting(true);
      
      // 1. Get client ID from session storage
      const sessionStr = await AsyncStorage.getItem(SESSION_KEY);
      let userId = "client_firebase_uid_123"; // Fallback client ID
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        if (session && session.uid) {
          userId = session.uid;
        }
      }
      
      // 2. Map coordinates safely
      const lat = detailsInfo.latitude !== undefined ? detailsInfo.latitude : 23.0225;
      const lon = detailsInfo.longitude !== undefined ? detailsInfo.longitude : 72.5714;
      
      // 3. Format Date
      const formattedMonth = String(calMonth + 1).padStart(2, "0");
      const formattedDay = String(selectedDay).padStart(2, "0");
      const scheduledDateStr = `${calYear}-${formattedMonth}-${formattedDay}`;
      
      // 4. Extract attached image URIs if available
      const attachedImageUris = Array.isArray(images)
        ? images.map((img) => img?.uri).filter((x) => typeof x === "string" && x.trim().length > 0)
        : [];
      
      // 5. Build payload
      const bookingData = {
        clientId: userId,
        serviceType: serviceType,
        scheduledDate: scheduledDateStr,
        scheduledTime: selectedTime,
        notes: notes || selectedProblems.map(p => p.title).join(", "),
        latitude: lat,
        longitude: lon
      };
      
      // 6. Create job request in Supabase
      const newRow = await createJobRequest(bookingData, attachedImageUris[0] || null, attachedImageUris);

      // 7. Write server-side booking log (non-blocking for booking success)
      try {
        await createBookingLog({
          bookingId: newRow.id,
          clientId: userId,
          action: "booking_created",
          message: `Booking created for ${serviceType} on ${scheduledDateStr} at ${selectedTime}`,
        });
      } catch (logErr) {
        console.warn("Booking log write failed:", logErr?.message || logErr);
      }
      try {
        await createNotificationEvent({
          recipientId: userId,
          eventType: "job_created",
          title: "Booking created successfully",
          body: `Your booking UC-${newRow.id} is pending professional acceptance.`,
          bookingId: newRow.id,
        });
      } catch (notifyErr) {
        console.warn("Notification write failed:", notifyErr?.message || notifyErr);
      }

      // 8. Fetch inserted booking again from API (not local object)
      const bookingFromApi = await fetchBookingById(newRow.id);
      setInsertedBooking(bookingFromApi || newRow);

      // 9. Fetch booking logs from API
      try {
        const logsFromApi = await fetchBookingLogsByBookingId(newRow.id);
        setBookingLogs(logsFromApi);
      } catch (logFetchErr) {
        console.warn("Booking logs fetch failed:", logFetchErr?.message || logFetchErr);
        setBookingLogs([]);
      }

      setConfirmed(true);
    } catch (err) {
      console.error("Error creating job request:", err);
      Alert.alert("Booking Failed", err.message || "An error occurred while confirming your booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <AppBackground>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[s.successScreen, { paddingTop: insets.top + sc(40), paddingBottom: sc(50) }]}
        >
          <LinearGradient colors={[C.success + "33", "transparent"]} style={s.successGlow} />
          <LinearGradient colors={[C.success, "#16A34A"]} style={s.successCircle}>
            <Text style={{ fontSize: sc(40) }}>✓</Text>
          </LinearGradient>
          <Text style={s.successTitle}>Booking Confirmed!</Text>
          <Text style={s.successSub}>
            Your {serviceType} service has been registered in our database!
          </Text>
          
          {insertedBooking && (
            <BlurView intensity={25} tint="light" style={s.receiptContainer}>
              <Text style={s.receiptHeader}>📋 SUPABASE REAL-TIME RECEIPT</Text>
              
              <View style={s.receiptRow}>
                <Text style={s.receiptLabel}>Booking ID:</Text>
                <Text style={s.receiptVal}>#UC-{insertedBooking.id}</Text>
              </View>
              <View style={s.receiptRow}>
                <Text style={s.receiptLabel}>Service Type:</Text>
                <Text style={s.receiptVal}>{(insertedBooking.service_type || "").toUpperCase()}</Text>
              </View>
              <View style={s.receiptRow}>
                <Text style={s.receiptLabel}>Scheduled Date:</Text>
                <Text style={s.receiptVal}>{insertedBooking.scheduled_date}</Text>
              </View>
              <View style={s.receiptRow}>
                <Text style={s.receiptLabel}>Scheduled Time:</Text>
                <Text style={s.receiptVal}>{insertedBooking.scheduled_time}</Text>
              </View>
              <View style={s.receiptRow}>
                <Text style={s.receiptLabel}>System Status:</Text>
                <Text style={[s.receiptVal, { color: "#22C55E", fontWeight: "900" }]}>
                  {(insertedBooking.status || "").toUpperCase()}
                </Text>
              </View>
              {parseImageUrls(insertedBooking.image_url).length > 0 && (
                <View style={s.receiptImageRow}>
                  <Text style={s.receiptLabel}>Description Attachment:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={{ flexDirection: "row", gap: sc(8) }}>
                      {parseImageUrls(insertedBooking.image_url).map((uri, idx) => (
                        <Image key={`receipt-image-${idx}`} source={{ uri }} style={s.receiptThumb} resizeMode="cover" />
                      ))}
                    </View>
                  </ScrollView>
                </View>
              )}

              <View style={{ marginTop: sc(12) }}>
                <Text style={s.receiptLabel}>Booking Logs (From API):</Text>
                {bookingLogs.length > 0 ? (
                  bookingLogs.map((log) => (
                    <View key={String(log.id)} style={s.receiptRow}>
                      <Text style={s.receiptLabel}>{log.action || "log"}</Text>
                      <Text style={s.receiptVal} numberOfLines={1}>
                        {log.message || "No message"}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={[s.receiptLabel, { marginTop: sc(6) }]}>
                    No API logs found for this booking yet.
                  </Text>
                )}
              </View>
            </BlurView>
          )}

          <TouchableOpacity
            style={s.receiptHomeBtn}
            activeOpacity={0.85}
            onPress={() => onConfirm && onConfirm()}
          >
            <LinearGradient colors={[C.p1, C.p2]} style={s.receiptHomeGradient}>
              <Text style={s.receiptHomeBtnText}>Go to Home Workspace 🏠</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </AppBackground>
    );
  }

  return (
    <AppBackground>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={{ flex: 1, paddingTop: insets.top }}>
        <TopBar title="Review Order" onBack={onBack} />
        <ProgressSteps current={2} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: sc(20), paddingBottom: sc(170) }}
        >
          {/* Service Card */}
          <GlassCard style={s.reviewServiceCard}>
            <View style={s.reviewServiceRow}>
              <LinearGradient
                colors={[svcColors[0] + "55", svcColors[1] + "33"]}
                style={s.reviewServiceIcon}
              >
                <Text style={{ fontSize: sc(26) }}>{svcIcon}</Text>
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={s.reviewServiceTitle}>
                  {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} Service
                </Text>
                <Text style={s.reviewServiceSub}>Premium On-demand</Text>
              </View>
              <Text style={s.reviewServicePrice}>₹{itemTotal.toLocaleString()}</Text>
            </View>
            {/* Qty */}
            <View style={s.qtyRow}>
              <Text style={s.qtyLabel}>Quantity</Text>
              <BlurView intensity={16} tint="dark" style={s.qtyPicker}>
                <View style={s.qtyPickerInner}>
                  <TouchableOpacity
                    onPress={() => qty > 1 && setQty(qty - 1)}
                    activeOpacity={0.75}
                    style={s.qtyBtn}
                  >
                    <Text style={s.qtyBtnTxt}>−</Text>
                  </TouchableOpacity>
                  <Text style={s.qtyVal}>{qty}</Text>
                  <TouchableOpacity
                    onPress={() => setQty(qty + 1)}
                    activeOpacity={0.75}
                    style={s.qtyBtn}
                  >
                    <Text style={s.qtyBtnTxt}>+</Text>
                  </TouchableOpacity>
                </View>
              </BlurView>
            </View>
          </GlassCard>

          {/* Selected services */}
          <SectionLabel icon="✅" label="Selected Services" />
          <GlassCard style={{ padding: sc(16) }}>
            {selectedProblems.map((p, i) => (
              <View
                key={i}
                style={[
                  s.selectedServiceRow,
                  i < selectedProblems.length - 1 && s.selectedServiceRowBorder,
                ]}
              >
                <LinearGradient colors={[C.p1, C.p3]} style={s.serviceDot} />
                <Text style={s.selectedServiceTxt}>{p.title}</Text>
                <Text style={s.selectedServicePrice}>{p.price}</Text>
              </View>
            ))}
          </GlassCard>

          {/* Booking details */}
          <SectionLabel icon="📋" label="Booking Details" />
          <GlassCard style={{ padding: sc(16) }}>
            {[
              { icon: "📅", text: dateStr },
              { icon: "🕐", text: `Arrival ${selectedTime} – ${endHour}:00` },
              { icon: "📍", text: location },
              ...(notes ? [{ icon: "📝", text: notes }] : []),
              ...(images && images.length > 0
                ? [{ icon: "🖼️", text: `${images.length} photo${images.length > 1 ? "s" : ""} attached` }]
                : []),
            ].map((row, i) => (
              <View key={i} style={[s.detailRow, i > 0 && { marginTop: sc(10) }]}>
                <Text style={{ fontSize: sc(15), marginRight: sc(10) }}>{row.icon}</Text>
                <Text style={s.detailTxt}>{row.text}</Text>
              </View>
            ))}
          </GlassCard>

          {/* Discount badge */}
          {discount > 0 && (
            <BlurView intensity={18} tint="dark" style={s.discountBadge}>
              <View style={s.discountBadgeInner}>
                <Text style={{ fontSize: sc(18) }}>🎟️</Text>
                <Text style={s.discountTxt}>Auto discount applied</Text>
                <Text style={s.discountAmt}>−₹{discount}</Text>
              </View>
            </BlurView>
          )}

          {/* Bill */}
          <SectionLabel icon="💳" label="Payment Summary" />
          <GlassCard style={{ padding: sc(18) }}>
            {[
              { label: "Item Total", val: `₹${itemTotal.toLocaleString()}`, color: C.white70 },
              { label: "Platform Fee", val: `₹${platformFee}`, color: C.white70 },
              { label: "GST (18%)", val: `₹${gst}`, color: C.white70 },
              ...(discount > 0
                ? [{ label: "Discount", val: `−₹${discount}`, color: C.success }]
                : []),
            ].map((row, i) => (
              <View key={i} style={s.billRow}>
                <Text style={s.billKey}>{row.label}</Text>
                <Text style={[s.billVal, { color: row.color }]}>{row.val}</Text>
              </View>
            ))}
            <View style={s.billDivider} />
            <View style={s.billTotalRow}>
              <Text style={s.billTotalKey}>Total Payable</Text>
              <Text style={s.billTotalVal}>₹{grandTotal.toLocaleString()}</Text>
            </View>
          </GlassCard>

          {/* Policy */}
          <BlurView intensity={14} tint="dark" style={s.policyCard}>
            <View style={s.policyInner}>
              <View style={s.policyHeader}>
                <Text style={{ fontSize: sc(16) }}>🛡️</Text>
                <Text style={s.policyTitle}>Cancellation Policy</Text>
              </View>
              <Text style={s.policyTxt}>
                100% refund for cancellations made 2 hours before start. No refund for late cancellations.
              </Text>
            </View>
          </BlurView>
        </ScrollView>

        {/* CTA */}
        <BlurView intensity={30} tint="dark" style={[s.ctaZone, { paddingBottom: insets.bottom + sc(16) }]}>
          <View style={s.ctaZoneBorder} />
          <GradBtn
            onPress={handleConfirmBooking}
            colors={[C.p1, C.p3]}
            style={{ width: "100%" }}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color={C.white} />
            ) : (
              <>
                <Text style={{ fontSize: sc(16), marginRight: sc(4) }}>💳</Text>
                <Text style={s.ctaBtnTxt}>Confirm Booking</Text>
                <View style={s.ctaBadge}>
                  <Text style={s.ctaBadgeTxt}>₹{grandTotal.toLocaleString()}</Text>
                </View>
              </>
            )}
          </GradBtn>
        </BlurView>
      </View>
    </AppBackground>
  );
};

// ══════════════════════════════════════════════════════════════
// ROOT — FULL 3-SCREEN FLOW
// ══════════════════════════════════════════════════════════════
export default function FullBookingFlow() {
  const { serviceType: serviceTypeParam } = useLocalSearchParams();
  const [screen, setScreen] = useState(0);
  const [scheduleInfo, setScheduleInfo] = useState(null);
  const [detailsInfo, setDetailsInfo] = useState(null);
  const serviceType = normalizeServiceType(serviceTypeParam);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg1 }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      {screen === 0 && (
        <BookAppointment
          onNext={(info) => { setScheduleInfo(info); setScreen(1); }}
        />
      )}
      {screen === 1 && (
        <ServiceDetails
          serviceType={serviceType}
          scheduleInfo={scheduleInfo}
          onBack={() => setScreen(0)}
          onNext={(info) => { setDetailsInfo(info); setScreen(2); }}
        />
      )}
      {screen === 2 && (
        <ReviewOrder
          serviceType={serviceType}
          scheduleInfo={scheduleInfo}
          detailsInfo={detailsInfo}
          onBack={() => setScreen(1)}
          onConfirm={() => router.replace("/home")}
        />
      )}
    </View>
  );
}

// ══════════════════════════════════════════════════════════════
// STYLES
// ══════════════════════════════════════════════════════════════
const s = StyleSheet.create({
  // ── App Background ──
  appBg: { flex: 1, backgroundColor: C.bg1 },
  orb: { position: "absolute", opacity: 0.6 },

  // ── Glass Card ──
  glassCard: {
    borderRadius: sc(20),
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.glassBorder,
  },
  glassInner: {
    backgroundColor: C.glass,
    borderRadius: sc(20),
  },

  // ── Top Bar ──
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: sc(20),
    paddingVertical: sc(12),
  },
  topBarBtn: { width: sc(42), height: sc(42) },
  topBarBtnInner: {
    flex: 1,
    borderRadius: sc(13),
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.glassBorder,
  },
  topBarBtnIcon: { color: C.white, fontSize: sc(22), lineHeight: sc(28) },
  topBarTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: sc(17),
    fontWeight: "700",
    color: C.white,
    letterSpacing: 0.2,
  },

  // ── Progress ──
  progressWrap: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: sc(20),
    paddingBottom: sc(8),
    gap: 0,
  },
  progressItem: {
    alignItems: "center",
    flexDirection: "column",
    position: "relative",
  },
  progressStepRow: { alignItems: "center", marginBottom: sc(4) },
  progressDot: {
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
  },
  progressDotTxt: { color: C.white, fontWeight: "800" },
  progressLabel: {
    fontSize: sc(9),
    color: C.white50,
    letterSpacing: 0.3,
    marginTop: sc(2),
  },
  progressLine: {
    position: "absolute",
    top: sc(13),
    left: "60%",
    width: sc(38),
    height: 2,
    backgroundColor: C.glassBorder,
    borderRadius: 2,
  },

  // ── Section Label ──
  sectionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: sc(22),
    marginBottom: sc(10),
  },
  sectionLabelTxt: {
    fontSize: sc(11),
    fontWeight: "800",
    color: C.white50,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },

  // ── Gradient Button ──
  gradBtn: {
    height: sc(58),
    borderRadius: sc(20),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: sc(8),
    shadowColor: C.p1,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  ctaBtnTxt: { color: C.white, fontSize: sc(16), fontWeight: "800", letterSpacing: 0.2 },
  ctaBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: sc(10),
    paddingHorizontal: sc(10),
    paddingVertical: sc(3),
  },
  ctaBadgeTxt: { color: C.white, fontSize: sc(11), fontWeight: "700" },

  // ── CTA Zone ──
  ctaZone: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: sc(20),
    paddingTop: sc(14),
    overflow: "hidden",
  },
  ctaZoneBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: C.glassBorder,
  },
  ctaMiniRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: sc(8),
  },
  ctaMiniLabel: { fontSize: sc(12), color: C.white50 },
  ctaMiniAmt: { fontSize: sc(15), fontWeight: "900", color: C.p1 },

  // ── Calendar ──
  calCard: { marginTop: sc(12), padding: sc(16) },
  calHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: sc(14),
  },
  calNavBtn: { width: sc(34), height: sc(34) },
  calNavInner: {
    flex: 1,
    borderRadius: sc(10),
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.glassBorder,
  },
  calNavTxt: { color: C.white, fontSize: sc(20), lineHeight: sc(26) },
  calMonthTxt: { fontSize: sc(15), fontWeight: "700", color: C.white },
  calDowRow: { flexDirection: "row", marginBottom: sc(6) },
  calDow: {
    flex: 1,
    textAlign: "center",
    fontSize: sc(11),
    fontWeight: "700",
    color: C.white30,
  },
  calGrid: { flexDirection: "row", flexWrap: "wrap" },
  calCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  calDaySelected: {
    width: "78%",
    aspectRatio: 1,
    borderRadius: sc(10),
    alignItems: "center",
    justifyContent: "center",
  },
  calDayTxt: { fontSize: sc(13), fontWeight: "500", color: C.white70 },
  datePillRow: { alignItems: "center", marginTop: sc(14) },
  datePill: {
    borderRadius: sc(20),
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.glassBorder,
  },
  datePillInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: sc(8),
    paddingHorizontal: sc(20),
    paddingVertical: sc(9),
    backgroundColor: C.glass,
  },
  datePillTxt: { fontSize: sc(13), fontWeight: "700", color: C.p1 },

  // ── Time Slots ──
  timeGrid: { flexDirection: "row", flexWrap: "wrap", gap: sc(8) },
  timeSlotWrap: { width: (width - sc(40) - sc(32)) / 5 },
  timeSlotGrad: {
    borderRadius: sc(12),
    paddingVertical: sc(10),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.p1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  timeSlotBlur: {
    borderRadius: sc(12),
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.glassBorder,
  },
  timeSlotGlassInner: {
    backgroundColor: C.glass,
    paddingVertical: sc(10),
    alignItems: "center",
    justifyContent: "center",
  },
  timeSlotTxt: { fontSize: sc(12), fontWeight: "600", color: C.white70 },

  // ── Hero Card ──
  heroCard: {
    marginTop: sc(12),
    borderRadius: sc(24),
    padding: sc(18),
    flexDirection: "row",
    alignItems: "center",
    gap: sc(14),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  heroBlobTL: {
    position: "absolute",
    top: -30,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  heroBlobBR: {
    position: "absolute",
    bottom: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  heroIconWrap: {
    width: sc(54),
    height: sc(54),
    borderRadius: sc(17),
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroLabel: { fontSize: sc(10), color: "rgba(255,255,255,0.6)", letterSpacing: 1, fontWeight: "700" },
  heroTitle: { fontSize: sc(18), fontWeight: "800", color: C.white, marginTop: sc(2) },
  heroSub: { fontSize: sc(11), color: "rgba(255,255,255,0.65)", marginTop: sc(3) },
  heroStep: {
    borderRadius: sc(14),
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: sc(12),
    paddingVertical: sc(8),
    alignItems: "center",
  },
  heroStepLabel: { fontSize: sc(9), color: "rgba(255,255,255,0.6)", fontWeight: "700" },
  heroStepNum: { fontSize: sc(20), fontWeight: "900", color: C.white, lineHeight: sc(24) },

  // ── Upload ──
  uploadCard: { padding: sc(24), alignItems: "center" },
  uploadTitle: { fontSize: sc(14), fontWeight: "700", color: C.white, marginTop: sc(4) },
  uploadSub: { fontSize: sc(12), color: C.white50, marginTop: sc(4), marginBottom: sc(16) },
  uploadBtnRow: { flexDirection: "row", gap: sc(10), width: "100%" },
  uploadBtnGlass: {
    borderRadius: sc(13),
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.glassBorder,
  },
  uploadBtnGrad: {
    borderRadius: sc(13),
    paddingVertical: sc(10),
    alignItems: "center",
    justifyContent: "center",
  },
  uploadBtnTxt: {
    textAlign: "center",
    paddingVertical: sc(10),
    fontSize: sc(12),
    fontWeight: "700",
    color: C.white70,
    paddingHorizontal: sc(8),
  },
  thumbWrap: { position: "relative" },
  thumb: { width: sc(78), height: sc(78), borderRadius: sc(14) },
  thumbRemove: {
    position: "absolute",
    top: sc(4),
    right: sc(4),
    width: sc(20),
    height: sc(20),
    borderRadius: sc(10),
    backgroundColor: "rgba(0,0,0,0.65)",
    alignItems: "center",
    justifyContent: "center",
  },
  thumbAdd: {
    width: sc(78),
    height: sc(78),
    borderRadius: sc(14),
    overflow: "hidden",
    borderWidth: 2,
    borderColor: C.p1,
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "dashed",
  },
  photoCountTxt: { fontSize: sc(11), color: C.success, fontWeight: "600", marginTop: sc(8) },

  // ── Filters ──
  filterChip: {
    borderRadius: sc(20),
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.glassBorder,
  },
  filterChipInner: {
    backgroundColor: C.glass,
    paddingHorizontal: sc(14),
    paddingVertical: sc(7),
  },
  filterChipActive: {
    borderRadius: sc(20),
    paddingHorizontal: sc(14),
    paddingVertical: sc(7),
  },
  filterChipTxt: { fontSize: sc(12), fontWeight: "500", color: C.white70 },

  // ── Problem Items ──
  problemItem: {
    borderRadius: sc(16),
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.glassBorder,
  },
  problemItemInner: {
    backgroundColor: C.glass,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: sc(15),
    paddingVertical: sc(13),
    gap: sc(12),
  },
  problemItemSelected: {
    borderRadius: sc(16),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: sc(15),
    paddingVertical: sc(13),
    gap: sc(12),
    borderWidth: 1,
    borderColor: C.p1 + "55",
  },
  problemCheck: {
    width: sc(22),
    height: sc(22),
    borderRadius: sc(7),
    borderWidth: 2,
    borderColor: C.glassBorder,
    backgroundColor: "transparent",
  },
  problemCheckActive: {
    width: sc(22),
    height: sc(22),
    borderRadius: sc(7),
    backgroundColor: C.p2,
    alignItems: "center",
    justifyContent: "center",
  },
  problemTitleTxt: { flex: 1, fontSize: sc(13), fontWeight: "600", color: C.white70 },
  problemPriceTxt: { fontSize: sc(14), fontWeight: "800", color: C.white50 },

  // ── Total Strip ──
  totalStrip: {
    borderRadius: sc(20),
    padding: sc(16),
    flexDirection: "row",
    alignItems: "center",
    marginBottom: sc(4),
    marginTop: sc(4),
  },
  totalStripLabel: { fontSize: sc(11), color: "rgba(255,255,255,0.65)" },
  totalStripSubs: { fontSize: sc(11), color: "rgba(255,255,255,0.5)", marginTop: sc(2) },
  totalStripSubLabel: { fontSize: sc(10), color: "rgba(255,255,255,0.6)" },
  totalStripAmt: { fontSize: sc(22), fontWeight: "900", color: C.white, lineHeight: sc(26) },

  // ── Location ──
  locationRow: { flexDirection: "row", gap: sc(10) },
  locationInput: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: C.glassBorder,
    borderRadius: sc(13),
    paddingHorizontal: sc(13),
    paddingVertical: sc(11),
    fontSize: sc(13),
    color: C.white,
  },
  gpsBtn: {
    borderRadius: sc(13),
    paddingHorizontal: sc(14),
    paddingVertical: sc(11),
    justifyContent: "center",
  },
  gpsBtnTxt: { fontSize: sc(11), fontWeight: "700", color: C.white },
  mapMock: {
    height: sc(80),
    borderRadius: sc(14),
    marginTop: sc(10),
    backgroundColor: "rgba(167,139,250,0.08)",
    borderWidth: 1,
    borderColor: C.glassBorder,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  mapGrid: { ...StyleSheet.absoluteFillObject, opacity: 0.15 },

  // ── Notes ──
  notesInput: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: C.glassBorder,
    borderRadius: sc(13),
    paddingHorizontal: sc(13),
    paddingVertical: sc(11),
    fontSize: sc(13),
    color: C.white,
    minHeight: sc(80),
    textAlignVertical: "top",
  },
  notesCount: { fontSize: sc(10), color: C.white30, marginTop: sc(4), textAlign: "right" },

  // ── Validation hint ──
  validationHint: {
    borderRadius: sc(14),
    overflow: "hidden",
    marginTop: sc(14),
    borderWidth: 1,
    borderColor: C.amberBg,
  },
  validationHintInner: {
    backgroundColor: "rgba(252,211,77,0.08)",
    padding: sc(12),
  },
  validationTxt: { fontSize: sc(12), color: C.amber, fontWeight: "600" },

  // ── Review: Service card ──
  reviewServiceCard: { marginTop: sc(12), padding: sc(18) },
  reviewServiceRow: { flexDirection: "row", alignItems: "center", gap: sc(14) },
  reviewServiceIcon: {
    width: sc(52),
    height: sc(52),
    borderRadius: sc(16),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.glassBorder,
  },
  reviewServiceTitle: { fontSize: sc(16), fontWeight: "800", color: C.white },
  reviewServiceSub: { fontSize: sc(12), color: C.white50 },
  reviewServicePrice: { fontSize: sc(20), fontWeight: "900", color: C.p1 },
  qtyRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: sc(16), paddingTop: sc(14), borderTopWidth: 1, borderTopColor: C.glassBorder },
  qtyLabel: { fontSize: sc(13), fontWeight: "600", color: C.white70 },
  qtyPicker: { borderRadius: sc(12), overflow: "hidden", borderWidth: 1, borderColor: C.glassBorder },
  qtyPickerInner: { flexDirection: "row", alignItems: "center", gap: sc(14), backgroundColor: C.glass, paddingHorizontal: sc(10), paddingVertical: sc(6) },
  qtyBtn: { width: sc(28), height: sc(28), borderRadius: sc(8), backgroundColor: "rgba(255,255,255,0.1)", alignItems: "center", justifyContent: "center" },
  qtyBtnTxt: { color: C.p1, fontSize: sc(18), lineHeight: sc(22), fontWeight: "700" },
  qtyVal: { fontSize: sc(15), fontWeight: "800", color: C.p1, minWidth: sc(18), textAlign: "center" },

  // ── Review: Selected services ──
  selectedServiceRow: { flexDirection: "row", alignItems: "center", gap: sc(10), paddingVertical: sc(10) },
  selectedServiceRowBorder: { borderBottomWidth: 1, borderBottomColor: C.glassBorder },
  serviceDot: { width: sc(7), height: sc(7), borderRadius: sc(4) },
  selectedServiceTxt: { flex: 1, fontSize: sc(13), color: C.white70, fontWeight: "600" },
  selectedServicePrice: { fontSize: sc(13), fontWeight: "800", color: C.p1 },

  // ── Review: Detail rows ──
  detailRow: { flexDirection: "row", alignItems: "flex-start" },
  detailTxt: { fontSize: sc(13), color: C.white70, fontWeight: "600", flex: 1, lineHeight: sc(20) },

  // ── Discount badge ──
  discountBadge: { borderRadius: sc(20), overflow: "hidden", marginTop: sc(14), borderWidth: 1, borderColor: C.successBg },
  discountBadgeInner: { flexDirection: "row", alignItems: "center", gap: sc(10), backgroundColor: C.successBg, padding: sc(14) },
  discountTxt: { flex: 1, fontSize: sc(13), fontWeight: "800", color: C.success },
  discountAmt: { fontSize: sc(14), fontWeight: "900", color: C.success },

  // ── Bill ──
  billRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: sc(12) },
  billKey: { fontSize: sc(14), color: C.white50, fontWeight: "600" },
  billVal: { fontSize: sc(14), fontWeight: "700" },
  billDivider: { height: 1, backgroundColor: C.glassBorder, marginVertical: sc(8) },
  billTotalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  billTotalKey: { fontSize: sc(16), fontWeight: "800", color: C.white },
  billTotalVal: { fontSize: sc(22), fontWeight: "900", color: C.p1 },

  // ── Policy ──
  policyCard: { borderRadius: sc(20), overflow: "hidden", marginTop: sc(16), borderWidth: 1, borderColor: "rgba(252,211,77,0.2)" },
  policyInner: { backgroundColor: "rgba(252,211,77,0.06)", padding: sc(18) },
  policyHeader: { flexDirection: "row", alignItems: "center", gap: sc(8), marginBottom: sc(8) },
  policyTitle: { fontSize: sc(14), fontWeight: "800", color: C.amber },
  policyTxt: { fontSize: sc(12), color: "rgba(252,211,77,0.75)", lineHeight: sc(20) },

  // ── Success screen ──
  successScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: sc(32),
  },
  successGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
  },
  successCircle: {
    width: sc(90),
    height: sc(90),
    borderRadius: sc(45),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: sc(24),
    shadowColor: C.success,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 16,
  },
  successTitle: {
    fontSize: sc(26),
    fontWeight: "900",
    color: C.white,
    marginBottom: sc(10),
    textAlign: "center",
  },
  successSub: {
    fontSize: sc(14),
    color: C.white50,
    textAlign: "center",
    lineHeight: sc(22),
    marginBottom: sc(28),
  },
  successAmtCard: {
    borderRadius: sc(20),
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.successBg,
  },
  successAmtInner: {
    backgroundColor: C.successBg,
    paddingHorizontal: sc(32),
    paddingVertical: sc(16),
    alignItems: "center",
  },
  successAmtLabel: { fontSize: sc(11), color: C.success, fontWeight: "700", letterSpacing: 1 },
  successAmtVal: { fontSize: sc(28), fontWeight: "900", color: C.success, marginTop: sc(2) },

  receiptContainer: {
    width: "100%",
    borderRadius: sc(20),
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    padding: sc(20),
    marginTop: sc(12),
    marginBottom: sc(24),
  },
  receiptHeader: {
    fontSize: sc(13),
    fontWeight: "900",
    color: C.p1,
    marginBottom: sc(14),
    letterSpacing: 0.5,
    textAlign: "center",
  },
  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: sc(8),
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },
  receiptLabel: {
    fontSize: sc(12),
    color: C.white50,
    fontWeight: "600",
  },
  receiptVal: {
    fontSize: sc(13),
    color: C.white,
    fontWeight: "700",
  },
  receiptImageRow: {
    marginTop: sc(12),
    gap: sc(8),
  },
  receiptThumb: {
    width: "100%",
    height: sc(110),
    borderRadius: sc(12),
    marginTop: sc(4),
  },
  receiptHomeBtn: {
    width: "100%",
    borderRadius: sc(16),
    overflow: "hidden",
    marginTop: sc(8),
  },
  receiptHomeGradient: {
    paddingVertical: sc(15),
    alignItems: "center",
    justifyContent: "center",
  },
  receiptHomeBtnText: {
    color: C.white,
    fontSize: sc(14),
    fontWeight: "800",
  },
});
