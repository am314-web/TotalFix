import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import AppBottomTab from "../components/AppBottomTab";
import {
    Animated,
    Dimensions,
    KeyboardAvoidingView,
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

const { width, height } = Dimensions.get("window");

// ─── Design Tokens ───────────────────────────────────────────────
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

// ─── Responsive helpers ───────────────────────────────────────────
const rem = (n) => n * (width / 375); // scale relative to 375pt base
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
const rs = (n) => clamp(rem(n), n * 0.8, n * 1.25); // responsive, clamped

// ─── Background Spheres ───────────────────────────────────────────
const BackgroundShapes = () => (
  <View style={styles.bgWrapper} pointerEvents="none">
    <View style={styles.wave1} />
    <View style={styles.wave2} />

    {/* Top-left dark sphere */}
    <LinearGradient
      colors={["#3F30CC", "#1A0F7A"]}
      start={{ x: 0.3, y: 0.3 }}
      end={{ x: 1, y: 1 }}
      style={styles.sphereTL}
    />

    {/* Top-right white cloud blob */}
    <View style={styles.whiteCloud} />

    {/* Top-right main purple sphere */}
    <LinearGradient
      colors={["#A99BFF", "#6255E8", "#2D1DB5"]}
      start={{ x: 0.2, y: 0.15 }}
      end={{ x: 1, y: 1 }}
      style={styles.spherePurple}
    />

    {/* Small white sphere */}
    <LinearGradient
      colors={["#FFFFFF", "#D5D9FF", "#9FA8FF"]}
      start={{ x: 0.25, y: 0.25 }}
      end={{ x: 1, y: 1 }}
      style={styles.sphereSmallWhite}
    />

    {/* Bottom big sphere */}
    <LinearGradient
      colors={["#8B7EFF", "#4B3DE0", "#1C10A0"]}
      start={{ x: 0.25, y: 0.25 }}
      end={{ x: 1, y: 1 }}
      style={styles.sphereBottom}
    />

    {/* Small left white sphere */}
    <LinearGradient
      colors={["#FFFFFF", "#DDE1FF", "#B8C0FF"]}
      start={{ x: 0.25, y: 0.25 }}
      end={{ x: 1, y: 1 }}
      style={styles.sphereSmallLeft}
    />
  </View>
);

// ─── Social Icon Button ───────────────────────────────────────────
const SocialBtn = ({ name, color, size = 26 }) => (
  <TouchableOpacity activeOpacity={0.7} style={styles.socialBtn}>
    <FontAwesome name={name} size={size} color={color} />
  </TouchableOpacity>
);

// ─── Animated Primary Button ──────────────────────────────────────
const PrimaryButton = ({ label, onPress }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const handleIn = () =>
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 40,
    }).start();
  const handleOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
    }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handleIn}
        onPressOut={handleOut}
        onPress={onPress}
        style={styles.primaryBtn}
      >
        <LinearGradient
          colors={["#8C7FFF", C.p2, "#4235D4"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.primaryBtnGrad}
        >
          <Text style={styles.primaryBtnText}>{label}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Input Field ──────────────────────────────────────────────────
const Field = ({ label, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ marginBottom: rs(18) }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        placeholderTextColor={C.textMuted}
        style={[styles.fieldInput, focused && styles.fieldInputFocused]}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
    </View>
  );
};

// ─── Screens ──────────────────────────────────────────────────────

const WelcomeScreen = ({ onSignIn, onSignUp }) => (
  <LinearGradient colors={["#6B5CF5", C.p3, C.dark]} style={styles.screen}>
    <BackgroundShapes />
    <View style={styles.welcomeCenter}>
      <LinearGradient
        colors={["#A99BFF", "#6255E8", "#2D1DB5"]}
        start={{ x: 0.25, y: 0.25 }}
        end={{ x: 1, y: 1 }}
        style={styles.welcomeOrb}
      />
      <Text style={styles.welcomeTitle}>Welcome Back!</Text>
      <Text style={styles.welcomeSub}>
        Enter your personal details{"\n"}to access your account
      </Text>
    </View>

    <View style={styles.welcomeBar}>
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.barLeft}
        onPress={onSignIn}
      >
        <Text style={styles.barLeftText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.barRight}
        onPress={onSignUp}
      >
        <Text style={styles.barRightText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  </LinearGradient>
);

const SignupScreen = ({ onBack, onSignInLink }) => (
  <LinearGradient colors={["#6B5CF5", C.p3, C.dark]} style={styles.screen}>
    <BackgroundShapes />
    <TouchableOpacity style={styles.backBtn} onPress={onBack}>
      <Ionicons name="chevron-back" size={18} color="#fff" />
      <Text style={styles.backText}>Back</Text>
    </TouchableOpacity>

    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, marginTop: height * 0.2 }}
    >
      <View style={styles.formCard}>
        {/* Floating orb badge */}
        <LinearGradient
          colors={["#A99BFF", "#6255E8", "#2D1DB5"]}
          start={{ x: 0.25, y: 0.25 }}
          end={{ x: 1, y: 1 }}
          style={styles.formOrb}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <Text style={styles.formTitle}>Get Started</Text>
          <Text style={styles.formSubtitle}>
            Create your account in seconds
          </Text>

          <Field
            label="FULL NAME"
            placeholder="Enter full name"
            autoCapitalize="words"
          />
          <Field
            label="EMAIL"
            placeholder="Enter email address"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Field
            label="PASSWORD"
            placeholder="Create a password"
            secureTextEntry
          />

          <View style={styles.checkRow}>
            <View style={styles.check}>
              <Ionicons name="checkmark" size={13} color="#fff" />
            </View>
            <Text style={styles.checkText}>
              I agree to the processing of{" "}
              <Text style={{ color: C.p2, fontWeight: "700" }}>
                Personal Data
              </Text>
            </Text>
          </View>

          <PrimaryButton label="Sign Up" />

          <View style={styles.divider}>
            <View style={styles.divLine} />
            <Text style={styles.divText}>or continue with</Text>
            <View style={styles.divLine} />
          </View>

          <View style={styles.socialRow}>
            <SocialBtn name="google" color="#EA4335" />
            <SocialBtn name="facebook-official" color="#1877F2" />
            <SocialBtn name="apple" color="#000" />
            <SocialBtn name="twitter" color="#1DA1F2" />
          </View>

          <Text style={styles.bottomText}>
            Already have an account?{" "}
            <Text style={styles.bottomLink} onPress={onSignInLink}>
              Sign in
            </Text>
          </Text>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  </LinearGradient>
);

const SigninScreen = ({ onBack, onSignUpLink }) => (
  <LinearGradient colors={["#6B5CF5", C.p3, C.dark]} style={styles.screen}>
    <BackgroundShapes />
    <TouchableOpacity style={styles.backBtn} onPress={onBack}>
      <Ionicons name="chevron-back" size={18} color="#fff" />
      <Text style={styles.backText}>Back</Text>
    </TouchableOpacity>

    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, marginTop: height * 0.2 }}
    >
      <View style={styles.formCard}>
        <LinearGradient
          colors={["#A99BFF", "#6255E8", "#2D1DB5"]}
          start={{ x: 0.25, y: 0.25 }}
          end={{ x: 1, y: 1 }}
          style={styles.formOrb}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <Text style={styles.formTitle}>Welcome Back</Text>
          <Text style={styles.formSubtitle}>
            Sign in to continue to your account
          </Text>

          <Field
            label="EMAIL"
            defaultValue="kristin.watson@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Field label="PASSWORD" secureTextEntry defaultValue="password1234" />

          <View style={styles.rememberRow}>
            <View style={styles.rememberLeft}>
              <View style={styles.check}>
                <Ionicons name="checkmark" size={13} color="#fff" />
              </View>
              <Text style={styles.rememberText}>Remember me</Text>
            </View>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </View>

          <PrimaryButton label="Sign In" />

          <View style={styles.divider}>
            <View style={styles.divLine} />
            <Text style={styles.divText}>or continue with</Text>
            <View style={styles.divLine} />
          </View>

          <View style={styles.socialRow}>
            <SocialBtn name="google" color="#EA4335" />
            <SocialBtn name="facebook-official" color="#1877F2" />
            <SocialBtn name="apple" color="#000" />
            <SocialBtn name="twitter" color="#1DA1F2" />
          </View>

          <Text style={styles.bottomText}>
            Don't have an account?{" "}
            <Text style={styles.bottomLink} onPress={onSignUpLink}>
              Sign up
            </Text>
          </Text>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  </LinearGradient>
);

// ─── Root ─────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("welcome");

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <SafeAreaView style={{ flex: 1 }}>
        {screen === "welcome" && (
          <WelcomeScreen
            onSignIn={() => setScreen("signin")}
            onSignUp={() => setScreen("signup")}
          />
        )}
        {screen === "signup" && (
          <SignupScreen
            onBack={() => setScreen("welcome")}
            onSignInLink={() => setScreen("signin")}
          />
        )}
        {screen === "signin" && (
          <SigninScreen
            onBack={() => setScreen("welcome")}
            onSignUpLink={() => setScreen("signup")}
          />
        )}
      </SafeAreaView>
      <AppBottomTab />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.dark },
  screen: { flex: 1 },

  // ── Background ──
  bgWrapper: { ...StyleSheet.absoluteFillObject, zIndex: 0 },
  wave1: {
    position: "absolute",
    width: width * 1.5,
    height: height * 0.45,
    backgroundColor: "rgba(255,255,255,0.045)",
    borderRadius: 200,
    top: height * 0.08,
    left: -width * 0.25,
    transform: [{ rotate: "-14deg" }],
  },
  wave2: {
    position: "absolute",
    width: width * 1.25,
    height: height * 0.35,
    backgroundColor: "rgba(255,255,255,0.025)",
    borderRadius: 160,
    top: height * 0.18,
    left: -width * 0.06,
    transform: [{ rotate: "9deg" }],
  },
  sphereTL: {
    position: "absolute",
    width: rs(100),
    height: rs(100),
    borderRadius: rs(50),
    top: -rs(25),
    left: -rs(20),
  },
  whiteCloud: {
    position: "absolute",
    width: rs(210),
    height: rs(225),
    backgroundColor: "rgba(255,255,255,0.95)",
    top: -rs(55),
    right: -rs(28),
    borderBottomLeftRadius: rs(125),
    borderBottomRightRadius: rs(55),
    transform: [{ rotate: "11deg" }],
  },
  spherePurple: {
    position: "absolute",
    width: rs(158),
    height: rs(158),
    borderRadius: rs(79),
    top: rs(44),
    right: rs(22),
    shadowColor: C.p2,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  sphereSmallWhite: {
    position: "absolute",
    width: rs(80),
    height: rs(80),
    borderRadius: rs(40),
    top: rs(125),
    right: rs(100),
  },
  sphereBottom: {
    position: "absolute",
    width: rs(140),
    height: rs(140),
    borderRadius: rs(70),
    bottom: height * 0.1,
    left: width * 0.12,
    shadowColor: C.p2,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 8,
  },
  sphereSmallLeft: {
    position: "absolute",
    width: rs(50),
    height: rs(50),
    borderRadius: rs(25),
    bottom: height * 0.24,
    left: width * 0.05,
  },

  // ── Welcome ──
  welcomeCenter: {
    flex: 1,
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: rs(32),
  },
  welcomeOrb: {
    width: rs(62),
    height: rs(62),
    borderRadius: rs(31),
    marginBottom: rs(20),
    shadowColor: C.p2,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  welcomeTitle: {
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif-medium",
    fontSize: rs(34),
    fontWeight: "800",
    color: C.white,
    letterSpacing: -0.5,
    marginBottom: rs(14),
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
  },
  welcomeSub: {
    fontSize: rs(15),
    color: "rgba(255,255,255,0.78)",
    textAlign: "center",
    lineHeight: rs(24),
    fontWeight: "300",
  },
  welcomeBar: {
    height: rs(90),
    flexDirection: "row",
    zIndex: 2,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
  barLeft: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(27,19,107,0.95)",
  },
  barRight: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: C.white,
    borderTopLeftRadius: rs(36),
  },
  barLeftText: {
    fontSize: rs(17),
    fontWeight: "700",
    color: C.white,
    letterSpacing: 0.3,
  },
  barRightText: {
    fontSize: rs(17),
    fontWeight: "700",
    color: C.p2,
    letterSpacing: 0.3,
  },

  // ── Back button ──
  backBtn: {
    position: "absolute",
    top: rs(52),
    left: rs(18),
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.22)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: rs(14),
    paddingVertical: rs(8),
    borderRadius: rs(20),
  },
  backText: {
    color: C.white,
    fontSize: rs(14),
    fontWeight: "600",
    marginLeft: rs(3),
  },

  // ── Form card ──
  formCard: {
    flex: 1,
    backgroundColor: C.white,
    borderTopLeftRadius: rs(38),
    borderTopRightRadius: rs(38),
    paddingHorizontal: rs(26),
    paddingTop: rs(42),
    zIndex: 5,
    elevation: 8,
    shadowColor: "#1e0f8c",
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.28,
    shadowRadius: 30,
  },
  formOrb: {
    position: "absolute",
    top: rs(-26),
    alignSelf: "center",
    width: rs(52),
    height: rs(52),
    borderRadius: rs(26),
    borderWidth: 3,
    borderColor: C.white,
    shadowColor: C.p2,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  formTitle: {
    fontSize: rs(26),
    fontWeight: "800",
    color: C.p2,
    textAlign: "center",
    marginBottom: rs(5),
    letterSpacing: -0.3,
  },
  formSubtitle: {
    fontSize: rs(13),
    color: C.textMuted,
    textAlign: "center",
    marginBottom: rs(26),
  },

  // ── Fields ──
  fieldLabel: {
    fontSize: rs(11),
    fontWeight: "700",
    color: C.labelGray,
    letterSpacing: 0.08,
    marginBottom: rs(8),
    marginLeft: rs(2),
    textTransform: "uppercase",
  },
  fieldInput: {
    height: rs(52),
    backgroundColor: C.inputBg,
    borderWidth: 1.5,
    borderColor: C.inputBorder,
    borderRadius: rs(16),
    paddingHorizontal: rs(16),
    fontSize: rs(15),
    color: C.textDark,
  },
  fieldInputFocused: {
    borderColor: C.p2,
    backgroundColor: C.white,
    shadowColor: C.p2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 2,
  },

  // ── Checkbox & remember ──
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: rs(10),
    marginBottom: rs(24),
    marginTop: rs(2),
  },
  check: {
    width: rs(20),
    height: rs(20),
    backgroundColor: C.p2,
    borderRadius: rs(6),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: C.p2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  checkText: { fontSize: rs(13), color: C.labelGray, flex: 1 },
  rememberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: rs(24),
    marginTop: rs(2),
  },
  rememberLeft: { flexDirection: "row", alignItems: "center", gap: rs(8) },
  rememberText: { fontSize: rs(13), color: C.labelGray },
  forgotText: { fontSize: rs(13), color: C.p2, fontWeight: "700" },

  // ── Primary button ──
  primaryBtn: { borderRadius: rs(16), overflow: "hidden" },
  primaryBtnGrad: {
    height: rs(54),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: C.p2,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 8,
  },
  primaryBtnText: {
    fontSize: rs(17),
    fontWeight: "700",
    color: C.white,
    letterSpacing: 0.4,
  },

  // ── Divider ──
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: rs(14),
    marginTop: rs(28),
    marginBottom: rs(22),
  },
  divLine: { flex: 1, height: 1, backgroundColor: "#EAE8F8" },
  divText: { fontSize: rs(12), color: C.textMuted, letterSpacing: 0.05 },

  // ── Social ──
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: rs(16),
    marginBottom: rs(28),
  },
  socialBtn: {
    width: rs(50),
    height: rs(50),
    borderRadius: rs(14),
    borderWidth: 1.5,
    borderColor: "#EAE8F8",
    backgroundColor: C.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  // ── Bottom text ──
  bottomText: { textAlign: "center", fontSize: rs(14), color: C.textMuted },
  bottomLink: { color: C.p2, fontWeight: "700" },
});
