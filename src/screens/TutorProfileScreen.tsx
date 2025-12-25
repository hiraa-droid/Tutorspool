// import React, { useEffect, useState } from 'react';
// import {
//   SafeAreaView,
//   View,
//   Text,
//   Image,
//   ScrollView,
//   Pressable,
//   ActivityIndicator,
//   FlatList,
//   StyleSheet,
//   Dimensions,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { TabsProvider, Tabs, TabScreen } from 'react-native-paper-tabs';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { apiClient } from '../lib/api';
// import { useToast } from '../hooks/use-toast';
// import { Badge } from 'react-native-paper';

// const DEVICE_WIDTH = Dimensions.get('window').width;

// interface Tutor {
//   id: string;
//   user?: { name?: string; avatarUrl?: string; country?: string };
//   headline?: string;
//   bio?: string;
//   hourlyRateCents?: number;
//   currency?: string;
//   yearsExperience?: number;
//   subjects?: string[];
//   levels?: string[];
//   ratingAvg?: number;
//   ratingCount?: number;
//   availabilityBlocks?: Array<{
//     dayOfWeek: number;
//     startTimeUTC: string;
//     endTimeUTC: string;
//     isRecurring: boolean;
//   }>;
//   inPersonLocation?: {
//     enabled: boolean;
//     address?: string;
//     city?: string;
//     state?: string;
//     country?: string;
//     zipCode?: string;
//     meetingPoint?: string;
//     additionalInfo?: string;
//   };
// }

// interface Review {
//   id: string;
//   rating: number;
//   comment?: string;
//   createdAt: string;
//   studentName?: string;
// }

// export default function TutorProfileScreen() {
//   const route = useRoute();
//   const { tutorId } = route.params as { tutorId: string };
//   const navigation = useNavigation<any>();
//   const { toast } = useToast();

//   const [tutor, setTutor] = useState<Tutor | null>(null);
//   const [reviews, setReviews] = useState<Review[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     fetchTutorData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [tutorId]);

//   const fetchTutorData = async () => {
//     setLoading(true);
//     try {
//       const tutorData = await apiClient.getTutorProfile(tutorId);
//       setTutor(tutorData);

//       const reviewsData = await apiClient.getTutorReviews(tutorId);
//       setReviews(reviewsData.reviews || []);
//     } catch (err) {
//       setError('Failed to load tutor profile');
//       toast({ title: 'Error', description: 'Failed to load tutor profile', variant: 'destructive' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatPrice = (cents?: number, currency = '$') => {
//     const val = (cents || 0) / 100;
//     // simple formatting — good fallback on RN
//     return `${currency}${val.toFixed(2)}`;
//   };

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.centered}>
//         <ActivityIndicator size="large" />
//         <Text style={styles.loadingText}>Loading tutor profile…</Text>
//       </SafeAreaView>
//     );
//   }

//   if (error || !tutor) {
//     return (
//       <SafeAreaView style={styles.centered}>
//         <Ionicons name="alert-circle" size={56} color="#e11d48" />
//         <Text style={styles.errorTitle}>Tutor Not Found</Text>
//         <Text style={styles.errorSubtitle}>The tutor you're looking for doesn't exist or has been removed.</Text>
//         <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
//           <Text style={styles.backButtonText}>Back to Search</Text>
//         </Pressable>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <TabsProvider defaultIndex={0}>
//       <SafeAreaView style={styles.container}>
//         {/* Header */}
//         <View style={styles.headerCard}>
//           <Image
//             source={{ uri: tutor.user?.avatarUrl || 'https://via.placeholder.com/150' }}
//             style={styles.avatar}
//           />

//           <View style={styles.headerInfo}>
//             <Text numberOfLines={1} style={styles.nameText}>
//               {tutor.user?.name || 'Anonymous Tutor'}
//             </Text>
//             <Text numberOfLines={1} style={styles.headlineText}>
//               {tutor.headline || 'Professional Tutor'}
//             </Text>

//             <View style={styles.ratingRow}>
//               <Ionicons name="star" size={16} color="#f97316" />
//               <Text style={styles.ratingText}>
//                 {(tutor.ratingAvg || 0).toFixed(1)} ({tutor.ratingCount || 0})
//               </Text>
//             </View>

//             <View style={styles.priceBadge}>
//               <Text style={styles.priceText}>{formatPrice(tutor.hourlyRateCents)}</Text>
//               <Text style={styles.rateSub}> / hr</Text>
//             </View>
//           </View>
//         </View>

//         <View style={styles.buttonRow}>
//           <Pressable
//             style={[styles.primaryButton, styles.flexGrow]}
//             onPress={() => navigation.navigate('Booking', { tutorId: tutor.id })}
//             accessibilityLabel="Book session"
//           >
//             <Text style={styles.primaryButtonText}>Book Session</Text>
//           </Pressable>

//           <Pressable
//             style={[styles.secondaryButton, styles.ml8]}
//             onPress={() => toast({ title: 'Contact', description: 'Messaging coming soon' })}
//             accessibilityLabel="Contact tutor"
//           >
//             <Text style={styles.secondaryButtonText}>Contact</Text>
//           </Pressable>
//         </View>

//         {/* Tabs */}
//         <Tabs style={styles.tabsContainer}>
//           <TabScreen label="Overview" icon="information">
//             <ScrollView contentContainerStyle={styles.contentContainer}>
//               <Text style={styles.sectionTitle}>Bio</Text>
//               <Text style={styles.paragraph}>{tutor.bio || 'No bio available'}</Text>

//               <Text style={styles.sectionTitle}>Experience</Text>
//               <Text style={styles.paragraph}>{tutor.yearsExperience || 0} years</Text>

//               <Text style={styles.sectionTitle}>Location</Text>
//               <Text style={styles.paragraph}>{tutor.user?.country || 'Online'}</Text>
//             </ScrollView>
//           </TabScreen>

//           <TabScreen label="Subjects" icon="book">
//             <FlatList
//               data={tutor.subjects || []}
//               keyExtractor={(item) => item}
//               contentContainerStyle={styles.listContainer}
//               ListEmptyComponent={<Text style={styles.emptyText}>No subjects listed</Text>}
//               renderItem={({ item }) => (
//                 <View style={styles.subjectChip}>
//                   <Text style={styles.subjectText}>{item}</Text>
//                 </View>
//               )}
//             />
//           </TabScreen>

//           <TabScreen label="Reviews" icon="star-outline">
//             <FlatList
//               data={reviews}
//               keyExtractor={(item) => item.id}
//               contentContainerStyle={styles.listContainer}
//               ListEmptyComponent={<Text style={styles.emptyText}>No reviews yet</Text>}
//               renderItem={({ item }) => (
//                 <View style={styles.reviewCard}>
//                   <View style={styles.reviewHeader}>
//                     <View style={styles.smallAvatar}>
//                       <Text style={styles.smallAvatarText}>
//                         {item.studentName ? item.studentName.charAt(0).toUpperCase() : 'S'}
//                       </Text>
//                     </View>
//                     <View style={{ marginLeft: 10, flex: 1 }}>
//                       <View style={styles.ratingRow}>
//                         <Ionicons name="star" size={14} color="#f97316" />
//                         <Text style={styles.ratingText}>{item.rating}</Text>
//                       </View>
//                       <Text style={styles.reviewDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
//                     </View>
//                   </View>

//                   <Text style={styles.paragraph}>{item.comment || 'No comment'}</Text>
//                 </View>
//               )}
//             />
//           </TabScreen>

//           <TabScreen label="Availability" icon="clock-outline">
//             <FlatList
//               data={tutor.availabilityBlocks || []}
//               keyExtractor={(item) => `${item.dayOfWeek}-${item.startTimeUTC}-${item.endTimeUTC}`}
//               contentContainerStyle={styles.listContainer}
//               ListEmptyComponent={<Text style={styles.emptyText}>No availability set</Text>}
//               renderItem={({ item }) => (
//                 <View style={styles.availabilityRow}>
//                   <Text style={styles.sectionSubTitle}>
//                     {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][item.dayOfWeek]}
//                   </Text>
//                   <Text style={styles.paragraph}>{item.startTimeUTC} — {item.endTimeUTC}</Text>
//                   <Badge style={styles.badge}>{item.isRecurring ? 'Recurring' : 'One-time'}</Badge>
//                 </View>
//               )}
//             />
//           </TabScreen>

//           <TabScreen label="Location" icon="map-marker">
//             <ScrollView contentContainerStyle={styles.contentContainer}>
//               {tutor.inPersonLocation?.enabled ? (
//                 <View>
//                   <Text style={styles.sectionTitle}>Address</Text>
//                   <Text style={styles.paragraph}>{tutor.inPersonLocation.address || 'N/A'}</Text>

//                   <Text style={styles.sectionTitle}>City</Text>
//                   <Text style={styles.paragraph}>{tutor.inPersonLocation.city || 'N/A'}</Text>
//                 </View>
//               ) : (
//                 <Text style={styles.emptyText}>In-person tutoring not available</Text>
//               )}
//             </ScrollView>
//           </TabScreen>
//         </Tabs>
//       </SafeAreaView>
//     </TabsProvider>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F8FAFC' },
//   centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
//   loadingText: { marginTop: 12, color: '#374151' },
//   errorTitle: { marginTop: 12, fontSize: 18, fontWeight: '700', color: '#111827' },
//   errorSubtitle: { marginTop: 6, color: '#6B7280', textAlign: 'center', paddingHorizontal: 20 },
//   backButton: {
//     marginTop: 16,
//     backgroundColor: '#F97316',
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 12,
//   },
//   backButtonText: { color: '#fff', fontWeight: '700' },

//   headerCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     margin: 12,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     // simple shadow
//     shadowColor: '#000',
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#E5E7EB' },
//   headerInfo: { marginLeft: 14, flex: 1 },
//   nameText: { fontSize: 20, fontWeight: '700', color: '#0F172A' },
//   headlineText: { fontSize: 14, color: '#6B7280', marginTop: 4 },
//   ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
//   ratingText: { marginLeft: 6, color: '#374151', fontWeight: '600' },
//   priceBadge: { marginTop: 10, flexDirection: 'row', alignItems: 'baseline' },
//   priceText: { fontSize: 16, fontWeight: '700', color: '#C2410C' },
//   rateSub: { marginLeft: 6, color: '#C2410C' },

//   buttonRow: { flexDirection: 'row', paddingHorizontal: 12, marginBottom: 8 },
//   flexGrow: { flex: 1 },
//   primaryButton: {
//     paddingVertical: 12,
//     borderRadius: 10,
//     backgroundColor: '#F97316',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   primaryButtonText: { color: '#fff', fontWeight: '700' },
//   secondaryButton: {
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderRadius: 10,
//     backgroundColor: '#3B82F6',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   secondaryButtonText: { color: '#fff', fontWeight: '700' },
//   ml8: { marginLeft: 8 },

//   tabsContainer: { flex: 1 },
//   contentContainer: { padding: 16 },
//   sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginTop: 8 },
//   sectionSubTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
//   paragraph: { color: '#374151', marginTop: 6, lineHeight: 20 },

//   listContainer: { padding: 12 },
//   emptyText: { textAlign: 'center', color: '#6B7280', paddingVertical: 28 },
//   subjectChip: {
//     paddingVertical: 12,
//     paddingHorizontal: 14,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     marginBottom: 8,
//     shadowColor: '#000',
//     shadowOpacity: 0.03,
//     elevation: 1,
//   },
//   subjectText: { fontWeight: '600', color: '#0F172A' },

//   reviewCard: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 10 },
//   reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
//   smallAvatar: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: '#F3F4F6',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   smallAvatarText: { fontWeight: '700', color: '#374151' },
//   reviewDate: { color: '#9CA3AF', fontSize: 12 },

//   availabilityRow: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 10 },
//   badge: { alignSelf: 'flex-start', marginTop: 8 },
// });

// screens/TutorProfileScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getTutorProfile } from "../lib/firestore"; // Using your Firestore function

const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const basePadding = isTablet ? 32 : 24;

interface TutorProfile {
  uid: string;
  fullName: string;
  email: string;
  subjects: string[];
  bio: string;
  hourlyRate: number;
  experience: string;
  photoURL?: string;
  // Add more fields if needed later (reviews will be separate)
}

export default function TutorProfileScreen() {
  const route = useRoute<any>();
  const { tutorId } = route.params as { tutorId: string };
  const navigation = useNavigation<any>();

  const [tutor, setTutor] = useState<TutorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTutor();
  }, [tutorId]);

  const fetchTutor = async () => {
    setLoading(true);
    try {
      const data = await getTutorProfile(tutorId);
      setTutor(data);
    } catch (err) {
      console.error("Failed to load tutor:", err);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#F97316" />
        <Text className="mt-4 text-gray-600 text-lg">Loading profile...</Text>
      </View>
    );
  }

  if (!tutor) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-8">
        <MaterialIcons name="error-outline" size={64} color="#EF4444" />
        <Text className="text-2xl font-bold text-gray-900 mt-6">Tutor Not Found</Text>
        <Text className="text-center text-gray-600 mt-3">
          The tutor profile you're looking for doesn't exist or has been removed.
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mt-8 bg-orange-500 rounded-full py-4 px-10"
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 80 }}
    >
      {/* Hero Header */}
      <View className="bg-gradient-to-b from-orange-50 to-white pt-12 pb-8">
        <View style={{ paddingHorizontal: basePadding }}>
          <View className="items-center">
            {/* Avatar */}
            {tutor.photoURL ? (
              <Image
                source={{ uri: tutor.photoURL }}
                className="w-32 h-32 rounded-full border-4 border-white shadow-2xl"
              />
            ) : (
              <View className="w-32 h-32 bg-orange-500 rounded-full items-center justify-center shadow-2xl">
                <Text className="text-5xl font-bold text-white">
                  {getInitials(tutor.fullName)}
                </Text>
              </View>
            )}

            {/* Name & Rating */}
            <Text className="text-3xl font-extrabold text-gray-900 mt-6">
              {tutor.fullName}
            </Text>

            <View className="flex-row items-center mt-3">
              <MaterialIcons name="star" size={24} color="#F97316" />
              <Text className="ml-2 text-xl font-semibold text-gray-800">
                4.9
              </Text>
              <Text className="ml-2 text-gray-600">(23 reviews)</Text>
            </View>

            {/* Price */}
            <View className="mt-5">
              <Text className="text-4xl font-black text-orange-500">
                ${tutor.hourlyRate}
                <Text className="text-xl text-gray-600"> / hour</Text>
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-4 mt-10">
            <TouchableOpacity
              onPress={() => navigation.navigate("Booking", { tutorId: tutor.uid })}
              className="flex-1"
            >
              <LinearGradient
                colors={["#FB923C", "#F97316"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="rounded-full py-5 shadow-2xl"
              >
                <Text className="text-white text-xl font-bold text-center">
                  Book Session →
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity className="border-2 border-orange-500 rounded-full py-5 px-8">
              <Text className="text-orange-500 text-xl font-bold">Message</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Content Sections */}
      <View style={{ paddingHorizontal: basePadding }} className="mt-8">
        {/* About / Bio */}
        <Text className="text-3xl font-bold text-gray-900 mb-4">About Me</Text>
        <View className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <Text className="text-gray-700 leading-7 text-lg">
            {tutor.bio || "Dedicated and experienced tutor passionate about helping students achieve their academic goals."}
          </Text>
        </View>

        {/* Experience & Quick Stats */}
        <View className="flex-row justify-around mt-10 mb-10">
          <View className="items-center">
            <Text className="text-3xl font-bold text-orange-500">{tutor.experience || "5+"}</Text>
            <Text className="text-gray-600 mt-1">Years Experience</Text>
          </View>
          <View className="items-center">
            <Text className="text-3xl font-bold text-orange-500">{tutor.subjects.length}</Text>
            <Text className="text-gray-600 mt-1">Subjects</Text>
          </View>
          <View className="items-center">
            <Text className="text-3xl font-bold text-orange-500">23</Text>
            <Text className="text-gray-600 mt-1">Students Helped</Text>
          </View>
        </View>

        {/* Subjects */}
        <Text className="text-3xl font-bold text-gray-900 mb-4">Subjects I Teach</Text>
        <View className="flex-row flex-wrap gap-3">
          {tutor.subjects.map((subject) => (
            <View
              key={subject}
              className="bg-orange-100 px-6 py-3 rounded-full"
            >
              <Text className="text-orange-700 font-bold text-base">{subject}</Text>
            </View>
          ))}
        </View>

        {/* Placeholder for Reviews (can be expanded later) */}
        <Text className="text-3xl font-bold text-gray-900 mt-12 mb-4">Student Reviews</Text>
        <View className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 items-center">
          <MaterialIcons name="star-border" size={48} color="#F97316" />
          <Text className="text-xl font-bold text-gray-900 mt-4">No reviews yet</Text>
          <Text className="text-center text-gray-600 mt-2">
            Be the first to book a session and leave a review!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}