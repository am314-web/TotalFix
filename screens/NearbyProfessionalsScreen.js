import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Briefcase, Calendar, MapPin, MessageSquare, Search, Star, User } from 'lucide-react-native';
import { useState } from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');
const PRIMARY = '#5B4CF0';

// --- MOCK PROFESSIONALS DATA ---
const professionalsData = [
    {
        id: '1',
        name: 'Alex Rivera',
        role: 'Full Stack Developer',
        experience: '5+ years exp',
        distance: '1.2 km away',
        rating: '4.9',
        reviews: '124',
        status: 'Available Now',
        rate: '₹1,500/hr',
        skills: ['React Native', 'Node.js', 'Next.js']
    },
    {
        id: '2',
        name: 'Sarah Chen',
        role: 'UI/UX Designer',
        experience: '4 years exp',
        distance: '2.8 km away',
        rating: '4.8',
        reviews: '98',
        status: 'Busy',
        rate: '₹1,200/hr',
        skills: ['Figma', 'Mobile Design', 'Design Systems']
    },
    {
        id: '3',
        name: 'David Miller',
        role: 'DevOps Engineer',
        experience: '7+ years exp',
        distance: '4.5 km away',
        rating: '5.0',
        reviews: '64',
        status: 'Available Now',
        rate: '₹2,200/hr',
        skills: ['AWS', 'Docker', 'CI/CD Pipelines']
    }
];

export default function App() {
    const [activeSegment, setActiveSegment] = useState('Available');

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

            {/* TOP DECORATIVE BACKGROUND GRAPHIC LAYER */}
            <View style={styles.topGraphicWrapper} pointerEvents="none">
                <View style={styles.purpleCircleBackground} />
            </View>

            {/* FIXED HEADER */}
            <View style={styles.headerRow}>
                <TouchableOpacity style={styles.iconButton}>
                    <ArrowLeft size={22} color="#111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Nearby Professionals</Text>
                <TouchableOpacity style={styles.iconButton}>
                    <Search size={22} color="#111" />
                </TouchableOpacity>
            </View>

            {/* SEGMENTED TAB SELECTOR (Matches reference image tabs) */}
            <View style={styles.segmentContainer}>
                {['Available', 'Booked', 'Saved'].map((tab) => {
                    const isSelected = activeSegment === tab;
                    return (
                        <TouchableOpacity
                            key={tab}
                            activeOpacity={0.8}
                            onPress={() => setActiveSegment(tab)}
                            style={styles.segmentTab}
                        >
                            <Text style={[styles.segmentText, isSelected && styles.segmentTextActive]}>
                                {tab}
                            </Text>
                            {isSelected && <View style={styles.activeIndicatorLine} />}
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* LIST OF PROFESSIONALS */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollList}
            >
                {professionalsData.map((pro) => {
                    const isAvailable = pro.status === 'Available Now';
                    return (
                        <View key={pro.id} style={styles.proCard}>

                            {/* TOP BAR OF CARD: STATUS BAR */}
                            <View style={styles.cardHeader}>
                                <View style={styles.statusRow}>
                                    <View style={[styles.statusDot, { backgroundColor: isAvailable ? '#10B981' : '#F59E0B' }]} />
                                    <Text style={styles.statusText}>{pro.status}</Text>
                                </View>
                                <View style={styles.rateBadge}>
                                    <Text style={styles.rateBadgeText}>{pro.rate}</Text>
                                </View>
                            </View>

                            {/* MAIN CARD CONTENT ROW */}
                            <View style={styles.cardMainContent}>
                                {/* PROFILE AVATAR PLACEHOLDER */}
                                <View style={styles.avatarWrapper}>
                                    <View style={styles.avatarPlaceholderBase}>
                                        <User size={28} color="#94A3B8" />
                                    </View>
                                    <LinearGradient
                                        colors={[PRIMARY, '#7C71FF']}
                                        style={styles.verifiedBadge}
                                    >
                                        <Briefcase size={10} color="#FFF" />
                                    </LinearGradient>
                                </View>

                                {/* PROFILE TEXT DETAILS */}
                                <View style={styles.infoColumn}>
                                    <View style={styles.titleRow}>
                                        <Text style={styles.proName} numberOfLines={1}>{pro.name}</Text>
                                        <View style={styles.ratingBox}>
                                            <Star size={12} color="#F4A623" fill="#F4A623" />
                                            <Text style={styles.ratingTextValue}>{pro.rating}</Text>
                                            <Text style={styles.reviewsCountText}>({pro.reviews})</Text>
                                        </View>
                                    </View>

                                    <Text style={styles.roleText}>{pro.role} • <Text style={styles.expText}>{pro.experience}</Text></Text>

                                    <View style={styles.locationRow}>
                                        <MapPin size={12} color="#94A3B8" />
                                        <Text style={styles.locationTextString} numberOfLines={1}>{pro.distance}</Text>
                                    </View>

                                    {/* SKILLS STRIP TAGS */}
                                    <View style={styles.skillsContainerRow}>
                                        {pro.skills.map((skill, index) => (
                                            <View key={index} style={styles.skillTag}>
                                                <Text style={styles.skillTagText}>{skill}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </View>

                            {/* ACTION FOOTER CONTAINER ROW (Matches split button style from image) */}
                            <View style={styles.cardActionsFooter}>
                                <TouchableOpacity style={styles.secondaryButtonVariant}>
                                    <MessageSquare size={16} color="#64748B" style={{ marginRight: 6 }} />
                                    <Text style={styles.secondaryBtnTextLabel}>Message</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.primaryActionButton}>
                                    <LinearGradient
                                        colors={[PRIMARY, '#4334E6']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.primaryBtnGradientFill}
                                    >
                                        <Calendar size={16} color="#FFF" style={{ marginRight: 6 }} />
                                        <Text style={styles.primaryBtnTextLabel}>Book Now</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>

                        </View>
                    );
                })}
                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFC',
    },
    topGraphicWrapper: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        zIndex: 0,
    },
    purpleCircleBackground: {
        width: width * 1.6,
        height: width * 1.6,
        borderRadius: (width * 1.6) / 2,
        backgroundColor: 'rgba(91, 76, 240, 0.04)',
        top: -width * 0.9,
        position: 'absolute',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFF',
        zIndex: 1,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1E293B',
    },
    segmentContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        zIndex: 1,
    },
    segmentTab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 15,
    },
    segmentText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#94A3B8',
    },
    segmentTextActive: {
        color: PRIMARY,
        fontWeight: '700',
    },
    activeIndicatorLine: {
        position: 'absolute',
        bottom: 0,
        width: 40,
        height: 3,
        backgroundColor: PRIMARY,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
    },
    scrollList: {
        padding: 20,
    },
    proCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#5B4CF0',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.02,
        shadowRadius: 16,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F8FAFC',
        paddingBottom: 12,
        marginBottom: 14,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    statusText: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '600',
    },
    rateBadge: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    rateBadgeText: {
        color: '#1E293B',
        fontSize: 12,
        fontWeight: '700',
    },
    cardMainContent: {
        flexDirection: 'row',
    },
    avatarWrapper: {
        width: 74,
        height: 74,
        borderRadius: 20,
        position: 'relative',
    },
    avatarPlaceholderBase: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    infoColumn: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    proName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
        flex: 1,
        marginRight: 8,
    },
    ratingBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingTextValue: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1E293B',
        marginLeft: 3,
    },
    reviewsCountText: {
        fontSize: 11,
        color: '#94A3B8',
        marginLeft: 2,
    },
    roleText: {
        fontSize: 13,
        color: '#475569',
        marginTop: 2,
        fontWeight: '500',
    },
    expText: {
        color: '#64748B',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 4,
    },
    locationTextString: {
        fontSize: 12,
        color: '#94A3B8',
        flex: 1,
    },
    skillsContainerRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
        gap: 6,
    },
    skillTag: {
        backgroundColor: 'rgba(91, 76, 240, 0.05)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    skillTagText: {
        color: PRIMARY,
        fontSize: 11,
        fontWeight: '600',
    },
    cardActionsFooter: {
        flexDirection: 'row',
        marginTop: 18,
        gap: 12,
    },
    secondaryButtonVariant: {
        flex: 1,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#F8FAFC',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    secondaryBtnTextLabel: {
        color: '#64748B',
        fontSize: 14,
        fontWeight: '700',
    },
    primaryActionButton: {
        flex: 1,
        height: 44,
        borderRadius: 14,
        overflow: 'hidden',
    },
    primaryBtnGradientFill: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryBtnTextLabel: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },
});