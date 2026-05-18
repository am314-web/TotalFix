import { useEffect, useRef, useState } from "react";
import {
    Alert,
    FlatList,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { createJobRequest } from "../services/supabaseBookingService";
import { SafeAreaView } from "react-native-safe-area-context";

import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, router } from "expo-router";

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

// --- ADDED SERVICES DATA DICTIONARY ---
export const servicesData = {
  plumber: {
    title: "Professional Plumbing Services",
    subtitle: "Expert plumbers for all home plumbing needs.",
    description:
      "Our certified plumbers handle pipe leakage, tap repairs, bathroom fittings, water tank installation, drainage cleaning, and complete plumbing maintenance with premium quality service.",
    stats: {
      experience: "10M+",
      rating: "4.9",
      customers: "5M+",
      price: "₹499",
    },
    about:
      "Trusted plumbing professionals for homes, offices, and apartments. Fast response, affordable pricing, and high-quality work.",
    reviews: [
      {
        name: "Rahul Sharma",
        review:
          "Excellent plumbing service. Fixed my kitchen leakage quickly.",
      },
      {
        name: "Anita Patel",
        review:
          "Very professional plumber and clean finishing work.",
      },
    ],
  },

  carpenter: {
    title: "Professional Carpenter Services",
    subtitle: "Furniture repair and woodwork experts.",
    description:
      "Get expert carpenters for furniture assembly, modular kitchen work, door repair, wardrobe installation, custom woodwork, and home interior solutions.",
    stats: {
      experience: "8M+",
      rating: "4.8",
      customers: "4M+",
      price: "₹599",
    },
    about:
      "Experienced carpenters delivering strong, premium, and modern woodwork solutions for your home.",
    reviews: [
      {
        name: "Vikas Mehta",
        review:
          "Amazing wardrobe installation and finishing quality.",
      },
      {
        name: "Sneha Verma",
        review:
          "Professional carpenter and completed work on time.",
      },
    ],
  },

  electrician: {
    title: "Professional Electrician Services",
    subtitle: "Safe and reliable electrical solutions.",
    description:
      "Hire expert electricians for switchboard repair, fan installation, wiring, lighting setup, inverter installation, and complete electrical maintenance.",
    stats: {
      experience: "12M+",
      rating: "4.9",
      customers: "6M+",
      price: "₹399",
    },
    about:
      "Certified electricians ensuring safe, fast, and premium electrical services for your home.",
    reviews: [
      {
        name: "Aman Gupta",
        review:
          "Quick electrician service and solved wiring issue perfectly.",
      },
      {
        name: "Ritika Jain",
        review:
          "Professional and very knowledgeable electrician.",
      },
    ],
  },

  painter: {
    title: "Professional Painting Services",
    subtitle: "Premium home painting experts.",
    description:
      "Book painters for wall painting, texture painting, waterproofing, exterior painting, interior decoration, and premium home makeover services.",
    stats: {
      experience: "7M+",
      rating: "4.8",
      customers: "3M+",
      price: "₹999",
    },
    about:
      "Transform your home with modern painting designs and premium wall finishes.",
    reviews: [
      {
        name: "Karan Singh",
        review:
          "Beautiful wall finish and very clean painting work.",
      },
      {
        name: "Priya Shah",
        review:
          "Affordable pricing with premium painting quality.",
      },
    ],
  },

  cleaner: {
    title: "Professional Cleaning Services",
    subtitle: "Deep cleaning for your home and office.",
    description:
      "Professional cleaners for bathroom cleaning, kitchen cleaning, sofa cleaning, carpet cleaning, full home deep cleaning, and sanitization services.",
    stats: {
      experience: "15M+",
      rating: "4.9",
      customers: "8M+",
      price: "₹699",
    },
    about:
      "High-quality deep cleaning solutions using modern equipment and eco-friendly products.",
    reviews: [
      {
        name: "Neha Kapoor",
        review:
          "My house looks completely fresh and clean now.",
      },
      {
        name: "Rohit Yadav",
        review:
          "Very professional cleaners with excellent service.",
      },
    ],
  },

  mechanic: {
    title: "Professional Mechanic Services",
    subtitle: "Trusted vehicle repair experts.",
    description:
      "Get mechanics for bike servicing, car repair, engine checkup, battery replacement, puncture repair, and vehicle maintenance.",
    stats: {
      experience: "9M+",
      rating: "4.7",
      customers: "4M+",
      price: "₹799",
    },
    about:
      "Reliable mechanics providing doorstep repair and maintenance services.",
    reviews: [
      {
        name: "Arjun Malhotra",
        review:
          "Bike service was smooth and very affordable.",
      },
      {
        name: "Deepak Joshi",
        review:
          "Professional mechanic and fast repair work.",
      },
    ],
  },

  gardener: {
    title: "Professional Gardening Services",
    subtitle: "Beautiful gardens made easy.",
    description:
      "Hire gardeners for lawn maintenance, plant care, landscaping, garden setup, watering systems, and terrace garden services.",
    stats: {
      experience: "5M+",
      rating: "4.8",
      customers: "2M+",
      price: "₹499",
    },
    about:
      "Expert gardeners helping you maintain healthy and beautiful green spaces.",
    reviews: [
      {
        name: "Pooja Desai",
        review:
          "My garden looks fresh and beautiful after the service.",
      },
      {
        name: "Nitin Rao",
        review:
          "Professional gardening work and good plant knowledge.",
      },
    ],
  },

  tailor: {
    title: "Professional Tailoring Services",
    subtitle: "Custom stitching and alteration experts.",
    description:
      "Book tailoring services for custom stitching, dress designing, alterations, blouse stitching, suit fitting, and premium fashion solutions.",
    stats: {
      experience: "6M+",
      rating: "4.9",
      customers: "3M+",
      price: "₹399",
    },
    about:
      "Professional tailors delivering perfect fitting and stylish clothing solutions.",
    reviews: [
      {
        name: "Simran Kaur",
        review:
          "Perfect fitting and premium stitching quality.",
      },
      {
        name: "Meera Shah",
        review:
          "Very talented tailor and fast delivery.",
      },
    ],
  },

  welder: {
    title: "Professional Welding Services",
    subtitle: "Strong and secure welding solutions.",
    description:
      "Expert welders for gate repair, grill fabrication, metal furniture, staircase welding, and industrial welding work.",
    stats: {
      experience: "4M+",
      rating: "4.7",
      customers: "2M+",
      price: "₹899",
    },
    about:
      "Durable and premium welding services for homes and commercial projects.",
    reviews: [
      {
        name: "Sanjay Kumar",
        review:
          "Strong welding work and excellent finishing.",
      },
      {
        name: "Ramesh Patel",
        review:
          "Professional welder with quality materials.",
      },
    ],
  },

  contractor: {
    title: "Professional Contractor Services",
    subtitle: "Complete construction and renovation solutions.",
    description:
      "Hire contractors for home renovation, construction projects, interior work, remodeling, civil work, and project management.",
    stats: {
      experience: "20M+",
      rating: "4.9",
      customers: "10M+",
      price: "₹1499",
    },
    about:
      "Trusted contractors managing premium residential and commercial projects.",
    reviews: [
      {
        name: "Manoj Verma",
        review:
          "Excellent renovation service and project management.",
      },
      {
        name: "Kriti Sharma",
        review:
          "Very professional contractor and quality construction.",
      },
    ],
  },

  laundry: {
    title: "Professional Laundry Services",
    subtitle: "Fast and premium laundry solutions.",
    description:
      "Book laundry professionals for washing, dry cleaning, ironing, stain removal, and doorstep pickup and delivery services.",
    stats: {
      experience: "11M+",
      rating: "4.8",
      customers: "7M+",
      price: "₹299",
    },
    about:
      "Affordable and premium laundry services with hygienic cleaning process.",
    reviews: [
      {
        name: "Riya Mehta",
        review:
          "Clothes were cleaned perfectly and delivered on time.",
      },
      {
        name: "Akash Jain",
        review:
          "Professional laundry service with great packaging.",
      },
    ],
  },

  security: {
    title: "Professional Security Services",
    subtitle: "Reliable safety and protection experts.",
    description:
      "Hire trained security guards for residential societies, offices, events, shops, and commercial buildings.",
    stats: {
      experience: "13M+",
      rating: "4.8",
      customers: "5M+",
      price: "₹1299",
    },
    about:
      "Trusted security professionals ensuring complete safety and protection.",
    reviews: [
      {
        name: "Harsh Thakur",
        review:
          "Very disciplined and professional security staff.",
      },
      {
        name: "Nidhi Kapoor",
        review:
          "Reliable security service for our apartment.",
      },
    ],
  },
};

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

const serviceIcons = {
    plumber: require("../assets/images/icons/plumber.png"),
    carpenter: require("../assets/images/icons/carpenter.png"),
    welder: require("../assets/images/icons/welder.png"),
    contractor: require("../assets/images/icons/construction.png"),
    electrician: require("../assets/images/icons/electrician.png"),
    painter: require("../assets/images/icons/painter.png"),
    laundry: require("../assets/images/icons/laundary.png"),
    mechanic: require("../assets/images/icons/mechanic.png"),
    cleaner: require("../assets/images/icons/laundary.png"),
    gardener: require("../assets/images/icons/construction.png"),
    security: require("../assets/images/icons/construction.png"),
    tailor: require("../assets/images/icons/painter.png"),
};

export default function App() {
    const { service } = useLocalSearchParams();
    const [activeTab, setActiveTab] = useState("About");
    const [liked, setLiked] = useState(false);
    
    // --- Added Selection State to compute active content ---
    const [selectedServiceKey, setSelectedServiceKey] = useState("plumber");
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        if (service && servicesData[service]) {
            setSelectedServiceKey(service);
        }
    }, [service]);

    const activeService = servicesData[selectedServiceKey] || servicesData.plumber;

    const handleBookService = () => {
        setBookingLoading(true);
        router.push({
            pathname: "/booking-invoice",
            params: { serviceType: selectedServiceKey }
        });
        // Reset loading state after navigation begins
        setTimeout(() => setBookingLoading(false), 1000);
    };

    // Derived loop arrays based on selected profile data
    const runtimeStats = [
        { id: "1", active: true, icon: <ShieldCheck size={24} color="#fff" />, number: activeService.stats.experience, label: "Experience" },
        { id: "2", icon: <Star size={24} color={PRIMARY} />, number: activeService.stats.rating, label: "Average rating" },
        { id: "3", icon: <Users size={24} color={PRIMARY} />, number: activeService.stats.customers, label: "Customers served" },
        { id: "4", icon: <Clock3 size={24} color={PRIMARY} />, number: "60 min", label: "Avg response" },
    ];

    const runtimeReviews = activeService.reviews.map((r, index) => ({
        id: String(index + 1),
        initials: r.name.split(" ").map(n => n[0]).join("").toUpperCase(),
        name: r.name,
        text: r.review
    }));

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

            {/* AMBIENT LIGHT BACKGROUND SERVICE ICON */}
            {serviceIcons[selectedServiceKey] && (
                <Image
                    source={serviceIcons[selectedServiceKey]}
                    style={styles.bgIcon}
                    resizeMode="contain"
                />
            )}

            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 160 }}
                >
                    {/* NAVBAR */}
                    <View style={styles.nav}>
                        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
                            <GlassButton>
                                <ArrowLeft size={22} color="#111" />
                            </GlassButton>
                        </TouchableOpacity>
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
                            {activeService.title.split(" ")[1] || "Urban"}{"\n"}
                            <Text style={styles.gradientText}>Company</Text>
                        </Text>
                        <Text style={styles.heroDescription}>
                            {activeService.subtitle} {activeService.description}
                        </Text>
                        <LinearGradient
                            colors={[PRIMARY, "#8B7CFF"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.pricePill}
                        >
                            <Wrench size={16} color="#fff" />
                            <Text style={styles.priceText}>Starting {activeService.stats.price} / visit</Text>
                        </LinearGradient>
                    </View>

                    {/* STATS CAROUSEL */}
                    <AutoHorizontalLoop
                        items={runtimeStats}
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
                    {/* Click event hooks added inside item renderer definition to toggle type data */}
                    <FlatList
                        data={[...services, ...services]}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.carouselContainer}
                        keyExtractor={(item, i) => `service-header-${item}-${i}`}
                        renderItem={({ item }) => {
                            const mappingKey = item.toLowerCase() === "cleaning" ? "cleaner" : item.toLowerCase() === "ac repair" ? "electrician" : item.toLowerCase() === "beauty" ? "tailor" : item.toLowerCase();
                            const isCurrent = selectedServiceKey === mappingKey;
                            return (
                                <TouchableOpacity 
                                    activeOpacity={0.8}
                                    onPress={() => Object.keys(servicesData).includes(mappingKey) && setSelectedServiceKey(mappingKey)}
                                    style={[styles.serviceTag, isCurrent && {borderColor: PRIMARY, backgroundColor: '#FAF9FF'}]}
                                >
                                    <View style={[styles.serviceDot, isCurrent && {backgroundColor: PRIMARY}]} />
                                    <Text style={[styles.serviceText, isCurrent && {color: PRIMARY, fontWeight: "800"}]}>{item}</Text>
                                </TouchableOpacity>
                            );
                        }}
                    />

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
                        <Text style={styles.sectionTitle}>{activeService.subtitle}</Text>
                        <Text style={styles.sectionText}>
                            {activeService.about}
                            <Text style={styles.readMore}> Read more →</Text>
                        </Text>
                    </View>

                    {/* RATING SECTION */}
                    <View style={styles.ratingSection}>
                        <Text style={styles.ratingNumber}>{activeService.stats.rating}</Text>
                        <View>
                            <View style={styles.starsRow}>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star key={i} size={16} fill="#F4A623" color="#F4A623" />
                                ))}
                            </View>
                            <Text style={styles.reviewCount}>Based on {activeService.stats.customers} reviews</Text>
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
                            title={activeService.stats.price}
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
                                <Text style={styles.profileRole}>{activeService.title}</Text>
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
                        items={runtimeReviews}
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
                    <TouchableOpacity 
                        activeOpacity={0.9} 
                        style={{ flex: 1 }} 
                        onPress={handleBookService}
                        disabled={bookingLoading}
                    >
                        <LinearGradient
                            colors={[PRIMARY, "#7B6DFF"]}
                            style={styles.bookBtn}
                        >
                            <CalendarDays size={22} color="#fff" />
                            <Text style={styles.bookText}>
                                {bookingLoading ? "Booking..." : "Book a Service"}
                            </Text>
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
    bgIcon: {
        position: "absolute",
        width: 320,
        height: 320,
        top: 80,
        right: -80,
        opacity: 0.35,
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