import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  FileText,
  MapPin,
  Play,
  User,
  XCircle,
} from "lucide-react-native";
import { useEffect, useState } from "react";
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
import { router } from "expo-router";
import ProBottomTab from "../components/ProBottomTab";
import { SESSION_KEY } from "../services/session";
import { supabase } from "../services/supabase";
import { createNotificationEvent } from "../services/supabaseBookingService";

const { width, height } = Dimensions.get("window");
const sc = (n) => (width / 390) * n;

const C = {
  p1: "#8C7FFF",
  p2: "#5B4CF0",
  p3: "#3D2EC0",
  white: "#FFFFFF",
  inputBg: "#F4F2FF",
  inputBorder: "#E8E5FF",
  labelGray: "#8B8BA7",
  textDark: "#1A1740",
  textMuted: "#B0B0C8",
};

export default function ProHistoryScreen() {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");

  const toLabelCase = (value) =>
    String(value || "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const formatDate = (dateStr) => {
    if (!dateStr) return "Scheduled date";
    const parts = String(dateStr).split("-");
    if (parts.length !== 3) return String(dateStr);
    const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  useEffect(() => {
    let mounted = true;
    let channel;

    const load = async () => {
      try {
        setLoading(true);
        const raw = await AsyncStorage.getItem(SESSION_KEY);
        const session = raw ? JSON.parse(raw) : null;
        const uid = session?.uid || "";

        if (!uid) {
          if (mounted) setJobs([]);
          return;
        }

        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("professional_id", uid)
          .in("status", ["accepted", "completed", "rejected"])
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (mounted) setJobs(data || []);

        if (!channel) {
          channel = supabase
            .channel(`pro-history-${uid}`)
            .on(
              "postgres_changes",
              { event: "*", schema: "public", table: "bookings", filter: `professional_id=eq.${uid}` },
              () => load()
            )
            .subscribe();
        }
      } catch (error) {
        console.error("History fetch failed:", error);
        import('react-native').then(rn => rn.Alert.alert("History Error", error?.message || JSON.stringify(error)));
        if (mounted) setJobs([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const filteredJobs = jobs.filter((job) => {
    if (activeTab === "Upcoming") return job.status === "accepted";
    if (activeTab === "Completed") return job.status === "completed";
    return job.status === "rejected";
  });

  const handleDeclineUpcoming = async (job) => {
    try {
      setActionLoadingId(String(job.id));
      const { error } = await supabase
        .from("bookings")
        .update({ status: "rejected" })
        .eq("id", job.id);
      if (error) throw error;

      await createNotificationEvent({
        recipientId: job.client_id,
        eventType: "job_declined",
        title: "Your booking was declined",
        body: `Professional declined booking UC-${job.id}.`,
        bookingId: job.id,
      });

      setJobs((prev) =>
        prev.map((x) => (x.id === job.id ? { ...x, status: "rejected" } : x))
      );
    } catch (e) {
      console.error("Decline failed:", e);
    } finally {
      setActionLoadingId("");
    }
  };

  const renderHistoryCard = (job) => {
    const isUpcoming = job.status === "accepted";
    const isCompleted = job.status === "completed";
    const statusLabel = toLabelCase(job.status);

    return (
      <View key={String(job.id)} style={s.cardOuterWrapper}>
        <BlurView intensity={Platform.OS === "ios" ? 45 : 95} tint="light" style={s.jobGlassCard}>
          <View style={s.cardHeaderRow}>
            <View>
              <View style={s.jobTypeTag}>
                <Text style={s.jobTypeTagText}>{statusLabel}</Text>
              </View>
              <Text style={s.serviceTitleText}>{toLabelCase(job.service_type)} Service</Text>
              <View style={s.clientMetaRow}>
                <User size={12} color={C.labelGray} />
                <Text style={s.clientNameText}>Client: {job.client_id || "Client"}</Text>
              </View>
            </View>
            <View style={s.payoutContainer}>
              <Text style={s.payoutText}>#{job.id}</Text>
              <Text style={s.jobIdText}>UC-{job.id}</Text>
            </View>
          </View>

          <View style={s.logisticsGroup}>
            <View style={s.logisticItemRow}>
              <View style={s.iconBadgeFrame}>
                <Calendar size={13} color={C.p2} />
              </View>
              <Text style={s.logisticText}>
                {formatDate(job.scheduled_date)} | {job.scheduled_time || "Time TBD"}
              </Text>
            </View>
            <View style={s.logisticItemRow}>
              <View style={s.iconBadgeFrame}>
                <MapPin size={13} color={C.p2} />
              </View>
              <Text style={s.logisticText} numberOfLines={1}>
                Address shared by client
              </Text>
            </View>
          </View>

          <View style={s.cardDividerLine} />

          <View style={s.cardStatusFooter}>
            {isCompleted ? (
              <View style={s.badgeSuccessFrame}>
                <CheckCircle2 size={14} color="#047857" />
                <Text style={s.badgeSuccessText}>Job completed successfully</Text>
              </View>
            ) : (
              <View style={s.badgeErrorFrame}>
                {isUpcoming ? <CheckCircle2 size={14} color={C.p2} /> : <XCircle size={14} color="#B91C1C" />}
                <View style={{ flex: 1 }}>
                  <Text style={s.badgeErrorText}>{statusLabel}</Text>
                  <Text style={s.reasonNoteText}>{job.notes || "No extra notes"}</Text>
                </View>
              </View>
            )}
          </View>
          {isUpcoming ? (
            <View style={s.upcomingActionsRow}>
              <TouchableOpacity
                style={s.startBtn}
                activeOpacity={0.8}
                onPress={() =>
                  router.push({
                    pathname: "/pro-job-execution",
                    params: {
                      jobId: String(job.id),
                      customerName: job.clientName || job.customer_name || "Customer",
                    },
                  })
                }
              >
                <Play size={14} color="#fff" />
                <Text style={s.startBtnText}>Start Job</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.declineBtn}
                activeOpacity={0.8}
                onPress={() => handleDeclineUpcoming(job)}
                disabled={actionLoadingId === String(job.id)}
              >
                <XCircle size={14} color="#fff" />
                <Text style={s.declineBtnText}>
                  {actionLoadingId === String(job.id) ? "Declining..." : "Decline Job"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.detailBtn}
                activeOpacity={0.8}
                onPress={() =>
                  router.push({
                    pathname: "/pro-job-detail",
                    params: { bookingId: String(job.id) },
                  })
                }
              >
                <FileText size={14} color={C.p2} />
                <Text style={s.detailBtnText}>Full Detail</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </BlurView>
      </View>
    );
  };

  return (
    <View style={s.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <LinearGradient colors={["#F4F3FF", "#FDFDFF"]} style={StyleSheet.absoluteFill} />

      <View style={[s.glowOrb, { top: -sc(20), right: -sc(40), backgroundColor: "rgba(140, 127, 255, 0.15)" }]} />
      <View style={[s.glowOrb, { bottom: height * 0.15, left: -sc(50), backgroundColor: "rgba(91, 76, 240, 0.1)" }]} />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={s.header}>
          <Text style={s.headerTitleText}>Job History</Text>
        </View>

        <View style={s.tabContainer}>
          <View style={s.tabBarBackground}>
            {["Upcoming", "Completed", "Declined"].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
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
          {loading ? (
            <View style={s.emptyStateBox}>
              <Text style={s.emptyStateTitle}>Loading jobs...</Text>
            </View>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map(renderHistoryCard)
          ) : (
            <View style={s.emptyStateBox}>
              <View style={s.emptyIconWrapper}>
                <Briefcase size={sc(32)} color={C.textMuted} />
              </View>
              <Text style={s.emptyStateTitle}>No jobs inside {activeTab.toLowerCase()}</Text>
              <Text style={s.emptyStateSub}>Live status updates for your jobs will appear here automatically.</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
      <ProBottomTab />
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
    opacity: 0.8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 10 : 20,
    marginBottom: 10,
  },
  headerTitleText: {
    fontSize: sc(26),
    fontWeight: "900",
    color: C.textDark,
    letterSpacing: -0.6,
  },
  tabContainer: { paddingHorizontal: 24, marginBottom: 15 },
  tabBarBackground: {
    flexDirection: "row",
    backgroundColor: "rgba(244, 242, 255, 0.7)",
    borderRadius: 20,
    padding: 5,
    borderWidth: 1,
    borderColor: "rgba(232, 229, 255, 0.6)",
  },
  tabItem: { flex: 1, paddingVertical: 11, alignItems: "center", borderRadius: 15 },
  tabItemActive: {
    backgroundColor: C.white,
    elevation: 4,
    shadowColor: C.p2,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  tabItemText: { fontSize: sc(13), fontWeight: "700", color: C.textMuted },
  tabItemTextActive: { color: C.p2, fontWeight: "800" },
  scrollArea: { paddingHorizontal: 24, paddingBottom: 120, paddingTop: 5 },
  cardOuterWrapper: {
    marginBottom: 15,
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
  jobGlassCard: { padding: 18, backgroundColor: "rgba(255, 255, 255, 0.45)" },
  cardHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  jobTypeTag: {
    backgroundColor: "rgba(91, 76, 240, 0.06)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "rgba(91, 76, 240, 0.1)",
  },
  jobTypeTagText: { fontSize: 9, fontWeight: "800", color: C.p2, textTransform: "uppercase", letterSpacing: 0.3 },
  serviceTitleText: { fontSize: sc(15), fontWeight: "900", color: C.textDark, letterSpacing: -0.2 },
  clientMetaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  clientNameText: { fontSize: sc(13), color: C.labelGray, fontWeight: "600" },
  payoutContainer: { alignItems: "flex-end" },
  payoutText: { fontSize: sc(16), fontWeight: "900", color: C.textDark, letterSpacing: -0.3 },
  jobIdText: { fontSize: 10, fontWeight: "700", color: C.textMuted, marginTop: 2, textTransform: "uppercase" },
  logisticsGroup: { gap: 10, marginVertical: 15 },
  logisticItemRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconBadgeFrame: {
    width: sc(26),
    height: sc(26),
    borderRadius: 8,
    backgroundColor: C.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.inputBorder,
  },
  logisticText: { fontSize: sc(13), color: C.textDark, fontWeight: "600", opacity: 0.85 },
  cardDividerLine: { height: 1, backgroundColor: "rgba(232, 229, 255, 0.7)", marginBottom: 14 },
  cardStatusFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  badgeSuccessFrame: {
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
  badgeSuccessText: { color: "#047857", fontWeight: "800", fontSize: sc(11) },
  badgeErrorFrame: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FCA5A5",
    flex: 1,
  },
  badgeErrorText: { color: "#B91C1C", fontWeight: "800", fontSize: sc(11), textTransform: "capitalize" },
  reasonNoteText: { color: "#EF4444", fontSize: 10, fontWeight: "600", marginTop: 2 },
  upcomingActionsRow: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  startBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: C.p2,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  declineBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#DC2626",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  detailBtn: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: C.inputBorder,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  startBtnText: { color: "#fff", fontSize: sc(12), fontWeight: "800" },
  declineBtnText: { color: "#fff", fontSize: sc(12), fontWeight: "800" },
  detailBtnText: { color: C.p2, fontSize: sc(12), fontWeight: "800" },
  emptyStateBox: { paddingVertical: height * 0.12, alignItems: "center", paddingHorizontal: 36 },
  emptyIconWrapper: {
    width: sc(64),
    height: sc(64),
    borderRadius: 22,
    backgroundColor: C.inputBg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.inputBorder,
  },
  emptyStateTitle: { fontSize: sc(16), fontWeight: "800", color: C.textDark },
  emptyStateSub: { fontSize: sc(12), color: C.labelGray, textAlign: "center", marginTop: 6, lineHeight: 18, fontWeight: "500" },
});
