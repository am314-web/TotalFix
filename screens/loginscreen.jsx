import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../services/firebase";
import { signInProfessional, signUpProfessional } from "../services/professionalAuthService";
import { SESSION_KEY } from "../services/session";

const ROLE_CLIENT = "client";
const ROLE_PROFESSIONAL = "professional";

const getAuthErrorMessage = (error, fallback) => {
  const code = error?.code || "";
  if (code === "auth/configuration-not-found") {
    return "Firebase Auth is not configured. In Firebase Console, enable Authentication and Email/Password sign-in.";
  }
  if (code === "auth/invalid-credential") {
    return "Invalid email or password.";
  }
  if (code === "auth/user-not-found") {
    return "No account found for this email.";
  }
  if (code === "auth/wrong-password") {
    return "Invalid email or password.";
  }
  if (code === "auth/email-already-in-use") {
    return "This email is already registered. Please sign in.";
  }
  return error?.message || fallback;
};

export default function LoginScreen() {
  const [mode, setMode] = useState("welcome");
  const [role, setRole] = useState(ROLE_CLIENT);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
  };

  const navigateByRole = (userRole) => {
    if (userRole === ROLE_PROFESSIONAL) {
      router.replace("/pro-registration");
      return;
    }
    router.replace("/home");
  };

  const handleSignup = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Missing info", "Please fill name, email and password.");
      return;
    }

    try {
      setLoading(true);
      if (role === ROLE_PROFESSIONAL) {
        await signUpProfessional({
          fullName: fullName.trim(),
          email: email.trim(),
          password,
        });
        Alert.alert("Signup successful", "Now login with your professional credentials.");
        resetForm();
        setMode("signin");
        return;
      }

      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await setDoc(doc(db, "users", credential.user.uid), {
        uid: credential.user.uid,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        role,
        createdAt: serverTimestamp(),
      });

      await auth.signOut();
      Alert.alert("Signup successful", "Now login with your email and password.");
      resetForm();
      setMode("signin");
    } catch (error) {
      Alert.alert("Signup failed", getAuthErrorMessage(error, "Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleSignin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing info", "Please enter email and password.");
      return;
    }

    try {
      setLoading(true);
      if (role === ROLE_PROFESSIONAL) {
        const { user, onboardingComplete } = await signInProfessional({
          email: email.trim(),
          password,
        });

        await AsyncStorage.setItem(
          SESSION_KEY,
          JSON.stringify({
            uid: user.id,
            email: user.email,
            role: ROLE_PROFESSIONAL,
            onboardingComplete,
          })
        );

        if (onboardingComplete) {
          router.replace("/pro-dashboard");
        } else {
          router.replace("/pro-registration");
        }
        return;
      }

      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const userRef = doc(db, "users", credential.user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.exists() ? userSnap.data() : {};
      const userRole = userData.role || ROLE_CLIENT;

      await AsyncStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          uid: credential.user.uid,
          email: credential.user.email,
          role: userRole,
        })
      );

      navigateByRole(userRole);
    } catch (error) {
      Alert.alert("Login failed", getAuthErrorMessage(error, "Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#6B5CF5", "#3D2EC0", "#150C72"]} style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardWrap}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.card}>
            {mode === "welcome" && (
              <>
                <Text style={styles.title}>Welcome</Text>
                <Text style={styles.subtitle}>Choose how you want to continue</Text>
                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={() => {
                    resetForm();
                    setMode("signin");
                  }}
                >
                  <Text style={styles.primaryBtnText}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.secondaryBtn}
                  onPress={() => {
                    resetForm();
                    setMode("signup");
                  }}
                >
                  <Text style={styles.secondaryBtnText}>Sign Up</Text>
                </TouchableOpacity>
              </>
            )}

            {mode !== "welcome" && (
              <>
                <Text style={styles.title}>{mode === "signup" ? "Create Account" : "Sign In"}</Text>

                <View style={styles.roleRow}>
                  <TouchableOpacity
                    style={[styles.roleBtn, role === ROLE_CLIENT && styles.roleBtnActive]}
                    onPress={() => setRole(ROLE_CLIENT)}
                  >
                    <Text style={[styles.roleText, role === ROLE_CLIENT && styles.roleTextActive]}>Client</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.roleBtn, role === ROLE_PROFESSIONAL && styles.roleBtnActive]}
                    onPress={() => setRole(ROLE_PROFESSIONAL)}
                  >
                    <Text style={[styles.roleText, role === ROLE_PROFESSIONAL && styles.roleTextActive]}>Professional</Text>
                  </TouchableOpacity>
                </View>

                {mode === "signup" && (
                  <TextInput
                    style={styles.input}
                    placeholder="Full name"
                    value={fullName}
                    onChangeText={setFullName}
                  />
                )}

                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="off"
                  textContentType="none"
                  importantForAutofill="no"
                  value={email}
                  onChangeText={setEmail}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry
                  autoComplete="off"
                  textContentType="none"
                  importantForAutofill="no"
                  value={password}
                  onChangeText={setPassword}
                />

                <TouchableOpacity
                  style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
                  disabled={loading}
                  onPress={mode === "signup" ? handleSignup : handleSignin}
                >
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>{mode === "signup" ? "Create Account" : "Login"}</Text>}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.switchBtn}
                  onPress={() => {
                    resetForm();
                    setMode(mode === "signup" ? "signin" : "signup");
                  }}
                >
                  <Text style={styles.switchText}>
                    {mode === "signup" ? "Already have an account? Sign In" : "New here? Sign Up"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.backBtn} onPress={() => setMode("welcome")}>
                  <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1 },
  keyboardWrap: { flex: 1, justifyContent: "center", padding: 20 },
  card: { backgroundColor: "#fff", borderRadius: 20, padding: 20, gap: 12 },
  title: { fontSize: 28, fontWeight: "800", color: "#1A1740" },
  subtitle: { color: "#6B7280", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12 },
  primaryBtn: { backgroundColor: "#5B4CF0", borderRadius: 12, paddingVertical: 14, alignItems: "center", marginTop: 4 },
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  secondaryBtn: { borderWidth: 1, borderColor: "#5B4CF0", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  secondaryBtnText: { color: "#5B4CF0", fontWeight: "700", fontSize: 16 },
  roleRow: { flexDirection: "row", gap: 8 },
  roleBtn: { flex: 1, borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 10, paddingVertical: 10, alignItems: "center" },
  roleBtnActive: { backgroundColor: "#5B4CF0", borderColor: "#5B4CF0" },
  roleText: { color: "#4B5563", fontWeight: "600" },
  roleTextActive: { color: "#fff" },
  switchBtn: { alignItems: "center", marginTop: 8 },
  switchText: { color: "#5B4CF0", fontWeight: "600" },
  backBtn: { alignItems: "center", marginTop: 4 },
  backText: { color: "#9CA3AF" },
});
