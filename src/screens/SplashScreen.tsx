// import React from "react";
// import { View, Text, TouchableOpacity, Image } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";

// export default function SplashScreen({ navigation }: any) {
//   return (
//     <View className="flex-1 bg-white px-6 justify-center">
//       {/* Logo */}
//       <View className="items-center mb-8">
//         <Image
//           source={require("../../assets/logo.png")}
//           className="w-20 h-20"
//           resizeMode="contain"
//         />
//       </View>

//       {/* Headline */}
//       <Text className="text-3xl font-extrabold text-center text-gray-900">
//         Transform Your{" "}
//         <Text className="text-orange-500">Learning Journey</Text>
//       </Text>

//       {/* Subheading */}
//       <Text className="text-center text-gray-600 mt-4 leading-6">
//         Connect with world-class tutors for personalized 1-on-1 sessions. Master
//         any subject with expert guidance and flexible scheduling.
//       </Text>

//       {/* Buttons */}
//       <View className="mt-10 space-y-4">
//         {/* Gradient Button */}
//         <TouchableOpacity onPress={() => navigation.navigate("Main")}>
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

//         {/* Outline Button */}
//         <TouchableOpacity className="border border-gray-300 rounded-2xl py-4">
//           <Text className="text-gray-700 text-center text-lg font-semibold">
//             Book Free Trial
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Stats */}
//       <View className="flex-row justify-around mt-12">
//         <View className="items-center">
//           <Text className="text-xl font-bold text-gray-900">15,000+</Text>
//           <Text className="text-gray-500 text-sm">Happy Students</Text>
//         </View>
//         <View className="items-center">
//           <Text className="text-xl font-bold text-gray-900">500+</Text>
//           <Text className="text-gray-500 text-sm">Expert Tutors</Text>
//         </View>
//         <View className="items-center">
//           <Text className="text-xl font-bold text-gray-900">95%</Text>
//           <Text className="text-gray-500 text-sm">Success Rate</Text>
//         </View>
//       </View>
//     </View>
//   );
// }
import React from "react";
import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function SplashScreen({ navigation }: any) {
  const isTablet = width >= 768; // Simple tablet detection

  return (
    <View className="flex-1 bg-white px-6 justify-between py-12">
      {/* Top Section: Logo + Trust Badge + Headline + Subheading + Features */}
      <View>
        {/* Logo */}
        <View className="items-center mb-6">
          <Image
            source={require("../../assets/logo.png")}
            className={`${isTablet ? "w-48 h-48" : "w-36 h-36"}`}
            resizeMode="contain"
          />
        </View>

        {/* Trust Badge */}
        <View className="bg-green-100 self-start px-5 py-2.5 rounded-full mb-10">
          <Text className={`text-green-800 ${isTablet ? "text-base" : "text-sm"} font-semibold`}>
            Trusted by 15,000+ students worldwide
          </Text>
        </View>

        {/* Headline */}
        <Text
          className={`font-extrabold text-gray-900 leading-tight ${
            isTablet ? "text-5xl" : "text-4xl"
          }`}
        >
          Transform Your{" "}
          <Text className="bg-orange-500 text-gray-900 px-3 py-1 rounded-md">
            Learning Journey
          </Text>
        </Text>

        {/* Subheading */}
        <Text
          className={`text-gray-600 mt-6 leading-7 ${
            isTablet ? "text-xl" : "text-lg"
          }`}
        >
          Connect with world-class tutors for personalized 1-on-1 sessions. Master
          any subject with expert guidance and flexible scheduling.
        </Text>

        {/* Responsive Horizontal Features */}
        <View
          className={`mt-10 ${
            isTablet
              ? "flex-row justify-between"
              : "flex-row justify-between flex-wrap gap-4"
          }`}
        >
          {/* Expert Tutors */}
          <View
            className={`flex-row items-center ${
              isTablet ? "flex-1 justify-center" : "justify-start"
            }`}
          >
            <MaterialIcons
              name="verified"
              size={isTablet ? 30 : 26}
              color="#F97316"
            />
            <Text
              className={`ml-3 text-gray-800 font-medium ${
                isTablet ? "text-xl" : "text-base"
              }`}
            >
              Expert Tutors
            </Text>
          </View>

          {/* 24/7 Availability */}
          <View
            className={`flex-row items-center ${
              isTablet ? "flex-1 justify-center" : "justify-center"
            }`}
          >
            <MaterialIcons
              name="access-time"
              size={isTablet ? 30 : 26}
              color="#F97316"
            />
            <Text
              className={`ml-3 text-gray-800 font-medium ${
                isTablet ? "text-xl" : "text-base"
              }`}
            >
              24/7 Availability
            </Text>
          </View>

          {/* 95% Success Rate */}
          <View
            className={`flex-row items-center ${
              isTablet ? "flex-1 justify-center" : "justify-end"
            }`}
          >
            <MaterialIcons
              name="trending-up"
              size={isTablet ? 30 : 26}
              color="#F97316"
            />
            <Text
              className={`ml-3 text-gray-800 font-medium ${
                isTablet ? "text-xl" : "text-base"
              }`}
            >
              95% Success Rate
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom Section: Button + Stats */}
      <View>
        {/* Start Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Main")}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={["#FB923C", "#F97316"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="rounded-full py-5 shadow-xl"
          >
            <Text
              className={`text-white text-center font-bold ${
                isTablet ? "text-2xl" : "text-xl"
              }`}
            >
              Start Learning Today →
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Stats */}
        <View className="mt-8 items-center">
          <Text
            className={`text-gray-900 font-semibold ${
              isTablet ? "text-xl" : "text-lg"
            }`}
          >
            500+ students joined this week
          </Text>
        </View>
      </View>
    </View>
  );
}