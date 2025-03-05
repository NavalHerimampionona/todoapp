// App.tsx
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import { auth } from "../firebase";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileScreen from "./screens/ProfileScreen";
import HomeScreen from "./screens/HomeScreen";
import { onAuthStateChanged, User } from "@firebase/auth";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ResetPassword: undefined;
};

export type RootTabParamList = {
  Home: undefined;
  Profile: undefined;
};

export const RootStack = createNativeStackNavigator<RootStackParamList>();
export const RootTab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  const [user, setUser] = useState<User | null>(null); // Local state for auth user
  const [isLoading, setIsLoading] = useState<Boolean>(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Update state when user signs in/out
      setIsLoading(false); // Update loading state
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [auth])

if(isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
);
}

  return (
    <NavigationContainer>
        {auth.currentUser ? (
          <RootTab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false, // Keep or customize as needed
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap = 'home-outline'; // Default value
  
              // Define icons for each route
              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Profile') {
                iconName = focused ? 'settings' : 'settings-outline';
              }
  
              // Return the Ionicons component
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'blue',
            tabBarInactiveTintColor: 'gray',
          })}
          >
              <RootTab.Screen name="Home" component={HomeScreen} />
              <RootTab.Screen name="Profile" component={ProfileScreen} />
          </RootTab.Navigator>
        ) : (
          <RootStack.Navigator screenOptions={{ headerShown: false }}>
            <RootStack.Screen name="Login" component={LoginScreen} />
            <RootStack.Screen name="SignUp" component={SignUpScreen} />
            <RootStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          </RootStack.Navigator>
        )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,  justifyContent: "center", alignItems: "center" },
  title: { marginBottom: 20 },
});

