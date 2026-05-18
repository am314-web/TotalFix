import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    Bell,
    Calendar,
    ChevronRight,
    Clock,
    Home,
    Map,
    Mic,
    Search,
    Star,
    User,
    Wallet,
    Zap
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
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
import { SafeAreaView } from "react-native-safe-area-context";
import AppBottomTab from "../components/AppBottomTab";
import { SESSION_KEY } from "../services/session";
import { fetchClientBookings } from "../services/supabaseBookingService";

const { width } = Dimensions.get("window");
const P = "#4A3AFF";
const P2 = "#7B6FFF";
const P3 = "#EDEAFF";
const P4 = "#F7F6FF";
const BG = "#F3F4FF";
const DARK = "#0D0B1E";
const DARK2 = "#1C1A35";
const TEXT = "#0D0B1E";
const SUB = "#6B7280";
const MUTED = "#9CA3AF";
const GOLD = "#F59E0B";
const GREEN = "#10B981";
const RED = "#EF4444";

const mapToServiceKey = (name) => {
  const lower = name.toLowerCase();
  if (lower.includes("clean")) return "cleaner";
  if (lower.includes("ac") || lower.includes("repair") || lower.includes("electric")) return "electrician";
  if (lower.includes("paint")) return "painter";
  if (lower.includes("plumb")) return "plumber";
  if (lower.includes("carpenter") || lower.includes("carpentry")) return "carpenter";
  if (lower.includes("weld")) return "welder";
  if (lower.includes("contract") || lower.includes("construct")) return "contractor";
  if (lower.includes("laund")) return "laundry";
  if (lower.includes("mechanic")) return "mechanic";
  if (lower.includes("garden")) return "gardener";
  if (lower.includes("secur")) return "security";
  if (lower.includes("beautician") || lower.includes("wellness") || lower.includes("tailor")) return "tailor";
  return "plumber"; // fallback
};

// ─── DATA ───────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    label: "Cleaning",
    iconSource: require("../assets/images/icons/laundary.png"),
    bg: "#EEF2FF",
  },
  {
    label: "AC Repair",
    iconSource: require("../assets/images/icons/mechanic.png"),
    bg: "#F0FFFE",
  },
  {
    label: "Painting",
    iconSource: require("../assets/images/icons/painter.png"),
    bg: "#FFFBEB",
  },
  {
    label: "Electric",
    iconSource: require("../assets/images/icons/electrician.png"),
    bg: "#FFF7ED",
  },
  {
    label: "Plumbing",
    iconSource: require("../assets/images/icons/plumber.png"),
    bg: "#F0FFF4",
  },
  {
    label: "Carpentry",
    iconSource: require("../assets/images/icons/carpenter.png"),
    bg: "#FFF5F5",
  },
  { label: "Wellness", icon: "💆", bg: "#FFF0FB" },
];

const DEALS = [
  {
    name: "Deep Clean",
    iconSource: require("../assets/images/icons/laundary.png"),
    bg: "#EEF2FF",
    orig: "₹1,299",
    price: "₹779",
    ribbon: "FLAT 40%",
    timer: "2h 14m",
  },
  {
    name: "AC Service",
    iconSource: require("../assets/images/icons/mechanic.png"),
    bg: "#F0FFFE",
    orig: "₹799",
    price: "₹599",
    ribbon: "₹200 OFF",
    timer: "5h 30m",
  },
  {
    name: "Painting",
    iconSource: require("../assets/images/icons/painter.png"),
    bg: "#FFF0FB",
    orig: "₹999",
    price: "₹699",
    ribbon: "FLAT 30%",
    timer: "1h 5m",
  },
  {
    name: "Plumbing",
    iconSource: require("../assets/images/icons/plumber.png"),
    bg: "#FFF7ED",
    orig: "₹499",
    price: "₹349",
    ribbon: "FREE VISIT",
    timer: "3h 20m",
  },
];

const PROS = [
  {
    initials: "RS",
    name: "Rahul S.",
    role: "Electrician",
    rating: "5.0",
    dist: "0.8 km",
    bg: ["#EEF2FF", "#C7D2FE"],
    tc: P,
    online: GREEN,
    imageSource: require("../assets/images/proffesional/electricianimage.png"),
  },
  {
    initials: "AP",
    name: "Ankit P.",
    role: "Plumber",
    rating: "4.9",
    dist: "1.2 km",
    bg: ["#FFF0FB", "#F9A8D4"],
    tc: "#9D174D",
    online: GREEN,
    imageSource: require("../assets/images/proffesional/plumberimage.png"),
  },
  {
    initials: "SV",
    name: "Suresh V.",
    role: "Cleaner",
    rating: "4.8",
    dist: "1.5 km",
    bg: ["#F0FFF4", "#A7F3D0"],
    tc: "#065F46",
    online: GREEN,
    imageSource: require("../assets/images/proffesional/cleanerimage.png"),
  },
  {
    initials: "MK",
    name: "Manoj K.",
    role: "Painter",
    rating: "4.7",
    dist: "2.1 km",
    bg: ["#FFFBEB", "#FDE68A"],
    tc: "#92400E",
    online: GOLD,
    imageSource: require("../assets/images/proffesional/painter.png"),
  },
  {
    initials: "PD",
    name: "Priya D.",
    role: "Beautician",
    rating: "4.9",
    dist: "2.4 km",
    bg: ["#FFF5F5", "#FCA5A5"],
    tc: "#991B1B",
    online: RED,
    imageSource: require("../assets/images/proffesional/beautician.png"),
  },
];

const PLANS = [
  {
    icon: "🧹",
    name: "Clean Monthly",
    freq: "4 sessions · Every week",
    price: "₹999",
    save: "SAVE ₹400",
    popular: false,
  },
  {
    icon: "⚡",
    name: "All-in-One",
    freq: "Unlimited · Priority",
    price: "₹1,499",
    save: "POPULAR",
    popular: true,
  },
  {
    icon: "🌿",
    name: "Garden Care",
    freq: "2 sessions · Biweekly",
    price: "₹599",
    save: "SAVE ₹200",
    popular: false,
  },
];

const BOOKING_STATUS_UI = {
  pending: { label: "Pending", bg: "#FFF7ED", color: "#EA580C" },
  accepted: { label: "Accepted", bg: "#EEF2FF", color: "#4338CA" },
  rejected: { label: "Rejected", bg: "#FEF2F2", color: "#DC2626" },
  completed: { label: "Done", bg: "#ECFDF5", color: "#059669" },
};

const getRecentBookingUI = (serviceType) => {
  const key = String(serviceType || "").toLowerCase().trim();
  if (key === "electrician") {
    return { name: "Electrical Service", iconSource: require("../assets/images/icons/electrician.png"), iconBg: "#FFF7ED" };
  }
  if (key === "painter") {
    return { name: "Painting Service", iconSource: require("../assets/images/icons/painter.png"), iconBg: "#FDF2F8" };
  }
  if (key === "mechanic") {
    return { name: "Mechanic Service", iconSource: require("../assets/images/icons/mechanic.png"), iconBg: "#FFF7ED" };
  }
  if (key === "cleaner" || key === "laundry") {
    return { name: key === "laundry" ? "Laundry Service" : "Cleaning Service", iconSource: require("../assets/images/icons/laundary.png"), iconBg: "#ECFEFF" };
  }
  if (key === "carpenter") {
    return { name: "Carpentry Service", iconSource: require("../assets/images/icons/carpenter.png"), iconBg: "#FFF1F2" };
  }
  return { name: "Plumbing Service", iconSource: require("../assets/images/icons/plumber.png"), iconBg: "#EFF6FF" };
};

// --- MAIN APP ────────────────────────────────────────────────────────────────

export default function App() {
  const [activeCat, setActiveCat] = useState(0);
  const [recentBookings, setRecentBookings] = useState([]);
  const [clientName, setClientName] = useState("User");

  useEffect(() => {
    const loadRecentBookings = async () => {
      try {
        const rawSession = await AsyncStorage.getItem(SESSION_KEY);
        const session = rawSession ? JSON.parse(rawSession) : null;
        const clientId = session?.uid || "";
        const sessionName =
          session?.fullName ||
          session?.name ||
          (session?.email ? String(session.email).split("@")[0] : "");
        setClientName(sessionName || "User");
        if (!clientId) return setRecentBookings([]);

        const bookings = await fetchClientBookings(clientId, 5);
        const mapped = bookings.map((booking) => {
          const ui = getRecentBookingUI(booking.service_type);
          const statusUi =
            BOOKING_STATUS_UI[String(booking.status || "pending").toLowerCase()] ||
            BOOKING_STATUS_UI.pending;
          const dateText = booking.scheduled_date
            ? new Date(booking.scheduled_date).toLocaleDateString()
            : "Scheduled";
          const timeText = booking.scheduled_time || "Time TBD";

          return {
            id: String(booking.id),
            serviceKey: String(booking.service_type || "plumber").toLowerCase(),
            iconSource: ui.iconSource,
            iconBg: ui.iconBg,
            name: ui.name,
            meta: `${dateText} · ${timeText}`,
            status: statusUi.label,
            statusBg: statusUi.bg,
            statusColor: statusUi.color,
          };
        });
        setRecentBookings(mapped);
      } catch (error) {
        console.error("Failed to load recent bookings:", error);
        setClientName("User");
        setRecentBookings([]);
      }
    };

    loadRecentBookings();
  }, []);

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      <HomeScreen
        activeCat={activeCat}
        setActiveCat={setActiveCat}
        onExplore={() => router.push("/categories")}
        recentBookings={recentBookings}
        clientName={clientName}
      />

      <AppBottomTab />
    </SafeAreaView>
  );
}

// ─── HOME SCREEN ─────────────────────────────────────────────────────────────

const HomeScreen = ({ activeCat, setActiveCat, onExplore, recentBookings, clientName }) => (
  <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{ paddingBottom: 110 }}
  >
    {/* HEADER */}
    <View style={s.header}>
      <View>
        <TouchableOpacity style={s.locPill}>
          <View style={s.locDot} />
          <Text style={s.locName}>Satellite, Ahmedabad</Text>
          <ChevronRight size={12} color={SUB} />
        </TouchableOpacity>
        <Text style={s.greeting}>
          Good Evening, <Text style={{ color: P }}>{clientName}</Text> 👋
        </Text>
      </View>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <TouchableOpacity style={s.iconBtn} onPress={() => router.push("/notifications")}>
          <Bell size={20} color={TEXT} />
          <View style={s.badge}>
            <Text style={s.badgeTxt}>3</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>

    {/* SEARCH BAR */}
    <View style={s.searchRow}>
      <View style={s.searchBox}>
        <Search size={18} color={MUTED} />
        <TextInput
          placeholder="Search services, pros, packages..."
          placeholderTextColor={MUTED}
          style={s.searchInput}
        />
        <Mic size={18} color={MUTED} />
      </View>
      <TouchableOpacity style={s.mapBtn}>
        <Map size={20} color={P} />
      </TouchableOpacity>
    </View>

    {/* QUICK STATS */}

    {/* PROMO BANNER */}
    <View style={s.bannerWrap}>
      <LinearGradient
        colors={["#4A3AFF", "#8B5CF6", "#A78BFA"]}
        style={s.banner}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={s.bOrb1} />
        <View style={s.bOrb2} />
        <View style={s.bBadge}>
          <Text style={s.bPct}>50%</Text>
          <Text style={s.bOff}>OFF</Text>
        </View>
        <View style={{ zIndex: 1 }}>
          <View style={s.bTag}>
            <Zap size={10} color="rgba(255,255,255,0.9)" />
            <Text style={s.bTagTxt}> TODAY ONLY</Text>
          </View>
          <Text style={s.bTitle}>Salon at Home{"\n"}by Experts</Text>
          <Text style={s.bSub}>Professional beauticians at your doorstep</Text>
          <TouchableOpacity style={s.bCta}>
            <Text style={s.bCtaTxt}>Book Now →</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <View style={s.bannerDots}>
        <View style={[s.dot, s.dotOn]} />
        <View style={s.dot} />
        <View style={s.dot} />
      </View>
    </View>

    {/* LIVE TRACKING */}
    <SectionHeader title="  Live Tracking" />
    <TouchableOpacity activeOpacity={0.1}>
      <LinearGradient
        colors={[DARK, DARK2]}
        style={s.trackCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={s.trackOrb} />
        <View style={s.trackAvatar}>
          <Image
            source={require("../assets/images/proffesional/electricianimage.png")}
            style={s.trackAvatarImage}
            resizeMode="cover"
          />
          <View style={s.liveDot} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.trackName}>Rahul Sharma</Text>
          <Text style={s.trackStatus}>AC Technician · On the way to you</Text>
          <View style={{ flexDirection: "row", gap: 6, marginTop: 6 }}>
            <View style={s.trackChip}>
              <Text style={s.trackChipTxt}>AC Service</Text>
            </View>
            <View
              style={[
                s.trackChip,
                {
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  borderColor: "rgba(16,185,129,0.3)",
                },
              ]}
            >
              <Text style={[s.trackChipTxt, { color: GREEN }]}>⭐ 5.0</Text>
            </View>
          </View>
        </View>
        <View style={s.etaBox}>
          <Text style={s.etaVal}>12</Text>
          <Text style={s.etaLbl}>MIN</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>

    {/* CATEGORIES */}
    <SectionHeader title="Categories" link="See All →" onLink={onExplore} />
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
    >
      {CATEGORIES.map((c, i) => (
        <TouchableOpacity
          key={i}
          style={s.catItem}
          onPress={() => {
            setActiveCat(i);
            const serviceKey = mapToServiceKey(c.label);
            router.push({ pathname: "/service-detail", params: { service: serviceKey } });
          }}
        >
          <View
            style={[
              s.catIconBox,
              { backgroundColor: c.bg },
              activeCat === i && s.catIconBoxSel,
            ]}
          >
            {c.iconSource ? (
              <Image
                source={c.iconSource}
                style={s.catImageIcon}
                resizeMode="contain"
              />
            ) : (
              <Text style={{ fontSize: 26 }}>{c.icon}</Text>
            )}
          </View>
          <Text style={[s.catLbl, activeCat === i && { color: P }]}>
            {c.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>

    {/* FLASH DEALS */}
    <SectionHeader title="⏳  Flash Deals" link="See All →" onLink={() => router.push("/flash-deals")} />
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
    >
      {DEALS.map((d, i) => (
        <TouchableOpacity
          key={i}
          style={s.dealCard}
          activeOpacity={0.85}
          onPress={() => {
            const serviceKey = mapToServiceKey(d.name);
            router.push({ pathname: "/service-detail", params: { service: serviceKey } });
          }}
        >
          <View style={s.dealRibbonWrap}>
            <Text style={s.dealRibbon}>{d.ribbon}</Text>
          </View>
          <View style={[s.dealImg, { backgroundColor: d.bg }]}>
            {d.iconSource ? (
              <Image
                source={d.iconSource}
                style={s.dealImageIcon}
                resizeMode="contain"
              />
            ) : (
              <Text style={{ fontSize: 26 }}>{d.icon}</Text>
            )}
          </View>
          <Text style={s.dealName}>{d.name}</Text>
          <Text style={s.dealOrig}>{d.orig}</Text>
          <Text style={s.dealPrice}>{d.price}</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              marginTop: 6,
            }}
          >
            <Clock size={10} color={RED} />
            <Text style={s.dealTimer}>{d.timer} left</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>

    {/* NEARBY PROS */}
    <SectionHeader title="Nearby Professionals" link="See All →" onLink={() => router.push("/nearby-pros")} />
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
    >
      {PROS.map((p, i) => (
        <TouchableOpacity
          key={i}
          style={s.proCard}
          activeOpacity={0.85}
          onPress={() => {
            router.push({ pathname: "/proffesional-profile", params: { name: p.name, role: p.role } });
          }}
        >
          <View style={s.proAv}>
            {p.imageSource ? (
              <Image
                source={p.imageSource}
                style={s.proAvatarImage}
                resizeMode="cover"
              />
            ) : (
              <LinearGradient colors={p.bg} style={s.proAv}>
                <Text style={[s.proInitials, { color: p.tc }]}>
                  {p.initials}
                </Text>
              </LinearGradient>
            )}
            <View style={[s.proOnline, { backgroundColor: p.online }]} />
          </View>
          <Text style={s.proName}>{p.name}</Text>
          <Text style={s.proRole}>{p.role}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
            <Star size={11} color={GOLD} fill={GOLD} />
            <Text style={s.proRating}>{p.rating}</Text>
          </View>
          <View style={s.proDist}>
            <Text style={s.proDistTxt}>{p.dist}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>

    {/* MONTHLY PLANS */}

    {/* RECENT BOOKINGS */}
    <SectionHeader title="Recent Bookings" link="View All →" />
    <View style={{ paddingHorizontal: 20, gap: 10 }}>
      {recentBookings.length === 0 ? (
        <View style={s.recCard}>
          <View style={[s.recIcon, { backgroundColor: "#EEF2FF" }]}>
            <Calendar size={20} color={P} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.recName}>No recent bookings yet</Text>
            <Text style={s.recMeta}>Your booked services will appear here.</Text>
          </View>
        </View>
      ) : recentBookings.map((r, i) => (
        <TouchableOpacity
          key={r.id || i}
          style={s.recCard}
          activeOpacity={0.85}
          onPress={() => {
            const serviceKey = r.serviceKey || mapToServiceKey(r.name);
            router.push({ pathname: "/service-detail", params: { service: serviceKey } });
          }}
        >
          <View style={[s.recIcon, { backgroundColor: r.iconBg }]}>
            {r.iconSource ? (
              <Image
                source={r.iconSource}
                style={s.recImageIcon}
                resizeMode="contain"
              />
            ) : (
              <Text style={{ fontSize: 20 }}>{r.icon}</Text>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.recName}>{r.name}</Text>
            <Text style={s.recMeta}>{r.meta}</Text>
          </View>
          <View style={{ alignItems: "flex-end", gap: 6 }}>
            <View style={[s.recTag, { backgroundColor: r.statusBg }]}>
              <Text style={[s.recTagTxt, { color: r.statusColor }]}>
                {r.status}
              </Text>
            </View>
            <TouchableOpacity style={s.rebookBtn}>
              <Text style={s.rebookTxt}>Rebook</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </View>

    {/* REVIEW PROMPT */}
    <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
      <LinearGradient colors={["#FFF7ED", "#FFEDD5"]} style={s.reviewCard}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 20, marginBottom: 4 }}>⭐⭐⭐⭐⭐</Text>
          <Text style={s.revTitle}>Rate your last service!</Text>
          <Text style={s.revSub}>How was Deep Cleaning by Suresh?</Text>
          <TouchableOpacity style={s.revBtn}>
            <Text style={s.revBtnTxt}>Give Review</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 48 }}>🙏</Text>
      </LinearGradient>
    </View>

    {/* WALLET PEEK */}
  </ScrollView>
);

// ─── PLACEHOLDER SCREEN ──────────────────────────────────────────────────────

const PlaceholderScreen = ({ title, onBack }) => (
  <View style={{ flex: 1, backgroundColor: BG }}>
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
        paddingTop: 16,
        gap: 12,
      }}
    >
      <TouchableOpacity style={s.iconBtn} onPress={onBack}>
        <ChevronRight
          size={20}
          color={TEXT}
          style={{ transform: [{ rotate: "180deg" }] }}
        />
      </TouchableOpacity>
      <Text
        style={{
          fontFamily: "System",
          fontSize: 18,
          fontWeight: "800",
          color: TEXT,
        }}
      >
        {title}
      </Text>
    </View>
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 48, marginBottom: 16 }}>🚧</Text>
      <Text style={{ fontSize: 18, fontWeight: "700", color: TEXT }}>
        Coming Soon
      </Text>
      <Text style={{ fontSize: 13, color: SUB, marginTop: 6 }}>
        This screen is under construction
      </Text>
    </View>
  </View>
);

// ─── SMALL COMPONENTS ────────────────────────────────────────────────────────

const SectionHeader = ({ title, link, onLink }) => (
  <View style={s.secHead}>
    <Text style={s.secTitle}>{title}</Text>
    {link && (
      <TouchableOpacity onPress={onLink}>
        <Text style={s.secLink}>{link}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const StatCard = ({ icon, val, lbl }) => (
  <View style={s.statCard}>
    {icon}
    <Text style={s.statVal}>{val}</Text>
    <Text style={s.statLbl}>{lbl}</Text>
  </View>
);

const TabBtn = ({ icon: Icon, label, active, onPress }) => (
  <TouchableOpacity style={s.tabBtn} onPress={onPress}>
    <Icon
      size={22}
      color={active ? P : "#CBD5E1"}
      strokeWidth={active ? 2.5 : 1.8}
    />
    <Text style={[s.tabLabel, active && { color: P }]}>{label}</Text>
  </TouchableOpacity>
);

const HelpCard = ({ icon, bg, title, sub }) => (
  <TouchableOpacity style={s.helpCard} activeOpacity={0.8}>
    <View style={[s.helpIcon, { backgroundColor: bg }]}>{icon}</View>
    <View>
      <Text style={s.helpTitle}>{title}</Text>
      <Text style={s.helpSub}>{sub}</Text>
    </View>
  </TouchableOpacity>
);

// ─── STYLES ──────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  // HEADER
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  locPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(74,58,255,0.1)",
    marginBottom: 6,
  },
  locDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: P },
  locName: { fontSize: 12, fontWeight: "600", color: TEXT },
  greeting: { fontSize: 24, fontWeight: "800", color: TEXT, lineHeight: 30 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(74,58,255,0.08)",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: RED,
    borderWidth: 2,
    borderColor: BG,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeTxt: { fontSize: 8, fontWeight: "800", color: "white" },

  // SEARCH
  searchRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    marginTop: 14,
    alignItems: "center",
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "white",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: "rgba(74,58,255,0.08)",
  },
  searchInput: { flex: 1, fontSize: 14, color: TEXT },
  mapBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: P3,
    alignItems: "center",
    justifyContent: "center",
  },

  // STATS
  statsRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(74,58,255,0.07)",
  },
  statVal: { fontSize: 15, fontWeight: "800", color: TEXT },
  statLbl: { fontSize: 10, fontWeight: "500", color: SUB },

  // BANNER
  bannerWrap: { paddingHorizontal: 20, marginTop: 16 },
  banner: {
    borderRadius: 24,
    padding: 22,
    overflow: "hidden",
    position: "relative",
  },
  bOrb1: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255,255,255,0.07)",
    top: -40,
    right: -40,
  },
  bOrb2: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.1)",
    bottom: -20,
    right: 60,
  },
  bBadge: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 16,
    padding: 10,
    alignItems: "center",
  },
  bPct: { fontSize: 26, fontWeight: "800", color: "white", lineHeight: 28 },
  bOff: {
    fontSize: 10,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  bTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  bTagTxt: {
    fontSize: 10,
    fontWeight: "700",
    color: "rgba(255,255,255,0.95)",
    letterSpacing: 0.8,
  },
  bTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "white",
    lineHeight: 27,
    marginBottom: 6,
  },
  bSub: { fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 14 },
  bCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 9,
    alignSelf: "flex-start",
  },
  bCtaTxt: { fontSize: 13, fontWeight: "700", color: P },
  bannerDots: {
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(74,58,255,0.2)",
  },
  dotOn: { width: 18, borderRadius: 3, backgroundColor: P },

  // LIVE TRACKING
  trackCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    overflow: "hidden",
    position: "relative",
  },
  trackOrb: {
    position: "absolute",
    right: -20,
    top: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(74,58,255,0.15)",
  },
  trackAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: P3,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  trackAvatarImage: { width: "100%", height: "100%", borderRadius: 23 },
  trackInitials: { fontSize: 16, fontWeight: "800", color: P },
  liveDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: GREEN,
    borderWidth: 2,
    borderColor: DARK2,
  },
  trackName: { fontSize: 14, fontWeight: "700", color: "white" },
  trackStatus: { fontSize: 11, color: MUTED, marginTop: 2 },
  trackChip: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  trackChipTxt: { fontSize: 10, color: "#9CA3AF" },
  etaBox: {
    backgroundColor: "rgba(16,185,129,0.15)",
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.3)",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
  },
  etaVal: { fontSize: 20, fontWeight: "800", color: GREEN, lineHeight: 22 },
  etaLbl: { fontSize: 9, color: MUTED, fontWeight: "600" },

  // CATEGORIES
  catItem: { alignItems: "center", gap: 7, minWidth: 68 },
  catIconBox: {
    width: 62,
    height: 62,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  catIconBoxSel: { borderColor: "rgba(74,58,255,0.3)", backgroundColor: P3 },
  catImageIcon: { width: 70, height: 70 },
  catLbl: { fontSize: 11, fontWeight: "600", color: SUB },

  // DEALS
  dealCard: {
    minWidth: 140,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(74,58,255,0.07)",
    position: "relative",
    overflow: "hidden",
  },
  dealRibbonWrap: {
    position: "absolute",
    top: 10,
    right: 0,
    backgroundColor: RED,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  dealRibbon: {
    fontSize: 9,
    fontWeight: "800",
    color: "white",
    letterSpacing: 0.3,
  },
  dealImg: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  dealImageIcon: { width: 56, height: 56 },
  dealName: { fontSize: 13, fontWeight: "700", color: TEXT, marginBottom: 3 },
  dealOrig: { fontSize: 10, color: MUTED, textDecorationLine: "line-through" },
  dealPrice: { fontSize: 15, fontWeight: "800", color: P },
  dealTimer: { fontSize: 10, fontWeight: "600", color: RED },

  // PROS
  proCard: {
    minWidth: 110,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(74,58,255,0.07)",
    alignItems: "center",
    gap: 5,
  },
  proAv: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  proAvatarImage: { width: "100%", height: "100%", borderRadius: 24 },
  proInitials: { fontSize: 16, fontWeight: "800" },
  proOnline: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 13,
    height: 13,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "white",
  },
  proName: {
    fontSize: 12,
    fontWeight: "700",
    color: TEXT,
    textAlign: "center",
  },
  proRole: { fontSize: 10, color: SUB, textAlign: "center" },
  proRating: { fontSize: 11, fontWeight: "700", color: TEXT },
  proDist: {
    backgroundColor: BG,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  proDistTxt: { fontSize: 9, color: MUTED },

  // PLANS
  planCard: {
    minWidth: 160,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(74,58,255,0.08)",
  },
  planCardPop: { borderColor: "rgba(74,58,255,0.3)", backgroundColor: P4 },
  planName: { fontSize: 13, fontWeight: "700", color: TEXT },
  planFreq: { fontSize: 10, color: SUB, marginTop: 2, marginBottom: 8 },
  planPrice: { fontSize: 15, fontWeight: "800", color: P },
  planMo: { fontSize: 10, color: SUB, fontWeight: "500" },
  planTag: {
    backgroundColor: P3,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  planTagPop: { backgroundColor: P },
  planTagTxt: { fontSize: 9, fontWeight: "700", color: P },

  // RECENTS
  recCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(74,58,255,0.07)",
  },
  recIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  recImageIcon: { width: 46, height: 46 },
  recName: { fontSize: 13, fontWeight: "600", color: TEXT },
  recMeta: { fontSize: 11, color: SUB, marginTop: 2 },
  recTag: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  recTagTxt: { fontSize: 10, fontWeight: "700" },
  rebookBtn: {
    backgroundColor: P3,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  rebookTxt: { fontSize: 10, fontWeight: "700", color: P },

  // REVIEW
  reviewCard: {
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(249,115,22,0.15)",
  },
  revTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#9A3412",
    marginBottom: 2,
  },
  revSub: { fontSize: 11, color: "#C2410C", marginBottom: 10 },
  revBtn: {
    backgroundColor: "#F97316",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignSelf: "flex-start",
  },
  revBtnTxt: { fontSize: 12, fontWeight: "700", color: "white" },

  // WALLET
  walletCard: {
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
    position: "relative",
  },
  walletOrb: {
    position: "absolute",
    right: -30,
    bottom: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  walletLbl: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
    marginBottom: 4,
  },
  walletBal: { fontSize: 26, fontWeight: "800", color: "white" },
  walletCb: { fontSize: 11, color: "rgba(255,255,255,0.8)" },
  walletAddBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  walletAddTxt: { fontSize: 13, fontWeight: "700", color: "white" },

  // REFER
  referCard: {
    borderRadius: 24,
    padding: 18,
    overflow: "hidden",
    position: "relative",
  },
  refOrb1: {
    position: "absolute",
    right: -40,
    top: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(139,92,246,0.12)",
  },
  refOrb2: {
    position: "absolute",
    left: -20,
    bottom: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(74,58,255,0.15)",
  },
  refTag: {
    backgroundColor: "rgba(245,158,11,0.2)",
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.4)",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  refTagTxt: {
    fontSize: 10,
    fontWeight: "700",
    color: GOLD,
    letterSpacing: 0.5,
  },
  refTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "white",
    marginBottom: 4,
  },
  refSub: { fontSize: 12, color: MUTED, marginBottom: 14 },
  refCode: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: 10,
    borderStyle: "dashed",
    padding: 10,
  },
  refCodeVal: {
    fontSize: 15,
    fontWeight: "800",
    color: "white",
    letterSpacing: 2,
  },
  refCodeLbl: { fontSize: 9, color: "#6B7280", marginTop: 1 },
  refShareBtn: {
    backgroundColor: P,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  refShareTxt: { fontSize: 12, fontWeight: "700", color: "white" },

  // MEMBER
  memberCard: {
    borderRadius: 24,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
    position: "relative",
  },
  mOrb1: {
    position: "absolute",
    right: -30,
    top: -30,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "rgba(74,58,255,0.15)",
  },
  mOrb2: {
    position: "absolute",
    left: -20,
    bottom: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(245,158,11,0.08)",
  },
  mCrownBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(245,158,11,0.15)",
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  mTitle: { fontSize: 16, fontWeight: "800", color: "white" },
  mPerk: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  mPerkTxt: { fontSize: 9, color: MUTED },
  mUpgradeBtn: { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  mUpgradeTxt: { fontSize: 12, fontWeight: "800", color: "white" },

  // HELP
  helpGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: 20,
  },
  helpCard: {
    width: (width - 50) / 2,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(74,58,255,0.07)",
  },
  helpIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  helpTitle: { fontSize: 12, fontWeight: "700", color: TEXT },
  helpSub: { fontSize: 10, color: SUB, marginTop: 1 },

  // SECTION
  secHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 22,
    marginBottom: 12,
  },
  secTitle: { fontSize: 16, fontWeight: "700", color: TEXT },
  secLink: { fontSize: 12, fontWeight: "600", color: P },

  // TAB BAR
  tabWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingBottom: 20,
  },
  tabBar: {
    width: width - 40,
    height: 68,
    borderRadius: 34,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 9.5,
    fontWeight: "600",
    color: "#CBD5E1",
    letterSpacing: 0.2,
  },
  tabCenter: {
    position: "absolute",
    bottom: 18,
    width: 58,
    height: 58,
    borderRadius: 29,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "white",
    elevation: 8,
    shadowColor: P,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  tabCenterGrad: { flex: 1, alignItems: "center", justifyContent: "center" },
});

