
// import "./global.css"
// import React from "react";
// import AppNavigator from "./src/navigation/AppNavigator";

// export default function App() {
//   return (
//       <AppNavigator />
//   );
// }
import "./global.css"

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/contexts/AuthContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
          <Toast />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}