import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  Main: undefined;
  TutorProfile: undefined;
  Booking: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <ScrollView
      className="flex-1 bg-white px-6 pt-10"
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <Text className="text-sm text-orange-500 font-semibold text-center mb-2">
        Trusted by 15,000+ students worldwide
      </Text>
      <Text className="text-3xl font-extrabold text-gray-900 text-center leading-snug mb-4">
        Transform Your{" "}
        <Text className="text-orange-500">Learning Journey</Text>
      </Text>
      <Text className="text-gray-600 text-center mb-6 leading-6">
        Connect with world-class tutors for personalized 1-on-1 sessions. Master
        any subject with expert guidance and flexible scheduling.
      </Text>

      {/* Quick Stats */}
      <View className="flex-row justify-around my-6">
        {[
          { label: "Expert Tutors", icon: "👩‍🏫" },
          { label: "24/7 Available", icon: "🕒" },
          { label: "95% Success Rate", icon: "🏆" },
        ].map((item, index) => (
          <View key={index} className="items-center">
            <Text className="text-2xl">{item.icon}</Text>
            <Text className="text-gray-700 text-sm mt-1">{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Buttons */}
      <View className="space-y-4 mb-10">
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
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

        <TouchableOpacity className="border border-gray-300 rounded-2xl py-4">
          <Text className="text-gray-700 text-center text-lg font-semibold">
            Book Free Trial
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats Overview */}
      <View className="flex-row justify-around mt-2 mb-10">
        <View className="items-center">
          <Text className="text-xl font-bold text-gray-900">15,000+</Text>
          <Text className="text-gray-500 text-sm">Happy Students</Text>
        </View>
        <View className="items-center">
          <Text className="text-xl font-bold text-gray-900">500+</Text>
          <Text className="text-gray-500 text-sm">Expert Tutors</Text>
        </View>
        <View className="items-center">
          <Text className="text-xl font-bold text-gray-900">25+</Text>
          <Text className="text-gray-500 text-sm">Subjects</Text>
        </View>
        <View className="items-center">
          <Text className="text-xl font-bold text-gray-900">95%</Text>
          <Text className="text-gray-500 text-sm">Success Rate</Text>
        </View>
      </View>

      {/* Live Session Section */}
      <View className="bg-gray-100 rounded-3xl p-4 flex-row items-center mb-10">
        <Image
          source={require("../../assets/group-study.avif")}
          className="w-24 h-24 rounded-2xl mr-4"
        />
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800">
            Live Session
          </Text>
          <Text className="text-gray-500 text-sm">2:00 PM - Active now</Text>
        </View>
      </View>

      {/* How It Works */}
      <Text className="text-2xl font-bold text-gray-900 mb-3">
        How It Works
      </Text>
      <Text className="text-gray-600 mb-6 leading-6">
        Getting started with personalized tutoring is simple and straightforward.
      </Text>

      {[
        {
          step: "01",
          title: "Choose Your Subject",
          desc: "Select from 25+ subjects including Math, Science, English, Coding, and more.",
        },
        {
          step: "02",
          title: "Pick Online or Offline",
          desc: "Choose between online video sessions or in-person tutoring.",
        },
        {
          step: "03",
          title: "Start Learning",
          desc: "Connect with expert tutors and begin your personalized learning journey.",
        },
      ].map((item) => (
        <View
          key={item.step}
          className="bg-gray-50 rounded-2xl p-4 mb-4 flex-row"
        >
          <Text className="text-orange-500 text-3xl font-extrabold mr-3">
            {item.step}
          </Text>
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-800 mb-1">
              {item.title}
            </Text>
            <Text className="text-gray-600">{item.desc}</Text>
          </View>
        </View>
      ))}

      {/* Tutoring Programs */}
      <Text className="text-2xl font-bold text-gray-900 mt-8 mb-3">
        Tutoring Programs
      </Text>
      <Text className="text-gray-600 mb-4">
        Comprehensive learning support across all major subjects and skill levels
      </Text>

      <View className="flex-row flex-wrap justify-between mb-10">
        {["Mathematics", "Science", "English", "Test Prep", "Coding", "Languages"].map(
          (subject) => (
            <TouchableOpacity
              key={subject}
              className="bg-gray-100 rounded-2xl p-4 w-[48%] mb-4"
            >
              <Text className="text-lg font-semibold text-gray-900 mb-1">
                {subject}
              </Text>
              <Text className="text-orange-500 font-medium">Learn More</Text>
            </TouchableOpacity>
          )
        )}
      </View>

      {/* Why Choose Us */}
      <Text className="text-2xl font-bold text-gray-900 mb-4">
        Why Choose Us
      </Text>
      <Text className="text-gray-600 mb-4 leading-6">
        Experience the difference with our innovative approach to personalized learning.
      </Text>

      {[
        { title: "Expert Tutors", desc: "Hand-picked professionals with proven expertise." },
        { title: "24/7 Learning", desc: "Learn anytime, anywhere with flexible scheduling." },
        { title: "Secure & Safe", desc: "Your data and payments are protected." },
        { title: "Proven Results", desc: "86% of students see improvement in grades." },
      ].map((item, i) => (
        <View key={i} className="bg-gray-50 rounded-2xl p-4 mb-3">
          <Text className="text-lg font-bold text-gray-900 mb-1">{item.title}</Text>
          <Text className="text-gray-600">{item.desc}</Text>
        </View>
      ))}

      {/* Pricing Section */}
      <Text className="text-2xl font-bold text-gray-900 mt-10 mb-3">
        Simple, Transparent Pricing
      </Text>
      <Text className="text-gray-600 mb-6">
        Choose the plan that works best for your learning goals
      </Text>

      {[
        {
          title: "Hourly Sessions",
          price: "$25/hr",
          features: [
            "One-on-one tutoring",
            "Flexible scheduling",
            "Online or offline",
            "Expert tutors",
            "Progress tracking",
          ],
        },
        {
          title: "Monthly Package (Most Popular)",
          price: "$199/month",
          features: [
            "8 hours of tutoring",
            "Unlimited subjects",
            "Priority scheduling",
            "Study materials",
            "24/7 support",
          ],
        },
        {
          title: "Group Sessions",
          price: "$15/hr",
          features: [
            "Small group learning",
            "Peer interaction",
            "Cost-effective",
            "Collaborative environment",
          ],
        },
      ].map((plan, index) => (
        <View
          key={index}
          className="bg-white rounded-2xl border border-gray-200 p-5 mb-5"
        >
          <Text className="text-xl font-bold text-gray-900 mb-1">
            {plan.title}
          </Text>
          <Text className="text-orange-500 text-lg mb-3">{plan.price}</Text>
          {plan.features.map((f, i) => (
            <Text key={i} className="text-gray-600 mb-1">
              • {f}
            </Text>
          ))}
          <TouchableOpacity className="bg-orange-500 py-3 rounded-xl mt-3">
            <Text className="text-white text-center font-semibold">
              Book Now
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Final CTA */}
      <View className="mt-10 mb-16 items-center">
        <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
          Boost Your Grades Today
        </Text>
        <Text className="text-gray-600 text-center mb-5 px-4">
          Join thousands of successful students who have improved their grades
          with our expert tutoring.
        </Text>
        <View className="flex-row space-x-3">
          <TouchableOpacity className="bg-orange-500 py-3 px-5 rounded-xl">
            <Text className="text-white font-semibold">Join Online Learning</Text>
          </TouchableOpacity>
          <TouchableOpacity className="border border-orange-500 py-3 px-5 rounded-xl">
            <Text className="text-orange-500 font-semibold">
              Find Offline Tutors
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}