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
} from "lucide-react-native";
import AppBottomTab from "../components/AppBottomTab";
import { useState } from "react";
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
  },
  {
    id: "UC-98",
    service: "AC Gas Top-up",
    date: "10 May 2026",
    time: "10:30 - 11:30",
    status: "Completed",
    price: "₹850",
    address: "B-402, Skyline Residency, Ahmedabad",
  },
  {
    id: "UC-85",
    service: "AC Installation",
    date: "01 May 2026",
    time: "12:00 - 14:00",
    status: "Cancelled",
    price: "₹2,100",
    address: "C-101, Green Park, Ahmedabad",
  },
];

export default function BookingTabsScreen() {
  const [activeTab, setActiveTab] = useState("Upcoming");

  const filteredBookings = BOOKINGS.filter((b) => b.status === activeTab);

  const renderBookingCard = (item) => (
    <View key={item.id} style={s.cardWrapper}>
      <BlurView
        intensity={Platform.OS === "ios" ? 45 : 95}
        tint="light"
        style={s.glassCard}
      >
        <View style={s.cardHeader}>
          <View>
            <View style={s.idBadge}>
              <Text style={s.orderId}>ID: {item.id}</Text>
            </View>
            <Text style={s.serviceTitle}>{item.service}</Text>
          </View>
          <Text style={s.priceText}>{item.price}</Text>
        </View>

        <View style={s.cardBody}>
          <View style={s.infoRow}>
            <View style={s.iconContainer}>
              <Calendar size={sc(14)} color={C.p2} />
            </View>
            <Text style={s.infoText}>{item.date}</Text>
          </View>
          <View style={s.infoRow}>
            <View style={s.iconContainer}>
              <Clock size={sc(14)} color={C.p2} />
            </View>
            <Text style={s.infoText}>{item.time}</Text>
          </View>
          <View style={s.infoRow}>
            <View style={s.iconContainer}>
              <MapPin size={sc(14)} color={C.p2} />
            </View>
            <Text style={s.infoText} numberOfLines={1}>
              {item.address}
            </Text>
          </View>
        </View>

        <View style={s.cardDivider} />

        <View style={s.actionRow}>
          {item.status === "Upcoming" && (
            <>
              <TouchableOpacity style={s.cancelBtn} activeOpacity={0.7}>
                <Text style={s.cancelBtnText}>Cancel Booking</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.trackBtn} activeOpacity={0.85}>
                <LinearGradient colors={[C.p1, C.p2]} style={s.trackGradient}>
                  <Navigation size={sc(14)} color={C.white} fill={C.white} />
                  <Text style={s.trackBtnText}>Track Expert</Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}

          {item.status === "Completed" && (
            <>
              <View style={s.statusBadgeSuccess}>
                <CheckCircle2
                  size={sc(14)}
                  color="#059669"
                  fill="rgba(5, 150, 105, 0.1)"
                />
                <Text style={s.statusBadgeTextSuccess}>Completed</Text>
              </View>
              <TouchableOpacity style={s.rebookBtn} activeOpacity={0.7}>
                <RotateCcw size={sc(14)} color={C.p2} />
                <Text style={s.rebookBtnText}>Rebook Service</Text>
              </TouchableOpacity>
            </>
          )}

          {item.status === "Cancelled" && (
            <>
              <View style={s.statusBadgeError}>
                <XCircle
                  size={sc(14)}
                  color="#DC2626"
                  fill="rgba(220, 38, 38, 0.1)"
                />
                <Text style={s.statusBadgeTextError}>Cancelled</Text>
              </View>
              <TouchableOpacity style={s.rebookBtn} activeOpacity={0.7}>
                <Text style={s.rebookBtnText}>Try Again</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </BlurView>
    </View>
  );

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
            {["Upcoming", "Completed", "Cancelled"].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  activeOpacity={0.8}
                  style={[s.tabItem, isActive && s.tabItemActive]}
                >
                  <Text style={[s.tabText, isActive && s.tabTextActive]}>
                    {tab}
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

  // Custom Smooth Tab Bar
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

  cardDivider: {
    height: 1,
    backgroundColor: "rgba(232, 229, 255, 0.8)",
    marginBottom: 16,
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

  // Semantic Badges
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

  // Polished Empty State UI
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
