import React from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "../context/AuthContext";
import { useHasOnboarded } from "../hooks/useHasOnboarded";
import { colors } from "../lib/colors";
import OnboardingScreen from "../screens/OnboardingScreen";
import SignInScreen from "../screens/SignInScreen";
import MainTabsNavigator from "./MainTabsNavigator";
import PersonDetailScreen from "../screens/PersonDetailScreen";
import AddPersonScreen from "../screens/AddPersonScreen";
import EditPersonScreen from "../screens/EditPersonScreen";

const Stack = createStackNavigator();

function Splash() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg }}>
      <ActivityIndicator color={colors.primary} />
    </View>
  );
}

export default function RootNavigator() {
  const { loading: authLoading, migrating } = useAuth();
  const { hasOnboarded, loading: onboardLoading, markOnboarded } = useHasOnboarded();

  if (authLoading || onboardLoading || migrating) return <Splash />;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!hasOnboarded ? (
          <Stack.Screen name="Onboarding">
            {(props) => <OnboardingScreen {...props} onDone={markOnboarded} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabsNavigator} />
            <Stack.Screen name="PersonDetail" component={PersonDetailScreen} />
            <Stack.Screen name="AddPerson" component={AddPersonScreen} />
            <Stack.Screen name="EditPerson" component={EditPersonScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
