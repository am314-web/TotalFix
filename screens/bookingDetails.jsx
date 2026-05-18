import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import {
    Calendar,
    CheckCircle2,
    Clock,
    MapPin,
    Navigation,
    RotateCcw,
    SlidersHorizontal,
    XCircle,
    ChevronRight
} from "lucide-react-native";
import AppBottomTab from "../components/AppBottomTab";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
} from "react-native";
import { router } from "expo-router";
import { supabase } from "../services/supabase";
import { SESSION_KEY } from "../services/session";

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
};

// ─── MOCK DATA ───────────────────────────────────────────────
const BOOKINGS = [
  {
    id: "UC-101",
    service: "Split AC Jet Service",
    date: "16 May 2026",
    time: "14:00 - 15:00",
    status: "Upcoming",
    price: "₹1,149",
    address: "B-402, Skyline Residency, Ahmedabad",
    issue: {
      description: "Water continuously leaks from the indoor unit filter & weak air speed.",
      images: [
        require("../assets/images/icons/mechanic.png"),
        require("../assets/images/icons/plumber.png")
      ]
    }
  },
  {
    id: "UC-98",
    service: "AC Gas Top-up",
    date: "10 May 2026",
    time: "10:30 - 11:30",
    status: "Completed",
    price: "₹850",
    address: "B-402, Skyline Residency, Ahmedabad",
    issue: {
      description: "Compressor vibrates loudly and the cooling temperature is very low.",
      images: [
        require("../assets/images/icons/mechanic.png")
      ]
    }
  },
  {
    id: "UC-85",
    service: "AC Installation",
    date: "01 May 2026",
    time: "12:00 - 14:00",
    status: "Cancelled",
    price: "₹2,100",
    address: "C-101, Green Park, Ahmedabad",
    issue: {
      description: "Installation of brand-new AC with 4.5m piping and mounting bracket.",
      images: [
        require("../assets/images/icons/mechanic.png"),
        require("../assets/images/icons/carpenter.png")
      ]
    }
  },
];

const SERVICE_PRICES = {
  plumber: "₹499",
  carpenter: "₹599",
  electrician: "₹399",
  painter: "₹999",
  cleaner: "₹699",
  mechanic: "₹799",
  gardener: "₹499",
  tailor: "₹399",
  welder: "₹899",
  contractor: "₹1,499",
  laundry: "₹299",
  security: "₹1,299",
};

const SERVICE_NAMES = {
  plumber: "Professional Plumbing Services",
  carpenter: "Professional Carpenter Services",
  electrician: "Professional Electrician Services",
  painter: "Professional Painting Services",
  cleaner: "Professional Cleaning Services",
  mechanic: "Professional Mechanic Services",
  gardener: "Professional Gardening Services",
  tailor: "Professional Tailoring Services",
  welder: "Professional Welding Services",
  contractor: "Professional Contractor Services",
  laundry: "Professional Laundry Services",
  security: "Professional Security Services",
};

const formatDateStr = (dateStr) => {
  if (!dateStr) return "Scheduled Date";
  try {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      const options = { day: "numeric", month: "short", year: "numeric" };
      return date.toLocaleDateString("en-IN", options);
    }
    return dateStr;
  } catch (e) {
    return dateStr;
  }
};

const BOOKING_TABS = ["all", "pending", "accepted", "completed", "cancelled"];

const toStatusLabel = (status) => {
  const raw = String(status || "").toLowerCase();
  if (raw === "rejected") return "cancelled";
  return raw || "pending";
};

const parseImageUrls = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value !== "string") return [];
  const trimmed = value.trim();
  if (!trimmed) return [];
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch {}
  return trimmed
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
};

export default function BookingTabsScreen() {
  const [activeTab, setActiveTab] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBookings() {
      try {
        setLoading(true);
        // 1. Get client ID from session storage
        const sessionStr = await AsyncStorage.getItem(SESSION_KEY);
        let userId = "client_firebase_uid_123"; // Fallback client ID
        if (sessionStr) {
          const session = JSON.parse(sessionStr);
          if (session && session.uid) {
            userId = session.uid;
          }
        }
        
        // 2. Fetch bookings from Supabase table
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("client_id", userId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        
        setBookings(data || []);
      } catch (err) {
        console.error("Error loading bookings from Supabase:", err);
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId);

      if (error) throw error;
      
      // Update local state instantly
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: "cancelled" } : b));
      alert("Your booking has been cancelled successfully.");
    } catch (err) {
      console.error("Error cancelling booking:", err);
      alert("Could not cancel booking. Please try again.");
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const status = toStatusLabel(b.status);
    if (activeTab === "all") return true;
    return status === activeTab;
  });

  const renderBookingCard = (item) => {
    const serviceName = SERVICE_NAMES[item.service_type] || (item.service_type ? item.service_type.charAt(0).toUpperCase() + item.service_type.slice(1) + " Service" : "On-Demand Home Service");
    const priceText = SERVICE_PRICES[item.service_type] || "₹499";
    const displayDate = formatDateStr(item.scheduled_date);
    const displayAddress = "Address shared by client";
    const statusVal = toStatusLabel(item.status);
    const imageUrls = parseImageUrls(item.image_url);

    return (
      <View key={item.id} style={s.cardWrapper}>
        <BlurView
          intensity={Platform.OS === "ios" ? 45 : 95}
          tint="light"
          style={s.glassCard}
        >
          <View style={s.cardHeader}>
            <View>
              <View style={s.idBadge}>
                <Text style={s.orderId}>ID: UC-{item.id}</Text>
              </View>
              <Text style={s.serviceTitle}>{serviceName}</Text>
            </View>
            <Text style={s.priceText}>{priceText}</Text>
          </View>

          <View style={s.cardBody}>
            <View style={s.infoRow}>
              <View style={s.iconContainer}>
                <Calendar size={sc(14)} color={C.p2} />
              </View>
              <Text style={s.infoText}>{displayDate}</Text>
            </View>
            <View style={s.infoRow}>
              <View style={s.iconContainer}>
                <Clock size={sc(14)} color={C.p2} />
              </View>
              <Text style={s.infoText}>{item.scheduled_time}</Text>
            </View>
            <View style={s.infoRow}>
              <View style={s.iconContainer}>
                <MapPin size={sc(14)} color={C.p2} />
              </View>
              <Text style={s.infoText} numberOfLines={1}>
                {displayAddress}
              </Text>
            </View>

            {/* CLIENT REPORTED ISSUE WITH THUMBNAIL */}
            {item.notes && (
              <View style={s.issueContainer}>
                <View style={s.issueTextCol}>
                  <Text style={s.issueHeader}>⚠️ CLIENT REPORTED ISSUE</Text>
                  <Text style={s.issueDesc} numberOfLines={3}>
                    {item.notes}
                  </Text>
                </View>
                {imageUrls.length > 0 && (
                  <View style={s.issueImagesRow}>
                    {imageUrls.map((uri, idx) => (
                      <Image
                        key={`${item.id}-img-${idx}`}
                        source={{ uri }}
                        style={s.issueThumb}
                        resizeMode="cover"
                      />
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>

          <View style={s.cardDivider} />

          {/* PROMINENT ACTION LINK TO INVOICE SCREEN */}
          <TouchableOpacity 
            style={s.invoiceRedirectBtn} 
            activeOpacity={0.8}
            onPress={() => router.push({ pathname: "/client-invoice", params: { bookingId: item.id } })}
          >
            <View style={s.invoiceRedirectLeft}>
              <Text style={s.invoiceRedirectTxt}>Take me to Booking & Invoice Screen 🧾</Text>
            </View>
            <ChevronRight size={14} color={C.p2} strokeWidth={2.5} />
          </TouchableOpacity>

          <View style={s.actionRow}>
            {(statusVal === "pending" || statusVal === "accepted") && (
              <>
                <TouchableOpacity 
                  style={s.cancelBtn} 
                  activeOpacity={0.7}
                  onPress={() => handleCancelBooking(item.id)}
                >
                  <Text style={s.cancelBtnText}>Cancel Booking</Text>
                </TouchableOpacity>
                {statusVal === "accepted" && item.professional_id ? (
                  <TouchableOpacity
                    style={s.trackBtn}
                    activeOpacity={0.85}
                    onPress={() =>
                      router.push({
                        pathname: "/chat",
                        params: { bookingId: String(item.id) },
                      })
                    }
                  >
                    <LinearGradient colors={[C.p1, C.p2]} style={s.trackGradient}>
                      <Text style={s.trackBtnText}>Chat with Professional</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={s.trackBtn} activeOpacity={0.85}>
                    <LinearGradient colors={[C.p1, C.p2]} style={s.trackGradient}>
                      <Navigation size={sc(14)} color={C.white} fill={C.white} />
                      <Text style={s.trackBtnText}>Track Expert</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </>
            )}

            {statusVal === "completed" && (
              <>
                <View style={s.statusBadgeSuccess}>
                  <CheckCircle2
                    size={sc(14)}
                    color="#059669"
                    fill="rgba(5, 150, 105, 0.1)"
                  />
                  <Text style={s.statusBadgeTextSuccess}>Completed</Text>
                </View>
                <TouchableOpacity 
                  style={s.rebookBtn} 
                  activeOpacity={0.7}
                  onPress={() => router.push({ pathname: "/client-invoice", params: { bookingId: item.id } })}
                >
                  <RotateCcw size={sc(14)} color={C.p2} />
                  <Text style={s.rebookBtnText}>Rebook Service</Text>
                </TouchableOpacity>
              </>
            )}

            {statusVal === "cancelled" && (
              <>
                <View style={s.statusBadgeError}>
                  <XCircle
                    size={sc(14)}
                    color="#DC2626"
                    fill="rgba(220, 38, 38, 0.1)"
                  />
                  <Text style={s.statusBadgeTextError}>Cancelled</Text>
                </View>
                <TouchableOpacity 
                  style={s.rebookBtn} 
                  activeOpacity={0.7}
                  onPress={() => router.push({ pathname: "/client-invoice", params: { bookingId: item.id } })}
                >
                  <Text style={s.rebookBtnText}>Try Again</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </BlurView>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[s.container, { justifyContent: "center", alignItems: "center" }]}>
        <StatusBar barStyle="dark-content" />
        <LinearGradient
          colors={["#F4F3FF", "#FDFDFF"]}
          style={StyleSheet.absoluteFill}
        />
        <ActivityIndicator size="large" color={C.p2} />
        <Text style={{ marginTop: 12, color: C.p2, fontWeight: "700" }}>Loading real-time bookings...</Text>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={["#F4F3FF", "#FDFDFF"]}
        style={StyleSheet.absoluteFill}
      />

      {/* AMBIENT GLOW ORBS FOR GLASSMOPHISM DEPTH */}
      <View
        style={[
          s.glowOrb,
          {
            top: height * 0.1,
            left: -sc(50),
            backgroundColor: "rgba(140, 127, 255, 0.18)",
          },
        ]}
      />
      <View
        style={[
          s.glowOrb,
          {
            bottom: height * 0.2,
            right: -sc(50),
            backgroundColor: "rgba(91, 76, 240, 0.12)",
          },
        ]}
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* APP BAR */}
        <View style={s.header}>
          <Text style={s.headerTitle}>My Bookings</Text>
          <TouchableOpacity style={s.filterBtn} activeOpacity={0.75}>
            <SlidersHorizontal size={sc(18)} color={C.textDark} />
          </TouchableOpacity>
        </View>

        {/* TOP TABS CONTROL */}
        <View style={s.tabBarContainer}>
          <View style={s.tabBarBackground}>
            {BOOKING_TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  activeOpacity={0.8}
                  style={[s.tabItem, isActive && s.tabItemActive]}
                >
                  <Text style={[s.tabText, isActive && s.tabTextActive]}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* CARDS FEED */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scrollContent}
        >
          {filteredBookings.length > 0 ? (
            filteredBookings.map(renderBookingCard)
          ) : (
            <View style={s.emptyState}>
              <View style={s.emptyIconCircle}>
                <Calendar size={sc(32)} color={C.textMuted} />
              </View>
              <Text style={s.emptyText}>
                No {activeTab.toLowerCase()} bookings found
              </Text>
              <Text style={s.emptySubText}>
                When you book an on-demand home service, it will appear here.
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
      <AppBottomTab />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  glowOrb: {
    position: "absolute",
    width: sc(260),
    height: sc(260),
    borderRadius: sc(130),
    filter: Platform.OS === "ios" ? "blur(40px)" : undefined,
    opacity: 0.8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: sc(26),
    fontWeight: "900",
    color: C.textDark,
    letterSpacing: -0.6,
  },
  filterBtn: {
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

  // Custom Tab Bar
  tabBarContainer: { paddingHorizontal: 24, marginBottom: 15 },
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
  tabText: { fontSize: sc(13), fontWeight: "700", color: C.textMuted },
  tabTextActive: { color: C.p2, fontWeight: "800" },

  // Luxury Glassmorphic Cards
  scrollContent: { paddingHorizontal: 24, paddingBottom: 120, paddingTop: 5 },
  cardWrapper: {
    marginBottom: 18,
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
  glassCard: { padding: 20, backgroundColor: "rgba(255, 255, 255, 0.45)" },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  idBadge: {
    backgroundColor: "rgba(91, 76, 240, 0.08)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  orderId: {
    fontSize: sc(10),
    fontWeight: "800",
    color: C.p2,
    letterSpacing: 0.5,
  },
  serviceTitle: {
    fontSize: sc(16),
    fontWeight: "900",
    color: C.textDark,
    letterSpacing: -0.2,
  },
  priceText: {
    fontSize: sc(18),
    fontWeight: "900",
    color: C.p2,
    letterSpacing: -0.5,
  },

  cardBody: { gap: 12, marginBottom: 18 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconContainer: {
    width: sc(26),
    height: sc(26),
    borderRadius: 8,
    backgroundColor: C.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.inputBorder,
  },
  infoText: {
    fontSize: sc(13),
    color: C.textDark,
    fontWeight: "600",
    opacity: 0.8,
  },

  // Issue Box Style
  issueContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(91, 76, 240, 0.05)",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(91, 76, 240, 0.1)",
    marginTop: 12,
    marginBottom: 4,
  },
  issueTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  issueHeader: {
    fontSize: 10,
    fontWeight: "800",
    color: C.p2,
    marginBottom: 3,
    letterSpacing: 0.3,
  },
  issueDesc: {
    fontSize: 12,
    fontWeight: "600",
    color: C.textDark,
    lineHeight: 16,
  },
  issueImagesRow: {
    flexDirection: "row",
    gap: 6,
  },
  issueThumb: {
    width: 42,
    height: 42,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: C.white,
    backgroundColor: C.white,
  },

  cardDivider: {
    height: 1,
    backgroundColor: "rgba(232, 229, 255, 0.8)",
    marginBottom: 16,
  },

  // Invoice Redirect Button
  invoiceRedirectBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(91, 76, 240, 0.08)",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(91, 76, 240, 0.15)",
    marginBottom: 16,
  },
  invoiceRedirectLeft: {
    flex: 1,
  },
  invoiceRedirectTxt: {
    fontSize: 12,
    fontWeight: "800",
    color: C.p2,
  },

  // Action Configurations
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cancelBtn: { paddingVertical: 12, paddingHorizontal: 8 },
  cancelBtnText: {
    color: "#EF4444",
    fontWeight: "800",
    fontSize: sc(13),
    letterSpacing: -0.1,
  },
  trackBtn: {
    width: width * 0.36,
    height: sc(46),
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: C.p2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  trackGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  trackBtnText: { color: C.white, fontWeight: "800", fontSize: sc(13) },

  rebookBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1.5,
    borderColor: C.inputBorder,
    backgroundColor: C.white,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 14,
    elevation: 1,
  },
  rebookBtnText: { color: C.p2, fontWeight: "800", fontSize: sc(12) },

  // Badges
  statusBadgeSuccess: {
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
  statusBadgeTextSuccess: {
    color: "#047857",
    fontWeight: "800",
    fontSize: sc(11),
  },
  statusBadgeError: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FCA5A5",
  },
  statusBadgeTextError: {
    color: "#B91C1C",
    fontWeight: "800",
    fontSize: sc(11),
  },

  // Empty State UI
  emptyState: {
    paddingVertical: height * 0.12,
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: sc(70),
    height: sc(70),
    borderRadius: 35,
    backgroundColor: C.inputBg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.inputBorder,
  },
  emptyText: { color: C.textDark, fontWeight: "800", fontSize: sc(16) },
  emptySubText: {
    color: C.labelGray,
    fontWeight: "500",
    fontSize: sc(12),
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
});
