import React, { useState } from "react";
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
  TextInput,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Star,
  Wrench,
  CreditCard,
  FileCheck,
  Settings,
  LogOut,
  Plus,
  Check,
  Moon,
  UploadCloud,
  ShieldCheck,
  X,
} from "lucide-react-native";
import AppBottomTab from "../components/AppBottomTab";

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

export default function ProProfileEcosystemScreen() {
  const [currentView, setCurrentView] = useState("main"); // main, bank, documents, skills
  const [isDarkMode, setIsDarkMode] = useState(false);

  // --- BANK INFO FORM STATES ---
  const [accountName, setAccountName] = useState("Rahul Sharma");
  const [accountNum, setAccountNum] = useState("•••• •••• 5624");
  const [ifsc, setIfsc] = useState("HDFC0000124");
  const [bankName, setBankName] = useState("HDFC Bank Ltd");

  // --- SKILLS MANAGEMENT MATRIX ---
  const [proSkills, setProSkills] = useState([
    { name: "Split AC Service", selected: true },
    { name: "Window AC Service", selected: true },
    { name: "Gas Charging (R32/R410)", selected: true },
    { name: "Inverter AC Diagnostics", selected: true },
    { name: "Compressor Overhauling", selected: false },
    { name: "HVAC Duct Cleaning", selected: false },
  ]);

  // --- DOCUMENTS MOCK ARCHIVE ---
  const [docs, setDocs] = useState([
    { name: "Aadhaar Card / Government ID", status: "Verified", date: "Approved on 12 Mar 2026" },
    { name: "Trade Competency Certificate", status: "Verified", date: "Approved on 14 Mar 2026" },
  ]);

  const toggleSkill = (index) => {
    const updated = [...proSkills];
    updated[index].selected = !updated[index].selected;
    setProSkills(updated);
  };

  // ─── SHARED BASE RENDERING SECTIONS ──────────────────────────
  const SectionLabel = ({ label }) => (
    <View style={s.sectionLabelRow}>
      <Text style={s.sectionLabelText}>{label}</Text>
    </View>
  );

  // ─── VIEW 1: MAIN PROFESSIONAL CENTER PANEL ──────────────────
  const renderMainProfile = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollArea}>
      
      {/* IDENTITY PROFILE METRIC TILE */}
      <View style={s.profileCardWrapper}>
        <BlurView intensity={Platform.OS === 'ios' ? 45 : 95} tint="light" style={s.glassCardRow}>
          <View style={s.avatarContainer}>
            <Image source={{ uri: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=300" }} style={s.profileAvatar} />
            <View style={s.verifiedBadge}><Check size={10} color={C.white} strokeWidth={3} /></View>
          </View>
          
          <View style={s.profileTextMeta}>
            <Text style={s.userNameText}>Rahul Sharma</Text>
            <Text style={s.userEmailText}>rahul.sharma@pro.platform.com</Text>
            
            {/* Rating Pill Display */}
            <View style={s.ratingPillRow}>
              <Star size={12} color="#F59E0B" fill="#F59E0B" />
              <Text style={s.ratingValueText}>4.9</Text>
              <Text style={s.ratingCountText}>(412 completed tasks)</Text>
            </View>
          </View>
        </BlurView>
      </View>

      {/* DASHBOARD ACTIONS GRID */}
      <SectionLabel label="Operational Management" />

      {/* Route Action: Skills Management */}
      <TouchableOpacity style={s.menuItemWrapper} activeOpacity={0.85} onPress={() => setCurrentView("skills")}>
        <BlurView intensity={85} tint="light" style={s.menuGlassItem}>
          <View style={[s.menuIconFrame, { backgroundColor: "rgba(91, 76, 240, 0.08)" }]}><Wrench size={sc(16)} color={C.p2} /></View>
          <Text style={s.menuItemTitle}>My Specializations & Skills</Text>
          <Text style={s.menuValueSummary}>{proSkills.filter(s=>s.selected).length} Active</Text>
          <ChevronRight size={sc(16)} color={C.labelGray} />
        </BlurView>
      </TouchableOpacity>

      {/* Route Action: Bank Details Configuration */}
      <TouchableOpacity style={s.menuItemWrapper} activeOpacity={0.85} onPress={() => setCurrentView("bank")}>
        <BlurView intensity={85} tint="light" style={s.menuGlassItem}>
          <View style={[s.menuIconFrame, { backgroundColor: "rgba(34, 197, 94, 0.08)" }]}><CreditCard size={sc(16)} color="#22C55E" /></View>
          <Text style={s.menuItemTitle}>Bank Payout Accounts</Text>
          <ChevronRight size={sc(16)} color={C.labelGray} />
        </BlurView>
      </TouchableOpacity>

      {/* Route Action: Documents Verification Portal */}
      <TouchableOpacity style={s.menuItemWrapper} activeOpacity={0.85} onPress={() => setCurrentView("documents")}>
        <BlurView intensity={85} tint="light" style={s.menuGlassItem}>
          <View style={[s.menuIconFrame, { backgroundColor: "rgba(140, 127, 255, 0.08)" }]}><FileCheck size={sc(16)} color={C.p1} /></View>
          <Text style={s.menuItemTitle}>Documents & Verification Vault</Text>
          <ChevronRight size={sc(16)} color={C.labelGray} />
        </BlurView>
      </TouchableOpacity>

      {/* Configuration Action: System Settings */}
      <SectionLabel label="Preferences" />
      <View style={s.menuItemWrapper}>
        <BlurView intensity={85} tint="light" style={s.menuGlassItem}>
          <View style={[s.menuIconFrame, { backgroundColor: "rgba(245, 158, 11, 0.08)" }]}><Moon size={sc(16)} color="#F59E0B" /></View>
          <Text style={s.menuItemTitle}>Dark Operational Interface</Text>
          <Switch value={isDarkMode} onValueChange={setIsDarkMode} trackColor={{ false: C.inputBorder, true: C.p1 }} thumbColor={isDarkMode ? C.p2 : "#FFF"} />
        </BlurView>
      </View>

      {/* Termination Action: Logout */}
      <TouchableOpacity style={[s.menuItemWrapper, { marginTop: sc(24) }]} activeOpacity={0.85} onPress={() => alert("Session terminated safely.")}>
        <BlurView intensity={85} tint="light" style={s.menuGlassItem}>
          <View style={[s.menuIconFrame, { backgroundColor: "rgba(239, 68, 68, 0.08)" }]}><LogOut size={sc(16)} color="#EF4444" /></View>
          <Text style={[s.menuItemTitle, { color: "#EF4444" }]}>Logout Profile Session</Text>
        </BlurView>
      </TouchableOpacity>
    </ScrollView>
  );

  // ─── VIEW 2: SPECIALIZATION MATRIX MANAGING SCREEN ───────────
  const renderSkillsView = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollArea}>
      <SectionLabel label="Select Your Core Capabilities" />
      <Text style={s.subViewDescription}>Toggle active capabilities. Bookings are routed straight to your feed based on selections mapped below.</Text>
      
      <View style={s.skillsGridCluster}>
        {proSkills.map((skill, idx) => (
          <TouchableOpacity
            key={skill.name}
            activeOpacity={0.8}
            onPress={() => toggleSkill(idx)}
            style={[s.skillChipNode, skill.selected && s.skillChipNodeActive]}
          >
            {skill.selected && <Check size={14} color={C.p2} style={{ marginRight: 6 }} />}
            <Text style={[s.skillChipText, skill.selected && { color: C.p2, fontWeight: "800" }]}>{skill.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={s.dashedActionBtn} activeOpacity={0.75}>
        <Plus size={15} color={C.p2} style={{ marginRight: 8 }} />
        <Text style={s.dashedActionText}>Suggest Additional Specialization</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  // ─── VIEW 3: BANK DETAILS ROUTE INPUT CONFIGURATION ──────────
  const renderBankView = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollArea}>
      <SectionLabel label="Settlement Account Profiles" />
      <Text style={s.subViewDescription}>Direct escrow deposits from completed consumer tasks transfer directly into this ledger path.</Text>

      <Text style={s.inputFieldLabelText}>Beneficiary Name</Text>
      <View style={s.inputContainerBlock}>
        <TextInput style={s.formInputField} value={accountName} onChangeText={setAccountName} />
      </View>

      <Text style={s.inputFieldLabelText}>Account Number</Text>
      <View style={s.inputContainerBlock}>
        <TextInput style={s.formInputField} value={accountNum} onChangeText={setAccountNum} keyboardType="number-pad" />
      </View>

      <Text style={s.inputFieldLabelText}>IFSC System Code</Text>
      <View style={s.inputContainerBlock}>
        <TextInput style={s.formInputField} value={ifsc} onChangeText={setIfsc} autoCapitalize="characters" />
      </View>

      <Text style={s.inputFieldLabelText}>Bank Entity Title</Text>
      <View style={s.inputContainerBlock}>
        <TextInput style={s.formInputField} value={bankName} onChangeText={setBankName} />
      </View>

      <TouchableOpacity style={s.solidCtaBtn} activeOpacity={0.85} onPress={() => { alert("Bank profile updated safely."); setCurrentView("main"); }}>
        <LinearGradient colors={[C.p1, C.p2]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.ctaBtnGradient}>
          <Text style={s.ctaBtnText}>Save Account Vector</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );

  // ─── VIEW 4: VERIFICATION DOCUMENTS PORTAL ───────────────────
  const renderDocumentsView = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollArea}>
      <SectionLabel label="Verified Documentation Vault" />
      <Text style={s.subViewDescription}>Current verification status map. Modifications or replacements undergo re-auditing cycles immediately.</Text>

      {docs.map((doc, i) => (
        <View key={i} style={s.menuItemWrapper}>
          <BlurView intensity={85} tint="light" style={[s.menuGlassItem, { paddingVertical: 16 }]}>
            <View style={[s.menuIconFrame, { backgroundColor: "rgba(34, 197, 94, 0.08)", borderColor: "rgba(34,197,94,0.2)" }]}>
              <ShieldCheck size={16} color={C.success} />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={s.documentTitleLabel}>{doc.name}</Text>
              <Text style={s.documentMetaSub}>{doc.date}</Text>
            </View>
            <View style={s.successStatusBadge}>
              <Text style={s.successBadgeText}>{doc.status}</Text>
            </View>
          </BlurView>
        </View>
      ))}

      <TouchableOpacity style={s.dashedActionBtn} activeOpacity={0.75}>
        <UploadCloud size={15} color={C.p2} style={{ marginRight: 8 }} />
        <Text style={s.dashedActionText}>Upload Supplemental License</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  // ─── SUB-PAGE TITLE SELECTOR CONFIGURATION ───────────────────
  const getSubPageTitle = () => {
    switch (currentView) {
      case "skills": return "My Specializations";
      case "bank": return "Bank Payout Setup";
      case "documents": return "Verification Vault";
      default: return "Partner Center";
    }
  };

  return (
    <View style={s.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <LinearGradient colors={["#F4F3FF", "#FDFDFF"]} style={StyleSheet.absoluteFill} />

      {/* AMBIENT RADIAL DEPTH BLOBS */}
      <View style={[s.ambientOrb, { top: -sc(40), left: -sc(40), backgroundColor: "rgba(140, 127, 255, 0.14)" }]} />
      <View style={[s.ambientOrb, { bottom: height * 0.15, right: -sc(60), backgroundColor: "rgba(91, 76, 240, 0.1)" }]} />

      <SafeAreaView style={{ flex: 1 }}>
        {/* TOP INTERACTIVE HUB DOCK BAR */}
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

        {/* CORE DISPATCH SYSTEM SWITCH ENGINE */}
        {currentView === "main" && renderMainProfile()}
        {currentView === "skills" && renderSkillsView()}
        {currentView === "bank" && renderBankView()}
        {currentView === "documents" && renderDocumentsView()}
      </SafeAreaView>
      <AppBottomTab />
    </View>
  );
}

// ─── MASTER PLATFORM DESIGN LAYOUT CSS CONFIG ─────────────────
const s = StyleSheet.create({
  container: { flex: 1 },
  ambientOrb: { position: "absolute", width: sc(280), height: sc(280), borderRadius: sc(140), opacity: 0.8 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 10 : 20, marginBottom: 15 },
  circleBarBtn: { width: sc(40), height: sc(40), borderRadius: 14, backgroundColor: C.white, borderWidth: 1, borderColor: C.inputBorder, justifyContent: "center", alignItems: "center", elevation: 1 },
  headerTitleText: { fontSize: sc(17), fontWeight: "900", color: C.textDark, letterSpacing: -0.4 },
  scrollArea: { paddingHorizontal: 24, paddingBottom: 120, paddingTop: 5 },
  
  // Custom Labels Architecture
  sectionLabelRow: { paddingHorizontal: 4, marginTop: 20, marginBottom: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionLabelText: { fontSize: 12, fontWeight: "800", color: C.labelGray, textTransform: "uppercase", letterSpacing: 1 },
  subViewDescription: { fontSize: sc(12), color: C.labelGray, paddingHorizontal: 4, marginBottom: 20, lineHeight: 18, fontWeight: "500" },

  // Profile Identity Row Block
  profileCardWrapper: { marginBottom: 10, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)', elevation: 3, shadowColor: C.p3, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12 },
  glassCardRow: { flexDirection: "row", padding: 20, backgroundColor: "rgba(255, 255, 255, 0.45)", alignItems: "center" },
  avatarContainer: { position: "relative" },
  profileAvatar: { width: sc(64), height: sc(64), borderRadius: 22, backgroundColor: C.inputBg, borderWidth: 2, borderColor: C.white },
  verifiedBadge: { position: "absolute", bottom: -2, right: -2, backgroundColor: C.p2, borderRadius: 6, width: 14, height: 14, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: C.white },
  profileTextMeta: { flex: 1, marginLeft: 16 },
  userNameText: { fontSize: sc(18), fontWeight: "900", color: C.textDark, letterSpacing: -0.3 },
  userEmailText: { fontSize: sc(12), color: C.labelGray, marginTop: 2, fontWeight: "500" },
  ratingPillRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  ratingValueText: { fontSize: sc(12), fontWeight: "900", color: C.textDark, marginLeft: 4 },
  ratingCountText: { fontSize: sc(11), color: C.labelGray, marginLeft: 4, fontWeight: "500" },

  // Functional Structured List Configuration Menu
  menuItemWrapper: { marginBottom: 12, borderRadius: 24, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.7)", elevation: 3, shadowColor: C.p3, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12 },
  menuGlassItem: { flexDirection: "row", padding: 14, backgroundColor: "rgba(255, 255, 255, 0.45)", alignItems: "center" },
  menuIconFrame: { width: sc(36), height: sc(36), borderRadius: 11, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: C.inputBorder, backgroundColor: C.white },
  menuItemTitle: { flex: 1, fontSize: sc(14), fontWeight: "700", color: C.textDark, marginLeft: 14, letterSpacing: -0.1 },
  menuValueSummary: { fontSize: sc(12), color: C.labelGray, fontWeight: "800", marginRight: 6 },

  // Interactive Capability Chip Grids
  skillsGridCluster: { flexDirection: "row", flexWrap: "wrap", gap: 10, paddingHorizontal: 4, marginBottom: 15 },
  skillChipNode: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, backgroundColor: C.white, borderWidth: 1, borderColor: C.inputBorder },
  skillChipNodeActive: { borderColor: C.p2, backgroundColor: C.inputBg },
  skillChipText: { fontSize: sc(13), fontWeight: "700", color: C.textDark, letterSpacing: -0.1 },

  // Banking System Node Layouts
  inputFieldLabelText: { fontSize: 11, fontWeight: "800", color: C.labelGray, textTransform: "uppercase", letterSpacing: 1, marginLeft: 4, marginTop: 14, marginBottom: 8 },
  inputContainerBlock: { backgroundColor: C.white, borderWidth: 1, borderColor: C.inputBorder, borderRadius: 16, paddingHorizontal: 16, height: sc(50), justifyContent: "center", marginBottom: 6 },
  formInputField: { fontSize: sc(14), color: C.textDark, fontWeight: "700" },
  solidCtaBtn: { height: sc(52), borderRadius: 18, overflow: "hidden", elevation: 4, shadowColor: C.p2, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, marginTop: 30 },
  ctaBtnGradient: { flex: 1, justifyContent: "center", alignItems: "center" },
  ctaBtnText: { color: C.white, fontSize: sc(15), fontWeight: "900", letterSpacing: -0.1 },

  // Vault Verification Layout Nodes
  documentTitleLabel: { fontSize: sc(14), fontWeight: "800", color: C.textDark, letterSpacing: -0.1 },
  documentMetaSub: { fontSize: sc(11), color: C.labelGray, marginTop: 4, fontWeight: "600" },
  successStatusBadge: { backgroundColor: "rgba(34, 197, 94, 0.08)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  successBadgeText: { fontSize: 11, fontWeight: "800", color: C.success },

  // Secondary Auxiliary Elements
  innerCardDivider: { height: 1, backgroundColor: "rgba(232, 229, 255, 0.5)", marginHorizontal: 16 },
  dashedActionBtn: { flexDirection: "row", justifyContent: "center", alignItems: "center", borderStyle: "dashed", borderWidth: 1.5, borderColor: C.p1, backgroundColor: "rgba(140, 127, 255, 0.04)", padding: 16, borderRadius: 22, marginTop: 8, marginHorizontal: 4 },
  dashedActionText: { fontSize: sc(13), color: C.p2, fontWeight: "800" },
});