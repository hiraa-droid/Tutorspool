import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getTutors, TutorProfile } from "../lib/firestore";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const basePadding = isTablet ? 32 : 24;

export default function FindTutorsScreen() {
  const navigation = useNavigation<any>();

  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [filteredTutors, setFilteredTutors] = useState<TutorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");

  const subjects = [
    "All Subjects",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "Programming",
    "Languages",
    "Music",
    "Arts",
  ];

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    setLoading(true);
    try {
      const data = await getTutors();
      setTutors(data);
      setFilteredTutors(data);
    } catch (err) {
      console.error("Error loading tutors:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  useEffect(() => {
    let result = tutors;

    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (tutor) =>
          tutor.fullName.toLowerCase().includes(lowerQuery) ||
          tutor.subjects.some((s) => s.toLowerCase().includes(lowerQuery))
      );
    }

    if (selectedSubject !== "All Subjects") {
      result = result.filter((tutor) =>
        tutor.subjects.some((s) => s.toLowerCase() === selectedSubject.toLowerCase())
      );
    }

    setFilteredTutors(result);
  }, [searchQuery, selectedSubject, tutors]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderTutor = ({ item }: { item: TutorProfile }) => (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={() => navigation.navigate("TutorProfile", { tutorId: item.uid })}
      className="bg-white rounded-3xl p-6 mb-6 shadow-xl border border-gray-100 mx-4"
    >
      <View className="flex-row items-start">
        {/* Avatar - Same style as TutorProfileScreen */}
        {item.photoURL ? (
          <Image
            source={{ uri: item.photoURL }}
            className="w-20 h-20 rounded-full mr-5 shadow-md border-4 border-white"
          />
        ) : (
          <View className="w-20 h-20 bg-orange-500 rounded-full items-center justify-center mr-5 shadow-md">
            <Text className="text-2xl font-bold text-white">
              {getInitials(item.fullName)}
            </Text>
          </View>
        )}

        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-900">{item.fullName}</Text>

          {/* Rating */}
          <View className="flex-row items-center mt-1">
            <MaterialIcons name="star" size={20} color="#F97316" />
            <Text className="ml-1 text-gray-700 font-medium">
              4.9 <Text className="text-gray-500">(23 reviews)</Text>
            </Text>
          </View>

          {/* Subjects */}
          <View className="flex-row flex-wrap mt-3 gap-2">
            {item.subjects.slice(0, 3).map((sub) => (
              <View key={sub} className="bg-orange-100 px-3 py-1 rounded-full">
                <Text className="text-orange-700 text-sm font-medium">{sub}</Text>
              </View>
            ))}
            {item.subjects.length > 3 && (
              <Text className="text-gray-500 text-sm">
                +{item.subjects.length - 3} more
              </Text>
            )}
          </View>

          {/* Bio preview */}
          <Text
            className="text-gray-600 mt-3 line-clamp-2"
            numberOfLines={2}
          >
            {item.bio ||
              "Passionate tutor dedicated to helping students reach their full potential."}
          </Text>

          {/* Price & Experience */}
          <View className="flex-row justify-between items-center mt-4">
            <View>
              <Text className="text-gray-600 text-sm">Experience</Text>
              <Text className="font-semibold text-gray-900">
                {item.experience || "2+ years"}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-gray-600 text-sm">Hourly Rate</Text>
              <Text className="text-2xl font-bold text-orange-500">
                ${item.hourlyRate || 30}
                <Text className="text-sm text-gray-600">/hr</Text>
              </Text>
            </View>
          </View>

          {/* Buttons */}
          <View className="flex-row gap-3 mt-5">
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("TutorProfile", { tutorId: item.uid })
              }
              className="flex-1 border border-orange-500 rounded-full py-3"
            >
              <Text className="text-orange-500 text-center font-bold">
                View Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Booking", { tutorId: item.uid })
              }
              className="flex-1"
            >
              <LinearGradient
                colors={["#FB923C", "#F97316"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="rounded-full py-3"
              >
                <Text className="text-white text-center font-bold">
                  Book Now →
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={filteredTutors}
        renderItem={renderTutor}
        keyExtractor={(item) => item.uid}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={{ paddingHorizontal: basePadding }} className="pt-12 pb-8">
            {/* Hero */}
            <Text className="text-sm text-gray-500 font-medium text-center mb-4 uppercase tracking-wider">
              {tutors.length}+ Verified Tutors
            </Text>

            <Text
              className={`text-center font-extrabold text-gray-900 leading-tight ${
                isTablet ? "text-5xl" : "text-4xl"
              } mb-6`}
            >
              Find Your Perfect{" "}
              <Text className="text-orange-500">Tutor</Text>
            </Text>

            <Text
              className={`text-center text-gray-600 leading-7 mb-10 ${
                isTablet ? "text-xl" : "text-lg"
              }`}
            >
              Browse our community of expert tutors and find the perfect match
              for your learning journey.
            </Text>

            {/* Search & Subject Filter */}
            <View className="space-y-5">
              {/* Search */}
              <View className="relative">
                <MaterialIcons
                  name="search"
                  size={24}
                  color="#9CA3AF"
                  style={{ position: "absolute", left: 16, top: 16, zIndex: 1 }}
                />
                <TextInput
                  placeholder="Search by name or subject..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  className="bg-gray-100 rounded-2xl pl-14 pr-5 py-4 text-base"
                />
              </View>

              {/* Subject Filter */}
              <View>
                <Text className="text-gray-700 font-medium mb-2">
                  Filter by Subject
                </Text>
                <View className="flex-row flex-wrap gap-3">
                  {subjects.map((sub) => (
                    <TouchableOpacity
                      key={sub}
                      onPress={() => setSelectedSubject(sub)}
                      className={`px-5 py-3 rounded-full ${
                        selectedSubject === sub
                          ? "bg-orange-500"
                          : "bg-gray-100 border border-gray-300"
                      }`}
                    >
                      <Text
                        className={`font-medium ${
                          selectedSubject === sub
                            ? "text-white"
                            : "text-gray-700"
                        }`}
                      >
                        {sub}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          loading ? null : (
            <View className="items-center py-20">
              <MaterialIcons name="search-off" size={64} color="#D1D5DB" />
              <Text className="text-gray-500 mt-4 text-lg">
                No tutors found
              </Text>
              <Text className="text-gray-400 text-center mt-2 px-10">
                Try adjusting your search or filters
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          loading ? (
            <ActivityIndicator
              size="large"
              color="#F97316"
              style={{ marginVertical: 40 }}
            />
          ) : null
        }
      />
    </View>
  );
}