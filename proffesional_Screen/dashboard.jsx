import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
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
import ProBottomTab from "../components/ProBottomTab";
import { supabase } from "../services/supabase";
import { SESSION_KEY } from "../services/session";
import { createNotificationEvent } from "../services/supabaseBookingService";

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

export default function ProWorkerDashboard() {
  const [isOnline, setIsOnline] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [assignedJobs, setAssignedJobs] = useState([]);
  const [proName, setProName] = useState("Professional");
  const [proUserId, setProUserId] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState("");

  const [earnings, setEarnings] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  const getPrimaryImageUrl = (rawValue) => {
    if (!rawValue) return "";
    if (Array.isArray(rawValue)) return rawValue[0] || "";
    if (typeof rawValue !== "string") return "";
    const trimmed = rawValue.trim();
    if (!trimmed) return "";
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed[0] || "";
    } catch {}
    return trimmed.split(",").map((x) => x.trim()).filter(Boolean)[0] || "";
  };

  const normalizeType = (value) =>
    String(value || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "");

  const toServiceKey = (value) => {
    const normalized = normalizeType(value);
    const aliases = {
      plumbing: "plumber",
      plumber: "plumber",
      electrical: "electrician",
      electrician: "electrician",
      acrepair: "mechanic",
      acservice: "mechanic",
      cleaning: "cleaner",
      cleaner: "cleaner",
      painting: "painter",
      painter: "painter",
    };
    return aliases[normalized] || normalized;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Scheduled date";
    const parts = String(dateStr).split("-");
    if (parts.length !== 3) return String(dateStr);
    const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  useEffect(() => {
    const loadAssignedJobs = async () => {
      try {
        setLoadingJobs(true);
        const raw = await AsyncStorage.getItem(SESSION_KEY);
        if (!raw) {
          setAssignedJobs([]);
          return;
        }

        const session = JSON.parse(raw);
        const userId = session?.uid;
        if (!userId) {
          setAssignedJobs([]);
          return;
        }
        setProUserId(userId);

        const { data: profileData } = await supabase
          .from("profiles")
          .select("name, service_type")
          .eq("id", userId)
          .maybeSingle();

        if (profileData?.name) setProName(profileData.name);
        const proTypeKey = toServiceKey(profileData?.service_type);

        const { data: proStats } = await supabase
          .from("professional_profiles")
          .select("total_earnings, average_rating, review_count")
          .eq("user_id", userId)
          .maybeSingle();

        if (proStats) {
          setEarnings(Number(proStats.total_earnings) || 0);
          setAvgRating(Number(proStats.average_rating) || 0);
          setCompletedCount(Number(proStats.review_count) || 0);
        }

        const { data: bookingsData, error: bookingsError } = await supabase
          .from("bookings")
          .select("*")
          .eq("status", "pending")
          .order("created_at", { ascending: false });

        if (bookingsError) throw bookingsError;

        const mapped = (bookingsData || [])
          .filter((b) => b?.status === "pending")
          .map((b) => ({
            id: String(b.id),
            customer: b.client_id || "Client",
            service: `${(b.service_type || "service").toString().replace(/\b\w/g, (c) => c.toUpperCase())} Service`,
            payout: SERVICE_PRICES[b.service_type] || "₹499",
            time: `${b.scheduled_time || "Time TBD"} (${formatDate(b.scheduled_date)})`,
            address: "Address shared by client",
            type: b.status === "accepted" ? "Accepted Job" : "New Request",
            status: b.status,
            notes: b.notes || "",
            imageUrl: getPrimaryImageUrl(b.image_url),
            serviceType: b.service_type || "",
            scheduledDate: b.scheduled_date || "",
            scheduledTime: b.scheduled_time || "",
            bookingId: b.id,
          }));

        setAssignedJobs(mapped);
      } catch (error) {
        console.error("Failed loading professional dashboard jobs:", error);
        setAssignedJobs([]);
      } finally {
        setLoadingJobs(false);
      }
    };

    loadAssignedJobs();
  }, []);

  const handleAcceptJob = async (job) => {
    try {
      if (!proUserId) return;
      setActionLoadingId(String(job.bookingId));
      const { error } = await supabase
        .from("bookings")
        .update({
          status: "accepted",
          professional_id: proUserId,
        })
        .eq("id", job.bookingId);
      if (error) throw error;
      await createNotificationEvent({
        recipientId: job.customer,
        eventType: "job_accepted",
        title: "Your booking was accepted",
        body: `Professional accepted booking UC-${job.bookingId}.`,
        bookingId: job.bookingId,
      });
      setAssignedJobs((prev) => prev.filter((j) => j.bookingId !== job.bookingId));
    } catch (error) {
      Alert.alert("Action Failed", error?.message || "Could not accept this booking.");
    } finally {
      setActionLoadingId("");
    }
  };

  const handleDeclineJob = async (job) => {
    try {
      setActionLoadingId(String(job.bookingId));
      const { error } = await supabase
        .from("bookings")
        .update({ status: "rejected" })
        .eq("id", job.bookingId);
      if (error) throw error;
      await createNotificationEvent({
        recipientId: job.customer,
        eventType: "job_declined",
        title: "Your booking was declined",
        body: `Professional declined booking UC-${job.bookingId}.`,
        bookingId: job.bookingId,
      });
      setAssignedJobs((prev) => prev.filter((j) => j.bookingId !== job.bookingId));
    } catch (error) {
      Alert.alert("Action Failed", error?.message || "Could not decline this booking.");
    } finally {
      setActionLoadingId("");
    }
  };

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
            <Text style={s.proNameText}>{proName}</Text>
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
                  <Text style={s.earningsLabel}>Total Earnings</Text>
                  <Text style={s.earningsValue}>₹{Number(earnings).toLocaleString('en-IN')}</Text>
                </View>
                <View style={s.trendBadge}>
                  <TrendingUp size={sc(12)} color={C.success} style={{ marginRight: 4 }} />
                  <Text style={s.trendText}>Live</Text>
                </View>
              </View>
              
              <View style={s.metricsDivider} />

              <View style={s.subStatsGrid}>
                <View style={s.subStatItem}>
                  <View style={s.miniStatIconBox}><CheckCircle2 size={14} color={C.p2} /></View>
                  <Text style={s.subStatVal}>{completedCount}</Text>
                  <Text style={s.subStatLabel}>Jobs Rated</Text>
                </View>
                <View style={s.verticalDivider} />
                <View style={s.subStatItem}>
                  <View style={s.miniStatIconBox}><Sparkles size={14} color="#F59E0B" fill="rgba(245,158,11,0.1)" /></View>
                  <Text style={s.subStatVal}>{Number(avgRating).toFixed(1)} ★</Text>
                  <Text style={s.subStatLabel}>Avg Rating</Text>
                </View>
              </View>
            </BlurView>
          </View>

          {/* BOOKINGS LIST VIEW */}
          <SectionLabel label="Assigned Schedule" value={`${assignedJobs.length} Bookings Remaining`} />

          {loadingJobs ? (
            <View style={{ paddingVertical: 30, alignItems: "center" }}>
              <ActivityIndicator size="small" color={C.p2} />
              <Text style={{ marginTop: 8, color: C.labelGray, fontWeight: "700" }}>Loading bookings...</Text>
            </View>
          ) : isOnline ? (
            assignedJobs.length > 0 ? assignedJobs.map((job) => (
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
                  {job.imageUrl ? (
                    <Image source={{ uri: job.imageUrl }} style={s.jobImage} resizeMode="cover" />
                  ) : null}
                  <TouchableOpacity
                    style={s.fullDetailBtn}
                    activeOpacity={0.8}
                    onPress={() => setSelectedJob(job)}
                  >
                    <Text style={s.fullDetailBtnText}>Full Detail</Text>
                  </TouchableOpacity>
                  {job.status === "accepted" ? (
                    <TouchableOpacity
                      style={[s.fullDetailBtn, { marginLeft: 8 }]}
                      activeOpacity={0.8}
                      onPress={() => router.push({ pathname: "/pro-chat", params: { bookingId: String(job.bookingId) } })}
                    >
                      <Text style={s.fullDetailBtnText}>Chat</Text>
                    </TouchableOpacity>
                  ) : null}

                  <View style={s.cardDividerLine} />

                  {/* Operational Interactive Action Row */}
                  <View style={s.cardActionsRow}>
                    <TouchableOpacity
                      style={s.rejectBtn}
                      activeOpacity={0.7}
                      onPress={() => handleDeclineJob(job)}
                      disabled={actionLoadingId === String(job.bookingId)}
                    >
                      <XCircle size={15} color="#EF4444" style={{ marginRight: 6 }} />
                      <Text style={s.rejectBtnText}>Decline</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={s.acceptBtn}
                      activeOpacity={0.85}
                      onPress={() => handleAcceptJob(job)}
                      disabled={actionLoadingId === String(job.bookingId)}
                    >
                      <LinearGradient colors={[C.p1, C.p2]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.acceptGradient}>
                        <Text style={s.acceptBtnText}>
                          {actionLoadingId === String(job.bookingId) ? "Updating..." : "Accept"}
                        </Text>
                        <ChevronRight size={14} color={C.white} strokeWidth={2.5} />
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>

                </BlurView>
              </View>
            )) : (
              <View style={s.offlinePlaceholderState}>
                <View style={s.emptyIconBoundary}>
                  <Briefcase size={sc(32)} color={C.textMuted} />
                </View>
                <Text style={s.offlineStateTitle}>No bookings yet</Text>
                <Text style={s.offlineStateSub}>When clients create matching bookings, they will appear here automatically.</Text>
              </View>
            )
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
      <Modal visible={Boolean(selectedJob)} transparent animationType="fade" onRequestClose={() => setSelectedJob(null)}>
        <View style={s.modalBackdrop}>
          <View style={s.modalCard}>
            <Text style={s.modalTitle}>Booking Full Detail</Text>
            <Text style={s.modalLine}>ID: UC-{selectedJob?.bookingId}</Text>
            <Text style={s.modalLine}>Service: {selectedJob?.service}</Text>
            <Text style={s.modalLine}>Status: {(selectedJob?.status || "").toUpperCase()}</Text>
            <Text style={s.modalLine}>Client: {selectedJob?.customer}</Text>
            <Text style={s.modalLine}>Date: {selectedJob?.scheduledDate}</Text>
            <Text style={s.modalLine}>Time: {selectedJob?.scheduledTime}</Text>
            <Text style={s.modalLine}>Address: {selectedJob?.address}</Text>
            <Text style={s.modalLine}>Issue: {selectedJob?.notes || "No extra notes"}</Text>
            {selectedJob?.imageUrl ? (
              <Image source={{ uri: selectedJob.imageUrl }} style={s.modalImage} resizeMode="cover" />
            ) : null}
            <TouchableOpacity style={s.modalCloseBtn} onPress={() => setSelectedJob(null)} activeOpacity={0.8}>
              <Text style={s.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <ProBottomTab />
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
  jobImage: { width: "100%", height: sc(120), borderRadius: 12, marginBottom: 10 },
  fullDetailBtn: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(91, 76, 240, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(91, 76, 240, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    marginBottom: 10,
  },
  fullDetailBtnText: { color: C.p2, fontWeight: "800", fontSize: sc(12) },
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
  offlineStateSub: { fontSize: sc(12), color: C.labelGray, textAlign: "center", marginTop: 6, lineHeight: 18, fontWeight: "500" },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
  },
  modalTitle: { fontSize: sc(16), fontWeight: "900", color: C.textDark, marginBottom: 8 },
  modalLine: { fontSize: sc(12), color: C.textDark, marginBottom: 4, fontWeight: "600" },
  modalImage: { width: "100%", height: sc(160), borderRadius: 12, marginTop: 8 },
  modalCloseBtn: {
    marginTop: 12,
    backgroundColor: C.p2,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  modalCloseText: { color: "#fff", fontWeight: "800" },
});

