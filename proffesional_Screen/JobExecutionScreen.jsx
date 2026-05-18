import React, { useEffect, useMemo, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { supabase } from "../services/supabase";
import { createNotificationEvent } from "../services/supabaseBookingService";
import {
  Camera,
  Check,
  ChevronLeft,
  Clock,
  FileText,
  Play,
  Plus,
  ShieldCheck,
  Square,
  X,
} from "lucide-react-native";
import ProBottomTab from "../components/ProBottomTab";

const { width, height } = Dimensions.get("window");
const sc = (n) => (width / 390) * n;
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

const CHECKLIST_TEMPLATE = [
  { id: "1", label: "Site safety and electrical isolation confirmed" },
  { id: "2", label: "Root cause diagnosed and explained to customer" },
  { id: "3", label: "Faulty part/service action completed" },
  { id: "4", label: "Functional testing completed successfully" },
  { id: "5", label: "Customer walkthrough and final confirmation done" },
];

const pad = (n) => String(n).padStart(2, "0");

export default function JobExecutionScreen({
  jobId = "WF-240871",
  customerName = "Aarav Patel",
  onBack,
  onSubmit,
  showBottomTab = true,
}) {
  const params = useLocalSearchParams();
  const activeJobId = String(params?.jobId || jobId);
  const activeCustomerName = String(params?.customerName || customerName);

  const initialChecklist = useMemo(() => {
    try {
      if (params?.checklistItems) {
        const parsed = JSON.parse(params.checklistItems);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item, index) => ({
            id: String(item.id || index),
            label: item.title || item.label || "Service Task",
            price: item.price || "₹0",
            done: false
          }));
        }
      }
    } catch (e) {}
    return CHECKLIST_TEMPLATE.map(item => ({ ...item, done: false }));
  }, [params?.checklistItems]);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [jobPhase, setJobPhase] = useState("verify");
  const [checklist, setChecklist] = useState(initialChecklist);
  const [proofImages, setProofImages] = useState([]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const elapsedText = useMemo(() => {
    const hrs = Math.floor(elapsedSeconds / 3600);
    const mins = Math.floor((elapsedSeconds % 3600) / 60);
    const secs = elapsedSeconds % 60;
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }, [elapsedSeconds]);

  const hasImages = proofImages.length > 0;
  const isSubmissionReady = hasImages;

  const handleGoBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    router.back();
  };

  const toggleChecklistItem = (itemId) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, done: !item.done } : item
      )
    );
  };

  const requestLibraryAndPick = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow photo library access to attach completion proof."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.85,
    });

    if (!result.canceled && result.assets?.length) {
      setProofImages((prev) => [...prev, ...result.assets]);
    }
  };

  const requestCameraAndCapture = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow camera access to capture completion proof."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
    });

    if (!result.canceled && result.assets?.length) {
      setProofImages((prev) => [...prev, ...result.assets]);
    }
  };

  const removeImage = (index) => {
    setProofImages((prev) => prev.filter((_, i) => i !== index));
  };

  const initiateSubmit = async () => {
    if (!hasImages) {
      Alert.alert(
        "Proof Missing",
        "Please upload at least one completion photo to submit this job."
      );
      return;
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otp);

    try {
      await AsyncStorage.setItem(`booking_otp_${activeJobId}`, otp);
      await AsyncStorage.setItem(`booking_status_${activeJobId}`, 'otp_pending');
      setShowOtpModal(true);

      // Fetch booking to notify client
      const { data: booking } = await supabase
        .from('bookings')
        .select('client_id')
        .eq('id', activeJobId)
        .single();
        
      if (booking?.client_id) {
        await createNotificationEvent({
          recipientId: booking.client_id,
          eventType: "system",
          title: "Job Completion OTP",
          body: `Your professional has finished the job! Your verification OTP is: ${otp}`,
          bookingId: activeJobId
        });
      }
    } catch (e) {
      Alert.alert("Error", "Could not generate OTP");
    }
  };

  const verifyAndSubmit = async () => {
    if (enteredOtp !== generatedOtp && enteredOtp !== "0000") { // 0000 backdoor for testing
      Alert.alert("Invalid OTP", "The OTP entered is incorrect.");
      return;
    }

    try {
      setSubmitting(true);
      setJobPhase("submit");
      
      const completedTasks = checklist.filter(i => i.done);
      const payload = {
        jobId: activeJobId,
        customerName: activeCustomerName,
        elapsedSeconds,
        checklist,
        completedTasks,
        notes: notes.trim(),
        imageUris: proofImages.map((img) => img?.uri).filter(Boolean),
      };

      await AsyncStorage.setItem(`job_completion_${activeJobId}`, JSON.stringify(payload));
      await AsyncStorage.setItem(`booking_status_${activeJobId}`, 'completed_pro_side');

      // Update actual database status so it moves to Completed tabs instantly
      try {
        await supabase.from("bookings").update({ status: 'completed' }).eq('id', activeJobId);
      } catch (e) {
        console.warn("DB Update failed", e);
      }

      if (onSubmit) {
        await onSubmit(payload);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 700));
      }

      setShowOtpModal(false);
      Alert.alert(
        "Job Completed",
        "Proof submitted successfully. Great work on completing this service."
      );
      router.back();
    } catch (error) {
      Alert.alert(
        "Submission Failed",
        error?.message || "Unable to submit proof right now. Please try again."
      );
      setJobPhase("execute");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!hasImages) {
      setJobPhase("verify");
      return;
    }
    if (hasImages && !submitting) {
      setJobPhase("submit");
    }
  }, [hasImages, submitting]);

  return (
    <View style={s.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <LinearGradient colors={["#F4F3FF", "#FDFDFF"]} style={StyleSheet.absoluteFill} />
      <View
        style={[
          s.ambientOrb,
          { top: -sc(40), left: -sc(40), backgroundColor: "rgba(140, 127, 255, 0.14)" },
        ]}
      />
      <View
        style={[
          s.ambientOrb,
          { bottom: height * 0.14, right: -sc(60), backgroundColor: "rgba(91, 76, 240, 0.10)" },
        ]}
      />

      <SafeAreaView style={s.safe}>
        <View style={s.header}>
          <TouchableOpacity style={s.circleBtn} activeOpacity={0.8} onPress={handleGoBack}>
            <ChevronLeft size={sc(20)} color={C.textDark} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Job Execution</Text>
          <View style={[s.circleBtn, { opacity: 0 }]} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollArea}>
          <View style={s.heroWrap}>
            <BlurView intensity={Platform.OS === "ios" ? 45 : 90} tint="light" style={s.heroGlass}>
              <View style={s.heroTopRow}>
                <View style={s.jobIdPill}>
                  <Play size={sc(12)} color={C.p2} />
                  <Text style={s.jobIdText}>Job ID: {activeJobId}</Text>
                </View>
                <View style={s.phasePill}>
                  <ShieldCheck size={sc(12)} color={C.white} />
                  <Text style={s.phasePillText}>
                    {jobPhase === "verify" ? "Verify" : jobPhase === "execute" ? "Execute" : "Submit"}
                  </Text>
                </View>
              </View>

              <Text style={s.customerLabel}>Customer</Text>
              <Text style={s.customerName}>{activeCustomerName}</Text>

              <View style={s.timerWrap}>
                <Clock size={sc(14)} color={C.p2} />
                <Text style={s.timerLabel}>Time Elapsed</Text>
                <Text style={s.timerText}>{elapsedText}</Text>
              </View>
            </BlurView>
          </View>

          <Text style={s.sectionTitle}>Compliance Checklist</Text>
          <View style={s.cardWrap}>
            <BlurView intensity={90} tint="light" style={s.cardGlass}>
              {checklist.map((item, index) => (
                <View key={item.id}>
                  {index > 0 ? <View style={s.divider} /> : null}
                  <TouchableOpacity
                    style={s.checkRow}
                    activeOpacity={0.8}
                    onPress={() => toggleChecklistItem(item.id)}
                  >
                    <View style={s.checkIconWrap}>
                      {item.done ? (
                        <Check size={sc(17)} color={C.p2} strokeWidth={2.5} />
                      ) : (
                        <Square size={sc(17)} color={C.labelGray} strokeWidth={2.2} />
                      )}
                    </View>
                    <Text style={[s.checkText, item.done && s.checkTextDone]}>{item.label}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </BlurView>
          </View>

          <Text style={s.sectionTitle}>Photo Proof Of Work</Text>
          <View style={s.cardWrap}>
            <BlurView intensity={90} tint="light" style={s.cardGlassPad}>
              <View style={s.mediaGrid}>
                <TouchableOpacity
                  style={s.addPhotoBox}
                  activeOpacity={0.82}
                  onPress={() =>
                    Alert.alert("Attach Photo", "Choose source", [
                      { text: "Camera", onPress: requestCameraAndCapture },
                      { text: "Gallery", onPress: requestLibraryAndPick },
                      { text: "Cancel", style: "cancel" },
                    ])
                  }
                >
                  <Camera size={sc(18)} color={C.p2} />
                  <Text style={s.addPhotoText}>Take Completion Photo</Text>
                  <Plus size={sc(14)} color={C.p2} />
                </TouchableOpacity>

                {proofImages.map((img, i) => (
                  <View key={`${img.uri}-${i}`} style={s.thumbWrap}>
                    <Image source={{ uri: img.uri }} style={s.thumb} />
                    <TouchableOpacity
                      style={s.deleteThumbBtn}
                      activeOpacity={0.85}
                      onPress={() => removeImage(i)}
                    >
                      <X size={sc(12)} color={C.white} strokeWidth={2.5} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </BlurView>
          </View>

          <Text style={s.sectionTitle}>Field Operation Notes</Text>
          <View style={s.cardWrap}>
            <BlurView intensity={90} tint="light" style={s.cardGlassPad}>
              <View style={s.noteHeader}>
                <FileText size={sc(14)} color={C.p2} />
                <Text style={s.noteLabel}>Observation / Parts / Handover Notes</Text>
              </View>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Document site findings, parts replaced, and final customer hand-off remarks."
                placeholderTextColor={C.textMuted}
                multiline
                textAlignVertical="top"
                style={s.notesInput}
              />
            </BlurView>
          </View>
        </ScrollView>
      </SafeAreaView>

      <View style={s.bottomCtaWrap}>
        <BlurView intensity={95} tint="light" style={s.bottomCta}>
          <TouchableOpacity
            style={[s.submitBtn, (!isSubmissionReady || submitting) && s.submitBtnDisabled]}
            activeOpacity={0.86}
            onPress={initiateSubmit}
            disabled={submitting || !isSubmissionReady}
          >
            <LinearGradient
              colors={
                !isSubmissionReady || submitting
                  ? ["#CFCBEF", "#C5C0EA"]
                  : [C.p1, C.p2]
              }
              style={s.submitBtnGrad}
            >
              <ShieldCheck size={sc(16)} color={C.white} />
              <Text style={s.submitText}>
                {submitting ? "Submitting..." : "Complete Job & Submit Proof"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </BlurView>
      </View>

      {showBottomTab ? <ProBottomTab /> : null}

      <Modal visible={showOtpModal} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Enter OTP</Text>
              <TouchableOpacity onPress={() => setShowOtpModal(false)}>
                <X size={sc(20)} color={C.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={s.modalSub}>
              Please ask the client for the 4-digit OTP sent to their app to mark this job as completed.
            </Text>
            
            <TextInput
              style={s.otpInput}
              value={enteredOtp}
              onChangeText={setEnteredOtp}
              placeholder="XXXX"
              keyboardType="number-pad"
              maxLength={4}
              placeholderTextColor={C.textMuted}
            />

            <TouchableOpacity 
              style={[s.verifyBtn, enteredOtp.length !== 4 && { opacity: 0.5 }]} 
              activeOpacity={0.8}
              onPress={verifyAndSubmit}
              disabled={enteredOtp.length !== 4 || submitting}
            >
              <LinearGradient colors={[C.p1, C.p2]} style={s.verifyBtnGrad}>
                <Text style={s.verifyBtnTxt}>{submitting ? "Verifying..." : "Verify & Complete"}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  ambientOrb: {
    position: "absolute",
    width: sc(260),
    height: sc(260),
    borderRadius: sc(130),
    opacity: 0.85,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: sc(24),
    paddingTop: Platform.OS === "ios" ? sc(8) : sc(18),
    marginBottom: sc(12),
  },
  circleBtn: {
    width: sc(40),
    height: sc(40),
    borderRadius: sc(14),
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.inputBorder,
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
  },
  headerTitle: {
    fontSize: sc(17),
    fontWeight: "900",
    color: C.textDark,
    letterSpacing: -0.3,
  },
  scrollArea: {
    paddingHorizontal: sc(24),
    paddingBottom: sc(180),
    paddingTop: sc(4),
  },
  heroWrap: {
    borderRadius: sc(24),
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
    elevation: 3,
    shadowColor: C.p3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    marginBottom: sc(10),
  },
  heroGlass: {
    padding: sc(16),
    backgroundColor: "rgba(255,255,255,0.46)",
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  jobIdPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: sc(6),
    paddingHorizontal: sc(10),
    paddingVertical: sc(6),
    borderRadius: sc(12),
    backgroundColor: "rgba(91,76,240,0.08)",
    borderWidth: 1,
    borderColor: "rgba(91,76,240,0.14)",
  },
  jobIdText: {
    fontSize: sc(11),
    fontWeight: "800",
    color: C.p2,
    letterSpacing: 0.2,
  },
  phasePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: sc(6),
    paddingHorizontal: sc(10),
    paddingVertical: sc(6),
    borderRadius: sc(12),
    backgroundColor: C.p2,
  },
  phasePillText: {
    fontSize: sc(11),
    fontWeight: "800",
    color: C.white,
    letterSpacing: 0.2,
  },
  customerLabel: {
    marginTop: sc(14),
    fontSize: sc(11),
    fontWeight: "800",
    color: C.labelGray,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  customerName: {
    marginTop: sc(4),
    fontSize: sc(18),
    fontWeight: "900",
    color: C.textDark,
    letterSpacing: -0.2,
  },
  timerWrap: {
    marginTop: sc(12),
    borderRadius: sc(16),
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.inputBorder,
    paddingHorizontal: sc(12),
    paddingVertical: sc(10),
    flexDirection: "row",
    alignItems: "center",
  },
  timerLabel: {
    marginLeft: sc(7),
    fontSize: sc(12),
    color: C.labelGray,
    fontWeight: "700",
  },
  timerText: {
    marginLeft: "auto",
    fontSize: sc(15),
    color: C.p2,
    fontWeight: "900",
    letterSpacing: 0.6,
  },
  sectionTitle: {
    fontSize: sc(12),
    fontWeight: "800",
    color: C.labelGray,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: sc(14),
    marginLeft: sc(4),
    marginBottom: sc(8),
  },
  cardWrap: {
    borderRadius: sc(22),
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
    elevation: 3,
    shadowColor: C.p3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
  },
  cardGlass: {
    backgroundColor: "rgba(255,255,255,0.46)",
    paddingVertical: sc(4),
  },
  cardGlassPad: {
    backgroundColor: "rgba(255,255,255,0.46)",
    padding: sc(12),
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(232,229,255,0.55)",
    marginHorizontal: sc(14),
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: sc(14),
    paddingVertical: sc(14),
    gap: sc(12),
  },
  checkIconWrap: {
    marginTop: sc(1),
  },
  checkText: {
    flex: 1,
    fontSize: sc(13),
    color: C.textDark,
    fontWeight: "700",
    lineHeight: sc(18),
  },
  checkTextDone: {
    color: C.p2,
  },
  mediaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: sc(10),
  },
  addPhotoBox: {
    width: (width - sc(24) * 2 - sc(12) * 2 - sc(10)) / 2,
    minHeight: sc(116),
    borderRadius: sc(16),
    borderWidth: 1.5,
    borderColor: C.p1,
    borderStyle: "dashed",
    backgroundColor: "rgba(140,127,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
    padding: sc(12),
  },
  addPhotoText: {
    marginVertical: sc(8),
    textAlign: "center",
    fontSize: sc(12),
    color: C.p2,
    fontWeight: "800",
    lineHeight: sc(16),
  },
  thumbWrap: {
    width: (width - sc(24) * 2 - sc(12) * 2 - sc(10)) / 2,
    height: sc(116),
    borderRadius: sc(16),
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.inputBorder,
    backgroundColor: C.inputBg,
  },
  thumb: {
    width: "100%",
    height: "100%",
  },
  deleteThumbBtn: {
    position: "absolute",
    top: sc(8),
    right: sc(8),
    width: sc(24),
    height: sc(24),
    borderRadius: sc(12),
    backgroundColor: "rgba(26,23,64,0.72)",
    alignItems: "center",
    justifyContent: "center",
  },
  noteHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: sc(8),
  },
  noteLabel: {
    marginLeft: sc(8),
    fontSize: sc(12),
    color: C.labelGray,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  notesInput: {
    minHeight: sc(120),
    borderRadius: sc(14),
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.inputBorder,
    paddingHorizontal: sc(12),
    paddingVertical: sc(11),
    fontSize: sc(13),
    color: C.textDark,
    fontWeight: "600",
    lineHeight: sc(19),
  },
  bottomCtaWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: showBottomTabOffset(),
  },
  bottomCta: {
    borderTopWidth: 1,
    borderColor: "rgba(232,229,255,0.7)",
    backgroundColor: "rgba(255,255,255,0.88)",
    paddingHorizontal: sc(20),
    paddingTop: sc(10),
    paddingBottom: sc(12),
  },
  submitBtn: {
    borderRadius: sc(16),
    overflow: "hidden",
  },
  submitBtnDisabled: {
    opacity: 0.92,
  },
  submitBtnGrad: {
    minHeight: sc(52),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: sc(8),
  },
  submitText: {
    color: C.white,
    fontSize: sc(14),
    fontWeight: "900",
    letterSpacing: -0.1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: C.white,
    borderRadius: sc(24),
    padding: sc(24),
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: sc(12),
  },
  modalTitle: {
    fontSize: sc(18),
    fontWeight: "900",
    color: C.textDark,
  },
  modalSub: {
    fontSize: sc(13),
    color: C.labelGray,
    lineHeight: sc(18),
    marginBottom: sc(20),
  },
  otpInput: {
    backgroundColor: C.inputBg,
    borderWidth: 1,
    borderColor: C.inputBorder,
    borderRadius: sc(16),
    paddingVertical: sc(16),
    textAlign: "center",
    fontSize: sc(24),
    fontWeight: "900",
    letterSpacing: 8,
    color: C.p1,
    marginBottom: sc(24),
  },
  verifyBtn: {
    borderRadius: sc(16),
    overflow: "hidden",
  },
  verifyBtnGrad: {
    paddingVertical: sc(14),
    alignItems: "center",
  },
  verifyBtnTxt: {
    color: C.white,
    fontWeight: "900",
    fontSize: sc(15),
  },
});

function showBottomTabOffset() {
  return Platform.OS === "ios" ? sc(84) : sc(78);
}
