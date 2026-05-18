import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { CheckCircle2, ChevronLeft, CreditCard, Lock, ShieldCheck } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { supabase } from "../services/supabase";

const { width, height } = Dimensions.get("window");
const sc = (n) => (width / 390) * n;

const C = {
  p1: "#8C7FFF",
  p2: "#5B4CF0",
  p3: "#3D2EC0",
  textDark: "#1A1740",
  textMuted: "#B0B0C8",
  white: "#FFFFFF",
  bg1: "#F4F3FF",
  success: "#10B981",
  glassBorder: "rgba(255,255,255,0.7)",
  labelGray: "#8B8BA7",
};

export default function ClientInvoiceScreen() {
  const { bookingId } = useLocalSearchParams();
  const [status, setStatus] = useState("loading"); // loading, waiting, otp_pending, invoice, paid
  const [otp, setOtp] = useState("");
  const [invoiceData, setInvoiceData] = useState(null);
  const [showPaymentDemo, setShowPaymentDemo] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("processing"); // processing, success

  useEffect(() => {
    if (!bookingId) {
      setStatus("waiting");
      return;
    }

    const checkStatus = async () => {
      try {
        const localStatus = await AsyncStorage.getItem(`booking_status_${bookingId}`);
        if (localStatus === 'otp_pending') {
          const generatedOtp = await AsyncStorage.getItem(`booking_otp_${bookingId}`);
          setOtp(generatedOtp || "1234");
          setStatus("otp_pending");
        } else if (localStatus === 'completed_pro_side') {
          const payloadStr = await AsyncStorage.getItem(`job_completion_${bookingId}`);
          if (payloadStr) {
            setInvoiceData(JSON.parse(payloadStr));
          }
          setStatus("invoice");
        } else if (localStatus === 'paid') {
          setStatus("paid");
        } else {
          setStatus("waiting");
        }
      } catch (e) {
        console.error(e);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 2000);
    return () => clearInterval(interval);
  }, [bookingId]);

  const handlePayNow = (grandTotal) => {
    setShowPaymentDemo(true);
    setPaymentStatus("processing");

    // Simulate payment processing
    setTimeout(async () => {
      setPaymentStatus("success");

      // Update local state
      await AsyncStorage.setItem(`booking_status_${bookingId}`, 'paid');

      // Update actual database status
      try {
        await supabase.from("bookings").update({ status: 'completed' }).eq('id', bookingId);
      } catch (err) {
        console.log("DB update failed, but local state updated", err);
      }

      setTimeout(() => {
        setShowPaymentDemo(false);
        router.replace({ pathname: "/review", params: { bookingId, amountPaid: grandTotal } });
      }, 2000);
    }, 2500);
  };

  const renderTopBar = (title) => (
    <View style={s.header}>
      <TouchableOpacity style={s.circleBtn} activeOpacity={0.8} onPress={() => router.back()}>
        <ChevronLeft size={sc(20)} color={C.textDark} strokeWidth={2.5} />
      </TouchableOpacity>
      <Text style={s.headerTitle}>{title}</Text>
      <View style={[s.circleBtn, { opacity: 0 }]} />
    </View>
  );

  const parsePrice = (priceStr) => parseInt(String(priceStr).replace(/[^0-9]/g, ""), 10) || 0;

  if (status === "loading") {
    return (
      <View style={[s.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={C.p2} />
      </View>
    );
  }

  if (status === "waiting") {
    return (
      <View style={s.container}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
          {renderTopBar("Job Status")}
          <View style={s.centerBox}>
            <ClockIcon />
            <Text style={s.mainMsg}>Job in Progress</Text>
            <Text style={s.subMsg}>The professional is currently working on your request. You will receive an OTP once they finish.</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (status === "otp_pending") {
    return (
      <View style={s.container}>
        <StatusBar barStyle="dark-content" />
        <LinearGradient colors={["#F4F3FF", "#FDFDFF"]} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={{ flex: 1 }}>
          {renderTopBar("OTP Verification")}
          <ScrollView contentContainerStyle={s.scrollArea}>
            <View style={s.otpCard}>
              <View style={s.iconWrap}>
                <Lock size={sc(32)} color={C.p2} />
              </View>
              <Text style={s.otpTitle}>Share this OTP</Text>
              <Text style={s.otpSub}>The professional has marked the job as done. Please verify the work and share this OTP to complete the service.</Text>

              <View style={s.otpBox}>
                <Text style={s.otpText}>{otp}</Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  if (status === "invoice" && invoiceData) {
    const allTasks = invoiceData.checklist || [];
    const completedTasks = invoiceData.completedTasks || [];
    const unfixedTasks = allTasks.filter(t => !completedTasks.find(c => c.id === t.id));

    const subtotal = completedTasks.reduce((sum, t) => sum + parsePrice(t.price), 0);
    const tax = Math.round(subtotal * 0.18);
    const grandTotal = subtotal + tax;

    return (
      <View style={s.container}>
        <StatusBar barStyle="dark-content" />
        <LinearGradient colors={["#F4F3FF", "#FDFDFF"]} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={{ flex: 1 }}>
          {renderTopBar("Service Invoice")}
          <ScrollView contentContainerStyle={s.scrollArea}>
            <View style={s.invoiceCard}>
              <Text style={s.sectionTitle}>Completed Work ({completedTasks.length})</Text>
              {completedTasks.length > 0 ? completedTasks.map((t, i) => (
                <View key={i} style={s.taskRow}>
                  <CheckCircle2 size={sc(16)} color={C.success} />
                  <Text style={s.taskText}>{t.label}</Text>
                  <Text style={s.taskPrice}>{t.price}</Text>
                </View>
              )) : (
                <Text style={s.emptyTaskTxt}>No tasks were marked as completed.</Text>
              )}

              {unfixedTasks.length > 0 && (
                <>
                  <View style={s.divider} />
                  <Text style={[s.sectionTitle, { color: '#EF4444' }]}>Unfixed/Remaining Work ({unfixedTasks.length})</Text>
                  {unfixedTasks.map((t, i) => (
                    <View key={i} style={s.taskRow}>
                      <View style={s.unfixedDot} />
                      <Text style={[s.taskText, { color: C.labelGray, textDecorationLine: 'line-through' }]}>{t.label}</Text>
                      <Text style={[s.taskPrice, { color: C.labelGray }]}>{t.price}</Text>
                    </View>
                  ))}
                  <Text style={s.noteTxt}>* You are not charged for unfixed items.</Text>
                </>
              )}

              <View style={s.billSection}>
                <View style={s.billRow}>
                  <Text style={s.billLabel}>Subtotal</Text>
                  <Text style={s.billVal}>₹{subtotal}</Text>
                </View>
                <View style={s.billRow}>
                  <Text style={s.billLabel}>GST (18%)</Text>
                  <Text style={s.billVal}>₹{tax}</Text>
                </View>
                <View style={s.totalRow}>
                  <Text style={s.totalLabel}>Total Payable</Text>
                  <Text style={s.totalVal}>₹{grandTotal}</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={s.bottomCta}>
            <TouchableOpacity style={s.payBtn} activeOpacity={0.85} onPress={() => handlePayNow(grandTotal)}>
              <LinearGradient colors={[C.p1, C.p2]} style={s.payBtnGrad}>
                <CreditCard size={sc(18)} color={C.white} />
                <Text style={s.payBtnTxt}>Pay ₹{grandTotal}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* MOCK PAYMENT MODAL */}
        <Modal visible={showPaymentDemo} transparent animationType="fade">
          <View style={s.modalOverlay}>
            <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={s.paymentModal}>
              {paymentStatus === "processing" ? (
                <>
                  <ActivityIndicator size="large" color={C.p2} />
                  <Text style={s.paymentTitle}>Processing Payment</Text>
                  <Text style={s.paymentSub}>Securely connecting to bank gateway...</Text>
                </>
              ) : (
                <>
                  <ShieldCheck size={sc(60)} color={C.success} />
                  <Text style={s.paymentTitle}>Payment Successful!</Text>
                  <Text style={s.paymentSub}>Thank you. Your booking is now complete.</Text>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  if (status === "paid") {
    return (
      <View style={[s.container, { justifyContent: "center", alignItems: "center" }]}>
        <CheckCircle2 size={sc(60)} color={C.success} />
        <Text style={[s.headerTitle, { marginTop: 20 }]}>Job Completed!</Text>
        <Text style={[s.subMsg, { textAlign: 'center', marginHorizontal: 40 }]}>The payment is done and the professional has finished their job.</Text>
        <TouchableOpacity style={[s.circleBtn, { width: 'auto', paddingHorizontal: 20, marginTop: 30 }]} onPress={() => router.back()}>
          <Text style={s.headerTitle}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
}

const ClockIcon = () => (
  <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(91, 76, 240, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
    <Text style={{ fontSize: 24 }}>⏳</Text>
  </View>
);

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: sc(24),
    paddingTop: sc(12),
    marginBottom: sc(12),
  },
  circleBtn: {
    width: sc(40),
    height: sc(40),
    borderRadius: sc(14),
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: "rgba(232,229,255,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: sc(17),
    fontWeight: "900",
    color: C.textDark,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: sc(40),
  },
  mainMsg: {
    fontSize: sc(20),
    fontWeight: "900",
    color: C.textDark,
    marginBottom: sc(8),
  },
  subMsg: {
    fontSize: sc(14),
    color: C.labelGray,
    textAlign: "center",
    lineHeight: sc(20),
  },
  scrollArea: {
    paddingHorizontal: sc(20),
    paddingBottom: sc(100),
  },
  otpCard: {
    backgroundColor: C.white,
    borderRadius: sc(24),
    padding: sc(30),
    alignItems: "center",
    shadowColor: C.p3,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
    marginTop: sc(20),
  },
  iconWrap: {
    width: sc(70),
    height: sc(70),
    borderRadius: sc(35),
    backgroundColor: "rgba(91,76,240,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: sc(20),
  },
  otpTitle: {
    fontSize: sc(22),
    fontWeight: "900",
    color: C.textDark,
    marginBottom: sc(8),
  },
  otpSub: {
    fontSize: sc(13),
    color: C.labelGray,
    textAlign: "center",
    lineHeight: sc(20),
    marginBottom: sc(30),
  },
  otpBox: {
    backgroundColor: "#F8F7FF",
    borderWidth: 2,
    borderColor: C.p2,
    borderRadius: sc(16),
    paddingHorizontal: sc(40),
    paddingVertical: sc(16),
  },
  otpText: {
    fontSize: sc(32),
    fontWeight: "900",
    letterSpacing: 12,
    color: C.p2,
  },
  invoiceCard: {
    backgroundColor: C.white,
    borderRadius: sc(24),
    padding: sc(20),
    shadowColor: C.p3,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
    marginTop: sc(10),
  },
  sectionTitle: {
    fontSize: sc(13),
    fontWeight: "900",
    color: C.p2,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: sc(16),
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: sc(12),
  },
  unfixedDot: {
    width: sc(8),
    height: sc(8),
    borderRadius: sc(4),
    backgroundColor: '#EF4444',
    marginHorizontal: sc(4),
  },
  taskText: {
    flex: 1,
    fontSize: sc(14),
    fontWeight: "600",
    color: C.textDark,
    marginLeft: sc(10),
  },
  taskPrice: {
    fontSize: sc(14),
    fontWeight: "800",
    color: C.textDark,
  },
  emptyTaskTxt: {
    fontSize: sc(13),
    color: C.labelGray,
    fontStyle: 'italic',
    marginBottom: sc(10),
  },
  divider: {
    height: 1,
    backgroundColor: C.glassBorder,
    marginVertical: sc(20),
  },
  noteTxt: {
    fontSize: sc(11),
    color: '#EF4444',
    marginTop: sc(4),
    fontStyle: 'italic',
  },
  billSection: {
    backgroundColor: "#F8F7FF",
    borderRadius: sc(16),
    padding: sc(16),
    marginTop: sc(20),
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: sc(10),
  },
  billLabel: {
    fontSize: sc(13),
    color: C.labelGray,
    fontWeight: "600",
  },
  billVal: {
    fontSize: sc(13),
    color: C.textDark,
    fontWeight: "700",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: sc(10),
    paddingTop: sc(10),
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  totalLabel: {
    fontSize: sc(15),
    fontWeight: "900",
    color: C.textDark,
  },
  totalVal: {
    fontSize: sc(18),
    fontWeight: "900",
    color: C.p2,
  },
  bottomCta: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: sc(24),
    paddingBottom: Platform.OS === 'ios' ? sc(34) : sc(24),
    paddingTop: sc(14),
    backgroundColor: C.white,
    borderTopWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  payBtn: {
    borderRadius: sc(16),
    overflow: "hidden",
  },
  payBtnGrad: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: sc(16),
    gap: sc(10),
  },
  payBtnTxt: {
    color: C.white,
    fontSize: sc(16),
    fontWeight: "900",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  paymentModal: {
    width: width * 0.8,
    backgroundColor: C.white,
    borderRadius: sc(24),
    padding: sc(30),
    alignItems: "center",
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  paymentTitle: {
    fontSize: sc(18),
    fontWeight: "900",
    color: C.textDark,
    marginTop: sc(20),
    marginBottom: sc(8),
  },
  paymentSub: {
    fontSize: sc(13),
    color: C.labelGray,
    textAlign: "center",
  }
});
