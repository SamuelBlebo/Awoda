import React from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from "react-native";
import { usePeople } from "../hooks/usePeople";
import { useDismissedNotifs } from "../hooks/useDismissedNotifs";
import PersonRow from "../components/ui/PersonRow";
import BellIcon from "../components/ui/icons/BellIcon";
import { colors, cardShadow } from "../lib/colors";

function Section({ title, people, onOpenPerson }) {
  if (!people.length) return null;
  return (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          fontSize: 12,
          fontWeight: "700",
          letterSpacing: 0.6,
          textTransform: "uppercase",
          color: colors.muted,
          marginBottom: 10,
        }}
      >
        {title}
      </Text>
      <View style={{ gap: 10 }}>
        {people.map((p) => (
          <PersonRow key={p.id} person={p} onPress={() => onOpenPerson(p.id)} />
        ))}
      </View>
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const { heroPerson, weekList, monthList, laterList, todayList, loading } = usePeople();
  const { isDismissed } = useDismissedNotifs();

  const unreadCount = [...todayList, ...weekList].filter((p) => !isDismissed(p.id)).length;

  const openPerson = (personId) => navigation.navigate("PersonDetail", { personId });

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingTop: 6,
          paddingBottom: 14,
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: "700", color: colors.ink, letterSpacing: -0.4 }}>
          Awoda
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Notifications")}
          style={[
            {
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: "#fff",
              alignItems: "center",
              justifyContent: "center",
            },
            cardShadow,
          ]}
        >
          <BellIcon size={18} />
          {unreadCount > 0 && (
            <View
              style={{
                position: "absolute",
                top: 6,
                right: 7,
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: colors.primary,
                borderWidth: 1.5,
                borderColor: "#fff",
              }}
            />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}>
        {heroPerson && (
          <View
            style={{
              position: "relative",
              overflow: "hidden",
              backgroundColor: colors.tint,
              borderRadius: 22,
              marginBottom: 20,
              padding: 18,
              paddingHorizontal: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "700",
                  letterSpacing: 0.6,
                  textTransform: "uppercase",
                  color: colors.primaryBorder,
                  marginBottom: 4,
                }}
              >
                Today
              </Text>
              <Text style={{ fontSize: 19, fontWeight: "700", color: colors.ink, marginBottom: 2 }}>
                {heroPerson.name}'s birthday!
              </Text>
              <Text style={{ fontSize: 13, color: colors.primaryDarkest }}>
                Turning {heroPerson.age} today
              </Text>
            </View>
            <Text style={{ fontSize: 44, fontWeight: "800", color: colors.primary, lineHeight: 44 }}>
              {heroPerson.age}
            </Text>
          </View>
        )}

        <Section title="This week" people={weekList} onOpenPerson={openPerson} />
        <Section title="This month" people={monthList} onOpenPerson={openPerson} />
        <Section title="Later" people={laterList} onOpenPerson={openPerson} />
      </ScrollView>
    </SafeAreaView>
  );
}
