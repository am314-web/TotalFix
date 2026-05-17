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

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', title: 'Plumber', iconSource: require('../assets/images/icons/plumber.png') },
  { id: '2', title: 'Carpenter', iconSource: require('../assets/images/icons/carpenter.png') },
  { id: '3', title: 'Welder', iconSource: require('../assets/images/icons/welder.png') },
  { id: '4', title: 'Contactor', iconSource: require('../assets/images/icons/construction.png') },
  { id: '5', title: 'Electrician', iconSource: require('../assets/images/icons/electrician.png') },
  { id: '6', title: 'Painter', iconSource: require('../assets/images/icons/painter.png') },
  { id: '7', title: 'Laundry', iconSource: require('../assets/images/icons/laundary.png') },
  { id: '8', title: 'Mechanic', iconSource: require('../assets/images/icons/mechanic.png') },
  { id: '9', title: 'Cleaner', iconSource: require('../assets/images/icons/laundary.png') },
  { id: '10', title: 'Gardener', iconSource: require('../assets/images/icons/construction.png') },
  { id: '11', title: 'Security', iconSource: require('../assets/images/icons/construction.png') },
  { id: '12', title: 'Tailor', iconSource: require('../assets/images/icons/painter.png') },
];

const CategoryItem = ({ title, iconSource }) => (
  <View style={styles.cardContainer}>
    <BlurView intensity={30} tint="light" style={styles.glassCard}>
      <View style={styles.iconCircle}>
        <Image source={iconSource} style={styles.categoryIcon} resizeMode="contain" />
      </View>
      <Text style={styles.cardText}>{title}</Text>
    </BlurView>
  </View>
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
          <TouchableOpacity style={styles.headerIconButton}>
            <MaterialCommunityIcons name="chevron-left" size={24} color="#2D3436" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Categories</Text>
          <TouchableOpacity style={styles.headerIconButton}>
            <MaterialCommunityIcons name="dots-vertical" size={24} color="#2D3436" />
          </TouchableOpacity>
        </View>

        {/* Grid List */}
        <FlatList
          data={CATEGORIES}
          renderItem={({ item }) => <CategoryItem title={item.title} iconSource={item.iconSource} />}
          keyExtractor={item => item.id}
          numColumns={3}
          contentContainerStyle={styles.listPadding}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.columnWrapper}
        />

        {/* Floating Glass Bottom Tab */}
        <View style={styles.tabWrapper}>
          <BlurView intensity={80} tint="light" style={styles.bottomTab}>
            <MaterialCommunityIcons name="home-outline" size={24} color="#636E72" />
            <View style={styles.activeTabIcon}>
              <MaterialCommunityIcons name="view-grid" size={24} color="#0984E3" />
            </View>
            <MaterialCommunityIcons name="magnify" size={24} color="#636E72" />
            <MaterialCommunityIcons name="bell-outline" size={24} color="#636E72" />
            <MaterialCommunityIcons name="account-outline" size={24} color="#636E72" />
          </BlurView>
        </View>
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
  tabWrapper: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    elevation: 5,
  },
  bottomTab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  activeTabIcon: {
    backgroundColor: 'rgba(9, 132, 227, 0.1)',
    padding: 10,
    borderRadius: 20,
  }
});
