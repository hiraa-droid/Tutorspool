import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function SplashScreen({ navigation }: any) {
  return (
    <View className="flex-1 bg-white px-6 justify-center">
      {/* Logo */}
      <View className="items-center mb-8">
        <Image
          source={require("../../assets/logo.png")}
          className="w-20 h-20"
          resizeMode="contain"
        />
      </View>

      {/* Headline */}
      <Text className="text-3xl font-extrabold text-center text-gray-900">
        Transform Your{" "}
        <Text className="text-orange-500">Learning Journey</Text>
      </Text>

      {/* Subheading */}
      <Text className="text-center text-gray-600 mt-4 leading-6">
        Connect with world-class tutors for personalized 1-on-1 sessions. Master
        any subject with expert guidance and flexible scheduling.
      </Text>

      {/* Buttons */}
      <View className="mt-10 space-y-4">
        {/* Gradient Button */}
        <TouchableOpacity onPress={() => navigation.navigate("Main")}>
          <LinearGradient
            colors={["#6C63FF", "#F97316"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="rounded-2xl py-4"
          >
            <Text className="text-white text-center text-lg font-semibold">
              Start Learning Today
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Outline Button */}
        <TouchableOpacity className="border border-gray-300 rounded-2xl py-4">
          <Text className="text-gray-700 text-center text-lg font-semibold">
            Book Free Trial
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View className="flex-row justify-around mt-12">
        <View className="items-center">
          <Text className="text-xl font-bold text-gray-900">15,000+</Text>
          <Text className="text-gray-500 text-sm">Happy Students</Text>
        </View>
        <View className="items-center">
          <Text className="text-xl font-bold text-gray-900">500+</Text>
          <Text className="text-gray-500 text-sm">Expert Tutors</Text>
        </View>
        <View className="items-center">
          <Text className="text-xl font-bold text-gray-900">95%</Text>
          <Text className="text-gray-500 text-sm">Success Rate</Text>
        </View>
      </View>
    </View>
  );
}