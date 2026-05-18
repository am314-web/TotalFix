import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Dimensions,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import AppBottomTab from '../components/AppBottomTab';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', title: 'Plumber', serviceKey: 'plumber', iconSource: require('../assets/images/icons/plumber.png') },
  { id: '2', title: 'Carpenter', serviceKey: 'carpenter', iconSource: require('../assets/images/icons/carpenter.png') },
  { id: '3', title: 'Welder', serviceKey: 'welder', iconSource: require('../assets/images/icons/welder.png') },
  { id: '4', title: 'Contractor', serviceKey: 'contractor', iconSource: require('../assets/images/icons/construction.png') },
  { id: '5', title: 'Electrician', serviceKey: 'electrician', iconSource: require('../assets/images/icons/electrician.png') },
  { id: '6', title: 'Painter', serviceKey: 'painter', iconSource: require('../assets/images/icons/painter.png') },
  { id: '7', title: 'Laundry', serviceKey: 'laundry', iconSource: require('../assets/images/icons/laundary.png') },
  { id: '8', title: 'Mechanic', serviceKey: 'mechanic', iconSource: require('../assets/images/icons/mechanic.png') },
  { id: '9', title: 'Cleaner', serviceKey: 'cleaner', iconSource: require('../assets/images/icons/laundary.png') },
  { id: '10', title: 'Gardener', serviceKey: 'gardener', iconSource: require('../assets/images/icons/construction.png') },
  { id: '11', title: 'Security', serviceKey: 'security', iconSource: require('../assets/images/icons/construction.png') },
  { id: '12', title: 'Tailor', serviceKey: 'tailor', iconSource: require('../assets/images/icons/painter.png') },
];

const CategoryItem = ({ title, iconSource, serviceKey }) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={() => router.push({ pathname: "/service-detail", params: { service: serviceKey } })}
    style={styles.cardContainer}
  >
    <BlurView intensity={30} tint="light" style={styles.glassCard}>
      <View style={styles.iconCircle}>
        <Image source={iconSource} style={styles.categoryIcon} resizeMode="contain" />
      </View>
      <Text style={styles.cardText}>{title}</Text>
    </BlurView>
  </TouchableOpacity>
);

export default function CategoriesScreen() {
  return (
    <View style={styles.container}>
      {/* Background Gradient for Depth */}
      <LinearGradient
        colors={['#E0EAFC', '#CFDEF3']} 
        style={StyleSheet.absoluteFill}
      />
      
      {/* Ambient background decoration */}
      <View style={styles.ambientCircle} />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Modern Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerIconButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="chevron-left" size={24} color="#2D3436" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Categories</Text>
          <View style={styles.headerIconPlaceholder} />
        </View>

        {/* Grid List */}
        <FlatList
          data={CATEGORIES}
          renderItem={({ item }) => <CategoryItem title={item.title} serviceKey={item.serviceKey} iconSource={item.iconSource} />}
          keyExtractor={item => item.id}
          numColumns={3}
          contentContainerStyle={styles.listPadding}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.columnWrapper}
        />

        <AppBottomTab />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ambientCircle: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(9, 132, 227, 0.1)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2D3436',
    letterSpacing: -0.5,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  headerIconPlaceholder: {
    width: 40,
    height: 40,
  },
  listPadding: {
    paddingHorizontal: 15,
    paddingBottom: 120,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: (width - 60) / 3,
    marginBottom: 15,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  glassCard: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  categoryIcon: {
    width: 50,
    height: 50,
  },
  cardText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2D3436',
  },
});
