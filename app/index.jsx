import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { fetchProfessionalRegistrationSnapshot } from "../services/professionalAuthService";
import { SESSION_KEY } from "../services/session";

export default function Index() {
  const [nextRoute, setNextRoute] = useState(null);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const raw = await AsyncStorage.getItem(SESSION_KEY);
        if (!raw) {
          setNextRoute("/login");
          return;
        }

        const session = JSON.parse(raw);
        if (session?.role === "professional") {
          try {
            const snapshot = await fetchProfessionalRegistrationSnapshot(session?.uid);
            const onboardingComplete = Boolean(snapshot?.profile?.onboarding_complete);

            await AsyncStorage.setItem(
              SESSION_KEY,
              JSON.stringify({
                ...session,
                onboardingComplete,
              })
            );

            setNextRoute(onboardingComplete ? "/pro-dashboard" : "/pro-registration");
          } catch {
            setNextRoute(session?.onboardingComplete ? "/pro-dashboard" : "/pro-registration");
          }
          return;
        }

        setNextRoute("/home");
      } catch (error) {
        setNextRoute("/login");
      }
    };

    loadSession();
  }, []);

  if (!nextRoute) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Redirect href={nextRoute} />;
}
