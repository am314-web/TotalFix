import React from "react";
import { router } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const NAV_ITEMS = [
  { label: "Dashboard (Current App)", route: "/dashboard" },
  { label: "Home Screen", route: "/home" },
  { label: "Categories Screen", route: "/categories" },
  { label: "Login Screen", route: "/login" },
  { label: "Booking Details", route: "/booking-details" },
  { label: "Profile Screen", route: "/profile" },
  { label: "Chat Screen", route: "/chat" },
  { label: "Notification Screen", route: "/notifications" },
  { label: "Pro Dashboard", route: "/pro-dashboard" },
  { label: "Pro Job Detail", route: "/pro-job-detail" },
  { label: "Pro Profile", route: "/pro-profile" },
  { label: "Pro Registration", route: "/pro-registration" },
  { label: "Pro Notifications", route: "/pro-notifications" },
  { label: "Pro Chat", route: "/pro-chat" },
  { label: "Pro History", route: "/pro-history" },
  { label: "Pro Earnings", route: "/pro-earnings" },
  { label: "Pro Progress Extra", route: "/pro-progress-extra" },
];

export default function NavigationPage() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Navigation</Text>
        <Text style={styles.subtitle}>Choose a screen to open</Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {NAV_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.route}
              style={styles.button}
              activeOpacity={0.85}
              onPress={() => router.push(item.route)}
            >
              <Text style={styles.buttonText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F3F4FF" },
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 20 },
  listContent: { paddingBottom: 20 },
  title: { fontSize: 30, fontWeight: "800", color: "#0D0B1E", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#6B7280", marginBottom: 20 },
  button: {
    backgroundColor: "#4A3AFF",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "700" },
});
