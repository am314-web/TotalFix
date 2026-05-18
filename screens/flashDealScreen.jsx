import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Clock, Flame, MapPin, Percent, Search, Star } from 'lucide-react-native';
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

// --- MOCK FLASH DEALS DATA ---
const flashDealsData = [
    {
        id: '1',
        title: 'GourmetGrove Galore',
        cuisine: 'European',
        location: '4517 Washington Ave.',
        rating: '5.0',
        discount: '50% OFF',
        timeLeft: '14m 22s',
        claimedProgress: 0.75, // 75% claimed
        originalPrice: '₹1,200',
        dealPrice: '₹599'
    },
    {
        id: '2',
        title: 'LibertyBite Bistro',
        cuisine: 'Italian',
        location: '1012 Ocean Avenue, NY',
        rating: '4.8',
        discount: '40% OFF',
        timeLeft: '32m 05s',
        claimedProgress: 0.40, // 40% claimed
        originalPrice: '₹800',
        dealPrice: '₹479'
    },
    {
        id: '3',
        title: 'TasteTrove Tavern',
        cuisine: 'Mexican',
        location: '3891 Ranchview Dr, Tech',
        rating: '4.3',
        discount: 'Buy 1 Get 1',
        timeLeft: '05m 12s',
        claimedProgress: 0.92, // 92% claimed
        originalPrice: '₹600',
        dealPrice: '₹300'
    }
];

export default function App() {
    const [activeSegment, setActiveSegment] = useState('Active');

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
                <Text style={styles.headerTitle}>Flash Deals</Text>
                <TouchableOpacity style={styles.iconButton}>
                    <Search size={22} color="#111" />
                </TouchableOpacity>
            </View>

            {/* SEGMENTED TAB SELECTOR */}
            <View style={styles.segmentContainer}>
                {['Active', 'Upcoming', 'Missed'].map((tab) => {
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

            {/* LIST OF DEALS */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollList}
            >
                {flashDealsData.map((deal) => (
                    <View key={deal.id} style={styles.dealCard}>

                        {/* TOP BAR OF CARD: DATE / TIME CONTROLLER CONTAINER */}
                        <View style={styles.cardHeader}>
                            <View style={styles.timerRow}>
                                <Clock size={14} color="#EF4444" style={{ marginRight: 6 }} />
                                <Text style={styles.timerText}>Ends in: <Text style={styles.timerCountdown}>{deal.timeLeft}</Text></Text>
                            </View>
                            <View style={styles.liveBadge}>
                                <Flame size={12} color="#FFF" fill="#FFF" style={{ marginRight: 4 }} />
                                <Text style={styles.liveBadgeText}>HOT</Text>
                            </View>
                        </View>

                        {/* MAIN CARD CONTENT COLUMN */}
                        <View style={styles.cardMainContent}>
                            {/* IMAGE THUMBNAIL PLACEHOLDER WITH DISCOUNT OVERLAY */}
                            <View style={styles.imageWrapper}>
                                <View style={styles.imagePlaceholderBase}>
                                    <Percent size={24} color="#AAA" />
                                </View>
                                <LinearGradient
                                    colors={[PRIMARY, '#7C71FF']}
                                    style={styles.discountBadge}
                                >
                                    <Text style={styles.discountBadgeText}>{deal.discount}</Text>
                                </LinearGradient>
                            </View>

                            {/* SERVICE INFO COMPONENT */}
                            <View style={styles.infoColumn}>
                                <View style={styles.titleRow}>
                                    <Text style={styles.dealTitle} numberOfLines={1}>{deal.title}</Text>
                                    <View style={styles.ratingBox}>
                                        <Star size={12} color="#F4A623" fill="#F4A623" />
                                        <Text style={styles.ratingTextValue}>{deal.rating}</Text>
                                    </View>
                                </View>

                                <Text style={styles.cuisineText}>{deal.cuisine} Cuisine</Text>

                                <View style={styles.locationRow}>
                                    <MapPin size={12} color="#94A3B8" />
                                    <Text style={styles.locationTextString} numberOfLines={1}>{deal.location}</Text>
                                </View>

                                {/* PRICE ROW DISPLAY */}
                                <View style={styles.priceContainerRow}>
                                    <Text style={styles.dealPriceAmount}>{deal.dealPrice}</Text>
                                    <Text style={styles.originalPriceAmount}>{deal.originalPrice}</Text>
                                </View>
                            </View>
                        </View>

                        {/* DEAL AVAILABILITY METER PROGRESS BAR */}
                        <View style={styles.progressContainer}>
                            <View style={styles.progressBarTrack}>
                                <View style={[styles.progressBarFill, { width: `${deal.claimedProgress * 100}%` }]} />
                            </View>
                            <Text style={styles.progressStatusText}>{Math.round(deal.claimedProgress * 100)}% claimed</Text>
                        </View>

                        {/* ACTION FOOTER CONTAINER ROW */}
                        <View style={styles.cardActionsFooter}>
                            <TouchableOpacity style={styles.secondaryButtonVariant}>
                                <Text style={styles.secondaryBtnTextLabel}>View Details</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.primaryActionButton}>
                                <LinearGradient
                                    colors={[PRIMARY, '#4334E6']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.primaryBtnGradientFill}
                                >
                                    <Text style={styles.primaryBtnTextLabel}>Claim Deal</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                    </View>
                ))}
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
    dealCard: {
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
    timerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timerText: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '500',
    },
    timerCountdown: {
        color: '#EF4444',
        fontWeight: '700',
    },
    liveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EF4444',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    liveBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    cardMainContent: {
        flexDirection: 'row',
    },
    imageWrapper: {
        width: 84,
        height: 84,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    imagePlaceholderBase: {
        flex: 1,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    discountBadge: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 2,
        alignItems: 'center',
    },
    discountBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '800',
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
    dealTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
        flex: 1,
        marginRight: 8,
    },
    ratingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingTextValue: {
        fontSize: 12,
        fontWeight: '700',
        color: '#64748B',
    },
    cuisineText: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 2,
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
    priceContainerRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginTop: 8,
        gap: 8,
    },
    dealPriceAmount: {
        fontSize: 18,
        fontWeight: '800',
        color: PRIMARY,
    },
    originalPriceAmount: {
        fontSize: 13,
        color: '#94A3B8',
        textDecorationLine: 'line-through',
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        gap: 10,
    },
    progressBarTrack: {
        flex: 1,
        height: 6,
        backgroundColor: '#E2E8F0',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#F59E0B',
        borderRadius: 3,
    },
    progressStatusText: {
        fontSize: 11,
        color: '#64748B',
        fontWeight: '600',
        width: 65,
        textAlign: 'right',
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryBtnTextLabel: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },
});