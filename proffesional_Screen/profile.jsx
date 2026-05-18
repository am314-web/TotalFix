import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Image,
  Switch,
  Platform,
  Alert,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import {
  ChevronLeft,
  ChevronRight,
  User,
  MapPin,
  CreditCard,
  Languages,
  Moon,
  LogOut,
  Plus,
  Home,
  Check,
  Building,
  Star,
  Award,
  Briefcase,
  FileText,
  TrendingUp,
  X,
  UploadCloud,
} from "lucide-react-native";
import AppBottomTab from "../components/AppBottomTab";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { SESSION_KEY } from "../services/session";
import { getUserAvatar, setUserAvatar } from "../services/profileAvatarService";

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

export default function ProfileEcosystemScreen() {
  const [currentView, setCurrentView] = useState("main"); // main, ratings, skills, bank, documents, settings
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");
  const [avatarUri, setAvatarUri] = useState("");

  // Professional Form State Hubs
  const [skills, setSkills] = useState(["Electrical Wiring", "AC Repair", "Home Automation", "Circuit Diagnosis"]);
  const [newSkill, setNewSkill] = useState("");
  const [bankDetails, setBankDetails] = useState({
    holderName: "Alok Mourya",
    accountNumber: "•••• •••• 4829",
    ifscCode: "HDFC0000123",
    bankName: "HDFC Bank Ltd",
  });

  const [documents, setDocuments] = useState([
    { id: "1", name: "Aadhaar_Card_Verification.pdf", status: "Verified", date: "12 Mar 2026" },
    { id: "2", name: "Electrical_License_Diploma.pdf", status: "Verified", date: "15 Mar 2026" },
    { id: "3", name: "GSTIN_Registration_Certificate.pdf", status: "Pending", date: "18 May 2026" },
  ]);

  React.useEffect(() => {
    const loadAvatar = async () => {
      const raw = await AsyncStorage.getItem(SESSION_KEY);
      const session = raw ? JSON.parse(raw) : null;
      const uid = session?.uid || "";
      setAvatarUri(await getUserAvatar(uid, "pro"));
    };
    loadAvatar();
  }, []);

  const pickAvatar = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (res.canceled) return;
    const uri = res.assets?.[0]?.uri;
    if (!uri) return;
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    const session = raw ? JSON.parse(raw) : null;
    const uid = session?.uid || "";
    await setUserAvatar(uid, uri);
    setAvatarUri(uri);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem(SESSION_KEY);
      await signOut(auth);
      router.replace("/");
    } catch (error) {
      console.error("Error during profile logout:", error);
      Alert.alert("Logout Failed", "An error occurred during logout. Please try again.");
    }
  };

  // --- PROFESSIONAL DATA STRUCTURES ---
  const dynamicRatings = {
    average: "4.92",
    totalReviews: 148,
    breakdown: [
      { stars: 5, count: 138 },
      { stars: 4, count: 8 },
      { stars: 3, count: 2 },
      { stars: 2, count: 0 },
      { stars: 1, count: 0 },
    ],
    recentFeedback: [
      { id: "1", user: "Rajesh K.", rate: 5, date: "Yesterday", text: "Exceptional speed and precision handling industrial breaker nodes." },
      { id: "2", user: "Pooja S.", rate: 5, date: "3 days ago", text: "Polite, structured, and systematically diagnosed internal conduit issues." },
    ]
  };

  const languages = ["English", "Hindi (हिंदी)", "Gujarati (ગુજરાતી)", "Spanish"];

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (target) => {
    setSkills(skills.filter(s => s !== target));
  };

  // ─── SHARED SUB-COMPONENTS ───────────────────────────────────
  const SectionLabel = ({ label, action, onAction }) => (
    <View style={s.sectionLabelRow}>
      <Text style={s.sectionLabelText}>{label}</Text>
      {action && (
        <TouchableOpacity onPress={onAction} activeOpacity={0.75}>
          <Text style={s.sectionAction}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // ─── VIEW CONSOLE HANDLERS ───────────────────────────────────

  const renderMainProfile = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollArea}>
      {/* HERO PROFILE HEADER */}
      <View style={s.profileCardWrapper}>
        <BlurView intensity={Platform.OS === 'ios' ? 45 : 95} tint="light" style={s.glassCardRow}>
          <TouchableOpacity onPress={pickAvatar} activeOpacity={0.8}>
            <Image source={{ uri: avatarUri }} style={s.profileAvatar} />
          </TouchableOpacity>
          <View style={s.profileTextMeta}>
            <Text style={s.userNameText}>Alok Mourya</Text>
            <Text style={s.userEmailText}>alokmourya@professional.com</Text>
            <View style={s.tierBadge}>
              <Text style={s.tierBadgeText}>Elite Verified Partner</Text>
            </View>
          </View>
        </BlurView>
      </View>

      {/* DASHBOARD LINK LIST */}
      <SectionLabel label="Professional Credentials" />
      
      {/* Option: Ratings Performance */}
      <TouchableOpacity style={s.menuItemWrapper} activeOpacity={0.85} onPress={() => setCurrentView("ratings")}>
        <BlurView intensity={85} tint="light" style={s.menuGlassItem}>
          <View style={[s.menuIconFrame, { backgroundColor: "rgba(245, 158, 11, 0.08)" }]}><Star size={sc(16)} color="#F59E0B" fill="#F59E0B" /></View>
          <Text style={s.menuItemTitle}>Ratings & Reviews</Text>
          <Text style={s.menuValueSummary}>★ {dynamicRatings.average}</Text>
          <ChevronRight size={sc(16)} color={C.labelGray} />
        </BlurView>
      </TouchableOpacity>

      {/* Option: Skills Expertise */}
      <TouchableOpacity style={s.menuItemWrapper} activeOpacity={0.85} onPress={() => setCurrentView("skills")}>
        <BlurView intensity={85} tint="light" style={s.menuGlassItem}>
          <View style={[s.menuIconFrame, { backgroundColor: "rgba(140, 127, 255, 0.08)" }]}><Award size={sc(16)} color={C.p1} /></View>
          <Text style={s.menuItemTitle}>Skills & Specializations</Text>
          <Text style={s.menuValueSummary}>{skills.length} Active</Text>
          <ChevronRight size={sc(16)} color={C.labelGray} />
        </BlurView>
      </TouchableOpacity>

      {/* Option: Bank Details */}
      <TouchableOpacity style={s.menuItemWrapper} activeOpacity={0.85} onPress={() => setCurrentView("bank")}>
        <BlurView intensity={85} tint="light" style={s.menuGlassItem}>
          <View style={[s.menuIconFrame, { backgroundColor: "rgba(34, 197, 94, 0.08)" }]}><CreditCard size={sc(16)} color="#22C55E" /></View>
          <Text style={s.menuItemTitle}>Payout Bank Details</Text>
          <ChevronRight size={sc(16)} color={C.labelGray} />
        </BlurView>
      </TouchableOpacity>

      {/* Option: Documents */}
      <TouchableOpacity style={s.menuItemWrapper} activeOpacity={0.85} onPress={() => setCurrentView("documents")}>
        <BlurView intensity={85} tint="light" style={s.menuGlassItem}>
          <View style={[s.menuIconFrame, { backgroundColor: "rgba(59, 130, 246, 0.08)" }]}><FileText size={sc(16)} color="#3B82F6" /></View>
          <Text style={s.menuItemTitle}>Verification Documents</Text>
          <ChevronRight size={sc(16)} color={C.labelGray} />
        </BlurView>
      </TouchableOpacity>

      <SectionLabel label="System Ecosystem" />

      {/* Option: Configuration Settings */}
      <TouchableOpacity style={s.menuItemWrapper} activeOpacity={0.85} onPress={() => setCurrentView("settings")}>
        <BlurView intensity={85} tint="light" style={s.menuGlassItem}>
          <View style={[s.menuIconFrame, { backgroundColor: "rgba(91, 76, 240, 0.08)" }]}><Building size={sc(16)} color={C.p2} /></View>
          <Text style={s.menuItemTitle}>Profile Settings</Text>
          <ChevronRight size={sc(16)} color={C.labelGray} />
        </BlurView>
      </TouchableOpacity>

      {/* Option: Logout Button */}
      <TouchableOpacity style={[s.menuItemWrapper, { marginTop: sc(20) }]} activeOpacity={0.85} onPress={handleLogout}>
        <BlurView intensity={85} tint="light" style={s.menuGlassItem}>
          <View style={[s.menuIconFrame, { backgroundColor: "rgba(239, 68, 68, 0.08)" }]}><LogOut size={sc(16)} color="#EF4444" /></View>
          <Text style={[s.menuItemTitle, { color: "#EF4444" }]}>Logout Account</Text>
        </BlurView>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderRatingsView = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollArea}>
      <SectionLabel label="Performance Matrix" />
      <Text style={s.subViewDescription}>Real-time performance aggregation analytics calculated from verified field deployments.</Text>

      {/* Big Score Card */}
      <View style={s.menuItemWrapper}>
        <BlurView intensity={85} tint="light" style={[s.menuGlassItem, { padding: 20, flexDirection: 'column', alignItems: 'center' }]}>
          <Text style={{ fontSize: sc(48), fontWeight: '900', color: C.textDark }}>{dynamicRatings.average}</Text>
          <View style={{ flexDirection: 'row', marginVertical: 6 }}>
            {[1,2,3,4,5].map((x) => <Star key={x} size={18} color="#F59E0B" fill="#F59E0B" style={{ marginHorizontal: 2 }} />)}
          </View>
          <Text style={{ fontSize: sc(12), color: C.labelGray, fontWeight: '600' }}>Lifetime rating across {dynamicRatings.totalReviews} transactions</Text>
        </BlurView>
      </View>

      <SectionLabel label="Recent Field Reviews" />
      {dynamicRatings.recentFeedback.map((feed) => (
        <View key={feed.id} style={s.menuItemWrapper}>
          <BlurView intensity={85} tint="light" style={[s.menuGlassItem, { paddingHorizontal: 16, paddingVertical: 16, alignItems: 'flex-start', flexDirection: 'column' }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 6 }}>
              <Text style={{ fontWeight: '800', color: C.textDark, fontSize: sc(14) }}>{feed.user}</Text>
              <Text style={{ fontSize: sc(11), color: C.textMuted, fontWeight: '600' }}>{feed.date}</Text>
            </View>
            <Text style={{ fontSize: sc(13), color: C.labelGray, fontWeight: '500', lineHeight: 18 }}>"{feed.text}"</Text>
          </BlurView>
        </View>
      ))}
    </ScrollView>
  );

  const renderSkillsView = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollArea}>
      <SectionLabel label="Active Specializations" />
      <Text style={s.subViewDescription}>Add or isolate modular operational skills. This dictates dispatch allocation engines.</Text>

      <View style={s.skillsContainer}>
        {skills.map((skill) => (
          <View key={skill} style={s.skillBadgeWrapper}>
            <LinearGradient colors={["#8C7FFF", "#5B4CF0"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.skillGradientBadge}>
              <Text style={s.skillBadgeText}>{skill}</Text>
              <TouchableOpacity onPress={() => handleRemoveSkill(skill)} style={s.skillCloseHitbox}>
                <X size={12} color={C.white} strokeWidth={3} />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        ))}
      </View>

      <SectionLabel label="Append Marketplace Competency" />
      <View style={s.menuItemWrapper}>
        <BlurView intensity={85} tint="light" style={[s.menuGlassItem, { padding: 6 }]}>
          <TextInput
            style={s.skillInputField}
            placeholder="Type skill cluster (e.g., HVAC Installation)"
            placeholderTextColor={C.textMuted}
            value={newSkill}
            onChangeText={setNewSkill}
          />
          <TouchableOpacity style={s.addSkillSquareBtn} onPress={handleAddSkill}>
            <Plus size={20} color={C.white} strokeWidth={2.5} />
          </TouchableOpacity>
        </BlurView>
      </View>
    </ScrollView>
  );

  const renderBankView = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollArea}>
      <SectionLabel label="Deposit Account Gateway" />
      <Text style={s.subViewDescription}>Configure designated settlement accounts where consumer escrows and contract fees deploy.</Text>

      <View style={s.menuItemWrapper}>
        <BlurView intensity={85} tint="light" style={[s.menuGlassItem, { paddingVertical: 20, flexDirection: 'column', alignItems: 'flex-start' }]}>
          <View style={s.bankDetailContainer}>
            <Text style={s.bankInputLabel}>BENEFICIARY HOLDER NAME</Text>
            <Text style={s.bankValueDisplay}>{bankDetails.holderName}</Text>
          </View>

          <View style={[s.bankDetailContainer, { marginTop: 16 }]}>
            <Text style={s.bankInputLabel}>ACCOUNT DESIGNATION NUMBER</Text>
            <Text style={s.bankValueDisplay}>{bankDetails.accountNumber}</Text>
          </View>

          <View style={{ flexDirection: 'row', marginTop: 16, width: '100%' }}>
            <View style={{ flex: 1 }}>
              <Text style={s.bankInputLabel}>IFSC ROUTING SYSTEM</Text>
              <Text style={s.bankValueDisplay}>{bankDetails.ifscCode}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.bankInputLabel}>CORE INSTITUTION</Text>
              <Text style={s.bankValueDisplay}>{bankDetails.bankName}</Text>
            </View>
          </View>
        </BlurView>
      </View>

      <TouchableOpacity style={s.dashedActionBtn} activeOpacity={0.75} onPress={() => Alert.alert("Update System", "Routing to encrypted KYC structural updating node.")}>
        <CreditCard size={15} color={C.p2} style={{ marginRight: 8 }} />
        <Text style={s.dashedActionText}>Modify Settlement Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderDocumentsView = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollArea}>
      <SectionLabel label="Compliance Dossier Vault" />
      <Text style={s.subViewDescription}>State-regulated verification parameters. Modifying or removing active clearings triggers status reassessment.</Text>

      {documents.map((doc) => (
        <View key={doc.id} style={s.menuItemWrapper}>
          <BlurView intensity={85} tint="light" style={[s.menuGlassItem, { paddingVertical: 16 }]}>
            <View style={[s.menuIconFrame, { backgroundColor: doc.status === "Verified" ? "rgba(34, 197, 94, 0.08)" : "rgba(245, 158, 11, 0.08)" }]}>
              <FileText size={sc(15)} color={doc.status === "Verified" ? "#22C55E" : "#F59E0B"} />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={s.paymentProviderText} numberOfLines={1}>{doc.name}</Text>
              <Text style={s.paymentDetailsText}>Uploaded: {doc.date}</Text>
            </View>
            <View style={[s.statusCapsule, { backgroundColor: doc.status === "Verified" ? "rgba(34, 197, 94, 0.12)" : "rgba(245, 158, 11, 0.12)" }]}>
              <Text style={[s.statusCapsuleText, { color: doc.status === "Verified" ? "#22C55E" : "#F59E0B" }]}>{doc.status}</Text>
            </View>
          </BlurView>
        </View>
      ))}

      <TouchableOpacity style={s.dashedActionBtn} activeOpacity={0.75}>
        <UploadCloud size={16} color={C.p2} style={{ marginRight: 8 }} />
        <Text style={s.dashedActionText}>Upload New Credentials</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderSettingsView = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollArea}>
      <SectionLabel label="Interface Parameters" />
      <Text style={s.subViewDescription}>Configure local operational ecosystem vectors.</Text>

      {/* Option: Language Settings */}
      <TouchableOpacity style={s.menuItemWrapper} activeOpacity={0.85} onPress={() => {}}>
        <BlurView intensity={85} tint="light" style={s.menuGlassItem}>
          <View style={[s.menuIconFrame, { backgroundColor: "rgba(140, 127, 255, 0.08)" }]}><Languages size={sc(16)} color={C.p1} /></View>
          <Text style={s.menuItemTitle}>Language Preference</Text>
          <Text style={s.menuValueSummary}>{selectedLang}</Text>
          <ChevronRight size={sc(16)} color={C.labelGray} />
        </BlurView>
      </TouchableOpacity>

      {/* Option: Dark Mode Toggle */}
      <View style={s.menuItemWrapper}>
        <BlurView intensity={85} tint="light" style={s.menuGlassItem}>
          <View style={[s.menuIconFrame, { backgroundColor: "rgba(245, 158, 11, 0.08)" }]}><Moon size={sc(16)} color="#F59E0B" /></View>
          <Text style={s.menuItemTitle}>Dark Theme Architecture</Text>
          <Switch value={isDarkMode} onValueChange={setIsDarkMode} trackColor={{ false: C.inputBorder, true: C.p1 }} thumbColor={isDarkMode ? C.p2 : "#FFF"} />
        </BlurView>
      </View>
    </ScrollView>
  );

  // ─── MASTER SYSTEM CONTROLLER DISPATCHER ──────────────────────
  const getSubPageTitle = () => {
    switch (currentView) {
      case "ratings": return "Ratings & Portfolio";
      case "skills": return "Specialized Skills";
      case "bank": return "Settlement Setup";
      case "documents": return "Compliance Dossier";
      case "settings": return "Profile Settings";
      default: return "Partner Dashboard";
    }
  };

  return (
    <View style={s.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <LinearGradient colors={["#F4F3FF", "#FDFDFF"]} style={StyleSheet.absoluteFill} />

      {/* GLASS DEPTH LAYERS */}
      <View style={[s.ambientOrb, { top: -sc(40), left: -sc(40), backgroundColor: "rgba(140, 127, 255, 0.14)" }]} />
      <View style={[s.ambientOrb, { bottom: height * 0.15, right: -sc(60), backgroundColor: "rgba(91, 76, 240, 0.1)" }]} />

      <SafeAreaView style={{ flex: 1 }}>
        {/* TOP COMPONENT DOCK BAR */}
        <View style={s.header}>
          {currentView !== "main" ? (
            <TouchableOpacity style={s.circleBarBtn} onPress={() => setCurrentView("main")} activeOpacity={0.75}>
              <ChevronLeft size={sc(20)} color={C.textDark} strokeWidth={2.5} />
            </TouchableOpacity>
          ) : (
            <View style={[s.circleBarBtn, { opacity: 0 }]} />
          )}
          <Text style={s.headerTitleText}>{getSubPageTitle()}</Text>
          <View style={[s.circleBarBtn, { opacity: 0 }]} />
        </View>

        {/* ECOSYSTEM SWITCH ROUTER ENGINE */}
        {currentView === "main" && renderMainProfile()}
        {currentView === "ratings" && renderRatingsView()}
        {currentView === "skills" && renderSkillsView()}
        {currentView === "bank" && renderBankView()}
        {currentView === "documents" && renderDocumentsView()}
        {currentView === "settings" && renderSettingsView()}
      </SafeAreaView>
      <AppBottomTab />
    </View>
  );
}

// ─── MASTER CORE STYLES CONSOLE SHEET ──────────────────────────
const s = StyleSheet.create({
  container: { flex: 1 },
  ambientOrb: { position: "absolute", width: sc(260), height: sc(260), borderRadius: sc(130), opacity: 0.8 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 10 : 20, marginBottom: 15 },
  circleBarBtn: { width: sc(40), height: sc(40), borderRadius: 14, backgroundColor: C.white, borderWidth: 1, borderColor: C.inputBorder, justifyContent: "center", alignItems: "center", elevation: 1 },
  headerTitleText: { fontSize: sc(17), fontWeight: "900", color: C.textDark, letterSpacing: -0.4 },
  scrollArea: { paddingHorizontal: 24, paddingBottom: 120, paddingTop: 5 },
  
  // Section Label Styling
  sectionLabelRow: { paddingHorizontal: 4, marginTop: 20, marginBottom: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionLabelText: { fontSize: 12, fontWeight: "800", color: C.labelGray, textTransform: "uppercase", letterSpacing: 1 },
  sectionAction: { fontSize: 13, fontWeight: "600", color: C.p2 },
  
  subViewDescription: { fontSize: sc(12), color: C.labelGray, paddingHorizontal: 4, marginBottom: 20, lineHeight: 18, fontWeight: "500" },

  // Profile Header Tile
  profileCardWrapper: { marginBottom: 10, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)', elevation: 3, shadowColor: C.p3, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12 },
  glassCardRow: { flexDirection: "row", padding: 20, backgroundColor: "rgba(255, 255, 255, 0.45)", alignItems: "center" },
  profileAvatar: { width: sc(64), height: sc(64), borderRadius: 22, backgroundColor: C.inputBg, borderWidth: 2, borderColor: C.white },
  profileTextMeta: { flex: 1, marginLeft: 16 },
  userNameText: { fontSize: sc(18), fontWeight: "900", color: C.textDark, letterSpacing: -0.3 },
  userEmailText: { fontSize: sc(12), color: C.labelGray, marginTop: 2, fontWeight: "500" },
  tierBadge: { backgroundColor: "rgba(91, 76, 240, 0.08)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: "flex-start", marginTop: 8 },
  tierBadgeText: { fontSize: 10, fontWeight: "800", color: C.p2, textTransform: "uppercase" },

  // Unified Menu Items
  menuItemWrapper: { 
    marginBottom: 12, 
    borderRadius: 24, 
    overflow: "hidden", 
    borderWidth: 1, 
    borderColor: "rgba(255,255,255,0.7)", 
    elevation: 3,
    shadowColor: C.p3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12
  },
  menuGlassItem: { flexDirection: "row", padding: 14, backgroundColor: "rgba(255, 255, 255, 0.45)", alignItems: "center" },
  menuIconFrame: { width: sc(36), height: sc(36), borderRadius: 11, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: C.inputBorder, backgroundColor: C.white },
  menuItemTitle: { flex: 1, fontSize: sc(14), fontWeight: "700", color: C.textDark, marginLeft: 14, letterSpacing: -0.1 },
  menuValueSummary: { fontSize: sc(12), color: C.labelGray, fontWeight: "700", marginRight: 6 },

  // Payments Elements (Used inside Document views mapping layout alignment context)
  paymentProviderText: { fontSize: sc(14), fontWeight: "700", color: C.textDark, letterSpacing: -0.1 },
  paymentDetailsText: { fontSize: sc(12), color: C.labelGray, marginTop: 2, fontWeight: "500" },

  // Dashed Auxiliary Button Housing
  dashedActionBtn: { flexDirection: "row", justifyContent: "center", alignItems: "center", borderStyle: "dashed", borderWidth: 1.5, borderColor: C.p1, backgroundColor: "rgba(140, 127, 255, 0.04)", padding: 16, borderRadius: 22, marginTop: 8, marginHorizontal: 4 },
  dashedActionText: { fontSize: sc(13), color: C.p2, fontWeight: "800" },

  // Professional Core Appended Subsystem Elements
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 4, marginBottom: 10 },
  skillBadgeWrapper: { marginRight: 8, marginBottom: 8, borderRadius: 14, overflow: 'hidden' },
  skillGradientBadge: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 14 },
  skillBadgeText: { color: C.white, fontSize: sc(12), fontWeight: '700', letterSpacing: -0.1 },
  skillCloseHitbox: { marginLeft: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: 3 },
  skillInputField: { flex: 1, paddingHorizontal: 14, fontSize: sc(14), fontWeight: '600', color: C.textDark, height: sc(40) },
  addSkillSquareBtn: { width: sc(40), height: sc(40), borderRadius: 14, backgroundColor: C.p2, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  bankDetailContainer: { width: '100%', borderBottomWidth: 1, borderBottomColor: 'rgba(232, 229, 255, 0.5)', paddingBottom: 10 },
  bankInputLabel: { fontSize: 10, fontWeight: '800', color: C.labelGray, letterSpacing: 0.5, marginBottom: 4 },
  bankValueDisplay: { fontSize: sc(15), fontWeight: '700', color: C.textDark },
  statusCapsule: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusCapsuleText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' }
});