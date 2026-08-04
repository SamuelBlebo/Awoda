import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { colors } from "../lib/colors";
import { goBackOrHome } from "../lib/navigation";
import BackChevronIcon from "../components/ui/icons/BackChevronIcon";

const ERROR_MESSAGES = {
  "auth/email-already-in-use": "An account with that email already exists.",
  "auth/invalid-email": "That email address doesn't look right.",
  "auth/weak-password": "Password should be at least 6 characters.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/user-not-found": "Incorrect email or password.",
};

const inputStyle = {
  width: "100%",
  borderWidth: 1.5,
  borderColor: colors.border,
  borderRadius: 12,
  paddingVertical: 11,
  paddingHorizontal: 12,
  fontSize: 14.5,
  color: colors.ink,
  backgroundColor: "#fff",
};

export default function SignInScreen({ navigation }) {
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const isSignUp = mode === "signup";

  const handleSubmit = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError("Enter an email and password.");
      return;
    }
    setSubmitting(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email.trim(), password);
      } else {
        await signInWithEmail(email.trim(), password);
      }
    } catch (e) {
      setError(ERROR_MESSAGES[e.code] || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, paddingTop: 6, paddingBottom: 14 }}>
        <TouchableOpacity
          onPress={() => goBackOrHome(navigation)}
          style={{
            width: 36, height: 36, borderRadius: 18, backgroundColor: "#fff",
            alignItems: "center", justifyContent: "center",
            shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 2, shadowOffset: { width: 0, height: 1 },
          }}
        >
          <BackChevronIcon />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, alignItems: "center", justifyContent: "center", padding: 28 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={{ fontSize: 30, fontWeight: "700", color: colors.ink, letterSpacing: -0.5, marginBottom: 8 }}>
            Awoda
          </Text>
          <Text style={{ fontSize: 15, color: colors.muted, textAlign: "center", maxWidth: 260, marginBottom: 24 }}>
            {isSignUp ? "Create an account to keep your birthdays backed up." : "Sign in to your birthdays."}
          </Text>

          <View style={{ width: "100%", gap: 12, marginBottom: 20 }}>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              style={inputStyle}
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete={isSignUp ? "new-password" : "password"}
              style={inputStyle}
            />
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={submitting}
            style={{
              width: "100%",
              paddingVertical: 16,
              borderRadius: 999,
              backgroundColor: colors.primary,
              alignItems: "center",
              opacity: submitting ? 0.6 : 1,
            }}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                {isSignUp ? "Create account" : "Sign in"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setError(null);
              setMode(isSignUp ? "signin" : "signup");
            }}
            style={{ padding: 12 }}
          >
            <Text style={{ color: colors.muted, fontSize: 14, fontWeight: "600" }}>
              {isSignUp ? "Already have an account? Sign in" : "New here? Create an account"}
            </Text>
          </TouchableOpacity>

          {error && (
            <Text style={{ color: colors.primaryBorder, fontSize: 13, textAlign: "center", marginTop: 8 }}>
              {error}
            </Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
