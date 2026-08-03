import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Share, Alert,
} from "react-native";
import { usePeople } from "../hooks/usePeople";
import Avatar from "../components/ui/Avatar";
import RelationTag from "../components/ui/RelationTag";
import BackChevronIcon from "../components/ui/icons/BackChevronIcon";
import CheckIcon from "../components/ui/icons/CheckIcon";
import { MONTHS } from "../lib/date";
import { colors } from "../lib/colors";
import { goBackOrHome } from "../lib/navigation";

export default function PersonDetailScreen({ route, navigation }) {
  const { personId } = route.params;
  const { withMeta, toggleGift, addGift, deletePerson } = usePeople();
  const [giftDraft, setGiftDraft] = useState("");

  const person = withMeta.find((p) => p.id === personId);
  if (!person) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} />
    );
  }

  const handleShare = () => {
    Share.share({ message: `Happy birthday, ${person.name}! 🎉` });
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete birthday?",
      `This removes ${person.name} and their gift list. This can't be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deletePerson(personId);
            goBackOrHome(navigation);
          },
        },
      ]
    );
  };

  const handleAddGift = async () => {
    await addGift(personId, giftDraft);
    setGiftDraft("");
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
        <Text style={{ fontSize: 16, fontWeight: "700", color: colors.ink }}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}>
        <View style={{ alignItems: "center", gap: 8, marginBottom: 20 }}>
          <Avatar initial={person.initial} color={person.avatarColor} size={80} />
          <Text style={{ fontSize: 22, fontWeight: "700", color: colors.ink, marginTop: 6 }}>
            {person.name}
          </Text>
          <RelationTag relation={person.relation} />
          <Text style={{ fontSize: 38, fontWeight: "800", color: colors.primary, marginTop: 6 }}>
            {person.age}
          </Text>
          <Text style={{ fontSize: 13, color: colors.muted, marginBottom: 8 }}>
            turning on {MONTHS[person.month - 1]} {person.day}
          </Text>
          <TouchableOpacity
            onPress={handleShare}
            style={{
              width: "100%", paddingVertical: 14, borderRadius: 999,
              backgroundColor: colors.tint, alignItems: "center",
            }}
          >
            <Text style={{ color: colors.primaryDarkest, fontSize: 14.5, fontWeight: "600" }}>
              Send a birthday message
            </Text>
          </TouchableOpacity>
        </View>

        {!!person.notes && (
          <Text style={{ fontSize: 13.5, lineHeight: 20, color: colors.muted, marginBottom: 20 }}>
            {person.notes}
          </Text>
        )}

        <Text
          style={{
            fontSize: 12, fontWeight: "700", letterSpacing: 0.6, textTransform: "uppercase",
            color: colors.muted, marginBottom: 10,
          }}
        >
          Gift ideas
        </Text>
        <View style={{ gap: 10, marginBottom: 16 }}>
          {(person.gifts || []).map((g) => (
            <View key={g.id} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <TouchableOpacity
                onPress={() => toggleGift(personId, g.id)}
                style={{
                  width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center",
                  borderWidth: 1.5,
                  borderColor: g.bought ? colors.primary : colors.border,
                  backgroundColor: g.bought ? colors.primary : "transparent",
                }}
              >
                {g.bought && <CheckIcon />}
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 14,
                  color: g.bought ? colors.mutedFaint : colors.ink,
                  textDecorationLine: g.bought ? "line-through" : "none",
                }}
              >
                {g.text}
              </Text>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TextInput
            placeholder="Add a gift idea"
            value={giftDraft}
            onChangeText={setGiftDraft}
            style={{
              flex: 1, borderWidth: 1.5, borderColor: colors.border, borderRadius: 12,
              paddingVertical: 10, paddingHorizontal: 12, fontSize: 14, color: colors.ink, backgroundColor: "#fff",
            }}
          />
          <TouchableOpacity
            onPress={handleAddGift}
            style={{ paddingVertical: 10, paddingHorizontal: 18, borderRadius: 12, backgroundColor: colors.primary }}
          >
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>Add</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleDelete} style={{ paddingVertical: 12, marginTop: 24, alignItems: "center" }}>
          <Text style={{ color: colors.primaryBorder, fontWeight: "600", fontSize: 14 }}>
            Delete birthday
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
