// import React from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Dimensions,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// const { width } = Dimensions.get("window");

// export default function ContactScreen() {
//   return (
//     <ScrollView
//       className="flex-1 bg-gray-50 px-5 pt-10"
//       showsVerticalScrollIndicator={false}
//       contentContainerStyle={{ paddingBottom: 40 }}
//     >
//       <Text className="text-3xl font-extrabold text-gray-900 text-center mb-2">
//         Get in <Text className="text-purple-700">Touch</Text>
//       </Text>
//       <Text className="text-center text-gray-600 mb-8">
//         We're here to help! Reach out with any questions, concerns, or feedback.
//       </Text>

//       {/* Contact Form Section */}
//       <View className="bg-white rounded-2xl p-5 shadow-sm mb-8">
//         <Text className="text-lg font-bold text-gray-900 mb-1">
//           💬 Send us a Message
//         </Text>
//         <Text className="text-gray-600 mb-4 text-sm">
//           Fill out the form below and we'll get back to you within 24 hours.
//         </Text>

//         <Text className="text-gray-800 mb-1">Full Name *</Text>
//         <TextInput
//           className="border border-gray-300 rounded-xl p-3 mb-3"
//           placeholder="Enter your full name"
//         />

//         <Text className="text-gray-800 mb-1">Email Address *</Text>
//         <TextInput
//           className="border border-gray-300 rounded-xl p-3 mb-3"
//           placeholder="Enter your email"
//           keyboardType="email-address"
//         />

//         <Text className="text-gray-800 mb-1">Subject</Text>
//         <TextInput
//           className="border border-gray-300 rounded-xl p-3 mb-3"
//           placeholder="What's this about?"
//         />

//         <Text className="text-gray-800 mb-1">Message *</Text>
//         <TextInput
//           className="border border-gray-300 rounded-xl p-3 h-28"
//           multiline
//           textAlignVertical="top"
//           placeholder="Tell us how we can help..."
//         />

//         <TouchableOpacity
//           className="rounded-xl py-3 mt-4"
//           style={{
//             backgroundColor: "#6C63FF",
//           }}
//         >
//           <Text className="text-center text-white font-bold">
//             Send Message
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Contact Information Section */}
//       <View className="bg-white rounded-2xl p-5 shadow-sm">
//         <Text className="text-lg font-bold text-gray-900 mb-3">
//           📞 Contact Information
//         </Text>
//         <Text className="text-gray-600 mb-4">
//           We're here to help you succeed. Whether you have questions about our services,
//           need technical support, or want to become a tutor, we're just a message away.
//         </Text>

//         <View className="bg-gray-50 rounded-xl p-4 mb-3 flex-row items-center">
//           <Ionicons name="call-outline" size={22} color="#6C63FF" />
//           <View className="ml-3 flex-1">
//             <Text className="text-gray-800 font-semibold">Phone Support</Text>
//             <Text className="text-gray-600 text-sm">(555) 123-4567</Text>
//             <Text className="text-gray-600 text-sm">(555) 123-4568</Text>
//             <Text className="text-gray-500 text-xs">Mon–Fri 9AM–6PM EST</Text>
//           </View>
//         </View>

//         <View className="bg-gray-50 rounded-xl p-4 mb-3 flex-row items-center">
//           <Ionicons name="mail-outline" size={22} color="#6C63FF" />
//           <View className="ml-3 flex-1">
//             <Text className="text-gray-800 font-semibold">Email Support</Text>
//             <Text className="text-gray-600 text-sm">support@tutorspool.com</Text>
//             <Text className="text-gray-600 text-sm">help@tutorspool.com</Text>
//             <Text className="text-gray-500 text-xs">24/7 Email Support</Text>
//           </View>
//         </View>

//         <View className="bg-gray-50 rounded-xl p-4 flex-row items-center">
//           <Ionicons name="location-outline" size={22} color="#6C63FF" />
//           <View className="ml-3 flex-1">
//             <Text className="text-gray-800 font-semibold">Office Address</Text>
//             <Text className="text-gray-600 text-sm">
//               123 Education Street, Learning City, LC 12345
//             </Text>
//           </View>
//         </View>
//       </View>
//     </ScrollView>
//   );
// }
import React from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const basePadding = isTablet ? 32 : 24;

export default function ContactScreen() {
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
      {/* Header */}
      <Text className="text-sm text-gray-500 font-medium text-center mb-4 uppercase tracking-wider">
        Get In Touch
      </Text>

      <Text
        className={`text-center font-extrabold text-gray-900 leading-tight ${
          isTablet ? "text-5xl" : "text-4xl"
        } mb-6`}
      >
        Contact Us
      </Text>

      <Text
        className={`text-center text-gray-600 leading-8 mb-12 ${
          isTablet ? "text-xl" : "text-lg"
        } px-4`}
      >
        Have questions or need help? We're here for you. Reach out and our team will get back to you as soon as possible.
      </Text>

      {/* Contact Cards */}
      <View className="space-y-6 mb-16">
        {/* Email Us */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => Linking.openURL("mailto:support@tutorspool.com")}
          className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex-row items-center"
        >
          <View className="w-14 h-14 bg-orange-100 rounded-2xl items-center justify-center mr-5">
            <MaterialIcons name="email" size={28} color="#F97316" />
          </View>
          <View className="flex-1">
            <Text className={`font-bold text-gray-900 ${isTablet ? "text-xl" : "text-lg"}`}>
              Email Us
            </Text>
            <Text className="text-orange-500 text-base mt-1">
              support@tutorspool.com
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              We'll respond within 24 hours
            </Text>
          </View>
        </TouchableOpacity>

        {/* Call Us */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => Linking.openURL("tel:+19243453224")}
          className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex-row items-center"
        >
          <View className="w-14 h-14 bg-orange-100 rounded-2xl items-center justify-center mr-5">
            <MaterialIcons name="phone" size={28} color="#F97316" />
          </View>
          <View className="flex-1">
            <Text className={`font-bold text-gray-900 ${isTablet ? "text-xl" : "text-lg"}`}>
              Call Us
            </Text>
            <Text className="text-orange-500 text-base mt-1">
              +1 (924) 345 3224
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              Mon–Fri, 9am–6pm EST
            </Text>
          </View>
        </TouchableOpacity>

        {/* Visit Us */}
        <View className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex-row items-center">
          <View className="w-14 h-14 bg-orange-100 rounded-2xl items-center justify-center mr-5">
            <MaterialIcons name="location-on" size={28} color="#F97316" />
          </View>
          <View className="flex-1">
            <Text className={`font-bold text-gray-900 ${isTablet ? "text-xl" : "text-lg"}`}>
              Visit Us
            </Text>
            <Text className="text-orange-500 text-base mt-1">
              TutorPool.com Global Platform
            </Text>
          </View>
        </View>

        {/* Business Hours */}
        <View className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex-row items-center">
          <View className="w-14 h-14 bg-orange-100 rounded-2xl items-center justify-center mr-5">
            <MaterialIcons name="access-time" size={28} color="#F97316" />
          </View>
          <View className="flex-1">
            <Text className={`font-bold text-gray-900 ${isTablet ? "text-xl" : "text-lg"}`}>
              Business Hours
            </Text>
            <Text className="text-orange-500 text-base mt-1">
              Mon – Fri: 9am – 6pm
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              Weekend support available
            </Text>
          </View>
        </View>
      </View>

      {/* Send Us a Message Form */}
      <Text
        className={`font-bold text-gray-900 mb-6 ${
          isTablet ? "text-4xl" : "text-3xl"
        }`}
      >
        Send Us a Message
      </Text>

      <Text
        className={`text-gray-600 leading-8 mb-10 ${
          isTablet ? "text-xl" : "text-lg"
        }`}
      >
        Fill out the form below and we'll get back to you shortly
      </Text>

      <View className="space-y-5 mb-12">
        <View>
          <Text className="text-gray-800 font-medium mb-2">Name</Text>
          <TextInput
            className={`border border-gray-300 rounded-2xl px-5 py-4 bg-white ${
              isTablet ? "text-lg" : "text-base"
            }`}
            placeholder="Your name"
          />
        </View>

        <View>
          <Text className="text-gray-800 font-medium mb-2">Email</Text>
          <TextInput
            className={`border border-gray-300 rounded-2xl px-5 py-4 bg-white ${
              isTablet ? "text-lg" : "text-base"
            }`}
            placeholder="you@example.com"
            keyboardType="email-address"
          />
        </View>

        <View>
          <Text className="text-gray-800 font-medium mb-2">Subject</Text>
          <TextInput
            className={`border border-gray-300 rounded-2xl px-5 py-4 bg-white ${
              isTablet ? "text-lg" : "text-base"
            }`}
            placeholder="What's this about?"
          />
        </View>

        <View>
          <Text className="text-gray-800 font-medium mb-2">Message</Text>
          <TextInput
            className={`border border-gray-300 rounded-2xl px-5 py-14 bg-white ${
              isTablet ? "text-lg" : "text-base"
            }`}
            placeholder="Tell us more..."
            multiline
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
  activeOpacity={0.9}
  className="mt-4 self-center"
>
  <LinearGradient
    colors={["#FB923C", "#F97316"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={{
      borderRadius: 50, // fully rounded pill
      paddingVertical: 14,
      paddingHorizontal: 30,
      minWidth: 200,     // optional: minimum width
      alignItems: "center",
    }}
  >
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
      <MaterialIcons
        name="send"
        size={18}
        color="white"
        style={{ marginRight: 8 }}
      />
      <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
        Send Message
      </Text>
    </View>
  </LinearGradient>
</TouchableOpacity>

      </View>

      {/* FAQ Section */}
      <Text
        className={`font-bold text-gray-900 mb-8 ${
          isTablet ? "text-4xl" : "text-3xl"
        }`}
      >
        Frequently Asked Questions
      </Text>

      <View className="space-y-6">
        {[
          {
            question: "How do I find a tutor?",
            answer: "Browse our tutor directory, filter by subject or expertise, view profiles, and book a session directly through our platform.",
          },
          {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards, PayPal, and bank transfers. Payment is processed securely through our platform.",
          },
          {
            question: "Can I become a tutor?",
            answer: "Yes! If you have expertise in a subject and passion for teaching, apply through our Become a Tutor page. We'll review your application within 48 hours.",
          },
          {
            question: "How do online sessions work?",
            answer: "Sessions are conducted via Zoom video conferencing. Once a tutor accepts your booking, you'll receive a meeting link to join at the scheduled time.",
          },
        ].map((faq, index) => (
          <View
            key={index}
            className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100"
          >
            <Text className={`font-bold text-gray-900 mb-3 ${isTablet ? "text-xl" : "text-lg"}`}>
              {faq.question}
            </Text>
            <Text className={`text-gray-600 leading-7 ${isTablet ? "text-lg" : "text-base"}`}>
              {faq.answer}
            </Text>
          </View>
        ))}
      </View>

      {/* Live Chat Support */}
      <View className="mt-16 items-center">
        <View className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 items-center">
          <View className="w-16 h-16 bg-orange-100 rounded-full items-center justify-center mb-6">
            <MaterialIcons name="support-agent" size={36} color="#F97316" />
          </View>
          <Text className={`font-bold text-gray-900 mb-3 text-center ${isTablet ? "text-2xl" : "text-xl"}`}>
            Need More Help?
          </Text>
          <Text className={`text-gray-600 text-center mb-8 ${isTablet ? "text-lg" : "text-base"}`}>
            Our support team is available 24/7 to assist you
          </Text>
          <TouchableOpacity className="mt-4 self-center">
  <LinearGradient
    colors={["#FB923C", "#F97316"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={{
      borderRadius: 50,       // makes it fully pill-shaped
      paddingVertical: 14,    // height
      paddingHorizontal: 30,  // width
      minWidth: 200,          // optional: ensures it’s not too small
      alignItems: "center",
    }}
  >
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
      <MaterialIcons
        name="chat"
        size={18}
        color="white"
        style={{ marginRight: 8 }}
      />
      <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
        Start Live Chat
      </Text>
    </View>
  </LinearGradient>
</TouchableOpacity>

        </View>
      </View>
    </ScrollView>
  );
}