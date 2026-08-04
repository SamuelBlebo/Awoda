import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { usePeople } from "../hooks/usePeople";
import PersonForm from "../components/PersonForm";
import BackChevronIcon from "../components/ui/icons/BackChevronIcon";
import { colors } from "../lib/colors";
import { goBackOrHome } from "../lib/navigation";

export default function EditPersonScreen({ route, navigation }) {
  const { personId } = route.params;
  const { withMeta, updatePerson } = usePeople();
  const person = withMeta.find((p) => p.id === personId);

  const handleSubmit = async (values) => {
    await updatePerson(personId, values);
    goBackOrHome(navigation);
  };

  if (!person) {
    return <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} />;
  }

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
        <Text style={{ fontSize: 16, fontWeight: "700", color: colors.ink }}>Edit person</Text>
      </View>

      <PersonForm submitLabel="Save changes" initialValues={person} onSubmit={handleSubmit} />
    </SafeAreaView>
  );
}
