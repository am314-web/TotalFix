import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, router } from "expo-router";
import { Calendar, ChevronLeft, Clock, MapPin } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../services/supabase";

const { width } = Dimensions.get("window");
const sc = (n) => (width / 390) * n;

const C = {
  p1: "#8C7FFF",
  p2: "#5B4CF0",
  white: "#FFFFFF",
  inputBorder: "#E8E5FF",
  labelGray: "#8B8BA7",
  textDark: "#1A1740",
};

const parseImageUrls = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value !== "string") return [];
  const trimmed = value.trim();
  if (!trimmed) return [];
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch {}
  return trimmed
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
};

export default function ProJobDetailsScreen() {
  const { bookingId } = useLocalSearchParams();
  const [booking, setBooking] = useState(null);
  const imageUrls = parseImageUrls(booking?.image_url);

  useEffect(() => {
    const load = async () => {
      if (!bookingId) return;
      const { data } = await supabase.from("bookings").select("*").eq("id", bookingId).maybeSingle();
      setBooking(data || null);
    };
    load();
  }, [bookingId]);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <LinearGradient colors={["#F4F3FF", "#FDFDFF"]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={s.topRow}>
          <TouchableOpacity style={s.iconBtn} onPress={() => router.back()}>
            <ChevronLeft size={20} color={C.textDark} />
          </TouchableOpacity>
          <Text style={s.title}>Job Details</Text>
          <View style={s.iconBtn} />
        </View>

        <ScrollView contentContainerStyle={s.scroll}>
          <BlurView intensity={Platform.OS === "ios" ? 45 : 95} tint="light" style={s.card}>
            <Text style={s.h1}>UC-{booking?.id || "-"}</Text>
            <Text style={s.sub}>{String(booking?.service_type || "service").toUpperCase()} | {(booking?.status || "").toUpperCase()}</Text>

            <View style={s.row}><Calendar size={14} color={C.p2} /><Text style={s.txt}>{booking?.scheduled_date || "-"}</Text></View>
            <View style={s.row}><Clock size={14} color={C.p2} /><Text style={s.txt}>{booking?.scheduled_time || "-"}</Text></View>
            <View style={s.row}><MapPin size={14} color={C.p2} /><Text style={s.txt}>Address shared by client</Text></View>

            <Text style={s.label}>Issue / Notes</Text>
            <Text style={s.notes}>{booking?.notes || "No notes"}</Text>

            {imageUrls.map((uri, idx) => (
              <Image key={`booking-image-${idx}`} source={{ uri }} style={s.image} resizeMode="cover" />
            ))}
          </BlurView>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 18, paddingTop: Platform.OS === "ios" ? 8 : 20 },
  iconBtn: { width: 40, height: 40 },
  title: { fontSize: sc(18), fontWeight: "900", color: C.textDark },
  scroll: { padding: 18, paddingBottom: 40 },
  card: { borderRadius: 18, padding: 16, borderWidth: 1, borderColor: C.inputBorder, overflow: "hidden" },
  h1: { fontSize: sc(18), fontWeight: "900", color: C.textDark },
  sub: { fontSize: sc(12), fontWeight: "700", color: C.labelGray, marginTop: 4, marginBottom: 10 },
  row: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  txt: { fontSize: sc(12), color: C.textDark, fontWeight: "600" },
  label: { marginTop: 8, fontSize: sc(12), color: C.labelGray, fontWeight: "800" },
  notes: { fontSize: sc(12), color: C.textDark, marginTop: 5, fontWeight: "600" },
  image: { width: "100%", height: sc(170), borderRadius: 12, marginTop: 12 },
});
