import React from "react";
import { ScrollView, View, Text } from "react-native";

export default function AboutScreen() {
  return (
    <ScrollView
      className="flex-1 bg-white px-6 pt-10"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text className="text-3xl font-extrabold text-gray-900 mb-4 text-center">
        About <Text className="text-orange-500">TutorsPool</Text>
      </Text>

      <Text className="text-gray-600 mb-6 leading-6 text-center">
        We're revolutionizing education by connecting students with expert tutors for personalized, high-quality learning experiences.
      </Text>

      <Text className="text-xl font-bold text-gray-800 mb-2 text-center">
        Our Mission: Making Quality Education Accessible
      </Text>

      <Text className="text-gray-600 mb-6 leading-6 text-justify">
        Founded in 2020, TutorsPool emerged from a simple belief: every student deserves access to quality, personalized education. We saw the gaps in traditional education and set out to bridge them with technology and expert human connections.
      </Text>

      <Text className="text-gray-600 mb-6 leading-6 text-justify">
        Today, we're proud to have helped over 15,000 students achieve their academic goals while providing meaningful teaching opportunities to educators worldwide.
      </Text>

      {/* Features */}
      <View className="space-y-4">
        <View className="bg-gray-50 rounded-2xl p-4">
          <Text className="text-lg font-bold text-gray-900 mb-1">
            🎯 Personalized Learning
          </Text>
          <Text className="text-gray-600">
            Every session is tailored to individual learning styles and goals.
          </Text>
        </View>

        <View className="bg-gray-50 rounded-2xl p-4">
          <Text className="text-lg font-bold text-gray-900 mb-1">
            👩‍🏫 Expert Tutors
          </Text>
          <Text className="text-gray-600">
            Hand-picked educators with proven track records and specialized expertise.
          </Text>
        </View>

        <View className="bg-gray-50 rounded-2xl p-4 mb-10">
          <Text className="text-lg font-bold text-gray-900 mb-1">
            🕒 Flexible Scheduling
          </Text>
          <Text className="text-gray-600">
            Learn when it's convenient for you, with 24/7 booking availability.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}