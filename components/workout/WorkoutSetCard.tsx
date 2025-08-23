import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import SettingsIcon from "@/lib/icons/SettingsIcon";

type SetItem = {
  id: number;
  previous: string;
  weight: string;
  reps: string;
};

const WorkoutSetCard = () => {
  const [sets, setSets] = useState<SetItem[]>([
    { id: 1, previous: "30 lbs", weight: "35 lbs", reps: "10" },
    { id: 2, previous: "35 lbs", weight: "--", reps: "10" },
    { id: 3, previous: "40 lbs", weight: "--", reps: "10" },
  ]);

  type EditableField = "previous" | "weight" | "reps";

  const handleChange = (index: number, field: EditableField, value: string) => {
    const newSets = [...sets];
    newSets[index][field] = value;
    setSets(newSets);
  };

  const addSet = () => {
    const newSet: SetItem = {
      id: sets.length + 1,
      previous: "30 lbs",
      weight: "35 lbs",
      reps: "10",
    };
    setSets([...sets, newSet]);
  };

  return (
    <View className="bg-[#181818] rounded-2xl p-4 mx-4 mt-4">
      <View className="flex-row items-center justify-between pb-3 border-b border-white/10">
        <View className="flex-row items-center gap-3">
          <Image
            source={require("../../assets/images/benchpress.png")}
            className="w-12 h-12 rounded-md"
          />
          <View>
            <Text className="text-white font-bold text-base">Bench Press</Text>
            <Text className="text-[#9f9f9f] text-sm">Chest</Text>
          </View>
        </View>

        <View className="flex-row items-center gap-2">
          <SettingsIcon />
          <View className="flex flex-col gap-1">
            <Text className="text-[#9f9f9f]">Sets</Text>
            <Text className="text-white font-semibold">{sets.length}</Text>
          </View>
        </View>
      </View>

      <View className="flex-row mt-4 py-2 justify-between">
        <View className="flex-1">
          <Text className="text-[#9f9f9f] text-sm font-medium text-center">
            Set
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-[#9f9f9f] text-sm font-medium text-center">
            Previous
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-[#9f9f9f] text-sm font-medium text-center">
            Weight
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-[#9f9f9f] text-sm font-medium text-center">
            Reps
          </Text>
        </View>
      </View>

      {sets.map((set, index) => (
        <View
          key={set.id}
          className="flex-row py-4  justify-between"
          style={{
            backgroundColor: index % 2 === 0 ? "#2a2a2a" : "#222222",
          }}
        >
          <View className="flex-1">
            <Text className="text-white font-medium text-center">{set.id}</Text>
          </View>
          <View className="flex-1">
            <TextInput
              value={set.previous}
              onChangeText={(text) => handleChange(index, "previous", text)}
              style={{
                color: "#fff",

                textAlign: "center",
                backgroundColor: "transparent",
                paddingVertical: 0,
                borderWidth: 0,
              }}
              placeholder="Previous"
              placeholderTextColor="#666"
              underlineColorAndroid="transparent"
            />
          </View>
          <View className="flex-1">
            <TextInput
              value={set.weight}
              onChangeText={(text) => handleChange(index, "weight", text)}
              style={{
                color: "#fff",

                textAlign: "center",
                backgroundColor: "transparent",
                paddingVertical: 0,
                borderWidth: 0,
              }}
              placeholder="Weight"
              placeholderTextColor="#666"
              underlineColorAndroid="transparent"
            />
          </View>
          <View className="flex-1">
            <TextInput
              value={set.reps}
              onChangeText={(text) => handleChange(index, "reps", text)}
              style={{
                color: "#fff",
                width: "29%",
                textAlign: "center",
                backgroundColor: "transparent",
                paddingVertical: 0,
                borderWidth: 0,
              }}
              placeholder="Reps"
              placeholderTextColor="#666"
              underlineColorAndroid="transparent"
              keyboardType="number-pad"
            />
          </View>
        </View>
      ))}

      <TouchableOpacity
        onPress={addSet}
        className="mt-4 py-3"
        style={{ width: "100%" }}
      >
        <Text className="text-center text-white font-medium">Add Set</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WorkoutSetCard;
