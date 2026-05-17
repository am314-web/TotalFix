import { useEffect, useRef, useState } from "react";
import {
    FlatList,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import AppBottomTab from "../components/AppBottomTab";

import {
    ArrowLeft,
    CalendarDays,
    Clock3,
    Heart,
    MessageCircle,
    Phone,
    Share2,
    ShieldCheck,
    Star,
    Users,
    Wrench,
} from "lucide-react-native";

const PRIMARY = "#5B4CF0";

// --- DATA ---
const services = [
  "Cleaning",
  "Plumbing",
  "Electrician",
  "AC Repair",
  "Beauty",
  "Painting",
  "Laundry",
  "Carpenter",
];

const statData = [
  {
    id: "1",
    active: true,
    icon: <ShieldCheck size={24} color="#fff" />,
    number: "10M+",
    label: "Services done",
  },
  {
    id: "2",
    icon: <Star size={24} color={PRIMARY} />,
    number: "4.9",
    label: "Average rating",
  },
  {
    id: "3",
    icon: <Users size={24} color={PRIMARY} />,
    number: "50M+",
    label: "Customers served",
  },
  {
    id: "4",
    icon: <Clock3 size={24} color={PRIMARY} />,
    number: "60 min",
    label: "Avg response",
  },
];

const reviews = [
  {
    id: "1",
    initials: "PR",
    name: "Priya R.",
    text: "Technician arrived on time and fixed the issue quickly. Amazing experience.",
  },
  {
    id: "2",
    initials: "AK",
    name: "Arjun K.",
    text: "Deep cleaning service was top notch. Very professional and premium.",
  },
  {
    id: "3",
    initials: "SM",
    name: "Sneha M.",
    text: "Booked within minutes and the professional arrived right on time.",
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("About");
  const [liked, setLiked] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* BACKGROUND */}
      <LinearGradient
        colors={["#F7F5FF", "#EFEAFF", "#FFFFFF"]}
        style={styles.bg}
      />
      <View style={styles.blob1} />
      <View style={styles.blob2} />
      <View style={styles.blob3} />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 160 }}
        >
          {/* NAVBAR */}
          <View style={styles.nav}>
            <GlassButton>
              <ArrowLeft size={22} color="#111" />
            </GlassButton>
            <GlassButton>
              <Share2 size={22} color="#111" />
            </GlassButton>
          </View>

          {/* HERO */}
          <View style={styles.hero}>
            <View style={styles.badge}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeText}>Verified & Trusted Platform</Text>
            </View>
            <Text style={styles.heroTitle}>
              Urban{"\n"}
              <Text style={styles.gradientText}>Company</Text>
            </Text>
            <Text style={styles.heroDescription}>
              India&apos;s leading home services platform with premium
              professionals.
            </Text>
            <LinearGradient
              colors={[PRIMARY, "#8B7CFF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.pricePill}
            >
              <Wrench size={16} color="#fff" />
              <Text style={styles.priceText}>Starting ₹499 / visit</Text>
            </LinearGradient>
          </View>

          {/* STATS CAROUSEL */}
          <AutoHorizontalLoop
            items={statData}
            itemWidth={164}
            speedPxPerSec={14}
            keyPrefix="stat"
            renderItem={(item) => (
              <StatCard
                active={item.active}
                icon={item.icon}
                number={item.number}
                label={item.label}
              />
            )}
          />

          {/* AUTO HORIZONTAL SERVICE CAROUSEL */}
          <AutoHorizontalServices items={services} />

          <View style={styles.divider} />

          {/* TABS */}
          <BlurView intensity={60} tint="light" style={styles.tabs}>
            {["About", "Services", "Offers", "Reviews"].map((tab) => (
              <TouchableOpacity
                key={tab}
                activeOpacity={0.8}
                onPress={() => setActiveTab(tab)}
                style={[styles.tabBtn, activeTab === tab && styles.activeTab]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </BlurView>

          {/* ABOUT SECTION */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>WHO WE ARE</Text>
            <Text style={styles.sectionTitle}>Home services, perfected.</Text>
            <Text style={styles.sectionText}>
              Urban Company connects you with India&apos;s best professionals...
              <Text style={styles.readMore}> Read more →</Text>
            </Text>
          </View>

          {/* RATING SECTION */}
          <View style={styles.ratingSection}>
            <Text style={styles.ratingNumber}>4.9</Text>
            <View>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={16} fill="#F4A623" color="#F4A623" />
                ))}
              </View>
              <Text style={styles.reviewCount}>Based on 2.4M+ reviews</Text>
            </View>
          </View>

          {/* FEATURE GRID */}
          <View style={styles.grid}>
            <FeatureCard
              title="100%"
              label="Guarantee"
              icon={<Heart size={24} color={PRIMARY} />}
            />
            <FeatureCard
              dark
              title="₹499"
              label="Start price"
              icon={<Wrench size={24} color="#fff" />}
            />
          </View>

          {/* PROFILE CARD */}
          <BlurView intensity={70} tint="light" style={styles.profileCard}>
            <View style={styles.profileLeft}>
              <View style={styles.logoBox}>
                <Text style={styles.logoText}>UC</Text>
              </View>
              <View>
                <Text style={styles.profileName}>Urban Company</Text>
                <Text style={styles.profileRole}>Home Services Platform</Text>
              </View>
            </View>
            <View style={styles.profileActions}>
              <CircleIcon>
                <MessageCircle size={20} color={PRIMARY} />
              </CircleIcon>
              <CircleIcon>
                <Phone size={20} color={PRIMARY} />
              </CircleIcon>
            </View>
          </BlurView>

          {/* REVIEW CAROUSEL */}
          <View style={styles.reviewHeader}>
            <Text style={styles.sectionLabel}>WHAT CUSTOMERS SAY</Text>
            <Text style={styles.sectionTitle}>Real stories.</Text>
          </View>
          <AutoHorizontalLoop
            items={reviews}
            itemWidth={256}
            speedPxPerSec={12}
            keyPrefix="review"
            renderItem={(item) => (
              <BlurView intensity={60} tint="light" style={styles.reviewCard}>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={12} fill="#F4A623" color="#F4A623" />
                  ))}
                </View>
                <Text style={styles.reviewText}>{item.text}</Text>
                <View style={styles.reviewer}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.initials}</Text>
                  </View>
                  <Text style={styles.reviewerName}>{item.name}</Text>
                </View>
              </BlurView>
            )}
          />
        </ScrollView>

        {/* CTA BAR */}
        <View style={styles.ctaBar}>
          <TouchableOpacity activeOpacity={0.9} style={{ flex: 1 }}>
            <LinearGradient
              colors={[PRIMARY, "#7B6DFF"]}
              style={styles.bookBtn}
            >
              <CalendarDays size={22} color="#fff" />
              <Text style={styles.bookText}>Book a Service</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setLiked(!liked)}
          >
            <BlurView intensity={70} tint="light" style={styles.favBtn}>
              <Star
                size={24}
                color={liked ? "#F4A623" : PRIMARY}
                fill={liked ? "#F4A623" : "transparent"}
              />
            </BlurView>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <AppBottomTab />
    </View>
  );
}

/* --- REUSABLE COMPONENTS --- */

const GlassButton = ({ children }) => (
  <BlurView intensity={70} tint="light" style={styles.glassBtn}>
    {children}
  </BlurView>
);

const CircleIcon = ({ children }) => (
  <View style={styles.circleBtn}>{children}</View>
);

const StatCard = ({ icon, number, label, active }) => {
  const CardBg = active ? LinearGradient : BlurView;
  const props = active
    ? { colors: [PRIMARY, "#7D6FFF"] }
    : { intensity: 70, tint: "light" };

  return (
    <CardBg {...props} style={styles.statCard}>
      {icon}
      <Text style={[styles.statNumber, active && { color: "#fff" }]}>
        {number}
      </Text>
      <Text style={[styles.statLabel, active && { color: "#ddd" }]}>
        {label}
      </Text>
    </CardBg>
  );
};

const FeatureCard = ({ title, label, icon, dark }) => (
  <View style={dark ? styles.featureDark : styles.featureCardWrapper}>
    {!dark ? (
      <BlurView intensity={70} tint="light" style={styles.featureBlur}>
        {icon}
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureLabel}>{label}</Text>
      </BlurView>
    ) : (
      <View style={{ padding: 22 }}>
        {icon}
        <Text style={styles.featureDarkTitle}>{title}</Text>
        <Text style={styles.featureDarkLabel}>{label}</Text>
      </View>
    )}
  </View>
);

const AutoHorizontalLoop = ({
  items,
  itemWidth,
  renderItem,
  speedPxPerSec = 14,
  keyPrefix = "item",
}) => {
  const listRef = useRef(null);
  const loopItems = [...items, ...items];
  const offsetRef = useRef(0);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(0);
  const loopWidth = items.length * itemWidth;

  useEffect(() => {
    const tick = (time) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = time;
      }
      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      offsetRef.current += speedPxPerSec * dt;
      if (offsetRef.current >= loopWidth) {
        offsetRef.current -= loopWidth;
      }

      listRef.current?.scrollToOffset({
        offset: offsetRef.current,
        animated: false,
      });
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTimeRef.current = 0;
    };
  }, [loopWidth, speedPxPerSec]);

  return (
    <FlatList
      ref={listRef}
      data={loopItems}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.carouselContainer}
      keyExtractor={(item, i) => `${keyPrefix}-${i}-${item?.id ?? item}`}
      getItemLayout={(_, i) => ({
        length: itemWidth,
        offset: itemWidth * i,
        index: i,
      })}
      scrollEnabled={false}
      renderItem={({ item }) => renderItem(item)}
    />
  );
};

const AutoHorizontalServices = ({ items }) => (
  <AutoHorizontalLoop
    items={items}
    itemWidth={132}
    speedPxPerSec={18}
    keyPrefix="service"
    renderItem={(item) => (
      <View style={styles.serviceTag}>
        <View style={styles.serviceDot} />
        <Text style={styles.serviceText}>{item}</Text>
      </View>
    )}
  />
);

/* --- STYLES --- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F5FF" },
  bg: { ...StyleSheet.absoluteFillObject },
  blob1: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 999,
    backgroundColor: "rgba(91,76,240,0.14)",
    top: -120,
    left: -120,
  },
  blob2: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 999,
    backgroundColor: "rgba(255,92,92,0.08)",
    bottom: 120,
    right: -80,
  },
  blob3: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: "rgba(244,166,35,0.08)",
    top: 350,
    left: 120,
  },
  nav: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginTop: 18,
  },
  glassBtn: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
  },
  hero: { paddingHorizontal: 24, marginTop: 30 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(91,76,240,0.1)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#22c55e",
    marginRight: 8,
  },
  badgeText: { fontSize: 12, fontWeight: "700", color: PRIMARY },
  heroTitle: {
    fontSize: 54,
    lineHeight: 60,
    fontWeight: "900",
    color: "#111",
    marginTop: 22,
  },
  gradientText: { color: PRIMARY },
  heroDescription: {
    fontSize: 16,
    lineHeight: 28,
    color: "#6B7280",
    marginTop: 18,
    maxWidth: 300,
  },
  pricePill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 999,
    marginTop: 26,
  },
  priceText: { color: "#fff", fontWeight: "800", marginLeft: 10, fontSize: 16 },

  carouselContainer: { paddingLeft: 24, paddingRight: 12, marginVertical: 24 },
  statCard: {
    width: 150,
    height: 160,
    borderRadius: 28,
    padding: 22,
    marginRight: 14,
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  statNumber: { fontSize: 30, fontWeight: "900", color: "#111", marginTop: 16 },
  statLabel: { fontSize: 13, color: "#666", marginTop: 8 },

  serviceTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(91,76,240,0.08)",
  },
  serviceDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: PRIMARY,
    marginRight: 8,
  },
  serviceText: { fontSize: 13, color: "#444", fontWeight: "600" },

  divider: {
    width: 60,
    height: 6,
    borderRadius: 999,
    backgroundColor: PRIMARY,
    opacity: 0.3,
    alignSelf: "center",
    marginTop: 10,
  },
  tabs: {
    flexDirection: "row",
    marginHorizontal: 24,
    marginTop: 30,
    borderRadius: 22,
    padding: 6,
    overflow: "hidden",
  },
  tabBtn: {
    flex: 1,
    height: 46,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  activeTab: { backgroundColor: "#fff" },
  tabText: { color: "#777", fontWeight: "700", fontSize: 13 },
  activeTabText: { color: PRIMARY },

  section: { paddingHorizontal: 24, marginTop: 34 },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 2,
    color: "#999",
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "900",
    color: "#111",
    marginTop: 16,
  },
  sectionText: { fontSize: 16, lineHeight: 30, color: "#555", marginTop: 18 },
  readMore: { color: PRIMARY, fontWeight: "800" },

  ratingSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: 40,
  },
  ratingNumber: {
    fontSize: 62,
    fontWeight: "900",
    color: "#111",
    marginRight: 18,
  },
  starsRow: { flexDirection: "row" },
  reviewCount: { marginTop: 6, fontSize: 13, color: "#777" },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginTop: 34,
  },
  featureCardWrapper: {
    width: "48%",
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: 16,
  },
  featureBlur: {
    padding: 22,
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  featureDark: {
    width: "48%",
    borderRadius: 28,
    backgroundColor: "#111",
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#111",
    marginTop: 18,
  },
  featureLabel: { fontSize: 13, color: "#777", marginTop: 8 },
  featureDarkTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
    marginTop: 18,
  },
  featureDarkLabel: { fontSize: 13, color: "#aaa", marginTop: 8 },

  profileCard: {
    marginHorizontal: 24,
    marginTop: 30,
    borderRadius: 30,
    padding: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  profileLeft: { flexDirection: "row", alignItems: "center" },
  logoBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  logoText: { color: "#fff", fontSize: 24, fontWeight: "900" },
  profileName: { fontSize: 18, fontWeight: "800", color: "#111" },
  profileRole: { marginTop: 4, color: "#777" },
  circleBtn: {
    width: 50,
    height: 50,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(91,76,240,0.08)",
    marginLeft: 10,
  },

  reviewHeader: { paddingHorizontal: 24, marginTop: 40 },
  reviewCard: {
    width: 240,
    borderRadius: 26,
    padding: 22,
    marginRight: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  reviewText: { marginTop: 14, fontSize: 14, lineHeight: 24, color: "#555" },
  reviewer: { flexDirection: "row", alignItems: "center", marginTop: 18 },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: "#EAE6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: { color: PRIMARY, fontWeight: "800", fontSize: 12 },
  reviewerName: { fontWeight: "700", color: "#111" },

  ctaBar: {
    position: "absolute",
    bottom: 20,
    left: 24,
    right: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  bookBtn: {
    height: 62,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },
  bookText: { color: "#fff", fontSize: 18, fontWeight: "800", marginLeft: 10 },
  favBtn: {
    width: 62,
    height: 62,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
});
