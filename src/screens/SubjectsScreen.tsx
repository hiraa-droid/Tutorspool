import React from "react";
import { View, Text, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const subjects = [
  { name: "Mathematics", tutors: 247, topics: "Algebra, Calculus, Geometry, Statistics" },
  { name: "Physics", tutors: 156, topics: "Mechanics, Thermodynamics, Quantum Physics" },
  { name: "Chemistry", tutors: 134, topics: "Organic, Inorganic, Physical Chemistry" },
  { name: "Biology", tutors: 103, topics: "Genetics, Anatomy, Ecology, Microbiology" },
  { name: "English", tutors: 202, topics: "Grammar, Writing, Literature, Speaking" },
  { name: "Computer Science", tutors: 185, topics: "Programming, AI, Data Structures" },
];

export default function SubjectsScreen() {
  return (
    <View className="flex-1 bg-gray-50 px-5 pt-10">
      <Text className="text-2xl font-extrabold text-gray-900 text-center mb-2">
        Expert <Text className="text-purple-700">Tutoring</Text> in Every Subject
      </Text>
      <Text className="text-center text-gray-600 mb-6">
        Find the perfect tutor for any subject, any level, anytime you need help.
      </Text>

      <FlatList
        data={subjects}
        keyExtractor={(item) => item.name}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 15 }}
        renderItem={({ item }) => (
          <View className="bg-white w-[48%] rounded-2xl p-4 shadow-sm">
            <View className="flex-row items-center mb-2">
              <Ionicons name="book-outline" size={22} color="#6C63FF" />
              <Text className="text-lg font-bold text-gray-900 ml-2">
                {item.name}
              </Text>
            </View>
            <Text className="text-gray-500 text-sm mb-1">
              ⭐ {item.tutors} Expert Tutors
            </Text>
            <Text className="text-gray-600 text-sm">{item.topics}</Text>
          </View>
        )}
      />
    </View>
  );
}