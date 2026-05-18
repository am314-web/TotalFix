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
  const [currentView, setCurrentView] = useState("main"); // main, addresses, payments, language
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");
  const [avatarUri, setAvatarUri] = useState("");

  React.useEffect(() => {
    const loadAvatar = async () => {
      const raw = await AsyncStorage.getItem(SESSION_KEY);
      const session = raw ? JSON.parse(raw) : null;
      const uid = session?.uid || "";
      setAvatarUri(await getUserAvatar(uid, "client"));
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

  // --- SUB-DATA STRUCTURES ---
  const savedAddresses = [
    { id: "1", type: "Home", icon: Home, details: "B-402, Skyline Residency, Satellite", city: "Ahmedabad, Gujarat" },
    { id: "2", type: "Office", icon: Building, details: "6th Floor, Alakmalak Towers, SG Highway", city: "Ahmedabad, Gujarat" },
  ];

  const paymentMethods = [
    { id: "1", provider: "HDFC Bank Credit Card", type: "Visa •••• 8975", expiry: "12/29" },
    { id: "2", provider: "Google Pay UPI", type: "alokmourya@oksbi", expiry: "Active" },
  ];

  const languages = ["English", "Hindi (हिंदी)", "Gujarati (ગુજરાતી)", "Spanish"];

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
            <Text style={s.userEmailText}>alokmourya@gmail.com</Text>
            <View style={s.tierBadge}>
              <Text style={s.tierBadgeText}>Premium Member</Text>
            </View>
          </View>
        </BlurView>
      </View>

      {/* DASHBOARD LINK LIST */}
      <SectionLabel label="Account Settings" />
      
      {/* Option: Saved Addresses */}
      <TouchableOpacity style={s.menuItemWrapper} activeOpacity={0.85} onPress={() => setCurrentView("addresses")}>
        <BlurView intensity={85} tint="light" style={s.menuGlassItem}>
          <View style={[s.menuIconFrame, { backgroundColor: "rgba(91, 76, 240, 0.08)" }]}><MapPin size={sc(16)} color={C.p2} /></View>
          <Text style={s.menuItemTitle}>Saved Addresses</Text>
          <ChevronRight size={sc(16)} color={C.labelGray} />
        </BlurView>
      </TouchableOpacity>

      {/* Option: Payment Methods */}
      <TouchableOpacity style={s.menuItemWrapper} activeOpacity={0.85} onPress={() => setCurrentView("payments")}>
        <BlurView intensity={85} tint="light" style={s.menuGlassItem}>
          <View style={[s.menuIconFrame, { backgroundColor: "rgba(34, 197, 94, 0.08)" }]}><CreditCard size={sc(16)} color="#22C55E" /></View>
          <Text style={s.menuItemTitle}>Payment Methods</Text>
          <ChevronRight size={sc(16)} color={C.labelGray} />
        </BlurView>
      </TouchableOpacity>

      {/* Option: Language Settings */}
      <TouchableOpacity style={s.menuItemWrapper} activeOpacity={0.85} onPress={() => setCurrentView("language")}>
        <BlurView intensity={85} tint="light" style={s.menuGlassItem}>
          <View style={[s.menuIconFrame, { backgroundColor: "rgba(140, 127, 255, 0.08)" }]}><Languages size={sc(16)} color={C.p1} /></View>
          <Text style={s.menuItemTitle}>Language Settings</Text>
          <Text style={s.menuValueSummary}>{selectedLang}</Text>
          <ChevronRight size={sc(16)} color={C.labelGray} />
        </BlurView>
      </TouchableOpacity>

      {/* Option: Dark Mode Toggle */}
      <View style={s.menuItemWrapper}>
        <BlurView intensity={85} tint="light" style={s.menuGlassItem}>
          <View style={[s.menuIconFrame, { backgroundColor: "rgba(245, 158, 11, 0.08)" }]}><Moon size={sc(16)} color="#F59E0B" /></View>
          <Text style={s.menuItemTitle}>Dark Mode</Text>
          <Switch value={isDarkMode} onValueChange={setIsDarkMode} trackColor={{ false: C.inputBorder, true: C.p1 }} thumbColor={isDarkMode ? C.p2 : "#FFF"} />
        </BlurView>
      </View>

      {/* Option: Logout Button */}
      <TouchableOpacity style={[s.menuItemWrapper, { marginTop: sc(20) }]} activeOpacity={0.85} onPress={handleLogout}>
        <BlurView intensity={85} tint="light" style={s.menuGlassItem}>
          <View style={[s.menuIconFrame, { backgroundColor: "rgba(239, 68, 68, 0.08)" }]}><LogOut size={sc(16)} color="#EF4444" /></View>
          <Text style={[s.menuItemTitle, { color: "#EF4444" }]}>Logout Account</Text>
        </BlurView>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderAddressesView = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollArea}>
      <SectionLabel label="Your Saved Locations" />
      <Text style={s.subViewDescription}>Manage your on-demand service delivery locations.</Text>
      
      {savedAddresses.map((addr) => {
        const IconComponent = addr.icon;
        return (
          <View key={addr.id} style={s.menuItemWrapper}>
            <BlurView intensity={85} tint="light" style={[s.menuGlassItem, { paddingVertical: 16, alignItems: 'flex-start' }]}>
              <View style={[s.menuIconFrame, { backgroundColor: C.inputBg, marginTop: 2 }]}><IconComponent size={sc(15)} color={C.p2} /></View>
              <View style={s.addressTextGroup}>
                <Text style={s.addressTypeTitle}>{addr.type}</Text>
                <Text style={s.addressDetails}>{addr.details}</Text>
                <Text style={s.addressCity}>{addr.city}</Text>
              </View>
            </BlurView>
          </View>
        );
      })}

      <TouchableOpacity style={s.dashedActionBtn} activeOpacity={0.75}>
        <Plus size={15} color={C.p2} style={{ marginRight: 8 }} />
        <Text style={s.dashedActionText}>Add New Address</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderPaymentsView = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollArea}>
      <SectionLabel label="Saved Accounts" />
      <Text style={s.subViewDescription}>Configure saved payment systems for faster checkout chains.</Text>
      
      {paymentMethods.map((method) => (
        <View key={method.id} style={s.menuItemWrapper}>
          <BlurView intensity={85} tint="light" style={[s.menuGlassItem, { paddingVertical: 16 }]}>
            <View style={[s.menuIconFrame, { backgroundColor: C.inputBg }]}><CreditCard size={sc(15)} color={C.p2} /></View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={s.paymentProviderText}>{method.provider}</Text>
              <Text style={s.paymentDetailsText}>{method.type}</Text>
            </View>
            <Text style={s.paymentExpiryText}>{method.expiry}</Text>
          </BlurView>
        </View>
      ))}

      <TouchableOpacity style={s.dashedActionBtn} activeOpacity={0.75}>
        <Plus size={15} color={C.p2} style={{ marginRight: 8 }} />
        <Text style={s.dashedActionText}>Add Payment Method</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderLanguageView = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollArea}>
      <SectionLabel label="Interface Language" />
      <Text style={s.subViewDescription}>Select preferred presentation language matrix for your platform profile.</Text>
      
      <View style={s.languageCardWrapper}>
        <BlurView intensity={90} tint="light" style={s.languageGlassBlock}>
          {languages.map((lang, index) => {
            const isSelected = selectedLang === lang;
            return (
              <View key={lang}>
                {index > 0 && <View style={s.innerCardDivider} />}
                <TouchableOpacity style={s.langSelectionRow} activeOpacity={0.75} onPress={() => setSelectedLang(lang)}>
                  <Text style={[s.langItemText, isSelected && { color: C.p2, fontWeight: "800" }]}>{lang}</Text>
                  {isSelected && <Check size={16} color={C.p2} strokeWidth={2.5} />}
                </TouchableOpacity>
              </View>
            );
          })}
        </BlurView>
      </View>
    </ScrollView>
  );

  // ─── MASTER SYSTEM CONTROLLER DISPATCHER ──────────────────────
  const getSubPageTitle = () => {
    switch (currentView) {
      case "addresses": return "Saved Addresses";
      case "payments": return "Payment Methods";
      case "language": return "Language Settings";
      default: return "My Profile";
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
        {currentView === "addresses" && renderAddressesView()}
        {currentView === "payments" && renderPaymentsView()}
        {currentView === "language" && renderLanguageView()}
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

  // Addresses Elements
  addressTextGroup: { flex: 1, marginLeft: 14 },
  addressTypeTitle: { fontSize: sc(14), fontWeight: "800", color: C.textDark, letterSpacing: -0.1 },
  addressDetails: { fontSize: sc(12), color: C.labelGray, marginTop: 4, fontWeight: "600", lineHeight: 18 },
  addressCity: { fontSize: sc(11), color: C.textMuted, marginTop: 2, fontWeight: "700" },

  // Payments Elements
  paymentProviderText: { fontSize: sc(14), fontWeight: "700", color: C.textDark, letterSpacing: -0.1 },
  paymentDetailsText: { fontSize: sc(12), color: C.labelGray, marginTop: 2, fontWeight: "500" },
  paymentExpiryText: { fontSize: sc(12), color: C.textDark, fontWeight: "700" },

  // Language Setup Block
  languageCardWrapper: { borderRadius: 24, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.7)", elevation: 3, shadowColor: C.p3, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12 },
  languageGlassBlock: { padding: 4, backgroundColor: "rgba(255, 255, 255, 0.45)" },
  langSelectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 16 },
  langItemText: { fontSize: sc(14), fontWeight: "700", color: C.textDark, letterSpacing: -0.1 },
  innerCardDivider: { height: 1, backgroundColor: "rgba(232, 229, 255, 0.5)", marginHorizontal: 16 },

  // Dashed Auxiliary Button Housing
  dashedActionBtn: { flexDirection: "row", justifyContent: "center", alignItems: "center", borderStyle: "dashed", borderWidth: 1.5, borderColor: C.p1, backgroundColor: "rgba(140, 127, 255, 0.04)", padding: 16, borderRadius: 22, marginTop: 8, marginHorizontal: 4 },
  dashedActionText: { fontSize: sc(13), color: C.p2, fontWeight: "800" },
});
