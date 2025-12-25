// import React, { useEffect, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   ActivityIndicator,
// } from "react-native";
// import Slider from "@react-native-community/slider";
// import { Picker } from "@react-native-picker/picker";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import { apiClient } from "../lib/api";
// import { useToast } from "../hooks/use-toast";

// // Define types for the tutor and filters
// interface Tutor {
//   id: string;
//   user?: { name?: string };
//   headline?: string;
//   ratingAvg?: number;
//   ratingCount?: number;
//   hourlyRateCents?: number;
//   subjects?: string[];
// }

// interface Filters {
//   subject?: string;
//   level?: string;
// }

// interface RouteParams {
//   subject?: string;
//   level?: string;
// }

// interface SearchResponse {
//   items: Tutor[];
//   total: number;
// }

// export default function FindTutorsScreen(){
//   // Use `any` for navigation/route to avoid strict type mismatch in examples.
//   // You can replace `any` with your project's NavigationProp/RouteProp types.
//   const navigation = useNavigation<any>();
//   const route = useRoute<any>();
//   const { toast } = useToast();

//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [minPrice, setMinPrice] = useState<number>(0);
//   const [maxPrice, setMaxPrice] = useState<number>(0); // Updated default to 200
//   const [rating, setRating] = useState<string>("any");
//   const [activeFilters, setActiveFilters] = useState<Filters>({});
//   const [results, setResults] = useState<Tutor[]>([]);
//   const [total, setTotal] = useState<number>(0);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [loading, setLoading] = useState<boolean>(false);

//   // Prevent accidental double-search on mount
//   const firstRunRef = useRef(true);

//   // Handle initial route params (do NOT trigger search here; search runs in the effect below)
//   useEffect(() => {
//     const params = (route.params as RouteParams) || {};
//     const { subject, level } = params;
//     if (subject || level) {
//       setSearchQuery(subject || "");
//       setActiveFilters({ subject, level });
//     }
//     // no handleSearch here to avoid double-calling (search handled by the effect below)
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Trigger search when filters change (or on first mount)
//   useEffect(() => {
//     // avoid running extra time on the very first render if you want a different behavior.
//     // Here we allow the first run to perform a search.
//     if (minPrice > maxPrice) {
//       toast({
//         title: "Invalid Price Range",
//         description: "Minimum price cannot exceed maximum price.",
//         variant: "destructive",
//       });
//       return;
//     }

//     // On first run we want to run search as well, so we don't skip it.
//     handleSearch(true);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [searchQuery, minPrice, maxPrice, rating]);

//   const handleSearch = async (resetPage: boolean = true) => {
//     // guard: ensure min <= max
//     if (minPrice > maxPrice) {
//       toast({
//         title: "Invalid Price Range",
//         description: "Minimum price cannot exceed maximum price.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setLoading(true);
//     const page = resetPage ? 1 : currentPage;
//     try {
//       const params: any = {
//         q: searchQuery || undefined,
//         priceMin: minPrice > 0 ? minPrice : undefined,
//         priceMax: maxPrice > 0 ? maxPrice : undefined,
//         ratingMin: rating !== "any" ? parseFloat(rating) : undefined,
//         page,
//         limit: 20,
//       };

//       // call your API client (assumes apiClient.searchTutors exists and returns SearchResponse)
//       const data: SearchResponse = await apiClient.searchTutors(params);

//       setResults((prev) => (resetPage ? data.items : [...prev, ...data.items]));
//       setTotal(data.total || 0);
//       setCurrentPage(page + 1);
//     } catch (error) {
//       toast({
//         title: "Search Failed",
//         description: "Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReset = () => {
//     setSearchQuery("");
//     setMinPrice(0);
//     setMaxPrice(200);
//     setRating("any");
//     setActiveFilters({});
//     setResults([]);
//     setTotal(0);
//     setCurrentPage(1);
//     // search will be triggered by the search effect (searchQuery/minPrice/... change)
//   };

//   const clearFilter = (filterType: keyof Filters) => {
//     const newFilters = { ...activeFilters };
//     delete newFilters[filterType];
//     setActiveFilters(newFilters);
//     if (filterType === "subject") {
//       setSearchQuery("");
//     }
//     // search will be triggered by useEffect
//   };

//   const renderTutor = ({ item }: { item: Tutor }) => {
//     const hourly = ((item.hourlyRateCents ?? 0) / 100).toFixed(2);
//     return (
//       <View className="bg-white p-4 rounded-xl mx-4 my-2 shadow-sm">
//         <Text className="text-lg font-bold text-gray-900">{item.user?.name ?? "Tutor"}</Text>
//         <Text className="text-gray-600">{item.headline ?? ""}</Text>

//         <View className="flex-row items-center mt-1">
//           <Ionicons name="star" size={16} color="#f97316" />
//           <Text className="ml-1 text-gray-700">
//             {item.ratingAvg !== undefined ? item.ratingAvg.toFixed(1) : "New"} ({item.ratingCount ?? 0})
//           </Text>
//         </View>

//         <Text className="text-orange-500 font-medium mt-1">${hourly} / hr</Text>

//         <Text className="text-gray-600 mt-1">
//           Subjects: {item.subjects && item.subjects.length ? item.subjects.join(", ") : "N/A"}
//         </Text>

//         <View className="flex-row justify-between mt-3">
//           <TouchableOpacity
//             className="bg-orange-500 rounded-xl py-2 px-4"
//             onPress={() => navigation.navigate("TutorProfile", { tutorId: item.id })}
//           >
//             <Text className="text-white font-semibold">View Profile</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             className="bg-blue-500 rounded-xl py-2 px-4"
//             onPress={() => navigation.navigate("Booking", { tutorId: item.id })}
//           >
//             <Text className="text-white font-semibold">Book Now</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View className="flex-1 bg-gray-50">
//       <FlatList
//         data={results}
//         renderItem={renderTutor}
//         keyExtractor={(item) => item.id}
//         onEndReached={() => {
//           if (!loading && results.length < total) {
//             handleSearch(false);
//           }
//         }}
//         onEndReachedThreshold={0.5}
//         ListHeaderComponent={
//           <View className="px-6 pt-10 pb-4">
//             {/* Header */}
//             <Text className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
//               Find Your Perfect<Text className="text-orange-500"> Tutor</Text>
//             </Text>
//             <Text className="text-center text-gray-600 mb-8 leading-6">
//             Browse our community of expert tutors and find the perfect match for your learning journey.
//             </Text>

//             {/* Active Filters */}
//             {Object.keys(activeFilters).length > 0 && (
//               <View className="mb-6">
//                 <Text className="text-sm font-medium text-gray-700 mb-2">Active Filters:</Text>
//                 <View className="flex-row flex-wrap">
//                   {activeFilters.subject && (
//                     <View className="bg-gray-200 rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center">
//                       <Text className="text-gray-700 mr-2">Subject: {activeFilters.subject}</Text>
//                       <TouchableOpacity onPress={() => clearFilter("subject")}>
//                         <Ionicons name="close" size={16} color="#777" />
//                       </TouchableOpacity>
//                     </View>
//                   )}
//                   {activeFilters.level && (
//                     <View className="bg-gray-200 rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center">
//                       <Text className="text-gray-700 mr-2">Level: {activeFilters.level}</Text>
//                       <TouchableOpacity onPress={() => clearFilter("level")}>
//                         <Ionicons name="close" size={16} color="#777" />
//                       </TouchableOpacity>
//                     </View>
//                   )}
//                 </View>
//               </View>
//             )}

//             {/* Filters Section */}
//             <View className="bg-white p-5 rounded-2xl shadow-sm mb-8">
//               <Text className="text-xl font-bold text-gray-800 mb-4 text-center">Search Filters</Text>

//               {/* Search Box */}
//               <Text className="text-gray-700 font-semibold mb-2">Search by name, subject, or expertise</Text>
//               <TextInput
//                 placeholder="Search..."
//                 className="border border-gray-300 rounded-xl p-3 mb-5 bg-gray-50"
//                 value={searchQuery}
//                 onChangeText={setSearchQuery}
//                 returnKeyType="search"
//               />

//               {/* Min Price */}
//               <Text className="text-gray-700 font-semibold mb-1">Min Price ($/hr): {minPrice}</Text>
//               <Slider
//                 style={{ width: "100%", height: 40 }}
//                 minimumValue={0}
//                 maximumValue={100}
//                 step={1}
//                 minimumTrackTintColor="#f97316"
//                 maximumTrackTintColor="#ddd"
//                 thumbTintColor="#f97316"
//                 value={minPrice}
//                 onValueChange={(value) => setMinPrice(value)}
//               />

//               {/* Max Price */}
//               <Text className="text-gray-700 font-semibold mb-1 mt-4">Max Price ($/hr): {maxPrice}</Text>
//               <Slider
//                 style={{ width: "100%", height: 40 }}
//                 minimumValue={0}
//                 maximumValue={200}
//                 step={1}
//                 minimumTrackTintColor="#f97316"
//                 maximumTrackTintColor="#ddd"
//                 thumbTintColor="#f97316"
//                 value={maxPrice}
//                 onValueChange={(value) => setMaxPrice(value)}
//               />

//               {/* Rating */}
//               <Text className="text-gray-700 font-semibold mt-6 mb-2">Min Rating</Text>
//               <View className="border border-gray-300 rounded-xl bg-gray-50 overflow-hidden">
//                 <Picker selectedValue={rating} onValueChange={(value) => setRating(String(value))} style={{ height: 50 }}>
//                   <Picker.Item label="Any rating" value="any" />
//                   <Picker.Item label="4+ stars" value="4" />
//                   <Picker.Item label="4.5+ stars" value="4.5" />
//                   <Picker.Item label="4.8+ stars" value="4.8" />
//                 </Picker>
//               </View>

//               {/* Reset Button */}
//               <View className="mt-6">
//                 <TouchableOpacity className="bg-gray-200 rounded-xl py-3" onPress={handleReset}>
//                   <Text className="text-center text-gray-700 font-semibold">Reset Filters</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         }
//         ListFooterComponent={() => (loading ? <ActivityIndicator size="large" color="#f97316" /> : null)}
//         ListEmptyComponent={() =>
//           !loading ? <Text className="text-center text-gray-600 mt-8">No tutors found</Text> : null
//         }
//         showsVerticalScrollIndicator={false}
//       />
//     </View>
//   );
// }

// screens/FindTutorsScreen.tsx
// screens/FindTutorsScreen.tsx (Updated with Avatar Images)
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