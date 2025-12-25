// import React from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   Image,
//   TouchableOpacity,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// type RootStackParamList = {
//   Splash: undefined;
//   Login: undefined;
//   SignUp: undefined;
//   Main: undefined;
//   TutorProfile: undefined;
//   Booking: undefined;
// };

// type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// export default function HomeScreen() {
//   const navigation = useNavigation<NavigationProp>();

//   return (
//     <ScrollView
//       className="flex-1 bg-white px-6 pt-10"
//       showsVerticalScrollIndicator={false}
//     >
//       {/* Header Section */}
//       <Text className="text-sm text-orange-500 font-semibold text-center mb-2">
//         Trusted by 15,000+ students worldwide
//       </Text>
//       <Text className="text-3xl font-extrabold text-gray-900 text-center leading-snug mb-4">
//         Transform Your{" "}
//         <Text className="text-orange-500">Learning Journey</Text>
//       </Text>
//       <Text className="text-gray-600 text-center mb-6 leading-6">
//         Connect with world-class tutors for personalized 1-on-1 sessions. Master
//         any subject with expert guidance and flexible scheduling.
//       </Text>

//       {/* Quick Stats */}
//       <View className="flex-row justify-around my-6">
//         {[
//           { label: "Expert Tutors", icon: "👩‍🏫" },
//           { label: "24/7 Available", icon: "🕒" },
//           { label: "95% Success Rate", icon: "🏆" },
//         ].map((item, index) => (
//           <View key={index} className="items-center">
//             <Text className="text-2xl">{item.icon}</Text>
//             <Text className="text-gray-700 text-sm mt-1">{item.label}</Text>
//           </View>
//         ))}
//       </View>

//       {/* Buttons */}
//       <View className="space-y-4 mb-10">
//         <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//           <LinearGradient
//             colors={["#6C63FF", "#F97316"]}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0 }}
//             className="rounded-2xl py-4"
//           >
//             <Text className="text-white text-center text-lg font-semibold">
//               Start Learning Today
//             </Text>
//           </LinearGradient>
//         </TouchableOpacity>

//         <TouchableOpacity className="border border-gray-300 rounded-2xl py-4">
//           <Text className="text-gray-700 text-center text-lg font-semibold">
//             Book Free Trial
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Stats Overview */}
//       <View className="flex-row justify-around mt-2 mb-10">
//         <View className="items-center">
//           <Text className="text-xl font-bold text-gray-900">15,000+</Text>
//           <Text className="text-gray-500 text-sm">Happy Students</Text>
//         </View>
//         <View className="items-center">
//           <Text className="text-xl font-bold text-gray-900">500+</Text>
//           <Text className="text-gray-500 text-sm">Expert Tutors</Text>
//         </View>
//         <View className="items-center">
//           <Text className="text-xl font-bold text-gray-900">25+</Text>
//           <Text className="text-gray-500 text-sm">Subjects</Text>
//         </View>
//         <View className="items-center">
//           <Text className="text-xl font-bold text-gray-900">95%</Text>
//           <Text className="text-gray-500 text-sm">Success Rate</Text>
//         </View>
//       </View>

//       {/* Live Session Section */}
//       <View className="bg-gray-100 rounded-3xl p-4 flex-row items-center mb-10">
//         <Image
//           source={require("../../assets/group-study.avif")}
//           className="w-24 h-24 rounded-2xl mr-4"
//         />
//         <View className="flex-1">
//           <Text className="text-lg font-semibold text-gray-800">
//             Live Session
//           </Text>
//           <Text className="text-gray-500 text-sm">2:00 PM - Active now</Text>
//         </View>
//       </View>

      

//       {/* Why Choose Us */}
//       <Text className="text-2xl font-bold text-gray-900 mb-4">
//         Why Choose Us
//       </Text>
//       <Text className="text-gray-600 mb-4 leading-6">
//         Experience the difference with our innovative approach to personalized learning.
//       </Text>

//       {[
//         { title: "Expert Tutors", desc: "Hand-picked professionals with proven expertise." },
//         { title: "24/7 Learning", desc: "Learn anytime, anywhere with flexible scheduling." },
//         { title: "Secure & Safe", desc: "Your data and payments are protected." },
//         { title: "Proven Results", desc: "86% of students see improvement in grades." },
//       ].map((item, i) => (
//         <View key={i} className="bg-gray-50 rounded-2xl p-4 mb-3">
//           <Text className="text-lg font-bold text-gray-900 mb-1">{item.title}</Text>
//           <Text className="text-gray-600">{item.desc}</Text>
//         </View>
//       ))}

//       {/* Pricing Section */}
//       <Text className="text-2xl font-bold text-gray-900 mt-10 mb-3">
//         Simple, Transparent Pricing
//       </Text>
//       <Text className="text-gray-600 mb-6">
//         Choose the plan that works best for your learning goals
//       </Text>

//       {[
//         {
//           title: "Hourly Sessions",
//           price: "$25/hr",
//           features: [
//             "One-on-one tutoring",
//             "Flexible scheduling",
//             "Online or offline",
//             "Expert tutors",
//             "Progress tracking",
//           ],
//         },
//         {
//           title: "Monthly Package (Most Popular)",
//           price: "$199/month",
//           features: [
//             "8 hours of tutoring",
//             "Unlimited subjects",
//             "Priority scheduling",
//             "Study materials",
//             "24/7 support",
//           ],
//         },
//         {
//           title: "Group Sessions",
//           price: "$15/hr",
//           features: [
//             "Small group learning",
//             "Peer interaction",
//             "Cost-effective",
//             "Collaborative environment",
//           ],
//         },
//       ].map((plan, index) => (
//         <View
//           key={index}
//           className="bg-white rounded-2xl border border-gray-200 p-5 mb-5"
//         >
//           <Text className="text-xl font-bold text-gray-900 mb-1">
//             {plan.title}
//           </Text>
//           <Text className="text-orange-500 text-lg mb-3">{plan.price}</Text>
//           {plan.features.map((f, i) => (
//             <Text key={i} className="text-gray-600 mb-1">
//               • {f}
//             </Text>
//           ))}
//           <TouchableOpacity className="bg-orange-500 py-3 rounded-xl mt-3">
//             <Text className="text-white text-center font-semibold">
//               Book Now
//             </Text>
//           </TouchableOpacity>
//         </View>
//       ))}

//       {/* Final CTA */}
//       <View className="mt-10 mb-16 items-center">
//         <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
//           Boost Your Grades Today
//         </Text>
//         <Text className="text-gray-600 text-center mb-5 px-4">
//           Join thousands of successful students who have improved their grades
//           with our expert tutoring.
//         </Text>
//         <View className="flex-row space-x-3">
//           <TouchableOpacity className="bg-orange-500 py-3 px-5 rounded-xl">
//             <Text className="text-white font-semibold">Join Online Learning</Text>
//           </TouchableOpacity>
//           <TouchableOpacity className="border border-orange-500 py-3 px-5 rounded-xl">
//             <Text className="text-orange-500 font-semibold">
//               Find Offline Tutors
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// }
import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";

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

const heroImage = require("../../assets/hero-tutoring.jpg"); // adjust path if needed
const groupStudy = require("../../assets/group-study.avif"); // used later

const stats = [
  { icon: "people", label: "Expert Tutors" },
  { icon: "time", label: "24/7 Available" },
  { icon: "trending-up", label: "95% Success Rate" },
];

const avatars = ["S1", "S2", "S3", "S4", "S5"];

type Props = {
  navigation: NavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  // Debugging guards: if dispatch is missing we'll see what's happening
  // (remove or comment out these logs in production)
  console.log("HomeScreen navigation:", typeof navigation, navigation && Object.keys(navigation));
  if (!navigation || typeof (navigation as any).dispatch !== "function") {
    console.warn(
      "Warning: navigation.dispatch is not a function. Make sure HomeScreen is registered inside a navigator wrapped by NavigationContainer."
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      contentContainerStyle={{ paddingBottom: 64 }}
      showsVerticalScrollIndicator={false}
    >
      {/* HERO */}
      <View style={{ paddingHorizontal: 24, paddingTop: 40, paddingBottom: 18 }}>
        {/* Trust Badge */}
        <View
          style={{
            alignSelf: "center",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: "#E6E6E9",
            backgroundColor: "#FFFFFF",
            elevation: 2,
          }}
        >
          <View
            style={{
              height: 8,
              width: 8,
              borderRadius: 8,
              backgroundColor: "#16A34A",
              marginRight: 8,
            }}
          />
          <Text style={{ fontSize: 13, fontWeight: "600" }}>
            Trusted by 15,000+ students worldwide
          </Text>
        </View>

        {/* Heading */}
        <View style={{ marginTop: 18, alignItems: "center" }}>
          <Text
            style={{
              fontSize: 34,
              lineHeight: 40,
              fontWeight: "800",
              textAlign: "center",
            }}
          >
            Transform Your{"\n"}
            <Text style={{ color: "#F97316" }}>Learning Journey</Text>
          </Text>
        </View>

        <Text
          style={{
            marginTop: 12,
            textAlign: "center",
            color: "#6B7280",
            fontSize: 16,
            maxWidth: 720,
            alignSelf: "center",
            lineHeight: 22,
          }}
        >
          Connect with world-class tutors for personalized 1-on-1 sessions. Master any subject with expert guidance and flexible scheduling.
        </Text>

        {/* Feature Pills (icons + labels) */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 14,
            gap: 18,
          }}
        >
          {stats.map((s) => (
            <View key={s.label} style={{ alignItems: "center", marginHorizontal: 8 }}>
              <Ionicons name={s.icon as any} size={18} color="#F97316" style={{ marginBottom: 4 }} />
              <Text style={{ color: "#6B7280", fontSize: 13 }}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* CTA Buttons */}
        <View style={{ marginTop: 18, alignItems: "center", gap: 12 }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate("SignUp")}
            style={{ width: "100%", maxWidth: 420 }}
          >
            <LinearGradient
              colors={["#FB923C", "#F97316"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                borderRadius: 999,
                paddingVertical: 14,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
                Start Learning Today
              </Text>
              <MaterialIcons name="arrow-forward" size={18} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          
        </View>

        {/* Social Proof - avatars */}
        <View
          style={{
            marginTop: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <View style={{ flexDirection: "row", marginRight: 8 }}>
            {avatars.map((a, i) => (
              <View
                key={a}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  borderWidth: 2,
                  borderColor: "#fff",
                  backgroundColor: "#E5E7EB",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: i === 0 ? 0 : -10,
                  zIndex: avatars.length - i,
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: "700" }}>{a}</Text>
              </View>
            ))}
          </View>
          <Text style={{ color: "#6B7280", fontSize: 13 }}>
            <Text style={{ color: "#111827", fontWeight: "700" }}>500+</Text> students joined this week
          </Text>
        </View>
      </View>

      {/* HERO IMAGE + FLOATING CARDS */}
      <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
        <View
          style={{
            borderRadius: 20,
            overflow: "hidden",
            backgroundColor: "#fff",
            elevation: 6,
            position: "relative",
          }}
        >
          <Image
            source={(heroImage as ImageSourcePropType) || groupStudy}
            style={{
              width: width - 32,
              height: (width - 32) * 0.66,
              resizeMode: "cover",
            }}
          />

          {/* Floating top-right card */}
          <View
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              backgroundColor: "#fff",
              borderRadius: 12,
              paddingVertical: 8,
              paddingHorizontal: 10,
              elevation: 4,
              minWidth: 140,
            }}
          >
            <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 6,
                  backgroundColor: "#10B981",
                }}
              />
              <View>
                <Text style={{ fontSize: 12, fontWeight: "700" }}>Live Session</Text>
                <Text style={{ fontSize: 11, color: "#6B7280" }}>2:00 PM - Active now</Text>
              </View>
            </View>
          </View>

          {/* Floating bottom-left rating */}
          <View
            style={{
              position: "absolute",
              bottom: 12,
              left: 12,
              backgroundColor: "#fff",
              borderRadius: 12,
              paddingVertical: 8,
              paddingHorizontal: 10,
              elevation: 4,
              minWidth: 120,
            }}
          >
            <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
              <Feather name="star" size={18} color="#F59E0B" />
              <Text style={{ fontWeight: "700" }}>4.8/5 Rating</Text>
            </View>
          </View>

          {/* Floating bottom-right stats */}
          <View
            style={{
              position: "absolute",
              bottom: 12,
              right: 12,
              backgroundColor: "#fff",
              borderRadius: 12,
              paddingVertical: 8,
              paddingHorizontal: 12,
              elevation: 4,
              minWidth: 120,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "800", color: "#10B981" }}>95%</Text>
            <Text style={{ fontSize: 11, color: "#6B7280" }}>Success Rate</Text>
            <Text style={{ fontSize: 11, color: "#6B7280" }}>Student Satisfaction</Text>
          </View>
        </View>
      </View>

      {/* STATS GRID */}
      <View style={{ paddingHorizontal: 20, marginTop: 18 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
          {[
            { value: "15,000+", label: "Happy Students" },
            { value: "500+", label: "Expert Tutors" },
            { value: "25+", label: "Subjects" },
            { value: "95%", label: "Success Rate" },
          ].map((s) => (
            <View key={s.label} style={{ alignItems: "center", flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: "800", color: "#111827" }}>{s.value}</Text>
              <Text style={{ color: "#6B7280", marginTop: 4 }}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* FEATURES */}
      <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: "800", textAlign: "center", marginBottom: 8 }}>
          Why Choose TutorsPool?
        </Text>
        <Text style={{ color: "#6B7280", textAlign: "center", marginBottom: 12 }}>
          Everything you need to accelerate your learning journey in one platform.
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 12 }}>
          {[
            {
              icon: "people",
              title: "Expert Tutors",
              description: "Learn from verified professionals with proven track records.",
            },
            {
              icon: "video",
              title: "Live Sessions",
              description: "Interactive 1-on-1 video sessions for personalized learning.",
            },
            {
              icon: "target",
              title: "AI Career Guidance",
              description: "Personalized career suggestions based on your goals.",
            },
            {
              icon: "clock",
              title: "Flexible Scheduling",
              description: "Book sessions at your convenience across time zones.",
            },
            {
              icon: "book",
              title: "25+ Subjects",
              description: "From mathematics to languages, find tutors for any subject.",
            },
            {
              icon: "award",
              title: "Track Progress",
              description: "Monitor your learning with detailed progress analytics.",
            },
          ].map((f, i) => (
            <View
              key={f.title}
              style={{
                width: (width - 56) / 2,
                backgroundColor: "#fff",
                borderRadius: 14,
                padding: 14,
                marginBottom: 12,
                elevation: 3,
              }}
            >
              <View style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: "#FFF7ED", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                <Ionicons name={i % 2 === 0 ? "people" : "play-circle"} size={20} color="#F97316" />
              </View>
              <Text style={{ fontWeight: "800", marginBottom: 6 }}>{f.title}</Text>
              <Text style={{ color: "#6B7280", fontSize: 13 }}>{f.description}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ paddingHorizontal: 16, paddingVertical: 24 }}>
  {/* Student CTA */}
  <View style={{ marginBottom: 24, borderRadius: 24, overflow: "hidden" }}>
    <LinearGradient
      colors={["#F97316", "#FB923C"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ padding: 24, borderRadius: 24 }}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          backgroundColor: "rgba(255,255,255,0.2)",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 12,
        }}
      >
        <Ionicons name="school" size={24} color="#fff" />
      </View>
      <Text
        style={{
          color: "#fff",
          fontSize: 20,
          fontWeight: "800",
          marginBottom: 8,
        }}
      >
        Ready to Learn?
      </Text>
      <Text
        style={{
          color: "rgba(255,255,255,0.9)",
          marginBottom: 16,
          maxWidth: width - 64,
        }}
      >
        Join thousands of students already learning with expert tutors. Start
        your journey today.
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("SignUp")}
        style={{
          backgroundColor: "#fff",
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 16,
          alignSelf: "flex-start",
        }}
      >
        <Text style={{ color: "#F97316", fontWeight: "800", fontSize: 16 }}>
          Start Learning
        </Text>
      </TouchableOpacity>

      {/* Decorative Circles */}
      <View
        style={{
          position: "absolute",
          top: -32,
          right: -32,
          width: 128,
          height: 128,
          borderRadius: 64,
          backgroundColor: "rgba(255,255,255,0.05)",
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: -24,
          left: -24,
          width: 96,
          height: 96,
          borderRadius: 48,
          backgroundColor: "rgba(255,255,255,0.05)",
        }}
      />
    </LinearGradient>
  </View>

  {/* Tutor CTA */}
  <View
    style={{
      marginBottom: 24,
      borderRadius: 24,
      backgroundColor: "#0f1729", // Updated background color
      overflow: "hidden",
      padding: 24,
    }}
  >
    <View
      style={{
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: "#F97316",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
      }}
    >
      <Ionicons name="people" size={24} color="#fff" />
    </View>
    <Text
      style={{
        fontSize: 20,
        fontWeight: "800",
        marginBottom: 8,
        color: "#fff", // Make text visible on dark background
      }}
    >
      Share Your Expertise
    </Text>
    <Text
      style={{
        color: "rgba(255,255,255,0.8)", // Adjusted description color
        marginBottom: 16,
        maxWidth: width - 64,
      }}
    >
      Become a tutor and help students achieve their goals while earning on
      your schedule.
    </Text>
    <TouchableOpacity
      onPress={() => navigation.navigate("SignUp")}
      style={{
        backgroundColor: "#F97316",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 16,
        alignSelf: "flex-start",
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>
        Become a Tutor
      </Text>
    </TouchableOpacity>

    {/* Decorative Circles */}
    <View
      style={{
        position: "absolute",
        top: -32,
        right: -32,
        width: 128,
        height: 128,
        borderRadius: 64,
        backgroundColor: "rgba(255,255,255,0.03)",
      }}
    />
    <View
      style={{
        position: "absolute",
        bottom: -24,
        left: -24,
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: "rgba(255,255,255,0.03)",
      }}
    />
  </View>
</View>


      
    </ScrollView>
  );
}
