// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Ionicons } from '@expo/vector-icons';

// import SplashScreen from '../screens/SplashScreen';
// import HomeScreen from '../screens/HomeScreen';
// import FindTutorsScreen from '../screens/FindTutorsScreen';
// import SubjectsScreen from '../screens/SubjectsScreen';
// import AboutScreen from '../screens/AboutScreen';
// import ContactScreen from '../screens/ContactScreen';
// import LoginScreen from '../screens/LoginScreen';
// import SignUpScreen from '../screens/SignUpScreen';

// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

// function BottomTabs() {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         headerShown: false,
//         tabBarShowLabel: true,
//         tabBarActiveTintColor: '#F97316',
//         tabBarInactiveTintColor: '#777',
//         tabBarStyle: { backgroundColor: 'white', borderTopWidth: 0.5 },
//         tabBarIcon: ({ color }) => {
//           let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

//           if (route.name === 'Home') iconName = 'home-outline';
//           else if (route.name === 'Find Tutors') iconName = 'people-outline';
//           else if (route.name === 'Subjects') iconName = 'book-outline';
//           else if (route.name === 'About') iconName = 'information-circle-outline';
//           else if (route.name === 'Contact') iconName = 'call-outline';

//           return <Ionicons name={iconName} size={22} color={color} />;
//         },
//       })}
//     >
//       <Tab.Screen name="Home" component={HomeScreen} />
//       <Tab.Screen name="Find Tutors" component={FindTutorsScreen} />
//       <Tab.Screen name="Subjects" component={SubjectsScreen} />
//       <Tab.Screen name="About" component={AboutScreen} />
//       <Tab.Screen name="Contact" component={ContactScreen} />
//     </Tab.Navigator>
//   );
// }

// export default function AppNavigator() {
//   return (
//     <Stack.Navigator initialRouteName="Splash">
//       <Stack.Screen
//         name="Splash"
//         component={SplashScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="Login"
//         component={LoginScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="SignUp"
//         component={SignUpScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="Main"
//         component={BottomTabs}
//         options={{ headerShown: false }}
//       />
//     </Stack.Navigator>
//   );
// }
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import FindTutorsScreen from '../screens/FindTutorsScreen';
import SubjectsScreen from '../screens/SubjectsScreen';
import AboutScreen from '../screens/AboutScreen';
import ContactScreen from '../screens/ContactScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import TutorProfileScreen from '../screens/TutorProfileScreen';
import BookingScreen from '../screens/BookingScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#F97316',
        tabBarInactiveTintColor: '#777',
        tabBarStyle: { backgroundColor: 'white', borderTopWidth: 0.5 },
        tabBarIcon: ({ color }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Find Tutors') iconName = 'people-outline';
          else if (route.name === 'Subjects') iconName = 'book-outline';
          else if (route.name === 'About') iconName = 'information-circle-outline';
          else if (route.name === 'Contact') iconName = 'call-outline';

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Find Tutors" component={FindTutorsScreen} />
      <Tab.Screen name="Subjects" component={SubjectsScreen} />
      <Tab.Screen name="About" component={AboutScreen} />
      <Tab.Screen name="Contact" component={ContactScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={BottomTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TutorProfile"
        component={TutorProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Booking"
        component={BookingScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}