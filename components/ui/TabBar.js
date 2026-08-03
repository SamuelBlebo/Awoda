import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HouseIcon from "./icons/HouseIcon";
import BellIcon from "./icons/BellIcon";
import GearIcon from "./icons/GearIcon";
import PlusIcon from "./icons/PlusIcon";
import { colors } from "../../lib/colors";

const TAB_META = {
  Home: { icon: HouseIcon, label: "Home" },
  Notifications: { icon: BellIcon, label: "Alerts" },
  Settings: { icon: GearIcon, label: "Settings" },
};

export default function TabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-end",
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 10,
        paddingBottom: Math.max(insets.bottom, 10),
        paddingHorizontal: 12,
        backgroundColor: colors.bg,
      }}
    >
      {state.routes.map((route, index) => {
        const meta = TAB_META[route.name];
        if (!meta) return null;
        const focused = state.index === index;
        const Icon = meta.icon;
        const color = focused ? colors.primary : colors.mutedFaint;

        if (route.name === "Notifications") {
          return (
            <React.Fragment key={route.key}>
              <TouchableOpacity
                onPress={() => navigation.navigate(route.name)}
                style={{ flex: 1, alignItems: "center", gap: 3, paddingVertical: 4 }}
              >
                <Icon size={21} color={color} />
                <Text style={{ fontSize: 10.5, fontWeight: "600", color }}>{meta.label}</Text>
              </TouchableOpacity>
              <View style={{ flex: 1, alignItems: "center", justifyContent: "flex-end" }}>
                <TouchableOpacity
                  onPress={() => navigation.getParent()?.navigate("AddPerson")}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    borderWidth: 3,
                    borderColor: colors.bg,
                    backgroundColor: colors.primary,
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: -30,
                    shadowColor: "#000",
                    shadowOpacity: 0.18,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: 4,
                  }}
                >
                  <PlusIcon size={20} color="#fff" />
                </TouchableOpacity>
                <Text style={{ fontSize: 10.5, fontWeight: "600", color: colors.mutedFaint, marginTop: 2 }}>
                  Add
                </Text>
              </View>
            </React.Fragment>
          );
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={{ flex: 1, alignItems: "center", gap: 3, paddingVertical: 4 }}
          >
            <Icon size={21} color={color} />
            <Text style={{ fontSize: 10.5, fontWeight: "600", color }}>{meta.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
