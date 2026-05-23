import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
  Switch,
  Alert,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

const { width, height } = Dimensions.get('window');
const Tab = createBottomTabNavigator();

// ---------- Theme Context ----------
const ThemeContext = createContext();
const useTheme = () => useContext(ThemeContext);

const lightTheme = {
  background: '#F9F9FC',
  card: '#FFFFFF',
  text: '#1E272E',
  subtext: '#636E72',
  border: '#E0E0E0',
  primary: '#6C5CE7',
  secondary: '#FF8C42',
  accent: '#FF5E7E',
  success: '#27AE60',
  progressBg: '#E0E0E0',
};

const darkTheme = {
  background: '#121212',
  card: '#1E1E2E',
  text: '#EAEAEA',
  subtext: '#A0A0A0',
  border: '#2D2D3A',
  primary: '#8E7BFF',
  secondary: '#FFA05E',
  accent: '#FF7A92',
  success: '#2ED573',
  progressBg: '#2D2D3A',
};

// ---------- Helper Components ----------
const ProgressBar = ({ percentage, color, height = 8 }) => {
  const { theme } = useTheme();
  const [widthAnim] = useState(new Animated.Value(0));
  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: percentage,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [percentage]);
  return (
    <View style={[styles.progressBarBg, { backgroundColor: theme.progressBg, height }]}>
      <Animated.View
        style={[
          styles.progressBarFill,
          {
            width: widthAnim.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
            backgroundColor: color,
            height,
          },
        ]}
      />
    </View>
  );
};

// ---------- Home Screen (Enhanced) ----------
const HomeScreen = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  // Health data state
  const [steps, setSteps] = useState(5500);
  const [stepGoal] = useState(10000);
  const [waterGlasses, setWaterGlasses] = useState(8);
  const [waterGoal] = useState(12);
  const [caloriesConsumed, setCaloriesConsumed] = useState(1250);
  const [calorieTarget] = useState(1920);
  const [breakfastCal, setBreakfastCal] = useState(484);
  const [lunchCal, setLunchCal] = useState(490);
  const [dinnerCal, setDinnerCal] = useState(276);
  const [exerciseHours] = useState(2.0);
  const [bpm] = useState(86);
  const [weight, setWeight] = useState(72.5);
  const [sleepHours, setSleepHours] = useState(7.5);
  const [stressLevel, setStressLevel] = useState(34);
  const [streakDays] = useState(6);
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [newMealCal, setNewMealCal] = useState('');

  const weeklyPercentages = [110, 47, 34, 32, 79, 24, 68];
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const stepProgress = (steps / stepGoal) * 100;
  const waterProgress = (waterGlasses / waterGoal) * 100;
  const calorieProgress = (caloriesConsumed / calorieTarget) * 100;

  const addWater = () => {
    if (waterGlasses < waterGoal) setWaterGlasses(waterGlasses + 1);
    else Alert.alert('Great job!', 'You reached your water goal for today 💧');
  };
  const addSteps = (amount) => {
    setSteps(prev => Math.min(prev + amount, stepGoal));
  };
  const addMeal = () => {
    const cal = parseInt(newMealCal);
    if (!isNaN(cal) && cal > 0) {
      setCaloriesConsumed(prev => prev + cal);
      setNewMealCal('');
      setShowAddMealModal(false);
      Alert.alert('Meal logged', `+${cal} kcal added`);
    } else {
      Alert.alert('Invalid', 'Please enter a valid calorie number');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Theme Toggle */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.subtext }]}>Good morning! 🌞</Text>
            <Text style={[styles.userName, { color: theme.text }]}>Sajibur Rahman</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
              <Ionicons name={isDark ? 'sunny' : 'moon'} size={24} color={theme.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileIcon}>
              <Ionicons name="person-circle-outline" size={48} color={theme.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Step & Water Cards */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: theme.card }]}>
            <MaterialCommunityIcons name="shoe-print" size={32} color={theme.secondary} />
            <Text style={[styles.statValue, { color: theme.text }]}>{steps.toLocaleString()}</Text>
            <Text style={[styles.statLabel, { color: theme.subtext }]}>Steps</Text>
            <ProgressBar percentage={stepProgress} color={theme.secondary} />
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <TouchableOpacity style={styles.smallButton} onPress={() => addSteps(500)}>
                <Text style={styles.smallButtonText}>+500</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.smallButton} onPress={() => addSteps(1000)}>
                <Text style={styles.smallButtonText}>+1000</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.statGoal, { color: theme.subtext }]}>Goal: {stepGoal.toLocaleString()}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.card }]}>
            <MaterialCommunityIcons name="cup-water" size={32} color="#4A90E2" />
            <Text style={[styles.statValue, { color: theme.text }]}>{waterGlasses} / {waterGoal}</Text>
            <Text style={[styles.statLabel, { color: theme.subtext }]}>Glasses</Text>
            <ProgressBar percentage={waterProgress} color="#4A90E2" />
            <TouchableOpacity style={styles.addButton} onPress={addWater}>
              <Text style={styles.addButtonText}>💧 +1 glass</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Weekly Progress Chart */}
        <View style={[styles.section, { backgroundColor: theme.card, borderRadius: 32, marginHorizontal: 16, padding: 16 }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Weekly Progress</Text>
            <Text style={[styles.sectionMonth, { color: theme.primary }]}>August 2025</Text>
          </View>
          <View style={styles.weeklyContainer}>
            {weekDays.map((day, idx) => (
              <View key={day} style={styles.weeklyDay}>
                <Text style={[styles.weekDayName, { color: theme.subtext }]}>{day}</Text>
                <View style={styles.weeklyBarWrapper}>
                  <View
                    style={[
                      styles.weeklyBar,
                      { height: Math.min(weeklyPercentages[idx], 100) * 0.8, backgroundColor: theme.primary },
                    ]}
                  />
                </View>
                <Text style={[styles.weeklyPercent, { color: theme.text }]}>{weeklyPercentages[idx]}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Meals Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Today's Meals</Text>
          <View style={styles.mealsRow}>
            <View style={[styles.mealCard, { backgroundColor: theme.card }]}>
              <MaterialCommunityIcons name="food-apple" size={28} color={theme.primary} />
              <Text style={[styles.mealName, { color: theme.text }]}>Breakfast</Text>
              <Text style={[styles.mealCal, { color: theme.primary }]}>{breakfastCal} kcal</Text>
            </View>
            <View style={[styles.mealCard, { backgroundColor: theme.card }]}>
              <MaterialCommunityIcons name="food-turkey" size={28} color={theme.primary} />
              <Text style={[styles.mealName, { color: theme.text }]}>Lunch</Text>
              <Text style={[styles.mealCal, { color: theme.primary }]}>{lunchCal} kcal</Text>
            </View>
            <View style={[styles.mealCard, { backgroundColor: theme.card }]}>
              <MaterialCommunityIcons name="food-variant" size={28} color={theme.primary} />
              <Text style={[styles.mealName, { color: theme.text }]}>Dinner</Text>
              <Text style={[styles.mealCal, { color: theme.primary }]}>{dinnerCal} kcal</Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.addMealBtn, { backgroundColor: theme.primary }]} onPress={() => setShowAddMealModal(true)}>
            <Text style={styles.addMealBtnText}>+ Log custom meal</Text>
          </TouchableOpacity>
        </View>

        {/* Calorie & Streak Card */}
        <View style={[styles.calorieCard, { backgroundColor: theme.card }]}>
          <View style={styles.calorieLeft}>
            <Text style={[styles.streakText, { color: theme.secondary }]}>{streakDays} day streak 🔥</Text>
            <Text style={[styles.calorieValue, { color: theme.text }]}>{caloriesConsumed} / {calorieTarget} kcal</Text>
          </View>
          <View style={styles.calorieRight}>
            <ProgressBar percentage={calorieProgress} color={theme.accent} height={10} />
            <Text style={[styles.calorieRemaining, { color: theme.accent }]}>
              {Math.max(0, calorieTarget - caloriesConsumed)} kcal left
            </Text>
          </View>
        </View>

        {/* Health Metrics Row */}
        <View style={styles.rowCards}>
          <View style={[styles.statCard, { backgroundColor: theme.card, width: width * 0.28 }]}>
            <MaterialCommunityIcons name="run-fast" size={28} color="#2D9CDB" />
            <Text style={[styles.statValue, { color: theme.text, fontSize: 18 }]}>{exerciseHours}h</Text>
            <Text style={[styles.statLabel, { color: theme.subtext }]}>Exercise</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.card, width: width * 0.28 }]}>
            <MaterialCommunityIcons name="heart-pulse" size={28} color="#EB5757" />
            <Text style={[styles.statValue, { color: theme.text, fontSize: 18 }]}>{bpm} bpm</Text>
            <Text style={[styles.statLabel, { color: theme.subtext }]}>Heart</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.card, width: width * 0.28 }]}>
            <MaterialCommunityIcons name="bed" size={28} color="#6FCF97" />
            <Text style={[styles.statValue, { color: theme.text, fontSize: 18 }]}>{sleepHours}h</Text>
            <Text style={[styles.statLabel, { color: theme.subtext }]}>Sleep</Text>
          </View>
        </View>

        {/* BMI & Stress */}
        <View style={styles.rowCards}>
          <View style={[styles.statCard, { backgroundColor: theme.card, width: width * 0.44 }]}>
            <SimpleLineIcons name="hourglass" size={26} color={theme.primary} />
            <Text style={[styles.statValue, { color: theme.text }]}>{weight} kg</Text>
            <Text style={[styles.statLabel, { color: theme.subtext }]}>Weight</Text>
            <Text style={[styles.statGoal, { color: theme.subtext }]}>BMI: {(weight / (1.75 * 1.75)).toFixed(1)}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.card, width: width * 0.44 }]}>
            <MaterialCommunityIcons name="brain" size={26} color="#FF8C42" />
            <Text style={[styles.statValue, { color: theme.text }]}>{stressLevel}%</Text>
            <Text style={[styles.statLabel, { color: theme.subtext }]}>Stress level</Text>
            <ProgressBar percentage={stressLevel} color="#FF8C42" height={6} />
          </View>
        </View>

        <View style={{ height: 80 }} />

        {/* Modal for adding meal */}
        <Modal visible={showAddMealModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Log Calories</Text>
              <TextInput
                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                placeholder="Calories (kcal)"
                placeholderTextColor={theme.subtext}
                keyboardType="numeric"
                value={newMealCal}
                onChangeText={setNewMealCal}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                <TouchableOpacity style={[styles.modalBtn, { backgroundColor: theme.subtext }]} onPress={() => setShowAddMealModal(false)}>
                  <Text style={styles.modalBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, { backgroundColor: theme.primary }]} onPress={addMeal}>
                  <Text style={styles.modalBtnText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

// ---------- Progress Screen (Enhanced) ----------
const ProgressScreen = () => {
  const { theme } = useTheme();
  const weeklySteps = [8200, 4700, 3400, 5200, 7900, 2400, 6800];
  const weeklyWater = [6, 5, 7, 8, 10, 9, 11];
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxStep = Math.max(...weeklySteps);
  const maxWater = Math.max(...weeklyWater);
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.progressContainer}>
        <Text style={[styles.progressTitle, { color: theme.text }]}>📊 Detailed Analytics</Text>
        <View style={[styles.chartCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.chartTitle, { color: theme.text }]}>Daily Steps</Text>
          {weeklySteps.map((step, idx) => (
            <View key={idx} style={styles.chartRow}>
              <Text style={[styles.chartDay, { color: theme.subtext }]}>{weekDays[idx]}</Text>
              <View style={[styles.chartBarBg, { backgroundColor: theme.progressBg }]}>
                <View style={[styles.chartBarFill, { width: `${(step / maxStep) * 100}%`, backgroundColor: theme.primary }]} />
              </View>
              <Text style={[styles.chartValue, { color: theme.text }]}>{step}</Text>
            </View>
          ))}
        </View>
        <View style={[styles.chartCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.chartTitle, { color: theme.text }]}>Water Intake (glasses)</Text>
          {weeklyWater.map((water, idx) => (
            <View key={idx} style={styles.chartRow}>
              <Text style={[styles.chartDay, { color: theme.subtext }]}>{weekDays[idx]}</Text>
              <View style={[styles.chartBarBg, { backgroundColor: theme.progressBg }]}>
                <View style={[styles.chartBarFill, { width: `${(water / maxWater) * 100}%`, backgroundColor: '#4A90E2' }]} />
              </View>
              <Text style={[styles.chartValue, { color: theme.text }]}>{water}</Text>
            </View>
          ))}
        </View>
        <View style={[styles.chartCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.chartTitle, { color: theme.text }]}>Macro Distribution</Text>
          <View style={styles.macroRow}>
            <Text style={{ color: theme.text }}>🥩 Protein: 35%</Text>
            <Text style={{ color: theme.text }}>🍚 Carbs: 45%</Text>
            <Text style={{ color: theme.text }}>🥑 Fat: 20%</Text>
          </View>
          <ProgressBar percentage={35} color="#EB5757" />
          <ProgressBar percentage={45} color="#F2994A" />
          <ProgressBar percentage={20} color="#27AE60" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ---------- Rewards Screen (Expanded) ----------
const RewardsScreen = () => {
  const { theme } = useTheme();
  const badges = [
    { name: '10K Steps', icon: 'walk', achieved: true, desc: 'Walk 10,000 steps in a day' },
    { name: 'Hydration Hero', icon: 'cup-water', achieved: true, desc: 'Drink 12 glasses of water' },
    { name: '5 Day Streak', icon: 'calendar-check', achieved: true, desc: 'Log meals for 5 days' },
    { name: 'Calorie Master', icon: 'food-apple', achieved: false, desc: 'Stay under calorie goal for a week' },
    { name: 'Early Bird', icon: 'weather-sunset-up', achieved: false, desc: 'Log breakfast before 8 AM' },
    { name: 'Heart Healthy', icon: 'heart-pulse', achieved: false, desc: 'Maintain BPM under 90 for 7 days' },
  ];
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.rewardsContainer}>
        <Text style={[styles.progressTitle, { color: theme.text }]}>🏆 Achievements</Text>
        {badges.map((badge, idx) => (
          <View key={idx} style={[styles.badgeCard, { backgroundColor: theme.card }]}>
            <MaterialCommunityIcons name={badge.icon} size={44} color={badge.achieved ? theme.primary : theme.subtext} />
            <View style={styles.badgeInfo}>
              <Text style={[styles.badgeName, { color: theme.text }, badge.achieved && { color: theme.success }]}>{badge.name}</Text>
              <Text style={[styles.badgeDesc, { color: theme.subtext }]}>{badge.desc}</Text>
              <Text style={[styles.badgeStatus, { color: badge.achieved ? theme.success : theme.accent }]}>
                {badge.achieved ? '✅ Unlocked' : '🔒 Locked'}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

// ---------- Menu Screen (Interactive) ----------
const MenuScreen = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [metricUnits, setMetricUnits] = useState(true);
  const menuItems = [
    { title: 'Profile Settings', icon: 'person-outline' },
    { title: 'Health Connect', icon: 'fitness-outline' },
    { title: 'Data Export', icon: 'document-text-outline' },
    { title: 'Appearance', icon: 'color-palette-outline' },
    { title: 'Support & Feedback', icon: 'chatbubble-outline' },
    { title: 'Privacy Policy', icon: 'lock-closed-outline' },
  ];
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.menuContainer}>
        <Text style={[styles.progressTitle, { color: theme.text }]}>⚙️ Settings</Text>
        <View style={[styles.settingItem, { backgroundColor: theme.card }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="moon" size={24} color={theme.primary} />
            <Text style={[styles.settingText, { color: theme.text }]}>Dark Mode</Text>
          </View>
          <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ false: '#767577', true: theme.primary }} />
        </View>
        <View style={[styles.settingItem, { backgroundColor: theme.card }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="notifications-outline" size={24} color={theme.primary} />
            <Text style={[styles.settingText, { color: theme.text }]}>Push Notifications</Text>
          </View>
          <Switch value={notifications} onValueChange={setNotifications} trackColor={{ false: '#767577', true: theme.primary }} />
        </View>
        <View style={[styles.settingItem, { backgroundColor: theme.card }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="scale-outline" size={24} color={theme.primary} />
            <Text style={[styles.settingText, { color: theme.text }]}>Metric Units (kg/km)</Text>
          </View>
          <Switch value={metricUnits} onValueChange={setMetricUnits} trackColor={{ false: '#767577', true: theme.primary }} />
        </View>
        {menuItems.map((item, idx) => (
          <TouchableOpacity key={idx} style={[styles.menuItem, { backgroundColor: theme.card }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name={item.icon} size={22} color={theme.primary} />
              <Text style={[styles.menuText, { color: theme.text, marginLeft: 15 }]}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.subtext} />
          </TouchableOpacity>
        ))}
        <View style={styles.versionRow}>
          <Text style={[styles.versionText, { color: theme.subtext }]}>Wellness Tracker v3.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ---------- Main App with Theme Provider ----------
export default function App() {
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? darkTheme : lightTheme;
  const toggleTheme = () => setIsDark(prev => !prev);
  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
              else if (route.name === 'Progress') iconName = focused ? 'stats-chart' : 'stats-chart-outline';
              else if (route.name === 'Rewards') iconName = focused ? 'trophy' : 'trophy-outline';
              else iconName = focused ? 'menu' : 'menu-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: theme.primary,
            tabBarInactiveTintColor: theme.subtext,
            tabBarStyle: [styles.tabBarStyle, { backgroundColor: theme.card, borderTopColor: theme.border }],
            tabBarLabelStyle: styles.tabBarLabel,
            headerShown: false,
          })}>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Progress" component={ProgressScreen} />
          <Tab.Screen name="Rewards" component={RewardsScreen} />
          <Tab.Screen name="Menu" component={MenuScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </ThemeContext.Provider>
  );
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  greeting: { fontSize: 16, fontWeight: '500' },
  userName: { fontSize: 24, fontWeight: 'bold', marginTop: 4 },
  themeToggle: { padding: 8, marginRight: 8 },
  profileIcon: { padding: 4 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 16 },
  statCard: { borderRadius: 28, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 4 },
  statValue: { fontSize: 20, fontWeight: '800', marginTop: 8 },
  statLabel: { fontSize: 14, marginTop: 4 },
  statGoal: { fontSize: 12, marginTop: 6 },
  smallButton: { backgroundColor: '#E8F0FE', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginHorizontal: 4, marginTop: 8 },
  smallButtonText: { fontSize: 12, fontWeight: '600', color: '#4A90E2' },
  addButton: { marginTop: 10, backgroundColor: '#E8F0FE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  addButtonText: { fontSize: 12, fontWeight: '600', color: '#4A90E2' },
  section: { marginHorizontal: 16, marginVertical: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 },
  sectionTitle: { fontSize: 20, fontWeight: '700' },
  sectionMonth: { fontSize: 14, fontWeight: '500' },
  weeklyContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 },
  weeklyDay: { alignItems: 'center', width: 40 },
  weekDayName: { fontSize: 14, fontWeight: '600', marginBottom: 12 },
  weeklyBarWrapper: { height: 100, justifyContent: 'flex-end', alignItems: 'center' },
  weeklyBar: { width: 8, borderRadius: 8, marginBottom: 8 },
  weeklyPercent: { fontSize: 12, fontWeight: 'bold', marginTop: 6 },
  mealsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  mealCard: { borderRadius: 24, padding: 16, width: width * 0.29, alignItems: 'center' },
  mealName: { fontSize: 14, fontWeight: '600', marginTop: 6 },
  mealCal: { fontSize: 16, fontWeight: '800', marginTop: 4 },
  addMealBtn: { marginTop: 12, paddingVertical: 10, borderRadius: 40, alignItems: 'center' },
  addMealBtnText: { color: 'white', fontWeight: '700' },
  calorieCard: { borderRadius: 28, marginHorizontal: 16, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 },
  calorieLeft: { flex: 1 },
  streakText: { fontSize: 14, fontWeight: '700' },
  calorieValue: { fontSize: 24, fontWeight: '800', marginTop: 4 },
  calorieRight: { flex: 1, alignItems: 'flex-end' },
  calorieRemaining: { fontSize: 12, marginTop: 8, fontWeight: '500' },
  rowCards: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 12 },
  progressContainer: { padding: 20 },
  progressTitle: { fontSize: 28, fontWeight: '800', marginVertical: 16 },
  chartCard: { borderRadius: 28, padding: 20, marginBottom: 20 },
  chartTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  chartRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  chartDay: { width: 45, fontSize: 14, fontWeight: '600' },
  chartBarBg: { flex: 1, height: 8, borderRadius: 8, marginHorizontal: 10, overflow: 'hidden' },
  chartBarFill: { height: '100%', borderRadius: 8 },
  chartValue: { width: 45, textAlign: 'right', fontSize: 14, fontWeight: '500' },
  macroRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 12 },
  rewardsContainer: { padding: 20, alignItems: 'center' },
  badgeCard: { flexDirection: 'row', width: '100%', borderRadius: 24, padding: 16, marginBottom: 16, alignItems: 'center' },
  badgeInfo: { marginLeft: 16, flex: 1 },
  badgeName: { fontSize: 18, fontWeight: '700' },
  badgeDesc: { fontSize: 12, marginTop: 2 },
  badgeStatus: { fontSize: 14, fontWeight: '500', marginTop: 4 },
  menuContainer: { padding: 20 },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, borderRadius: 20, marginBottom: 12 },
  settingText: { fontSize: 16, fontWeight: '500', marginLeft: 15 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, borderRadius: 20, marginBottom: 12 },
  menuText: { fontSize: 16, fontWeight: '500' },
  versionRow: { alignItems: 'center', marginTop: 30 },
  versionText: { fontSize: 12 },
  tabBarStyle: { height: 70, paddingBottom: 10, paddingTop: 10, borderTopLeftRadius: 25, borderTopRightRadius: 25, position: 'absolute', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 10 },
  tabBarLabel: { fontSize: 12, fontWeight: '600' },
  progressBarBg: { borderRadius: 10, overflow: 'hidden', width: '100%', marginTop: 8 },
  progressBarFill: { borderRadius: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', borderRadius: 28, padding: 24, alignItems: 'center' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  input: { width: '100%', borderWidth: 1, borderRadius: 16, padding: 12, fontSize: 16, marginBottom: 16 },
  modalBtn: { paddingVertical: 10, paddingHorizontal: 24, borderRadius: 40, marginHorizontal: 8 },
  modalBtnText: { color: 'white', fontWeight: 'bold' },
});
