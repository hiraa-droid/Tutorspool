import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const basePadding = isTablet ? 32 : 24;

const subjects = [
  {
    category: "Mathematics",
    icon: "calculate",
    color: "#3B82F6",
    subjects: ["Algebra", "Calculus", "Geometry", "Statistics", "Trigonometry", "Linear Algebra"],
    tutorCount: 247
  },
  {
    category: "Sciences",
    icon: "science",
    color: "#10B981",
    subjects: ["Physics", "Chemistry", "Biology", "Environmental Science", "Astronomy"],
    tutorCount: 156
  },
  {
    category: "Languages",
    icon: "language",
    color: "#8B5CF6",
    subjects: ["English", "Spanish", "French", "German", "Mandarin", "Japanese"],
    tutorCount: 202
  },
  {
    category: "Humanities",
    icon: "book",
    color: "#F59E0B",
    subjects: ["History", "Literature", "Philosophy", "Psychology", "Sociology"],
    tutorCount: 134
  },
  {
    category: "Programming",
    icon: "code",
    color: "#06B6D4",
    subjects: ["Python", "JavaScript", "Java", "C++", "Web Development", "Data Science"],
    tutorCount: 185
  },
  {
    category: "Arts",
    icon: "palette",
    color: "#EC4899",
    subjects: ["Drawing", "Painting", "Digital Art", "Photography", "Graphic Design"],
    tutorCount: 103
  },
  {
    category: "Music",
    icon: "music-note",
    color: "#F97316",
    subjects: ["Piano", "Guitar", "Violin", "Voice", "Music Theory", "Drums"],
    tutorCount: 134
  },
  {
    category: "Test Prep",
    icon: "school",
    color: "#EF4444",
    subjects: ["SAT", "ACT", "GRE", "GMAT", "TOEFL", "IELTS"],
    tutorCount: 202
  }
];

export default function SubjectsScreen() {
  const navigation = useNavigation<any>();

  const renderSubject = ({ item }: { item: typeof subjects[0] }) => (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={() => navigation.navigate("Find Tutors")}
      className="bg-white rounded-3xl p-6 mb-6 shadow-xl border border-gray-100"
    >
      {/* Category Icon */}
      <View className="w-16 h-16 rounded-2xl items-center justify-center mb-5" 
            style={{ backgroundColor: `${item.color}10` }}>
        <MaterialIcons name={item.icon as any} size={28} color={item.color} />
      </View>

      {/* Category Title & Tutor Count */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className={`text-2xl font-extrabold ${isTablet ? "text-3xl" : "text-2xl"} text-gray-900`}>
          {item.category}
        </Text>
        <View className="bg-orange-100 px-3 py-1 rounded-full">
          <Text className="text-orange-600 font-bold text-base">
            {item.tutorCount} tutors
          </Text>
        </View>
      </View>

      <Text className="text-gray-600 mb-5 text-base">
        Expert tutors available for all levels
      </Text>

      {/* Sub-subjects */}
      <View className="flex-row flex-wrap gap-2 mb-6">
        {item.subjects.slice(0, 4).map((subject) => (
          <View key={subject} className="bg-gray-100 px-4 py-2 rounded-full">
            <Text className="text-gray-700 text-sm font-medium">{subject}</Text>
          </View>
        ))}
        {item.subjects.length > 4 && (
          <View className="bg-gray-100 px-4 py-2 rounded-full">
            <Text className="text-gray-700 text-sm font-medium">
              +{item.subjects.length - 4} more
            </Text>
          </View>
        )}
      </View>

      {/* Find Tutors Button */}
      <TouchableOpacity 
            onPress={() => navigation.navigate("Find Tutors")}

      className="w-full">
        <LinearGradient
          colors={["#FB923C", "#F97316"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="rounded-full py-4 shadow-xl"
        >
          <Text className="text-white text-center font-bold text-lg">
            Find Tutors →
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={subjects}
        renderItem={renderSubject}
        keyExtractor={(item) => item.category}
        numColumns={1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: basePadding, paddingTop: 60, paddingBottom: 80 }}
        ListHeaderComponent={
          <View className="items-center mb-16 px-4">
            {/* Hero Badge */}
            <View className="bg-green-100 px-5 py-2 rounded-full mb-6">
              <Text className="text-green-800 font-semibold text-base">
                <MaterialIcons name="school" size={18} color="#059669" className="mr-2" />
                50+ Subjects Available
              </Text>
            </View>

            {/* Hero Title */}
            <Text
              className={`text-center font-extrabold text-gray-900 leading-tight ${
                isTablet ? "text-5xl" : "text-4xl"
              } mb-6`}
            >
              Explore Our{" "}
              <Text className="text-orange-500">Subjects</Text>
            </Text>

            {/* Hero Subtitle */}
            <Text
              className={`text-center text-gray-600 leading-7 px-8 ${
                isTablet ? "text-xl" : "text-lg"
              }`}
            >
              From mathematics to music, find expert tutors in any subject. 
              Our verified educators are ready to help you achieve your learning goals.
            </Text>
          </View>
        }
        ListFooterComponent={
          <View className="items-center px-8 mb-20">
            <Text className={`text-3xl font-bold text-gray-900 mb-4 text-center ${isTablet ? "text-4xl" : "text-3xl"}`}>
              Can't find your subject?
            </Text>
            <Text className="text-gray-600 mb-8 text-center px-6 leading-7 text-lg">
              We're always adding new subjects and tutors. Let us know what you're looking for!
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Contact")}
              className="bg-gray-900 rounded-full py-5 px-12 shadow-2xl"
            >
              <Text className="text-white text-xl font-bold">Contact Us</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}