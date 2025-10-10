// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   FlatList,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import {
//   TabsProvider,
//   Tabs,
//   TabScreen,
// } from 'react-native-paper-tabs';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { apiClient } from '../lib/api';
// import { useToast } from '../hooks/use-toast';
// import { Badge } from 'react-native-paper'; // <-- import Badge

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
//   const navigation = useNavigation<any>(); // <- relax nav typing to avoid TS errors
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

//   if (loading) {
//     return (
//       <View className="flex-1 justify-center items-center bg-gray-50">
//         <ActivityIndicator size="large" color="#f97316" />
//       </View>
//     );
//   }

//   if (error || !tutor) {
//     return (
//       <View className="flex-1 justify-center items-center bg-gray-50">
//         <Ionicons name="alert-circle" size={48} color="red" />
//         <Text className="text-lg font-semibold mt-4">Tutor Not Found</Text>
//         <Text className="text-gray-600 mt-2">The tutor you're looking for doesn't exist or has been removed.</Text>
//         <TouchableOpacity
//           className="bg-orange-500 rounded-xl py-3 px-6 mt-4"
//           onPress={() => navigation.goBack()}
//         >
//           <Text className="text-white font-bold">Back to Search</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <TabsProvider defaultIndex={0}>
//   <View className="flex-1 bg-gray-50">
//     {/* Header */}
//     <View className="p-6 bg-white">
//       <View className="flex-row items-center mb-4">
//         <Image
//           source={{ uri: tutor.user?.avatarUrl || 'https://via.placeholder.com/96' }}
//           className="w-24 h-24 rounded-full mr-4"
//         />
//         <View className="flex-1">
//           <Text className="text-2xl font-bold text-gray-900">{tutor.user?.name || 'Anonymous Tutor'}</Text>
//           <Text className="text-lg text-gray-600">{tutor.headline || 'Professional Tutor'}</Text>
//           <View className="flex-row items-center mt-2">
//             <Ionicons name="star" size={16} color="#f97316" />
//             <Text className="ml-1 text-gray-700">
//               {tutor.ratingAvg?.toFixed(1) || '0.0'} ({tutor.ratingCount || 0} reviews)
//             </Text>
//           </View>
//           <Text className="text-orange-500 font-medium mt-1">
//             ${((tutor.hourlyRateCents || 0) / 100).toFixed(2)} / hr
//           </Text>
//         </View>
//       </View>
//       <TouchableOpacity
//         className="bg-orange-500 rounded-xl py-3 mb-2"
//         onPress={() => navigation.navigate('Booking', { tutorId: tutor.id })}
//       >
//         <Text className="text-center text-white font-bold">Book Session</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         className="bg-blue-500 rounded-xl py-3"
//         onPress={() => toast({ title: 'Contact', description: 'Messaging coming soon' })}
//       >
//         <Text className="text-center text-white font-bold">Contact Tutor</Text>
//       </TouchableOpacity>
//     </View>

//     {/* Tabs */}
//     <Tabs>
//       <TabScreen label="Overview" icon="information">
//         {/* only Overview wrapped in ScrollView */}
//         <ScrollView className="p-4">
//           <Text className="font-bold mb-2">Bio</Text>
//           <Text className="text-gray-700">{tutor.bio || 'No bio available'}</Text>
//           <Text className="font-bold mt-4 mb-2">Experience</Text>
//           <Text className="text-gray-700">{tutor.yearsExperience || 0} years</Text>
//           <Text className="font-bold mt-4 mb-2">Location</Text>
//           <Text className="text-gray-700">{tutor.user?.country || 'Online'}</Text>
//         </ScrollView>
//       </TabScreen>

//       <TabScreen label="Subjects" icon="book">
//         <FlatList
//           data={tutor.subjects || []}
//           renderItem={({ item }) => (
//             <View className="p-4 border-b border-gray-200">
//               <Text className="font-semibold">{item}</Text>
//             </View>
//           )}
//           keyExtractor={(item) => item}
//           ListEmptyComponent={<Text className="text-center text-gray-500 py-8">No subjects listed</Text>}
//         />
//       </TabScreen>

//       <TabScreen label="Reviews" icon="star-outline">
//         <FlatList
//           data={reviews}
//           renderItem={({ item }) => (
//             <View className="p-4 border-b border-gray-200">
//               <View className="flex-row items-center mb-2">
//                 <Ionicons name="star" size={16} color="#f97316" />
//                 <Text className="ml-1 font-semibold">{item.rating}</Text>
//               </View>
//               <Text className="text-gray-700">{item.comment || 'No comment'}</Text>
//               <Text className="text-sm text-gray-500 mt-1">{new Date(item.createdAt).toLocaleDateString()}</Text>
//             </View>
//           )}
//           keyExtractor={(item) => item.id}
//           ListEmptyComponent={<Text className="text-center text-gray-500 py-8">No reviews yet</Text>}
//         />
//       </TabScreen>

//       <TabScreen label="Availability" icon="clock-outline">
//         <FlatList
//           data={tutor.availabilityBlocks || []}
//           renderItem={({ item }) => (
//             <View className="p-4 border-b border-gray-200">
//               <Text className="font-semibold">
//                 Day: {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][item.dayOfWeek]}
//               </Text>
//               <Text>Time: {item.startTimeUTC} - {item.endTimeUTC}</Text>
//               <Badge style={{ alignSelf: 'flex-start', marginTop: 8 }}>
//                 {item.isRecurring ? 'Recurring' : 'One-time'}
//               </Badge>
//             </View>
//           )}
//           keyExtractor={(item) => `${item.dayOfWeek}-${item.startTimeUTC}-${item.endTimeUTC}`}
//           ListEmptyComponent={<Text className="text-center text-gray-500 py-8">No availability set</Text>}
//         />
//       </TabScreen>

//       <TabScreen label="Location" icon="map-marker">
//         <ScrollView className="p-4">
//           {tutor.inPersonLocation?.enabled ? (
//             <>
//               <Text className="font-bold mb-2">Address</Text>
//               <Text>{tutor.inPersonLocation.address || 'N/A'}</Text>
//               <Text className="font-bold mt-4 mb-2">City</Text>
//               <Text>{tutor.inPersonLocation.city || 'N/A'}</Text>
//             </>
//           ) : (
//             <Text className="text-center text-gray-500 py-8">In-person tutoring not available</Text>
//           )}
//         </ScrollView>
//       </TabScreen>
//     </Tabs>
//   </View>
// </TabsProvider>

//   );
// }
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabsProvider, Tabs, TabScreen } from 'react-native-paper-tabs';
import { useNavigation, useRoute } from '@react-navigation/native';
import { apiClient } from '../lib/api';
import { useToast } from '../hooks/use-toast';
import { Badge } from 'react-native-paper';

const DEVICE_WIDTH = Dimensions.get('window').width;

interface Tutor {
  id: string;
  user?: { name?: string; avatarUrl?: string; country?: string };
  headline?: string;
  bio?: string;
  hourlyRateCents?: number;
  currency?: string;
  yearsExperience?: number;
  subjects?: string[];
  levels?: string[];
  ratingAvg?: number;
  ratingCount?: number;
  availabilityBlocks?: Array<{
    dayOfWeek: number;
    startTimeUTC: string;
    endTimeUTC: string;
    isRecurring: boolean;
  }>;
  inPersonLocation?: {
    enabled: boolean;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
    meetingPoint?: string;
    additionalInfo?: string;
  };
}

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  studentName?: string;
}

export default function TutorProfileScreen() {
  const route = useRoute();
  const { tutorId } = route.params as { tutorId: string };
  const navigation = useNavigation<any>();
  const { toast } = useToast();

  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTutorData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutorId]);

  const fetchTutorData = async () => {
    setLoading(true);
    try {
      const tutorData = await apiClient.getTutorProfile(tutorId);
      setTutor(tutorData);

      const reviewsData = await apiClient.getTutorReviews(tutorId);
      setReviews(reviewsData.reviews || []);
    } catch (err) {
      setError('Failed to load tutor profile');
      toast({ title: 'Error', description: 'Failed to load tutor profile', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (cents?: number, currency = '$') => {
    const val = (cents || 0) / 100;
    // simple formatting — good fallback on RN
    return `${currency}${val.toFixed(2)}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading tutor profile…</Text>
      </SafeAreaView>
    );
  }

  if (error || !tutor) {
    return (
      <SafeAreaView style={styles.centered}>
        <Ionicons name="alert-circle" size={56} color="#e11d48" />
        <Text style={styles.errorTitle}>Tutor Not Found</Text>
        <Text style={styles.errorSubtitle}>The tutor you're looking for doesn't exist or has been removed.</Text>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back to Search</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <TabsProvider defaultIndex={0}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.headerCard}>
          <Image
            source={{ uri: tutor.user?.avatarUrl || 'https://via.placeholder.com/150' }}
            style={styles.avatar}
          />

          <View style={styles.headerInfo}>
            <Text numberOfLines={1} style={styles.nameText}>
              {tutor.user?.name || 'Anonymous Tutor'}
            </Text>
            <Text numberOfLines={1} style={styles.headlineText}>
              {tutor.headline || 'Professional Tutor'}
            </Text>

            <View style={styles.ratingRow}>
              <Ionicons name="star" size={16} color="#f97316" />
              <Text style={styles.ratingText}>
                {(tutor.ratingAvg || 0).toFixed(1)} ({tutor.ratingCount || 0})
              </Text>
            </View>

            <View style={styles.priceBadge}>
              <Text style={styles.priceText}>{formatPrice(tutor.hourlyRateCents)}</Text>
              <Text style={styles.rateSub}> / hr</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <Pressable
            style={[styles.primaryButton, styles.flexGrow]}
            onPress={() => navigation.navigate('Booking', { tutorId: tutor.id })}
            accessibilityLabel="Book session"
          >
            <Text style={styles.primaryButtonText}>Book Session</Text>
          </Pressable>

          <Pressable
            style={[styles.secondaryButton, styles.ml8]}
            onPress={() => toast({ title: 'Contact', description: 'Messaging coming soon' })}
            accessibilityLabel="Contact tutor"
          >
            <Text style={styles.secondaryButtonText}>Contact</Text>
          </Pressable>
        </View>

        {/* Tabs */}
        <Tabs style={styles.tabsContainer}>
          <TabScreen label="Overview" icon="information">
            <ScrollView contentContainerStyle={styles.contentContainer}>
              <Text style={styles.sectionTitle}>Bio</Text>
              <Text style={styles.paragraph}>{tutor.bio || 'No bio available'}</Text>

              <Text style={styles.sectionTitle}>Experience</Text>
              <Text style={styles.paragraph}>{tutor.yearsExperience || 0} years</Text>

              <Text style={styles.sectionTitle}>Location</Text>
              <Text style={styles.paragraph}>{tutor.user?.country || 'Online'}</Text>
            </ScrollView>
          </TabScreen>

          <TabScreen label="Subjects" icon="book">
            <FlatList
              data={tutor.subjects || []}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={<Text style={styles.emptyText}>No subjects listed</Text>}
              renderItem={({ item }) => (
                <View style={styles.subjectChip}>
                  <Text style={styles.subjectText}>{item}</Text>
                </View>
              )}
            />
          </TabScreen>

          <TabScreen label="Reviews" icon="star-outline">
            <FlatList
              data={reviews}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={<Text style={styles.emptyText}>No reviews yet</Text>}
              renderItem={({ item }) => (
                <View style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.smallAvatar}>
                      <Text style={styles.smallAvatarText}>
                        {item.studentName ? item.studentName.charAt(0).toUpperCase() : 'S'}
                      </Text>
                    </View>
                    <View style={{ marginLeft: 10, flex: 1 }}>
                      <View style={styles.ratingRow}>
                        <Ionicons name="star" size={14} color="#f97316" />
                        <Text style={styles.ratingText}>{item.rating}</Text>
                      </View>
                      <Text style={styles.reviewDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                    </View>
                  </View>

                  <Text style={styles.paragraph}>{item.comment || 'No comment'}</Text>
                </View>
              )}
            />
          </TabScreen>

          <TabScreen label="Availability" icon="clock-outline">
            <FlatList
              data={tutor.availabilityBlocks || []}
              keyExtractor={(item) => `${item.dayOfWeek}-${item.startTimeUTC}-${item.endTimeUTC}`}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={<Text style={styles.emptyText}>No availability set</Text>}
              renderItem={({ item }) => (
                <View style={styles.availabilityRow}>
                  <Text style={styles.sectionSubTitle}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][item.dayOfWeek]}
                  </Text>
                  <Text style={styles.paragraph}>{item.startTimeUTC} — {item.endTimeUTC}</Text>
                  <Badge style={styles.badge}>{item.isRecurring ? 'Recurring' : 'One-time'}</Badge>
                </View>
              )}
            />
          </TabScreen>

          <TabScreen label="Location" icon="map-marker">
            <ScrollView contentContainerStyle={styles.contentContainer}>
              {tutor.inPersonLocation?.enabled ? (
                <View>
                  <Text style={styles.sectionTitle}>Address</Text>
                  <Text style={styles.paragraph}>{tutor.inPersonLocation.address || 'N/A'}</Text>

                  <Text style={styles.sectionTitle}>City</Text>
                  <Text style={styles.paragraph}>{tutor.inPersonLocation.city || 'N/A'}</Text>
                </View>
              ) : (
                <Text style={styles.emptyText}>In-person tutoring not available</Text>
              )}
            </ScrollView>
          </TabScreen>
        </Tabs>
      </SafeAreaView>
    </TabsProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  loadingText: { marginTop: 12, color: '#374151' },
  errorTitle: { marginTop: 12, fontSize: 18, fontWeight: '700', color: '#111827' },
  errorSubtitle: { marginTop: 6, color: '#6B7280', textAlign: 'center', paddingHorizontal: 20 },
  backButton: {
    marginTop: 16,
    backgroundColor: '#F97316',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  backButtonText: { color: '#fff', fontWeight: '700' },

  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    margin: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    // simple shadow
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#E5E7EB' },
  headerInfo: { marginLeft: 14, flex: 1 },
  nameText: { fontSize: 20, fontWeight: '700', color: '#0F172A' },
  headlineText: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  ratingText: { marginLeft: 6, color: '#374151', fontWeight: '600' },
  priceBadge: { marginTop: 10, flexDirection: 'row', alignItems: 'baseline' },
  priceText: { fontSize: 16, fontWeight: '700', color: '#C2410C' },
  rateSub: { marginLeft: 6, color: '#C2410C' },

  buttonRow: { flexDirection: 'row', paddingHorizontal: 12, marginBottom: 8 },
  flexGrow: { flex: 1 },
  primaryButton: {
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: { color: '#fff', fontWeight: '700' },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: { color: '#fff', fontWeight: '700' },
  ml8: { marginLeft: 8 },

  tabsContainer: { flex: 1 },
  contentContainer: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginTop: 8 },
  sectionSubTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  paragraph: { color: '#374151', marginTop: 6, lineHeight: 20 },

  listContainer: { padding: 12 },
  emptyText: { textAlign: 'center', color: '#6B7280', paddingVertical: 28 },
  subjectChip: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    elevation: 1,
  },
  subjectText: { fontWeight: '600', color: '#0F172A' },

  reviewCard: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 10 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  smallAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallAvatarText: { fontWeight: '700', color: '#374151' },
  reviewDate: { color: '#9CA3AF', fontSize: 12 },

  availabilityRow: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 10 },
  badge: { alignSelf: 'flex-start', marginTop: 8 },
});
