import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  Main: undefined;
  TutorProfile: undefined;
  Booking: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get("window");
const isTablet = width >= 768;

// Base spacing & sizing for consistency
const basePadding = isTablet ? 32 : 24;
const buttonBaseWidth = isTablet ? 280 : "100%";
const buttonMaxWidth = isTablet ? 320 : undefined;

export default function AboutScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <ScrollView
      className="flex-1 bg-white"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: basePadding,
        paddingTop: 50,
        paddingBottom: 100,
      }}
    >
      {/* Header Section */}
      <Text className="text-sm text-gray-500 font-medium text-center mb-4 uppercase tracking-wider">
        About TutorsPool
      </Text>

      <Text
        className={`text-center font-extrabold text-gray-900 leading-tight ${
          isTablet ? "text-5xl" : "text-4xl"
        } mb-8`}
      >
        Empowering Students{" "}
        <Text className="text-orange-500">to Succeed</Text>
      </Text>

      <Text
        className={`text-center text-gray-600 leading-8 ${
          isTablet ? "text-xl" : "text-lg"
        } mb-12`}
      >
        TutorsPool connects students with expert tutors for personalized learning
        experiences. Our mission is to make quality education accessible to
        everyone, everywhere.
      </Text>

      {/* Our Mission */}
      <Text
        className={`font-bold text-gray-900 mb-6 ${
          isTablet ? "text-4xl" : "text-3xl"
        }`}
      >
        Our Mission
      </Text>

      <Text
        className={`text-gray-600 leading-8 mb-12 ${
          isTablet ? "text-xl" : "text-lg"
        }`}
      >
        We believe that every student deserves access to quality education and
        personalized support. TutorsPool was founded with a simple yet powerful
        idea: connect passionate educators with motivated learners to create
        meaningful educational experiences.
      </Text>

      {/* Impact Description */}
      <Text
        className={`text-gray-700 leading-8 mb-10 ${
          isTablet ? "text-xl" : "text-lg"
        }`}
      >
        Through our platform, we've helped thousands of students improve their
        grades, build confidence, and develop a genuine love for learning. Our
        verified tutors bring expertise, patience, and dedication to every
        session.
      </Text>

      {/* Join Community Button */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate("SignUp")}
        style={{ width: buttonBaseWidth, maxWidth: buttonMaxWidth }}
        className="self-center mb-16"
      >
        <LinearGradient
          colors={["#FB923C", "#F97316"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="rounded-full py-5 px-10 shadow-xl"
        >
          <Text className="text-white text-xl font-bold text-center">
            Join Our Community →
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Impact Stats List */}
      <View className="space-y-8 mb-20">
        {[
          { text: "5,000+ students helped achieve their academic goals", icon: "emoji-events" },
          { text: "200+ verified expert tutors across 50+ subjects", icon: "school" },
          { text: "98% student satisfaction rate", icon: "sentiment-satisfied" },
          { text: "Available in 25+ countries worldwide", icon: "public" },
          { text: "Partnership with leading educational institutions", icon: "handshake" },
          { text: "Award-winning online learning platform", icon: "star-rate" },
        ].map((item, index) => (
          <View key={index} className="flex-row items-start">
            <View className="w-12 h-12 bg-orange-100 rounded-2xl items-center justify-center mr-5 shadow-sm">
              <MaterialIcons name={item.icon as any} size={28} color="#F97316" />
            </View>
            <Text
              className={`text-gray-800 flex-1 leading-7 ${
                isTablet ? "text-xl" : "text-lg"
              } font-medium`}
            >
              {item.text}
            </Text>
          </View>
        ))}
      </View>

      {/* Our Values */}
      <Text
        className={`font-bold text-gray-900 mb-8 ${
          isTablet ? "text-4xl" : "text-3xl"
        }`}
      >
        Our Values
      </Text>

      <Text
        className={`text-gray-600 leading-8 mb-12 ${
          isTablet ? "text-xl" : "text-lg"
        }`}
      >
        These core values guide everything we do at TutorsPool
      </Text>

      <View className="space-y-10 mb-20">
        {[
          {
            title: "Excellence",
            desc: "We strive for excellence in education, ensuring every student receives the highest quality tutoring experience.",
            icon: "emoji-events",
          },
          {
            title: "Passion",
            desc: "Our tutors are passionate educators who genuinely care about student success and growth.",
            icon: "favorite",
          },
          {
            title: "Accessibility",
            desc: "Quality education should be accessible to everyone, regardless of location or background.",
            icon: "language",
          },
          {
            title: "Community",
            desc: "We foster a supportive learning community where students and tutors thrive together.",
            icon: "group",
          },
        ].map((value, index) => (
          <View
            key={index}
            className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
          >
            <View className="w-16 h-16 bg-orange-500 rounded-2xl items-center justify-center mb-6 shadow-md">
              <MaterialIcons name={value.icon as any} size={32} color="#FFFFFF" />
            </View>
            <Text className={`font-bold text-gray-900 mb-4 ${isTablet ? "text-2xl" : "text-xl"}`}>
              {value.title}
            </Text>
            <Text className={`text-gray-600 leading-7 ${isTablet ? "text-lg" : "text-base"}`}>
              {value.desc}
            </Text>
          </View>
        ))}
      </View>

      {/* Leadership Team */}
      <Text
        className={`font-bold text-gray-900 mb-8 ${
          isTablet ? "text-4xl" : "text-3xl"
        }`}
      >
        Leadership Team
      </Text>

      <Text
        className={`text-gray-600 leading-8 mb-12 ${
          isTablet ? "text-xl" : "text-lg"
        }`}
      >
        Meet the passionate people behind TutorsPool
      </Text>

      <View className="space-y-10 mb-20">
        {[
          {
            initials: "DSM",
            name: "Dr. Sarah Mitchell",
            role: "Founder & CEO",
            bio: "Former professor with 15+ years in education technology",
          },
          {
            initials: "MC",
            name: "Michael Chen",
            role: "Head of Academics",
            bio: "PhD in Educational Psychology from Stanford",
          },
          {
            initials: "ER",
            name: "Emily Rodriguez",
            role: "Director of Operations",
            bio: "10+ years experience in edtech startups",
          },
        ].map((member) => (
          <View
            key={member.name}
            className="bg-white rounded-3xl p-8 flex-row items-center shadow-xl border border-gray-100"
          >
            <View className="w-24 h-24 bg-orange-500 rounded-full items-center justify-center mr-8 shadow-lg">
              <Text className="text-3xl font-bold text-white">
                {member.initials}
              </Text>
            </View>
            <View className="flex-1">
              <Text className={`font-bold text-gray-900 ${isTablet ? "text-2xl" : "text-xl"}`}>
                {member.name}
              </Text>
              <Text className="text-orange-500 font-bold text-lg mb-3">
                {member.role}
              </Text>
              <Text className={`text-gray-600 leading-6 ${isTablet ? "text-lg" : "text-base"}`}>
                {member.bio}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Final CTA - Responsive Buttons */}
      <View className="items-center">
        <View className="w-24 h-24 bg-orange-100 rounded-full items-center justify-center mb-8 shadow-xl">
          <MaterialIcons name="auto-awesome" size={48} color="#F97316" />
        </View>

        <Text
          className={`text-center font-extrabold text-gray-900 mb-6 ${
            isTablet ? "text-4xl" : "text-3xl"
          } leading-tight`}
        >
          Ready to Transform Your Learning?
        </Text>

        <Text
          className={`text-center text-gray-600 mb-12 px-6 leading-8 ${
            isTablet ? "text-xl" : "text-lg"
          }`}
        >
          Join thousands of students who have achieved their academic goals with
          TutorsPool.
        </Text>

        {/* Responsive Button Row */}
        <View
          className={`flex-row ${isTablet ? "space-x-8" : "flex-col space-y-6 w-full"}`}
          style={{ maxWidth: isTablet ? 700 : undefined }}
        >
          {/* Find a Tutor Button */}
          <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate("Main")}
        style={{
          flex: isTablet ? 1 : undefined,
          minWidth: isTablet ? 220 : undefined,
              marginBottom: 8, // 👈 space between buttons

        }}
      >
        <LinearGradient
          colors={["#FB923C", "#F97316"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            borderRadius: 9999,
            overflow: "hidden",
            paddingVertical: 14, // 👈 reduced height
            paddingHorizontal: 28, // 👈 reduced width
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 16, // 👈 smaller text
              fontWeight: "bold",
            }}
          >
            Find a Tutor
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Become a Tutor Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate("SignUp")}
        style={{
          flex: isTablet ? 1 : undefined,
          minWidth: isTablet ? 220 : undefined,
          borderWidth: 2,
          borderColor: "#F97316",
          borderRadius: 9999,
          paddingVertical: 14, // 👈 reduced height
          paddingHorizontal: 28, // 👈 reduced width
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: "#F97316",
            fontSize: 16, // 👈 smaller text
            fontWeight: "bold",
          }}
        >
          Become a Tutor
        </Text>
      </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}