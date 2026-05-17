import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router, usePathname } from "expo-router";
import { Calendar, Home, Search, User, Wallet } from "lucide-react-native";
import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");
const P = "#4A3AFF";
const P2 = "#7B6FFF";

const tabs = [
  { label: "Home", route: "/home", icon: Home },
  { label: "Bookings", route: "/booking-details", icon: Calendar },
  { label: "Wallet", route: "/dashboard", icon: Wallet },
  { label: "Profile", route: "/profile", icon: User },
];

export default function AppBottomTab() {
  const pathname = usePathname();

  return (
    <View style={s.tabWrapper}>
      <BlurView intensity={90} tint="light" style={s.tabBar}>
        {tabs.slice(0, 2).map((tab) => (
          <TabBtn key={tab.route} tab={tab} active={pathname === tab.route} />
        ))}
        <View style={{ width: 64 }} />
        {tabs.slice(2).map((tab) => (
          <TabBtn key={tab.route} tab={tab} active={pathname === tab.route} />
        ))}
      </BlurView>

      <TouchableOpacity
        style={s.tabCenter}
        onPress={() => router.push("/categories")}
        activeOpacity={0.85}
      >
        <LinearGradient colors={[P, P2]} style={s.tabCenterGrad}>
          <Search color="white" size={26} strokeWidth={2.5} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

function TabBtn({ tab, active }) {
  const Icon = tab.icon;
  return (
    <TouchableOpacity style={s.tabBtn} onPress={() => router.push(tab.route)}>
      <Icon size={22} color={active ? P : "#CBD5E1"} strokeWidth={active ? 2.5 : 1.8} />
      <Text style={[s.tabLabel, active && { color: P }]}>{tab.label}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  tabWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingBottom: 20,
  },
  tabBar: {
    width: width - 40,
    height: 68,
    borderRadius: 34,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 9.5,
    fontWeight: "600",
    color: "#CBD5E1",
    letterSpacing: 0.2,
  },
  tabCenter: {
    position: "absolute",
    bottom: 18,
    width: 58,
    height: 58,
    borderRadius: 29,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "white",
    elevation: 8,
    shadowColor: P,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  tabCenterGrad: { flex: 1, alignItems: "center", justifyContent: "center" },
});
