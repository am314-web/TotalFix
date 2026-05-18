import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import {
    Briefcase,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    FileText,
    Mail,
    Phone,
    Power,
    ShieldAlert,
    UploadCloud,
    User,
    Wrench
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  completeProfessionalOnboarding,
  createProfessionalRegistrationLog,
  fetchProfessionalRegistrationLogs,
  fetchProfessionalRegistrationSnapshot,
  uploadProfessionalDocument,
} from "../services/professionalAuthService";
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
  success: "#22C55E",
  successBg: "#DCFCE7",
};

export default function ProfessionalRegisterScreen() {
  const [currentStep, setCurrentStep] = useState(1); // 1: Profile Details, 2: Document Verification
  const [submitting, setSubmitting] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [registrationDone, setRegistrationDone] = useState(false);
  const [apiSnapshot, setApiSnapshot] = useState(null);
  const [apiLogs, setApiLogs] = useState([]);
  const [preloadLogs, setPreloadLogs] = useState([]);

  // Form Local States
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [experience, setExperience] = useState("");
  const [selectedService, setSelectedService] = useState("AC Repair");

  // Document Upload Mock States
  const [aadhaarStatus, setAadhaarStatus] = useState("empty"); // empty, uploading, done
  const [certStatus, setCertStatus] = useState("empty");
  const [aadhaarUrl, setAadhaarUrl] = useState("");
  const [certificateUrl, setCertificateUrl] = useState("");
  const [sessionUserId, setSessionUserId] = useState("");

  const servicesList = [
    "AC Repair",
    "Plumbing",
    "Electrical",
    "Cleaning",
    "Painting",
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      await AsyncStorage.removeItem(SESSION_KEY);
      router.replace("/login");
    } catch (error) {
      Alert.alert("Logout Failed", error?.message || "Could not logout. Please try again.");
    }
  };

  const handlePickAndUploadDocument = async (type) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed", "Please allow photo access to upload documents.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });
      if (result.canceled || !result.assets?.length) return;

      if (!sessionUserId) {
        throw new Error("Professional session missing. Please login again.");
      }

      const uri = result.assets[0]?.uri;
      if (!uri) throw new Error("Selected file URI is invalid.");

      if (type === "aadhaar") setAadhaarStatus("uploading");
      else setCertStatus("uploading");

      const uploadedUrl = await uploadProfessionalDocument(
        uri,
        sessionUserId,
        type === "aadhaar" ? "aadhaar" : "certificate"
      );

      if (type === "aadhaar") {
        setAadhaarUrl(uploadedUrl || "");
        setAadhaarStatus("done");
      } else {
        setCertificateUrl(uploadedUrl || "");
        setCertStatus("done");
      }
    } catch (error) {
      if (type === "aadhaar") setAadhaarStatus("empty");
      else setCertStatus("empty");
      Alert.alert("Upload Failed", error?.message || "Could not upload document.");
    }
  };

  useEffect(() => {
    const bootstrapProfessionalSession = async () => {
      try {
        setProfileLoading(true);
        const rawSession = await AsyncStorage.getItem(SESSION_KEY);
        if (!rawSession) return;
        const session = JSON.parse(rawSession);
        if (session?.role !== "professional") return;
        if (!session?.uid) return;

        setSessionUserId(session.uid);
        if (session?.onboardingComplete) {
          router.replace("/pro-dashboard");
          return;
        }

        const snapshot = await fetchProfessionalRegistrationSnapshot(session.uid);
        const logs = await fetchProfessionalRegistrationLogs(session.uid);
        setPreloadLogs(logs);
        if (snapshot?.profile?.name) setName(snapshot.profile.name);
        if (snapshot?.professionalProfile?.full_name) setName(snapshot.professionalProfile.full_name);

        if (snapshot?.professionalProfile?.email) setEmail(snapshot.professionalProfile.email);
        else if (session?.email) setEmail(session.email);

        if (!snapshot?.profile?.name && !snapshot?.professionalProfile?.full_name) {
          setName("");
        }
        if (!snapshot?.professionalProfile?.email && session?.email) {
          setEmail(session.email);
        }

        if (snapshot?.professionalProfile?.phone) setPhone(snapshot.professionalProfile.phone);
        if (snapshot?.professionalProfile?.experience_years !== undefined) {
          setExperience(String(snapshot.professionalProfile.experience_years));
        }
        if (snapshot?.professionalProfile?.primary_service) {
          setSelectedService(snapshot.professionalProfile.primary_service);
        }
        if (snapshot?.professionalProfile?.aadhaar_url) {
          setAadhaarUrl(snapshot.professionalProfile.aadhaar_url);
          setAadhaarStatus("done");
        }
        if (snapshot?.professionalProfile?.certificate_url) {
          setCertificateUrl(snapshot.professionalProfile.certificate_url);
          setCertStatus("done");
        }
      } catch (error) {
        Alert.alert("Profile Fetch Failed", error?.message || "Could not fetch profile from Supabase.");
      } finally {
        setProfileLoading(false);
      }
    };
    bootstrapProfessionalSession();
  }, []);

  const handleSubmitApplication = async () => {
    if (submitting) return;

    try {
      setSubmitting(true);
      const rawSession = await AsyncStorage.getItem(SESSION_KEY);
      if (!rawSession) {
        throw new Error("Session missing. Please login again.");
      }
      const session = JSON.parse(rawSession);
      if (!session?.uid || session?.role !== "professional") {
        throw new Error("Professional session not found. Please login again.");
      }

      await completeProfessionalOnboarding({
        userId: session.uid,
        fullName: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        experienceYears: experience,
        primaryService: selectedService,
        aadhaarUploaded: aadhaarStatus === "done",
        certificateUploaded: certStatus === "done",
        aadhaarUrl,
        certificateUrl,
      });

      await AsyncStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          ...session,
          email: email.trim().toLowerCase(),
          onboardingComplete: true,
        })
      );

      await createProfessionalRegistrationLog({
        userId: session.uid,
        action: "onboarding_completed",
        message: "Professional profile submitted and onboarding marked complete",
        payload: {
          fullName: name.trim(),
          phone: phone.trim(),
          email: email.trim().toLowerCase(),
          experienceYears: Number(experience) || 0,
          primaryService: selectedService,
          aadhaarUploaded: aadhaarStatus === "done",
          certificateUploaded: certStatus === "done",
        },
      });

      const snapshot = await fetchProfessionalRegistrationSnapshot(session.uid);
      const logs = await fetchProfessionalRegistrationLogs(session.uid);

      setApiSnapshot(snapshot);
      setApiLogs(logs);
      setRegistrationDone(true);
    } catch (error) {
      Alert.alert("Registration Failed", error?.message || "Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderSuccessFromApi = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollArea}>
      <Text style={s.subViewDescription}>
        Registration completed. The details below are fetched from Supabase API.
      </Text>

      <View style={s.uploadCardWrapper}>
        <BlurView intensity={85} tint="light" style={s.uploadGlassCard}>
          <View style={{ flex: 1 }}>
            <Text style={s.docTitleText}>Profile Snapshot (API)</Text>
            <Text style={s.docSubText}>
              Name: {apiSnapshot?.professionalProfile?.full_name || "-"}
            </Text>
            <Text style={s.docSubText}>
              Email: {apiSnapshot?.professionalProfile?.email || "-"}
            </Text>
            <Text style={s.docSubText}>
              Phone: {apiSnapshot?.professionalProfile?.phone || "-"}
            </Text>
            <Text style={s.docSubText}>
              Service: {apiSnapshot?.professionalProfile?.primary_service || "-"}
            </Text>
            <Text style={s.docSubText}>
              Experience: {apiSnapshot?.professionalProfile?.experience_years ?? "-"} years
            </Text>
            <Text style={s.docSubText}>
              Onboarding Complete: {String(apiSnapshot?.profile?.onboarding_complete)}
            </Text>
          </View>
        </BlurView>
      </View>

      <Text style={s.inputLabel}>Registration Logs (API)</Text>
      <View style={s.languageCardWrapper}>
        <BlurView intensity={90} tint="light" style={s.languageGlassBlock}>
          {apiLogs.length > 0 ? (
            apiLogs.map((log, index) => (
              <View key={String(log.id)}>
                {index > 0 && <View style={s.innerCardDivider} />}
                <View style={s.langSelectionRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.langItemText}>{log.action || "log"}</Text>
                    <Text style={s.docSubText}>{log.message || "-"}</Text>
                  </View>
                  <CheckCircle2 size={16} color={C.success} />
                </View>
              </View>
            ))
          ) : (
            <View style={s.langSelectionRow}>
              <Text style={s.langItemText}>No logs returned from API</Text>
            </View>
          )}
        </BlurView>
      </View>

      <TouchableOpacity
        style={s.mainActionBtn}
        activeOpacity={0.85}
        onPress={() => router.replace("/pro-dashboard")}
      >
        <LinearGradient colors={[C.p1, C.p2]} style={s.actionBtnGradient}>
          <Text style={s.actionBtnText}>Continue to Professional Home</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );

  // ─── STEP RENDERERS ──────────────────────────────────────────

  const renderStep1Profile = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={s.scrollArea}
    >
      <Text style={s.subViewDescription}>
        Join our elite service network. Setup your profile metrics to receive
        high-ticket local jobs.
      </Text>

      <Text style={s.inputLabel}>Auth/API Logs</Text>
      <View style={s.languageCardWrapper}>
        <BlurView intensity={90} tint="light" style={s.languageGlassBlock}>
          {preloadLogs.length > 0 ? (
            preloadLogs.slice(0, 4).map((log, index) => (
              <View key={String(log.id)}>
                {index > 0 && <View style={s.innerCardDivider} />}
                <View style={s.langSelectionRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.langItemText}>{log.action || "log"}</Text>
                    <Text style={s.docSubText}>{log.message || "-"}</Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={s.langSelectionRow}>
              <Text style={s.langItemText}>No signup/login logs fetched yet.</Text>
            </View>
          )}
        </BlurView>
      </View>

      {/* Input Field: Full Name */}
      <Text style={s.inputLabel}>Full Name</Text>
      <View style={s.inputContainerFrame}>
        <User size={16} color={C.p2} />
        <TextInput
          placeholder="Enter your official name"
          placeholderTextColor={C.textMuted}
          value={name}
                  onChangeText={setName}
                  style={s.textInputField}
                  editable={false}
                />
      </View>

      {/* Input Field: Mobile Number */}
      <Text style={s.inputLabel}>Mobile Number</Text>
      <View style={s.inputContainerFrame}>
        <Phone size={16} color={C.p2} />
        <TextInput
          placeholder="Enter 10-digit number"
          placeholderTextColor={C.textMuted}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          style={s.textInputField}
        />
      </View>

      {/* Input Field: Email Address */}
      <Text style={s.inputLabel}>Email Address</Text>
      <View style={s.inputContainerFrame}>
        <Mail size={16} color={C.p2} />
        <TextInput
          placeholder="name@example.com"
          placeholderTextColor={C.textMuted}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={s.textInputField}
          editable={false}
        />
      </View>

      {/* Input Field: Total Experience */}
      <Text style={s.inputLabel}>Years of Experience</Text>
      <View style={s.inputContainerFrame}>
        <Briefcase size={16} color={C.p2} />
        <TextInput
          placeholder="e.g. 5"
          placeholderTextColor={C.textMuted}
          keyboardType="number-pad"
          value={experience}
          onChangeText={setExperience}
          style={s.textInputField}
        />
      </View>

      {/* Core Specialization Cluster Selection */}
      <Text style={s.inputLabel}>Primary Specialization</Text>
      <View style={s.servicesClusterGrid}>
        {servicesList.map((service) => {
          const isSelected = selectedService === service;
          return (
            <TouchableOpacity
              key={service}
              onPress={() => setSelectedService(service)}
              activeOpacity={0.8}
              style={[s.serviceChipBtn, isSelected && s.serviceChipBtnActive]}
            >
              <Text style={[s.serviceChipText, isSelected && { color: C.p2 }]}>
                {service}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={s.mainActionBtn}
        activeOpacity={0.85}
        onPress={() => setCurrentStep(2)}
      >
        <LinearGradient
          colors={[C.p1, C.p2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={s.actionBtnGradient}
        >
          <Text style={s.actionBtnText}>Continue to Documents</Text>
          <ChevronRight size={18} color={C.white} strokeWidth={2.5} />
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderStep2Documents = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={s.scrollArea}
    >
      <Text style={s.subViewDescription}>
        Upload identity and technical verification credentials to secure your
        background clearance badge.
      </Text>

      {/* Document Tile 1: National Identity Card */}
      <Text style={s.inputLabel}>Aadhaar Card / Government ID</Text>
      <View style={s.uploadCardWrapper}>
        <BlurView intensity={85} tint="light" style={s.uploadGlassCard}>
          <FileText size={sc(22)} color={C.p2} />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={s.docTitleText}>National ID Card Front/Back</Text>
            <Text style={s.docSubText}>
              PDF, PNG, or JPEG formats up to 5MB
            </Text>
          </View>

          {aadhaarStatus === "empty" && (
            <TouchableOpacity
              style={s.uploadTriggerBtn}
              onPress={() => handlePickAndUploadDocument("aadhaar")}
            >
              <UploadCloud size={14} color={C.p2} />
              <Text style={s.uploadTriggerText}>Upload</Text>
            </TouchableOpacity>
          )}
          {aadhaarStatus === "uploading" && (
            <Text style={[s.statusStateText, { color: C.p1 }]}>
              Processing...
            </Text>
          )}
          {aadhaarStatus === "done" && (
            <View style={s.successCheckBadge}>
              <CheckCircle2 size={16} color={C.success} fill={C.successBg} />
            </View>
          )}
        </BlurView>
      </View>

      {/* Document Tile 2: Professional Certificate */}
      <Text style={s.inputLabel}>Trade License / Course Certificate</Text>
      <View style={s.uploadCardWrapper}>
        <BlurView intensity={85} tint="light" style={s.uploadGlassCard}>
          <Wrench size={sc(22)} color={C.p2} />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={s.docTitleText}>Technical Competency Cert</Text>
            <Text style={s.docSubText}>Proof of local trade registration</Text>
          </View>

          {certStatus === "empty" && (
            <TouchableOpacity
              style={s.uploadTriggerBtn}
              onPress={() => handlePickAndUploadDocument("cert")}
            >
              <UploadCloud size={14} color={C.p2} />
              <Text style={s.uploadTriggerText}>Upload</Text>
            </TouchableOpacity>
          )}
          {certStatus === "uploading" && (
            <Text style={[s.statusStateText, { color: C.p1 }]}>
              Processing...
            </Text>
          )}
          {certStatus === "done" && (
            <View style={s.successCheckBadge}>
              <CheckCircle2 size={16} color={C.success} fill={C.successBg} />
            </View>
          )}
        </BlurView>
      </View>

      {/* Trust compliance panel notice */}
      <View style={s.complianceNoticeBox}>
        <ShieldAlert size={16} color={C.labelGray} style={{ marginTop: 2 }} />
        <Text style={s.complianceNoticeText}>
          Your files are safely encrypted and handled directly by our background
          verification auditing team. Processing may take up to 24-48 working
          hours.
        </Text>
      </View>

      <TouchableOpacity
        style={s.mainActionBtn}
        activeOpacity={0.85}
        onPress={handleSubmitApplication}
        disabled={submitting}
      >
        <LinearGradient colors={[C.p1, C.p2]} style={s.actionBtnGradient}>
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={s.actionBtnText}>Submit Application</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <View style={s.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <LinearGradient
        colors={["#F4F3FF", "#FDFDFF"]}
        style={StyleSheet.absoluteFill}
      />

      {/* AMBIENT BACKGROUND GLOW EFFECTS */}
      <View
        style={[
          s.ambientOrb,
          {
            top: -sc(40),
            left: -sc(40),
            backgroundColor: "rgba(140, 127, 255, 0.14)",
          },
        ]}
      />
      <View
        style={[
          s.ambientOrb,
          {
            bottom: height * 0.15,
            right: -sc(60),
            backgroundColor: "rgba(91, 76, 240, 0.1)",
          },
        ]}
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* APP REGISTRATION BAR HEADER */}
        <View style={s.header}>
          {currentStep > 1 ? (
            <TouchableOpacity
              style={s.circleBarBtn}
              onPress={() => setCurrentStep(1)}
              activeOpacity={0.75}
            >
              <ChevronLeft size={sc(20)} color={C.textDark} strokeWidth={2.5} />
            </TouchableOpacity>
          ) : (
            <View style={[s.circleBarBtn, { opacity: 0 }]} />
          )}
          <Text style={s.headerTitleText}>Partner Onboarding</Text>
          <TouchableOpacity
            style={s.circleBarBtn}
            onPress={handleLogout}
            activeOpacity={0.75}
          >
            <Power size={sc(18)} color="#EF4444" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* STEPPER STEP CONTROLLER TRAIL */}
        <View style={s.stepperProgressContainer}>
          <View style={s.stepperBarBackground}>
            <TouchableOpacity
              onPress={() => setCurrentStep(1)}
              style={[
                s.stepPillItem,
                currentStep === 1 && s.stepPillItemActive,
              ]}
            >
              <Text
                style={[
                  s.stepPillText,
                  currentStep === 1 && s.stepPillTextActive,
                ]}
              >
                1. Profile Details
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setCurrentStep(2)}
              style={[
                s.stepPillItem,
                currentStep === 2 && s.stepPillItemActive,
              ]}
            >
              <Text
                style={[
                  s.stepPillText,
                  currentStep === 2 && s.stepPillTextActive,
                ]}
              >
                2. Verification
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ECOSYSTEM CONDITION ENGINE SWITCH */}
        {profileLoading ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator size="large" color={C.p2} />
            <Text style={{ marginTop: 10, color: C.labelGray, fontWeight: "700" }}>
              Fetching profile from Supabase...
            </Text>
          </View>
        ) : registrationDone
          ? renderSuccessFromApi()
          : currentStep === 1
            ? renderStep1Profile()
            : renderStep2Documents()}
      </SafeAreaView>
    </View>
  );
}

// ─── STYLES CORE CONSOLE ARCHITECTURE ─────────────────────────
const s = StyleSheet.create({
  container: { flex: 1 },
  ambientOrb: {
    position: "absolute",
    width: sc(280),
    height: sc(280),
    borderRadius: sc(140),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 10 : 20,
    marginBottom: 15,
  },
  circleBarBtn: {
    width: sc(40),
    height: sc(40),
    borderRadius: 14,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.inputBorder,
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
  },
  headerTitleText: {
    fontSize: sc(17),
    fontWeight: "900",
    color: C.textDark,
    letterSpacing: -0.4,
  },
  scrollArea: { paddingHorizontal: 24, paddingBottom: 120, paddingTop: 5 },
  subViewDescription: {
    fontSize: sc(13),
    color: C.labelGray,
    paddingHorizontal: 4,
    marginBottom: 20,
    lineHeight: 20,
    fontWeight: "500",
  },

  // Form Input Infrastructure
  inputLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: C.labelGray,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginLeft: 4,
    marginTop: 18,
    marginBottom: 8,
  },
  inputContainerFrame: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.inputBorder,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: sc(50),
    marginBottom: 5,
  },
  textInputField: {
    flex: 1,
    marginLeft: 12,
    fontSize: sc(14),
    color: C.textDark,
    fontWeight: "600",
  },

  // Capabilities Spec Clusters
  servicesClusterGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
    marginBottom: 15,
  },
  serviceChipBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.inputBorder,
  },
  serviceChipBtnActive: { borderColor: C.p2, backgroundColor: C.inputBg },
  serviceChipText: { fontSize: sc(13), fontWeight: "700", color: C.textDark },

  // Glass Verification Cards
  uploadCardWrapper: {
    marginBottom: 5,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
    elevation: 3,
    shadowColor: C.p3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
  },
  uploadGlassCard: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.45)",
    alignItems: "center",
  },
  docTitleText: {
    fontSize: sc(14),
    fontWeight: "800",
    color: C.textDark,
    letterSpacing: -0.1,
  },
  docSubText: {
    fontSize: sc(11),
    color: C.labelGray,
    marginTop: 4,
    fontWeight: "500",
  },
  uploadTriggerBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: C.p2,
    backgroundColor: C.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  uploadTriggerText: { fontSize: sc(12), fontWeight: "800", color: C.p2 },
  statusStateText: { fontSize: sc(12), fontWeight: "700" },
  successCheckBadge: { padding: 4 },
  languageCardWrapper: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
    elevation: 3,
    shadowColor: C.p3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
  },
  languageGlassBlock: { padding: 4, backgroundColor: "rgba(255, 255, 255, 0.45)" },
  langSelectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  langItemText: { fontSize: sc(13), fontWeight: "700", color: C.textDark, letterSpacing: -0.1 },
  innerCardDivider: { height: 1, backgroundColor: "rgba(232, 229, 255, 0.5)", marginHorizontal: 16 },

  // Compliance Notices
  complianceNoticeBox: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 6,
    marginTop: 20,
    opacity: 0.8,
  },
  complianceNoticeText: {
    fontSize: sc(11),
    color: C.labelGray,
    lineHeight: 16,
    flex: 1,
    fontWeight: "500",
  },

  // Stepper Head Navigation
  stepperProgressContainer: { paddingHorizontal: 24, marginBottom: 15 },
  stepperBarBackground: {
    flexDirection: "row",
    backgroundColor: "rgba(244, 242, 255, 0.7)",
    borderRadius: 20,
    padding: 5,
    borderWidth: 1,
    borderColor: "rgba(232, 229, 255, 0.6)",
  },
  stepPillItem: {
    flex: 1,
    paddingVertical: 11,
    alignItems: "center",
    borderRadius: 15,
  },
  stepPillItemActive: {
    backgroundColor: C.white,
    elevation: 4,
    shadowColor: C.p2,
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  stepPillText: { fontSize: sc(13), fontWeight: "700", color: C.textMuted },
  stepPillTextActive: { color: C.p2, fontWeight: "800" },

  // CTA Master Buttons
  mainActionBtn: {
    height: sc(54),
    borderRadius: 18,
    overflow: "hidden",
    elevation: 4,
    shadowColor: C.p2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    marginTop: 35,
  },
  actionBtnGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  actionBtnText: {
    color: C.white,
    fontSize: sc(15),
    fontWeight: "900",
    letterSpacing: -0.1,
  },
});
