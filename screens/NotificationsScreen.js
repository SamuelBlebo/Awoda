import React, { useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { usePeople } from "../hooks/usePeople";
import { useDismissedNotifs } from "../hooks/useDismissedNotifs";
import { colors, cardShadow } from "../lib/colors";

export default function NotificationsScreen({ navigation }) {
  const { todayList, weekList } = usePeople();
  const { isDismissed, dismiss } = useDismissedNotifs();

  const notifList = useMemo(
    () => [...todayList, ...weekList].filter((p) => !isDismissed(p.id)),
    [todayList, weekList, isDismissed]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 6, paddingBottom: 14 }}>
        <Text style={{ fontSize: 22, fontWeight: "700", color: colors.ink, letterSpacing: -0.4 }}>
          Notifications
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32, gap: 10 }}>
        {notifList.length === 0 ? (
          <Text style={{ color: colors.muted, fontSize: 14, marginTop: 60, textAlign: "center" }}>
            You're all caught up.
          </Text>
        ) : (
          notifList.map((p) => (
            <View
              key={p.id}
              style={[
                { backgroundColor: "#fff", borderRadius: 18, padding: 16, marginBottom: 10 },
                cardShadow,
              ]}
            >
              <Text style={{ fontSize: 14, color: colors.ink, marginBottom: 10 }}>
                {p.daysUntil === 0
                  ? `It's ${p.name}'s birthday today!`
                  : `${p.name}'s birthday is in ${p.daysUntil} day${p.daysUntil === 1 ? "" : "s"}`}
              </Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("PersonDetail", { personId: p.id })}
                  style={{
                    borderWidth: 1.5,
                    borderColor: colors.primaryBorder,
                    paddingVertical: 6,
                    paddingHorizontal: 14,
                    borderRadius: 999,
                  }}
                >
                  <Text style={{ color: colors.primaryDarkest, fontWeight: "600", fontSize: 12.5 }}>
                    View
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => dismiss(p.id)}
                  style={{ paddingVertical: 6, paddingHorizontal: 8 }}
                >
                  <Text style={{ color: colors.muted, fontWeight: "600", fontSize: 12.5 }}>Dismiss</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
