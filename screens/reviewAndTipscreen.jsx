import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  TextInput,
  Image,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../services/supabase";
import AppBottomTab from "../components/AppBottomTab";
import {
  X,
  Star,
  ChevronRight,
  Heart,
  CheckCircle2,
  MessageSquareText,
} from "lucide-react-native";

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

export default function ReviewScreenFlow() {
  const { bookingId, amountPaid } = useLocalSearchParams();
  const [step, setStep] = useState(1); // 1: Tip, 2: Rating, 3: Private
  const [selectedTip, setSelectedTip] = useState("₹50");
  const [rating, setRating] = useState(0);
  const [match, setMatch] = useState("No opinion");
  const [feedbackText, setFeedbackText] = useState("");
  const [proDetails, setProDetails] = useState({ name: "Loading...", service: "Service", avatar: "https://i.pravatar.cc/150?u=pro" });
  const [professionalId, setProfessionalId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchDetails() {
      if (!bookingId) return;
      const { data: booking } = await supabase.from("bookings").select("professional_id, service_type").eq("id", bookingId).single();
      if (booking?.professional_id) {
        setProfessionalId(booking.professional_id);
        const { data: profile } = await supabase.from("professional_profiles").select("full_name").eq("user_id", booking.professional_id).single();
        if (profile) {
          setProDetails({ name: profile.full_name, service: booking.service_type, avatar: `https://i.pravatar.cc/150?u=${booking.professional_id}` });
        }
      }
    }
    fetchDetails();
  }, [bookingId]);

  const tips = [
    { label: "No Tip", val: "₹0" },
    { label: "₹30", val: "Small" },
    { label: "₹50", val: "Great" },
    { label: "₹100", val: "Hero" },
  ];

  const handleSubmitReview = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      if (!bookingId || !professionalId) {
        alert("Missing booking details");
        setSubmitting(false);
        return;
      }

      const sessionStr = await AsyncStorage.getItem("workmate_session");
      let clientId = "client_firebase_uid_123";
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        if (session?.uid) clientId = session.uid;
      }

      const safeRating = rating > 0 ? rating : 5;

      await supabase.from("reviews").insert({
        booking_id: parseInt(bookingId, 10),
        professional_id: professionalId,
        client_id: clientId,
        rating: safeRating,
        review_text: feedbackText
      });

      const { data: profile } = await supabase
        .from("professional_profiles")
        .select("total_earnings, average_rating, review_count")
        .eq("user_id", professionalId)
        .single();

      if (profile) {
        const currentEarnings = Number(profile.total_earnings || 0);
        const currentRating = Number(profile.average_rating || 0);
        const currentCount = Number(profile.review_count || 0);

        const tipVal = parseInt(selectedTip.replace(/[^0-9]/g, ""), 10) || 0;
        const finalEarnings = currentEarnings + Number(amountPaid || 0) + tipVal;

        const newCount = currentCount + 1;
        const newRating = ((currentRating * currentCount) + safeRating) / newCount;

        await supabase.from("professional_profiles").update({
          total_earnings: finalEarnings,
          average_rating: newRating,
          review_count: newCount
        }).eq("user_id", professionalId);
      }

      alert("Feedback Submitted! Thank you.");
      router.replace("/home");
    } catch (e) {
      console.error(e);
      alert("Error submitting review");
      setSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <View style={s.stepWrap}>
      <Text style={s.stepTitle}>Add a tip for the expert</Text>
      <View style={s.tipGrid}>
        {tips.map((item) => {
          const isActive = selectedTip === item.label;
          return (
            <TouchableOpacity
              key={item.label}
              onPress={() => setSelectedTip(item.label)}
              activeOpacity={0.8}
              style={[s.tipCard, isActive && s.tipCardActive]}
            >
              <Text style={[s.tipLabel, isActive && { color: C.p2 }]}>{item.label}</Text>
              <Text style={[s.tipVal, isActive && { color: C.p2 }]}>{item.val}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={s.infoNote}>
        <Heart size={14} color={C.labelGray} />
        <Text style={s.infoNoteText}>100% of the tip goes to your service professional. It will be added to your final invoice.</Text>
      </View>
      <TouchableOpacity style={s.mainBtn} onPress={() => setStep(2)}>
        <LinearGradient colors={[C.p1, C.p2]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.btnGradient}>
          <Text style={s.btnText}>Continue to Rating</Text>
          <ChevronRight size={20} color={C.white} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View style={s.stepWrap}>
      <Text style={s.stepTitle}>How was your experience?</Text>
      <View style={s.starRow}>
        {[1, 2, 3, 4, 5].map((i) => (
          <TouchableOpacity key={i} onPress={() => setRating(i)}>
            <Star
              size={sc(42)}
              color={i <= rating ? "#F59E0B" : C.inputBorder}
              fill={i <= rating ? "#F59E0B" : "transparent"}
              strokeWidth={1.5}
            />
          </TouchableOpacity>
        ))}
      </View>
      <Text style={s.ratingStatus}>
        {rating === 5 ? "Excellent Service!" : rating > 0 ? "Thank you for rating" : "Tap a star to rate"}
      </Text>
      <TouchableOpacity style={s.mainBtn} onPress={() => setStep(3)}>
        <LinearGradient colors={[C.p1, C.p2]} style={s.btnGradient}>
          <Text style={s.btnText}>Next</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderStep3 = () => (
    <View style={s.stepWrap}>
      <Text style={s.stepTitle}>Private Feedback</Text>
      <View style={s.innerCard}>
        <Text style={s.questionText}>Would you like to book the same expert in the future?</Text>
        <View style={s.choiceRow}>
          {["Yes", "No opinion", "No"].map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setMatch(c)}
              style={[s.choiceBtn, match === c && s.choiceBtnActive]}
            >
              <Text style={[s.choiceBtnText, match === c && { color: C.white }]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          placeholder="Anything else you'd like us to know?"
          placeholderTextColor={C.textMuted}
          multiline
          value={feedbackText}
          onChangeText={setFeedbackText}
          style={s.textInput}
        />
      </View>
      <TouchableOpacity style={s.mainBtn} onPress={handleSubmitReview} disabled={submitting}>
        <LinearGradient colors={[C.p1, C.p2]} style={s.btnGradient}>
          <Text style={s.btnText}>{submitting ? "Submitting..." : "Submit Review"}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[C.p4, C.dark]} style={StyleSheet.absoluteFill} />

      {/* BACKGROUND DECORATION */}
      <View style={s.orb} />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={s.header}>
          <TouchableOpacity style={s.closeBtn} onPress={() => step > 1 ? setStep(step-1) : router.replace("/home")}>
            <X size={24} color={C.white} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Review Flow</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={s.centerContainer}>
          <BlurView intensity={Platform.OS === 'ios' ? 30 : 100} tint="light" style={s.glassCard}>
            {/* Header Profile Area (Constant) */}
            <View style={s.profileHeader}>
              <View style={s.avatarWrap}>
                <Image source={{ uri: proDetails.avatar }} style={s.avatar} />
                <View style={s.verifiedBadge}><CheckCircle2 size={14} color={C.white} fill={C.p2} /></View>
              </View>
              <Text style={s.proName}>{proDetails.name}</Text>
              <Text style={s.proService}>{proDetails.service}</Text>
            </View>

            {/* Steps */}
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </BlurView>
        </View>
      </SafeAreaView>
      <AppBottomTab />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  orb: { position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: C.p2, top: -50, right: -50, opacity: 0.3 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 10 },
  headerTitle: { color: C.white, fontSize: 18, fontWeight: "700" },
  closeBtn: { width: 44, height: 44, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  centerContainer: { flex: 1, justifyContent: "center", paddingHorizontal: 20 },
  
  // Glass Card
  glassCard: { width: '100%', borderRadius: 40, padding: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', overflow: 'hidden' },
  profileHeader: { alignItems: 'center', marginBottom: 20 },
  avatarWrap: { position: 'relative', marginBottom: 12 },
  avatar: { width: 80, height: 80, borderRadius: 30, borderWidth: 3, borderColor: C.white },
  verifiedBadge: { position: 'absolute', bottom: -4, right: -4 },
  proName: { fontSize: 20, fontWeight: "900", color: C.textDark },
  proService: { fontSize: 13, color: C.labelGray, fontWeight: '600' },

  stepWrap: { width: '100%' },
  stepTitle: { fontSize: 17, fontWeight: "800", color: C.textDark, textAlign: 'center', marginBottom: 20 },
  
  // Tips
  tipGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  tipCard: { width: '23%', paddingVertical: 14, borderRadius: 18, backgroundColor: C.white, alignItems: 'center', borderWidth: 1, borderColor: C.inputBorder },
  tipCardActive: { borderColor: C.p2, backgroundColor: C.inputBg },
  tipLabel: { fontSize: 14, fontWeight: "800", color: C.textDark },
  tipVal: { fontSize: 10, fontWeight: "600", color: C.textMuted, marginTop: 2 },
  
  infoNote: { flexDirection: 'row', gap: 10, paddingHorizontal: 10, marginBottom: 25 },
  infoNoteText: { fontSize: 11, color: C.labelGray, lineHeight: 16, flex: 1 },

  // Rating
  starRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginVertical: 20 },
  ratingStatus: { textAlign: 'center', fontSize: 14, fontWeight: '700', color: C.p2, marginBottom: 20 },

  // Private Feedback
  innerCard: { backgroundColor: C.white, borderRadius: 24, padding: 16, marginBottom: 20 },
  questionText: { fontSize: 14, fontWeight: "700", color: C.textDark, lineHeight: 20 },
  choiceRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15 },
  choiceBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: C.p2 },
  choiceBtnActive: { backgroundColor: C.p2 },
  choiceBtnText: { fontSize: 12, fontWeight: "700", color: C.p2 },
  textInput: { backgroundColor: C.inputBg, borderRadius: 15, padding: 15, height: 100, textAlignVertical: 'top', fontSize: 14, color: C.textDark },

  // Button
  mainBtn: { height: 60, borderRadius: 20, overflow: 'hidden', elevation: 5 },
  btnGradient: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  btnText: { color: C.white, fontSize: 16, fontWeight: "800" },
});
