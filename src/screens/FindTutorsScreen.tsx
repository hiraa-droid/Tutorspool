// import React, { useState, useEffect } from "react";
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
//   user?: { name: string };
//   headline?: string;
//   ratingAvg?: number;
//   ratingCount?: number;
//   hourlyRateCents: number;
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

// export default function FindTutorsScreen() {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { toast } = useToast();

//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [minPrice, setMinPrice] = useState<number>(0);
//   const [maxPrice, setMaxPrice] = useState<number>(0);
//   const [rating, setRating] = useState<string>("any");
//   const [activeFilters, setActiveFilters] = useState<Filters>({});
//   const [results, setResults] = useState<Tutor[]>([]);
//   const [total, setTotal] = useState<number>(0);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [loading, setLoading] = useState<boolean>(false);

//   useEffect(() => {
//     const params = (route.params as RouteParams) || {};
//     const { subject, level } = params;
//     if (subject || level) {
//       setSearchQuery(subject || "");
//       setActiveFilters({ subject, level });
//       handleSearch(true);
//     }
//   }, [route.params]);

//   const handleSearch = async (resetPage: boolean = true) => {
//     setLoading(true);
//     const page = resetPage ? 1 : currentPage;
//     try {
//       const params = {
//         q: searchQuery || undefined,
//         priceMin: minPrice > 0 ? minPrice : undefined,
//         priceMax: maxPrice > 0 ? maxPrice : undefined,
//         ratingMin: rating !== "any" ? parseFloat(rating) : undefined,
//         page,
//         limit: 20,
//       };
//       const data: SearchResponse = await apiClient.searchTutors(params);
//       setResults(resetPage ? data.items : [...results, ...data.items]);
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
//     setMaxPrice(0);
//     setRating("any");
//     setActiveFilters({});
//     setResults([]);
//     setTotal(0);
//     setCurrentPage(1);
//     handleSearch(true);
//   };

//   const clearFilter = (filterType: keyof Filters) => {
//     const newFilters = { ...activeFilters };
//     delete newFilters[filterType];
//     setActiveFilters(newFilters);
//     if (filterType === "subject") {
//       setSearchQuery("");
//     }
//     handleSearch(true);
//   };

//   const renderTutor = ({ item }: { item: Tutor }) => (
//     <View className="bg-white p-4 rounded-xl mx-4 my-2 shadow-sm">
//       <Text className="text-lg font-bold text-gray-900">{item.user?.name}</Text>
//       <Text className="text-gray-600">{item.headline}</Text>
//       <View className="flex-row items-center mt-1">
//         <Ionicons name="star" size={16} color="#f97316" />
//         <Text className="ml-1 text-gray-700">
//           {item.ratingAvg?.toFixed(1) || "New"} ({item.ratingCount || 0})
//         </Text>
//       </View>
//       <Text className="text-orange-500 font-medium mt-1">
//         ${(item.hourlyRateCents / 100).toFixed(2)} / hr
//       </Text>
//       <Text className="text-gray-600 mt-1">
//         Subjects: {item.subjects?.join(", ") || "N/A"}
//       </Text>
//       <View className="flex-row justify-between mt-3">
//         <TouchableOpacity
//           className="bg-orange-500 rounded-xl py-2 px-4"
//           onPress={() => {
//             // Navigate to profile - assuming 'TutorProfile' screen exists
//             // navigation.navigate('TutorProfile', { tutorId: item.id });
//           }}
//         >
//           <Text className="text-white font-semibold">View Profile</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           className="bg-blue-500 rounded-xl py-2 px-4"
//           onPress={() => {
//             // Navigate to booking - assuming 'Booking' screen exists
//             // navigation.navigate('Booking', { tutorId: item.id });
//           }}
//         >
//           <Text className="text-white font-semibold">Book Now</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

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
//               Find Your <Text className="text-orange-500">Perfect Tutor</Text>
//             </Text>
//             <Text className="text-center text-gray-600 mb-8 leading-6">
//               Discover experienced tutors who can help you achieve your learning goals.
//             </Text>

//             {/* Active Filters */}
//             {Object.keys(activeFilters).length > 0 && (
//               <View className="mb-6">
//                 <Text className="text-sm font-medium text-gray-700 mb-2">
//                   Active Filters:
//                 </Text>
//                 <View className="flex-row flex-wrap">
//                   {activeFilters.subject && (
//                     <View className="bg-gray-200 rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center">
//                       <Text className="text-gray-700 mr-2">
//                         Subject: {activeFilters.subject}
//                       </Text>
//                       <TouchableOpacity onPress={() => clearFilter("subject")}>
//                         <Ionicons name="close" size={16} color="#777" />
//                       </TouchableOpacity>
//                     </View>
//                   )}
//                   {activeFilters.level && (
//                     <View className="bg-gray-200 rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center">
//                       <Text className="text-gray-700 mr-2">
//                         Level: {activeFilters.level}
//                       </Text>
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
//               <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
//                 🎯 Search Filters
//               </Text>

//               {/* Search Box */}
//               <Text className="text-gray-700 font-semibold mb-2">
//                 Search by name, subject, or expertise
//               </Text>
//               <TextInput
//                 placeholder="Search..."
//                 className="border border-gray-300 rounded-xl p-3 mb-5 bg-gray-50"
//                 value={searchQuery}
//                 onChangeText={setSearchQuery}
//               />

//               {/* Min Price */}
//               <Text className="text-gray-700 font-semibold mb-1">
//                 Min Price ($/hr): {minPrice}
//               </Text>
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
//               <Text className="text-gray-700 font-semibold mb-1 mt-4">
//                 Max Price ($/hr): {maxPrice}
//               </Text>
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
//               <Text className="text-gray-700 font-semibold mt-6 mb-2">
//                 Min Rating
//               </Text>
//               <View className="border border-gray-300 rounded-xl bg-gray-50 overflow-hidden">
//                 <Picker
//                   selectedValue={rating}
//                   onValueChange={(value) => setRating(value)}
//                   style={{ height: 50 }}
//                 >
//                   <Picker.Item label="Any rating" value="any" />
//                   <Picker.Item label="4+ stars" value="4" />
//                   <Picker.Item label="4.5+ stars" value="4.5" />
//                   <Picker.Item label="4.8+ stars" value="4.8" />
//                 </Picker>
//               </View>

//               {/* Buttons */}
//               <View className="mt-6 flex-row justify-between">
//                 <TouchableOpacity
//                   className="flex-1 bg-orange-500 rounded-xl py-3 mr-2"
//                   onPress={() => handleSearch(true)}
//                 >
//                   <Text className="text-center text-white font-bold">
//                     Search Tutors
//                   </Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   className="flex-1 bg-gray-200 rounded-xl py-3 ml-2"
//                   onPress={handleReset}
//                 >
//                   <Text className="text-center text-gray-700 font-semibold">
//                     Reset Filters
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         }
//         ListFooterComponent={() =>
//           loading ? <ActivityIndicator size="large" color="#f97316" /> : null
//         }
//         ListEmptyComponent={() =>
//           !loading ? (
//             <Text className="text-center text-gray-600 mt-8">
//               No tutors found
//             </Text>
//           ) : null
//         }
//         showsVerticalScrollIndicator={false}
//       />
//     </View>
//   );
// }
// import React, { useState, useEffect } from "react";
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
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { toast } = useToast();

//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [minPrice, setMinPrice] = useState<number>(0);
//   const [maxPrice, setMaxPrice] = useState<number>(200); // Updated default to 200
//   const [rating, setRating] = useState<string>("any");
//   const [activeFilters, setActiveFilters] = useState<Filters>({});
//   const [results, setResults] = useState<Tutor[]>([]);
//   const [total, setTotal] = useState<number>(0);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [loading, setLoading] = useState<boolean>(false);

//   // Handle initial search and route params
//   useEffect(() => {
//     const params = (route.params as RouteParams) || {};
//     const { subject, level } = params;
//     if (subject || level) {
//       setSearchQuery(subject || "");
//       setActiveFilters({ subject, level });
//     }
//     // Trigger initial search
//     handleSearch(true);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Trigger search when filters change
//   useEffect(() => {
//     // Only trigger search if minPrice is not greater than maxPrice
//     if (minPrice <= maxPrice) {
//       handleSearch(true);
//     } else {
//       toast({
//         title: "Invalid Price Range",
//         description: "Minimum price cannot exceed maximum price.",
//         variant: "destructive",
//       });
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [searchQuery, minPrice, maxPrice, rating]);

//   const handleSearch = async (resetPage: boolean = true) => {
//     setLoading(true);
//     const page = resetPage ? 1 : currentPage;
//     try {
//       const params = {
//         q: searchQuery || undefined,
//         priceMin: minPrice > 0 ? minPrice : undefined,
//         priceMax: maxPrice > 0 ? maxPrice : undefined,
//         ratingMin: rating !== "any" ? parseFloat(rating) : undefined,
//         page,
//         limit: 20,
//       };
//       const data: SearchResponse = await apiClient.searchTutors(params);
//       setResults(resetPage ? data.items : [...results, ...data.items]);
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
//     // Search will be triggered by useEffect
//   };

//   const clearFilter = (filterType: keyof Filters) => {
//     const newFilters = { ...activeFilters };
//     delete newFilters[filterType];
//     setActiveFilters(newFilters);
//     if (filterType === "subject") {
//       setSearchQuery("");
//     }
//     // Search will be triggered by useEffect
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
//             onPress={() => navigation.navigate('TutorProfile' as any, { tutorId: item.id })}
//           >
//             <Text className="text-white font-semibold">View Profile</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             className="bg-blue-500 rounded-xl py-2 px-4"
//             onPress={() => navigation.navigate('Booking' as any, { tutorId: item.id })}
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
//               Find Your <Text className="text-orange-500">Perfect Tutor</Text>
//             </Text>
//             <Text className="text-center text-gray-600 mb-8 leading-6">
//               Discover experienced tutors who can help you achieve your learning goals.
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
//               <Text className="text-xl font-bold text-gray-800 mb-4 text-center">🎯 Search Filters</Text>

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
//                 <Picker
//                   selectedValue={rating}
//                   onValueChange={(value) => setRating(String(value))}
//                   style={{ height: 50 }}
//                 >
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
//           !loading ? (
//             <Text className="text-center text-gray-600 mt-8">No tutors found</Text>
//           ) : null
//         }
//         showsVerticalScrollIndicator={false}
//       />
//     </View>
//   );
// }
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { apiClient } from "../lib/api";
import { useToast } from "../hooks/use-toast";

// Define types for the tutor and filters
interface Tutor {
  id: string;
  user?: { name?: string };
  headline?: string;
  ratingAvg?: number;
  ratingCount?: number;
  hourlyRateCents?: number;
  subjects?: string[];
}

interface Filters {
  subject?: string;
  level?: string;
}

interface RouteParams {
  subject?: string;
  level?: string;
}

interface SearchResponse {
  items: Tutor[];
  total: number;
}

export default function FindTutorsScreen(){
  // Use `any` for navigation/route to avoid strict type mismatch in examples.
  // You can replace `any` with your project's NavigationProp/RouteProp types.
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0); // Updated default to 200
  const [rating, setRating] = useState<string>("any");
  const [activeFilters, setActiveFilters] = useState<Filters>({});
  const [results, setResults] = useState<Tutor[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Prevent accidental double-search on mount
  const firstRunRef = useRef(true);

  // Handle initial route params (do NOT trigger search here; search runs in the effect below)
  useEffect(() => {
    const params = (route.params as RouteParams) || {};
    const { subject, level } = params;
    if (subject || level) {
      setSearchQuery(subject || "");
      setActiveFilters({ subject, level });
    }
    // no handleSearch here to avoid double-calling (search handled by the effect below)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Trigger search when filters change (or on first mount)
  useEffect(() => {
    // avoid running extra time on the very first render if you want a different behavior.
    // Here we allow the first run to perform a search.
    if (minPrice > maxPrice) {
      toast({
        title: "Invalid Price Range",
        description: "Minimum price cannot exceed maximum price.",
        variant: "destructive",
      });
      return;
    }

    // On first run we want to run search as well, so we don't skip it.
    handleSearch(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, minPrice, maxPrice, rating]);

  const handleSearch = async (resetPage: boolean = true) => {
    // guard: ensure min <= max
    if (minPrice > maxPrice) {
      toast({
        title: "Invalid Price Range",
        description: "Minimum price cannot exceed maximum price.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const page = resetPage ? 1 : currentPage;
    try {
      const params: any = {
        q: searchQuery || undefined,
        priceMin: minPrice > 0 ? minPrice : undefined,
        priceMax: maxPrice > 0 ? maxPrice : undefined,
        ratingMin: rating !== "any" ? parseFloat(rating) : undefined,
        page,
        limit: 20,
      };

      // call your API client (assumes apiClient.searchTutors exists and returns SearchResponse)
      const data: SearchResponse = await apiClient.searchTutors(params);

      setResults((prev) => (resetPage ? data.items : [...prev, ...data.items]));
      setTotal(data.total || 0);
      setCurrentPage(page + 1);
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchQuery("");
    setMinPrice(0);
    setMaxPrice(200);
    setRating("any");
    setActiveFilters({});
    setResults([]);
    setTotal(0);
    setCurrentPage(1);
    // search will be triggered by the search effect (searchQuery/minPrice/... change)
  };

  const clearFilter = (filterType: keyof Filters) => {
    const newFilters = { ...activeFilters };
    delete newFilters[filterType];
    setActiveFilters(newFilters);
    if (filterType === "subject") {
      setSearchQuery("");
    }
    // search will be triggered by useEffect
  };

  const renderTutor = ({ item }: { item: Tutor }) => {
    const hourly = ((item.hourlyRateCents ?? 0) / 100).toFixed(2);
    return (
      <View className="bg-white p-4 rounded-xl mx-4 my-2 shadow-sm">
        <Text className="text-lg font-bold text-gray-900">{item.user?.name ?? "Tutor"}</Text>
        <Text className="text-gray-600">{item.headline ?? ""}</Text>

        <View className="flex-row items-center mt-1">
          <Ionicons name="star" size={16} color="#f97316" />
          <Text className="ml-1 text-gray-700">
            {item.ratingAvg !== undefined ? item.ratingAvg.toFixed(1) : "New"} ({item.ratingCount ?? 0})
          </Text>
        </View>

        <Text className="text-orange-500 font-medium mt-1">${hourly} / hr</Text>

        <Text className="text-gray-600 mt-1">
          Subjects: {item.subjects && item.subjects.length ? item.subjects.join(", ") : "N/A"}
        </Text>

        <View className="flex-row justify-between mt-3">
          <TouchableOpacity
            className="bg-orange-500 rounded-xl py-2 px-4"
            onPress={() => navigation.navigate("TutorProfile", { tutorId: item.id })}
          >
            <Text className="text-white font-semibold">View Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-blue-500 rounded-xl py-2 px-4"
            onPress={() => navigation.navigate("Booking", { tutorId: item.id })}
          >
            <Text className="text-white font-semibold">Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={results}
        renderItem={renderTutor}
        keyExtractor={(item) => item.id}
        onEndReached={() => {
          if (!loading && results.length < total) {
            handleSearch(false);
          }
        }}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <View className="px-6 pt-10 pb-4">
            {/* Header */}
            <Text className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
              Find Your <Text className="text-orange-500">Perfect Tutor</Text>
            </Text>
            <Text className="text-center text-gray-600 mb-8 leading-6">
              Discover experienced tutors who can help you achieve your learning goals.
            </Text>

            {/* Active Filters */}
            {Object.keys(activeFilters).length > 0 && (
              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-700 mb-2">Active Filters:</Text>
                <View className="flex-row flex-wrap">
                  {activeFilters.subject && (
                    <View className="bg-gray-200 rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center">
                      <Text className="text-gray-700 mr-2">Subject: {activeFilters.subject}</Text>
                      <TouchableOpacity onPress={() => clearFilter("subject")}>
                        <Ionicons name="close" size={16} color="#777" />
                      </TouchableOpacity>
                    </View>
                  )}
                  {activeFilters.level && (
                    <View className="bg-gray-200 rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center">
                      <Text className="text-gray-700 mr-2">Level: {activeFilters.level}</Text>
                      <TouchableOpacity onPress={() => clearFilter("level")}>
                        <Ionicons name="close" size={16} color="#777" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Filters Section */}
            <View className="bg-white p-5 rounded-2xl shadow-sm mb-8">
              <Text className="text-xl font-bold text-gray-800 mb-4 text-center">🎯 Search Filters</Text>

              {/* Search Box */}
              <Text className="text-gray-700 font-semibold mb-2">Search by name, subject, or expertise</Text>
              <TextInput
                placeholder="Search..."
                className="border border-gray-300 rounded-xl p-3 mb-5 bg-gray-50"
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
              />

              {/* Min Price */}
              <Text className="text-gray-700 font-semibold mb-1">Min Price ($/hr): {minPrice}</Text>
              <Slider
                style={{ width: "100%", height: 40 }}
                minimumValue={0}
                maximumValue={100}
                step={1}
                minimumTrackTintColor="#f97316"
                maximumTrackTintColor="#ddd"
                thumbTintColor="#f97316"
                value={minPrice}
                onValueChange={(value) => setMinPrice(value)}
              />

              {/* Max Price */}
              <Text className="text-gray-700 font-semibold mb-1 mt-4">Max Price ($/hr): {maxPrice}</Text>
              <Slider
                style={{ width: "100%", height: 40 }}
                minimumValue={0}
                maximumValue={200}
                step={1}
                minimumTrackTintColor="#f97316"
                maximumTrackTintColor="#ddd"
                thumbTintColor="#f97316"
                value={maxPrice}
                onValueChange={(value) => setMaxPrice(value)}
              />

              {/* Rating */}
              <Text className="text-gray-700 font-semibold mt-6 mb-2">Min Rating</Text>
              <View className="border border-gray-300 rounded-xl bg-gray-50 overflow-hidden">
                <Picker selectedValue={rating} onValueChange={(value) => setRating(String(value))} style={{ height: 50 }}>
                  <Picker.Item label="Any rating" value="any" />
                  <Picker.Item label="4+ stars" value="4" />
                  <Picker.Item label="4.5+ stars" value="4.5" />
                  <Picker.Item label="4.8+ stars" value="4.8" />
                </Picker>
              </View>

              {/* Reset Button */}
              <View className="mt-6">
                <TouchableOpacity className="bg-gray-200 rounded-xl py-3" onPress={handleReset}>
                  <Text className="text-center text-gray-700 font-semibold">Reset Filters</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        }
        ListFooterComponent={() => (loading ? <ActivityIndicator size="large" color="#f97316" /> : null)}
        ListEmptyComponent={() =>
          !loading ? <Text className="text-center text-gray-600 mt-8">No tutors found</Text> : null
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
