import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import AppBottomTab from "../components/AppBottomTab";
import {
    Calendar,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    CreditCard,
    Download,
    Home,
    MapPin,
    Minus,
    Plus,
    ShieldCheck,
    Ticket,
    Wrench,
} from "lucide-react-native";
import { useState } from "react";
import {
    Dimensions,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

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
  success: "#22C55E",
  successBg: "#DCFCE7",
  amber: "#F59E0B",
  error: "#EF4444",
};

// ─── DATA ────────────────────────────────────────────────────
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DOWS = ["S", "M", "T", "W", "T", "F", "S"];
const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

// ─── SHARED COMPONENTS (No lines removed) ─────────────────────
const StatusBarRow = () => (
  <View style={s.statusBar}>
    <Text style={s.statusTime}>9:41</Text>
    <View style={s.statusIcons}>
      <View style={s.signalGroup}>
        {[3, 5, 7, 9].map((h, i) => (
          <View
            key={i}
            style={[s.signalBar, { height: h, opacity: i < 3 ? 1 : 0.3 }]}
          />
        ))}
      </View>
      <View style={s.wifiIcon}>
        {[12, 8, 4].map((w, i) => (
          <View
            key={i}
            style={[
              s.wifiArc,
              {
                width: w,
                height: w / 2,
                borderTopLeftRadius: w / 2,
                borderTopRightRadius: w / 2,
                opacity: i === 0 ? 0.3 : 1,
              },
            ]}
          />
        ))}
      </View>
      <View style={s.batteryWrap}>
        <View style={[s.batteryFill, { width: "75%" }]} />
        <View style={s.batteryCap} />
      </View>
    </View>
  </View>
);

const TopBar = ({ title, onBack, rightIcon }) => (
  <View style={s.topBar}>
    {onBack ? (
      <TouchableOpacity style={s.iconBtn} onPress={onBack} activeOpacity={0.75}>
        <ChevronLeft size={sc(20)} color={C.textDark} strokeWidth={2.2} />
      </TouchableOpacity>
    ) : (
      <View style={s.iconBtnPlaceholder} />
    )}
    <Text style={s.topBarTitle}>{title}</Text>
    {rightIcon ? (
      <TouchableOpacity style={s.iconBtn} activeOpacity={0.75}>
        {rightIcon}
      </TouchableOpacity>
    ) : (
      <View style={s.iconBtnPlaceholder} />
    )}
  </View>
);

const ProgressDots = ({ current }) => (
  <View style={s.progressDots}>
    {[0, 1, 2].map((i) => (
      <View
        key={i}
        style={[s.dot, current === i && s.dotActive, current > i && s.dotDone]}
      />
    ))}
  </View>
);

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

const Avatar = ({
  initials,
  size = 48,
  colors = [C.p1, C.p3],
  style: overrideStyle,
}) => (
  <LinearGradient
    colors={colors}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[
      {
        width: size,
        height: size,
        borderRadius: size * 0.28,
        alignItems: "center",
        justifyContent: "center",
      },
      overrideStyle,
    ]}
  >
    <Text
      style={{
        color: C.white,
        fontSize: sc(size * 0.3),
        fontWeight: "800",
        letterSpacing: -0.5,
      }}
    >
      {initials}
    </Text>
  </LinearGradient>
);

const QRCode = () => {
  const cell = sc(6);
  const pattern = [
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1],
    [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0],
    [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1],
    [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0],
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1],
  ];
  return (
    <View style={{ flexDirection: "column", gap: 1 }}>
      {pattern.map((row, ri) => (
        <View key={ri} style={{ flexDirection: "row", gap: 1 }}>
          {row.map((cell_val, ci) => (
            <View
              key={ci}
              style={{
                width: cell,
                height: cell,
                borderRadius: 1,
                backgroundColor: cell_val
                  ? (ri < 7 && ci < 7) ||
                    (ri < 7 && ci > 13) ||
                    (ri > 13 && ci < 7)
                    ? C.p3
                    : C.textDark
                  : "transparent",
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

// ─── SCREEN 0: BOOKING AC REPAIR ─────────────────────────────
const BookAppointment = ({ onNext }) => {
  const [calMonth, setCalMonth] = useState(4); // May
  const [selectedDay, setSelectedDay] = useState(16);
  const [selectedTime, setSelectedTime] = useState("14:00");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.offWhite }}>
      <StatusBarRow />
      <TopBar title="Book AC Repair" />
      <ProgressDots current={0} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: height * 0.14 }}
      >
        <View style={s.calWrap}>
          <View style={s.calHeader}>
            <TouchableOpacity style={s.calNav} activeOpacity={0.75}>
              <ChevronLeft size={sc(16)} color={C.textDark} />
            </TouchableOpacity>
            <Text style={s.calMonthText}>{MONTHS[calMonth]} 2026</Text>
            <TouchableOpacity style={s.calNav} activeOpacity={0.75}>
              <ChevronRight size={sc(16)} color={C.textDark} />
            </TouchableOpacity>
          </View>
          <View style={s.calDowRow}>
            {DOWS.map((d, i) => (
              <Text key={i} style={s.calDow}>
                {d}
              </Text>
            ))}
          </View>
          <View style={s.calGrid}>
            {[...Array(31)].map((_, i) => {
              const day = i + 1;
              const isSelected = day === selectedDay;
              return (
                <TouchableOpacity
                  key={i}
                  style={[s.calCell, isSelected && s.calCellSelected]}
                  onPress={() => setSelectedDay(day)}
                >
                  {isSelected ? (
                    <LinearGradient
                      colors={[C.p1, C.p3]}
                      style={s.calCellGradient}
                    >
                      <Text style={[s.calDayText, s.calDaySelected]}>
                        {day}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <Text style={s.calDayText}>{day}</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={s.timeLabelRow}>
          <View style={s.timeLabelLeft}>
            <Clock size={sc(16)} color={C.p2} />
            <Text style={s.sectionLabelText}>Arrival Time</Text>
          </View>
          <View style={s.selectedTimePill}>
            <Text style={s.selectedTimePillText}>{selectedTime}</Text>
          </View>
        </View>

        <View style={s.timeGrid}>
          {TIME_SLOTS.map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setSelectedTime(t)}
              style={[s.timeSlot, t === selectedTime && s.timeSlotActive]}
            >
              {t === selectedTime ? (
                <LinearGradient
                  colors={[C.p2, C.p3]}
                  style={s.timeSlotGradient}
                >
                  <Text style={[s.timeSlotText, s.timeSlotTextActive]}>
                    {t}
                  </Text>
                </LinearGradient>
              ) : (
                <Text style={s.timeSlotText}>{t}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={s.ctaZone}>
        <TouchableOpacity
          onPress={onNext}
          activeOpacity={0.88}
          style={{ flex: 1 }}
        >
          <LinearGradient
            colors={[C.p1, C.p3]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={s.ctaBtn}
          >
            <Calendar size={sc(20)} color={C.white} />
            <Text style={s.ctaBtnText}>Continue</Text>
            <ChevronRight size={sc(20)} color={C.white} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ─── SCREEN 1: SERVICE OVERVIEW (PREMIUM UI) ──────────────────
const AppointmentOverview = ({ onBack, onNext }) => {
  const [qty, setQty] = useState(1);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.offWhite }}>
      <StatusBarRow />
      <TopBar title="Review Order" onBack={onBack} />
      <ProgressDots current={1} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: height * 0.15 }}
      >
        <SectionLabel label="Selected Service" />
        <View style={s.premiumCard}>
          <View style={s.serviceHeader}>
            <View style={s.iconBox}>
              <Wrench size={sc(22)} color={C.p2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.mainTitle}>Split AC Jet Service</Text>
              <Text style={s.subText}>Premium Deep Cleaning</Text>
            </View>
            <Text style={s.priceBold}>₹1,499</Text>
          </View>
          <View style={s.cardActionRow}>
            <Text style={s.actionLabel}>Quantity</Text>
            <View style={s.qtyPicker}>
              <TouchableOpacity
                onPress={() => qty > 1 && setQty(qty - 1)}
                style={s.qtyCircle}
              >
                <Minus size={14} color={C.p2} />
              </TouchableOpacity>
              <Text style={s.qtyVal}>{qty}</Text>
              <TouchableOpacity
                onPress={() => setQty(qty + 1)}
                style={s.qtyCircle}
              >
                <Plus size={14} color={C.p2} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <SectionLabel label="Add-ons" />
        <View style={s.premiumCard}>
          <View style={s.addonItem}>
            <View style={{ flex: 1 }}>
              <Text style={s.addonTitle}>Gas Top-up (R32)</Text>
              <Text style={s.addonPrice}>+₹850</Text>
            </View>
            <TouchableOpacity style={s.addBtnSmall}>
              <Text style={s.addBtnText}>ADD</Text>
            </TouchableOpacity>
          </View>
        </View>

        <SectionLabel label="Coupon" />
        <TouchableOpacity style={s.couponGlass}>
          <Ticket size={20} color={C.success} />
          <Text style={s.couponTxt}>UC500 APPLIED</Text>
          <Text style={s.couponSaving}>-₹500</Text>
        </TouchableOpacity>

        <SectionLabel label="Service Address" />
        <View style={s.premiumCard}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <MapPin size={18} color={C.p2} />
            <Text
              style={{ fontSize: 13, color: C.textDark, fontWeight: "600" }}
            >
              B-402, Skyline Residency, Ahmedabad
            </Text>
          </View>
        </View>

        <SectionLabel label="Payment Summary" />
        <View style={s.billCard}>
          <View style={s.billRow}>
            <Text style={s.billKey}>Item Total</Text>
            <Text style={s.billVal}>₹{qty * 1499}</Text>
          </View>
          <View style={s.billRow}>
            <Text style={s.billKey}>Taxes & Fee</Text>
            <Text style={s.billVal}>₹150</Text>
          </View>
          <View style={s.billRow}>
            <Text style={s.billKey}>Discount</Text>
            <Text style={[s.billVal, { color: C.success }]}>-₹500</Text>
          </View>
          <View style={s.billDivider} />
          <View style={s.billRow}>
            <Text style={s.totalKey}>Total Payable</Text>
            <Text style={s.totalVal}>₹{qty * 1499 - 350}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={s.ctaZone}>
        <TouchableOpacity
          onPress={onNext}
          activeOpacity={0.88}
          style={{ flex: 1 }}
        >
          <LinearGradient colors={[C.p1, C.p3]} style={s.ctaBtn}>
            <CreditCard size={sc(20)} color={C.white} />
            <Text style={s.ctaBtnText}>
              Confirm Booking • ₹{qty * 1499 - 350}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ─── SCREEN 2: BOOKING INVOICE (E-RECEIPT UI) ─────────────────
const EReceipt = ({ onHome }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.offWhite }}>
      <StatusBarRow />
      <TopBar
        title="Booking Invoice"
        rightIcon={<Download size={sc(20)} color={C.textDark} />}
      />
      <ProgressDots current={2} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: height * 0.14 }}
      >
        <LinearGradient colors={[C.p2, C.p4]} style={s.invoiceHeader}>
          <View style={s.successCircle}>
            <CheckCircle2 size={sc(36)} color={C.white} />
          </View>
          <Text style={s.invoiceStatus}>Payment Successful</Text>
          <Text style={s.invoiceId}>Transaction ID: #UC-88291044</Text>
          <View style={s.headerBlob} />
        </LinearGradient>

        <View style={s.invoiceQRWrap}>
          <BlurView intensity={80} style={s.qrGlassCard}>
            <QRCode />
            <Text style={s.qrInstructions}>
              Show this QR to the technician upon arrival
            </Text>
          </BlurView>
        </View>

        <SectionLabel label="Service Details" />
        <View style={s.invoiceDetailCard}>
          <View style={s.detailRow}>
            <Calendar size={16} color={C.p2} />
            <Text style={s.detailText}>Saturday, 16 May 2026</Text>
          </View>
          <View style={s.detailRow}>
            <Clock size={16} color={C.p2} />
            <Text style={s.detailText}>Arrival at 14:00 - 15:00</Text>
          </View>
          <View style={s.detailRow}>
            <MapPin size={16} color={C.p2} />
            <Text style={s.detailText}>
              B-402, Skyline Residency, Ahmedabad
            </Text>
          </View>
          <View style={s.detailRow}>
            <Ticket size={16} color={C.p2} />
            <Text style={s.detailText}>Coupon applied: UC500</Text>
          </View>
        </View>

        <SectionLabel label="Payment Summary" />
        <View style={s.invoiceTable}>
          <View style={s.tableHeader}>
            <Text style={s.tableHeadText}>Description</Text>
            <Text style={s.tableHeadText}>Amount</Text>
          </View>
          <View style={s.tableRow}>
            <Text style={s.tableCell}>Split AC Jet Service (Qty 1)</Text>
            <Text style={s.tableCellPrice}>₹1,499.00</Text>
          </View>
          <View style={s.tableRow}>
            <Text style={s.tableCell}>Platform Fee</Text>
            <Text style={s.tableCellPrice}>₹50.00</Text>
          </View>
          <View style={s.tableRow}>
            <Text style={s.tableCell}>GST (18%)</Text>
            <Text style={s.tableCellPrice}>₹100.00</Text>
          </View>
          <View style={s.tableRow}>
            <Text style={[s.tableCell, { color: C.success }]}>
              Coupon Discount
            </Text>
            <Text style={[s.tableCellPrice, { color: C.success }]}>
              -₹500.00
            </Text>
          </View>
          <View style={s.tableTotalRow}>
            <Text style={s.tableTotalKey}>Paid via Credit Card</Text>
            <Text style={s.tableTotalVal}>₹1,149.00</Text>
          </View>
        </View>

        <View style={s.policyCard}>
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <ShieldCheck size={18} color={C.amber} />
            <Text style={s.policyTitle}>Cancellation Policy</Text>
          </View>
          <Text style={s.policyDesc}>
            100% refund for cancellations made 2 hours before start. No refund
            for late cancellations.
          </Text>
        </View>
      </ScrollView>

      <View style={s.ctaZone}>
        <TouchableOpacity onPress={onHome} style={{ flex: 1 }}>
          <LinearGradient colors={[C.p1, C.p3]} style={s.ctaBtn}>
            <Home size={sc(20)} color={C.white} />
            <Text style={s.ctaBtnText}>Go to Home</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ─── ROOT ────────────────────────────────────────────────────
export default function ACRepairApp() {
  const [screen, setScreen] = useState(0);
  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      {screen === 0 && <BookAppointment onNext={() => setScreen(1)} />}
      {screen === 1 && (
        <AppointmentOverview
          onBack={() => setScreen(0)}
          onNext={() => setScreen(2)}
        />
      )}
      {screen === 2 && <EReceipt onHome={() => setScreen(0)} />}
      <AppBottomTab />
    </View>
  );
}

// ─── STYLES (Comprehensive Responsive Styles) ──────────────────
const s = StyleSheet.create({
  statusBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: sc(24),
    paddingTop: Platform.OS === "android" ? sc(12) : sc(4),
    paddingBottom: sc(4),
  },
  statusTime: { fontSize: sc(15), fontWeight: "700", color: C.textDark },
  statusIcons: { flexDirection: "row", alignItems: "center", gap: sc(6) },
  signalBar: { width: sc(3), borderRadius: 1, backgroundColor: C.textDark },
  batteryWrap: {
    width: sc(22),
    height: sc(11),
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: C.textDark,
    padding: 2,
  },
  batteryFill: { height: "100%", backgroundColor: C.textDark, borderRadius: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: sc(20),
    paddingVertical: sc(14),
  },
  iconBtn: {
    width: sc(40),
    height: sc(40),
    borderRadius: sc(12),
    backgroundColor: C.inputBg,
    borderWidth: 1,
    borderColor: C.inputBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtnPlaceholder: { width: sc(40) },
  topBarTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: sc(17),
    fontWeight: "700",
    color: C.textDark,
  },
  progressDots: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: sc(8),
    paddingBottom: sc(8),
  },
  dot: {
    width: sc(8),
    height: sc(8),
    borderRadius: sc(4),
    backgroundColor: C.inputBorder,
  },
  dotActive: { width: sc(24), borderRadius: sc(4), backgroundColor: C.p2 },
  sectionLabelRow: { paddingHorizontal: 24, marginTop: 25, marginBottom: 12 },
  sectionLabelText: {
    fontSize: 13,
    fontWeight: "800",
    color: C.labelGray,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  // Calendar Styles
  calWrap: {
    marginHorizontal: sc(20),
    backgroundColor: C.white,
    borderRadius: sc(20),
    padding: sc(16),
    borderWidth: 1,
    borderColor: C.inputBorder,
    elevation: 4,
  },
  calHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: sc(14),
  },
  calNav: {
    width: sc(32),
    height: sc(32),
    borderRadius: sc(10),
    backgroundColor: C.inputBg,
    borderWidth: 1,
    borderColor: C.inputBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  calMonthText: { fontSize: sc(15), fontWeight: "700", color: C.textDark },
  calDowRow: { flexDirection: "row", marginBottom: sc(6) },
  calDow: {
    flex: 1,
    textAlign: "center",
    fontSize: sc(11),
    fontWeight: "700",
    color: C.textMuted,
  },
  calGrid: { flexDirection: "row", flexWrap: "wrap" },
  calCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: sc(10),
  },
  calCellSelected: { overflow: "hidden" },
  calCellGradient: {
    width: "80%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: sc(10),
  },
  calDayText: { fontSize: sc(13), fontWeight: "500", color: C.textDark },
  calDaySelected: { color: C.white, fontWeight: "800" },
  timeLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: sc(20),
    paddingTop: sc(20),
    paddingBottom: sc(10),
  },
  timeLabelLeft: { flexDirection: "row", alignItems: "center", gap: sc(6) },
  selectedTimePill: {
    backgroundColor: C.inputBg,
    borderWidth: 1,
    borderColor: C.inputBorder,
    borderRadius: sc(20),
    paddingHorizontal: sc(12),
    paddingVertical: sc(4),
  },
  selectedTimePillText: { fontSize: sc(12), fontWeight: "700", color: C.p2 },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: sc(20),
    gap: sc(8),
  },
  timeSlot: {
    width: (width - sc(40) - sc(32)) / 5,
    borderRadius: sc(10),
    backgroundColor: C.inputBg,
    borderWidth: 1,
    borderColor: C.inputBorder,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  timeSlotActive: { borderColor: C.p2, elevation: 5 },
  timeSlotGradient: {
    width: "100%",
    paddingVertical: sc(10),
    alignItems: "center",
    justifyContent: "center",
  },
  timeSlotText: {
    fontSize: sc(12),
    fontWeight: "600",
    color: C.textDark,
    paddingVertical: sc(10),
  },
  timeSlotTextActive: { color: C.white, fontWeight: "700" },

  // Premium Overview UI
  premiumCard: {
    marginHorizontal: 20,
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: C.inputBorder,
    elevation: 2,
  },
  serviceHeader: { flexDirection: "row", alignItems: "center", gap: 15 },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: C.inputBg,
    justifyContent: "center",
    alignItems: "center",
  },
  mainTitle: { fontSize: 16, fontWeight: "800", color: C.textDark },
  subText: { fontSize: 12, color: C.labelGray },
  priceBold: { fontSize: 18, fontWeight: "900", color: C.p2 },
  cardActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
  },
  actionLabel: { fontSize: 13, fontWeight: "600", color: C.textDark },
  qtyPicker: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    backgroundColor: C.inputBg,
    padding: 6,
    borderRadius: 12,
  },
  qtyCircle: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyVal: { fontSize: 15, fontWeight: "800", color: C.p2 },
  addonItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addonTitle: { fontSize: 14, fontWeight: "700", color: C.textDark },
  addonPrice: { fontSize: 12, color: C.p2, fontWeight: "600" },
  addBtnSmall: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.p2,
  },
  addBtnText: { fontSize: 12, fontWeight: "800", color: C.p2 },
  couponGlass: {
    marginHorizontal: 20,
    backgroundColor: C.successBg,
    padding: 18,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: C.success,
  },
  couponTxt: {
    flex: 1,
    marginLeft: 12,
    fontSize: 13,
    fontWeight: "800",
    color: C.success,
  },
  couponSaving: { fontSize: 14, fontWeight: "900", color: C.success },
  billCard: {
    marginHorizontal: 20,
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: C.inputBorder,
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  billKey: { fontSize: 14, color: C.labelGray, fontWeight: "600" },
  billVal: { fontSize: 14, color: C.textDark, fontWeight: "700" },
  billDivider: { height: 1, backgroundColor: "#F5F5F5", marginVertical: 10 },
  totalKey: { fontSize: 16, fontWeight: "800", color: C.textDark },
  totalVal: { fontSize: 20, fontWeight: "900", color: C.p2 },

  // Invoice Screen Styles
  invoiceHeader: {
    marginHorizontal: 20,
    borderRadius: 28,
    padding: 30,
    alignItems: "center",
    overflow: "hidden",
    elevation: 10,
  },
  successCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  invoiceStatus: { fontSize: 20, fontWeight: "800", color: C.white },
  invoiceId: { fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 5 },
  headerBlob: {
    position: "absolute",
    top: -20,
    right: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  invoiceQRWrap: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
    zIndex: 2,
  },
  qrGlassCard: {
    padding: 20,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderWidth: 1,
    borderColor: C.white,
    elevation: 5,
    alignItems: "center",
  },
  qrInstructions: {
    fontSize: 11,
    color: C.labelGray,
    marginTop: 12,
    textAlign: "center",
    maxWidth: 200,
  },
  invoiceDetailCard: {
    marginHorizontal: 20,
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: C.inputBorder,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  detailText: { fontSize: 13, color: C.textDark, fontWeight: "600" },
  invoiceTable: {
    marginHorizontal: 20,
    backgroundColor: "#FFF",
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.inputBorder,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: C.inputBg,
    padding: 15,
  },
  tableHeadText: {
    fontSize: 11,
    fontWeight: "800",
    color: C.labelGray,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  tableCell: { fontSize: 13, color: C.textDark, fontWeight: "600" },
  tableCellPrice: { fontSize: 13, color: C.textDark, fontWeight: "700" },
  tableTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: C.inputBg,
  },
  tableTotalKey: { fontSize: 14, fontWeight: "700", color: C.textDark },
  tableTotalVal: { fontSize: 18, fontWeight: "900", color: C.p2 },
  policyCard: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    backgroundColor: "#FFFBEB",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#FEF3C7",
  },
  policyTitle: { fontSize: 14, fontWeight: "800", color: "#92400E" },
  policyDesc: { fontSize: 12, color: "#B45309", lineHeight: 18, marginTop: 5 },

  // Fixed Bottom CTA
  ctaZone: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 35,
    paddingTop: 15,
    backgroundColor: "#FFF",
  },
  ctaBtn: {
    height: 60,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    elevation: 8,
  },
  ctaBtnText: { color: "#FFF", fontSize: 17, fontWeight: "800" },
});
