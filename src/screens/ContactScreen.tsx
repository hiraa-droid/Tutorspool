import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function ContactScreen() {
  return (
    <ScrollView
      className="flex-1 bg-gray-50 px-5 pt-10"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text className="text-3xl font-extrabold text-gray-900 text-center mb-2">
        Get in <Text className="text-purple-700">Touch</Text>
      </Text>
      <Text className="text-center text-gray-600 mb-8">
        We're here to help! Reach out with any questions, concerns, or feedback.
      </Text>

      {/* Contact Form Section */}
      <View className="bg-white rounded-2xl p-5 shadow-sm mb-8">
        <Text className="text-lg font-bold text-gray-900 mb-1">
          💬 Send us a Message
        </Text>
        <Text className="text-gray-600 mb-4 text-sm">
          Fill out the form below and we'll get back to you within 24 hours.
        </Text>

        <Text className="text-gray-800 mb-1">Full Name *</Text>
        <TextInput
          className="border border-gray-300 rounded-xl p-3 mb-3"
          placeholder="Enter your full name"
        />

        <Text className="text-gray-800 mb-1">Email Address *</Text>
        <TextInput
          className="border border-gray-300 rounded-xl p-3 mb-3"
          placeholder="Enter your email"
          keyboardType="email-address"
        />

        <Text className="text-gray-800 mb-1">Subject</Text>
        <TextInput
          className="border border-gray-300 rounded-xl p-3 mb-3"
          placeholder="What's this about?"
        />

        <Text className="text-gray-800 mb-1">Message *</Text>
        <TextInput
          className="border border-gray-300 rounded-xl p-3 h-28"
          multiline
          textAlignVertical="top"
          placeholder="Tell us how we can help..."
        />

        <TouchableOpacity
          className="rounded-xl py-3 mt-4"
          style={{
            backgroundColor: "#6C63FF",
          }}
        >
          <Text className="text-center text-white font-bold">
            Send Message
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contact Information Section */}
      <View className="bg-white rounded-2xl p-5 shadow-sm">
        <Text className="text-lg font-bold text-gray-900 mb-3">
          📞 Contact Information
        </Text>
        <Text className="text-gray-600 mb-4">
          We're here to help you succeed. Whether you have questions about our services,
          need technical support, or want to become a tutor, we're just a message away.
        </Text>

        <View className="bg-gray-50 rounded-xl p-4 mb-3 flex-row items-center">
          <Ionicons name="call-outline" size={22} color="#6C63FF" />
          <View className="ml-3 flex-1">
            <Text className="text-gray-800 font-semibold">Phone Support</Text>
            <Text className="text-gray-600 text-sm">(555) 123-4567</Text>
            <Text className="text-gray-600 text-sm">(555) 123-4568</Text>
            <Text className="text-gray-500 text-xs">Mon–Fri 9AM–6PM EST</Text>
          </View>
        </View>

        <View className="bg-gray-50 rounded-xl p-4 mb-3 flex-row items-center">
          <Ionicons name="mail-outline" size={22} color="#6C63FF" />
          <View className="ml-3 flex-1">
            <Text className="text-gray-800 font-semibold">Email Support</Text>
            <Text className="text-gray-600 text-sm">support@tutorspool.com</Text>
            <Text className="text-gray-600 text-sm">help@tutorspool.com</Text>
            <Text className="text-gray-500 text-xs">24/7 Email Support</Text>
          </View>
        </View>

        <View className="bg-gray-50 rounded-xl p-4 flex-row items-center">
          <Ionicons name="location-outline" size={22} color="#6C63FF" />
          <View className="ml-3 flex-1">
            <Text className="text-gray-800 font-semibold">Office Address</Text>
            <Text className="text-gray-600 text-sm">
              123 Education Street, Learning City, LC 12345
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}