// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { useToast } from '../hooks/use-toast';
// import { apiClient } from '../lib/api';

// export default function BookingScreen() {
//   const route = useRoute();
//   const { tutorId } = route.params as { tutorId: string };
//   const navigation = useNavigation();
//   const { toast } = useToast();

//   const [selectedSubject, setSelectedSubject] = useState('');
//   const [selectedDate, setSelectedDate] = useState(''); // YYYY-MM-DD
//   const [selectedTime, setSelectedTime] = useState(''); // HH:mm
//   const [duration, setDuration] = useState(60); // minutes (number)
//   const [notes, setNotes] = useState('');

//   // Simplified time slots
//   const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

//   const handleSubmit = async () => {
//     // Basic validation
//     if (!selectedSubject || !selectedDate || !selectedTime) {
//       toast({ title: 'Missing fields', description: 'Please pick a subject, date and time.', variant: 'destructive' });
//       return;
//     }

//     // Build start Date and validate
//     const start = new Date(`${selectedDate}T${selectedTime}`);
//     if (isNaN(start.getTime())) {
//       toast({ title: 'Invalid date/time', description: 'Please enter a valid date (YYYY-MM-DD) and time.', variant: 'destructive' });
//       return;
//     }

//     // Compute end time by adding duration minutes
//     const end = new Date(start.getTime() + duration * 60_000);

//     try {
//       await apiClient.createBooking({
//         tutorId,
//         subjectId: selectedSubject,
//         startAtUTC: start.toISOString(),
//         endAtUTC: end.toISOString(),
//         priceCents: 2500, // keep same if that's intentional
//         currency: 'USD',
    
//       });

//       toast({ title: 'Booking Successful', description: 'Your session has been booked.' });
//       // goBack may need casting depending on your navigation typing
//       (navigation as any).goBack();
//     } catch (error) {
//       toast({ title: 'Booking Failed', description: 'Please try again.', variant: 'destructive' });
//     }
//   };

//   return (
//     <ScrollView className="flex-1 bg-gray-50 p-6">
//       <Text className="text-2xl font-bold text-gray-900 mb-4">Book a Session</Text>

//       <View className="space-y-4">
//         <View>
//           <Text className="text-sm font-medium text-gray-700 mb-1">Subject *</Text>
//           <View className="border border-gray-300 rounded-xl bg-gray-50">
//             <Picker selectedValue={selectedSubject} onValueChange={(v) => setSelectedSubject(String(v))}>
//               <Picker.Item label="Select subject" value="" />
//               {/* Fetch subjects or hardcode */}
//               <Picker.Item label="Math" value="math" />
//             </Picker>
//           </View>
//         </View>

//         <View>
//           <Text className="text-sm font-medium text-gray-700 mb-1">Date *</Text>
//           <TextInput
//             className="border border-gray-300 rounded-xl p-3 bg-gray-50"
//             placeholder="YYYY-MM-DD"
//             value={selectedDate}
//             onChangeText={setSelectedDate}
//           />
//         </View>

//         <View>
//           <Text className="text-sm font-medium text-gray-700 mb-1">Time *</Text>
//           <View className="border border-gray-300 rounded-xl bg-gray-50">
//             <Picker selectedValue={selectedTime} onValueChange={(v) => setSelectedTime(String(v))}>
//               <Picker.Item label="Select time" value="" />
//               {timeSlots.map((time) => (
//                 <Picker.Item key={time} label={time} value={time} />
//               ))}
//             </Picker>
//           </View>
//         </View>

//         <View>
//           <Text className="text-sm font-medium text-gray-700 mb-1">Duration</Text>
//           <View className="border border-gray-300 rounded-xl bg-gray-50">
//             <Picker
//               selectedValue={duration.toString()}
//               onValueChange={(value) => setDuration(Number(value))}
//             >
//               <Picker.Item label="30 minutes" value="30" />
//               <Picker.Item label="60 minutes" value="60" />
//               <Picker.Item label="90 minutes" value="90" />
//             </Picker>
//           </View>
//         </View>

//         <View>
//           <Text className="text-sm font-medium text-gray-700 mb-1">Notes</Text>
//           <TextInput
//             className="border border-gray-300 rounded-xl p-3 bg-gray-50 h-24"
//             multiline
//             value={notes}
//             onChangeText={setNotes}
//             placeholder="Any notes..."
//           />
//         </View>

//         <TouchableOpacity className="bg-orange-500 rounded-xl py-3" onPress={handleSubmit}>
//           <Text className="text-center text-white font-bold">Book and Pay</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { format, parseISO, isSameDay } from 'date-fns';
import { useToast } from '../hooks/use-toast';           // ← your toast hook
import { useAuth } from '../contexts/AuthContext';      // ← your auth context
import {
  getTutorProfile,
  getTutorAvailability,
  createSession,
  TutorProfile,
  AvailabilitySlot,
} from '../lib/firestore';                           // ← adjust path

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function BookingScreen() {
  const route = useRoute();
  const { tutorId } = route.params as { tutorId: string };
  const navigation = useNavigation();
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const [tutor, setTutor] = useState<TutorProfile | null>(null);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tutorData, slots] = await Promise.all([
          getTutorProfile(tutorId),
          getTutorAvailability(tutorId),
        ]);
        setTutor(tutorData);
        setAvailability(slots);
      } catch (err) {
        console.error(err);
        toast({ title: 'Error', description: 'Failed to load tutor data', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    if (tutorId) fetchData();
  }, [tutorId]);

  // Simple filter: only show times that fall within any availability slot for that day
  const getAvailableTimesForDate = (): string[] => {
    if (!selectedDate || availability.length === 0) return [];

    const dayOfWeek = selectedDate.getDay();
    const slotsForDay = availability.filter(slot => slot.dayOfWeek === dayOfWeek);

    if (slotsForDay.length === 0) return [];

    // Very basic → collect possible start times (you can refine this logic)
    const times: string[] = [];
    slotsForDay.forEach(slot => {
      let current = parseISO(`2025-01-01T${slot.startTime}:00`); // dummy date
      const end = parseISO(`2025-01-01T${slot.endTime}:00`);

      while (current < end) {
        times.push(format(current, 'HH:mm'));
        current = new Date(current.getTime() + 30 * 60_000); // 30 min steps
      }
    });

    // Remove duplicates & sort
    return [...new Set(times)].sort();
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      setSelectedTime(''); // reset time when date changes
    }
  };

  const handleSubmit = async () => {
  if (!tutor || !userProfile || !selectedDate || !selectedTime || !selectedSubject) {
    toast({ title: 'Error', description: 'Please complete all required fields', variant: 'destructive' });
    return;
  }

  setSubmitting(true);

  try {
    const dateStr = format(selectedDate!, 'yyyy-MM-dd');
    const startTime = `${dateStr}T${selectedTime}:00`; // not used yet but kept for future

    const sessionData: any = {
      studentId: userProfile.uid,
      studentName: userProfile.fullName || 'Student',
      tutorId: tutor.uid,
      tutorName: tutor.fullName,
      subject: selectedSubject,
      date: dateStr,
      time: selectedTime,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Only include message if there's actual content
    const trimmedMessage = message.trim();
    if (trimmedMessage) {
      sessionData.message = trimmedMessage;
    }

    await createSession(sessionData);

    toast({
      title: 'Success',
      description: 'Session request sent to tutor!',
    });

    navigation.goBack();
  } catch (err: any) {
    console.error('Error creating session:', err);
    toast({
      title: 'Error',
      description: err.message || 'Failed to send request',
      variant: 'destructive',
    });
  } finally {
    setSubmitting(false);
  }
};

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  if (!tutor) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-6">
        <Text className="text-lg text-gray-600 mb-4">Tutor not found</Text>
        <TouchableOpacity
          className="bg-orange-500 px-6 py-3 rounded-xl"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const availableTimes = getAvailableTimesForDate();

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 20 }}>
      {/* Header */}
      <Text className="text-2xl font-bold text-gray-900 mb-1">Book a Session</Text>
      <Text className="text-gray-600 mb-6">With {tutor.fullName}</Text>

      {/* Tutor Info Card */}
      <View className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100">
        <Text className="text-lg font-semibold text-gray-900 mb-1">{tutor.fullName}</Text>
        <Text className="text-sm text-gray-500 mb-2">{tutor.experience}</Text>
        <Text className="text-sm text-gray-600 mb-3">{tutor.bio}</Text>

        <View className="flex-row flex-wrap gap-2 mb-3">
          {tutor.subjects.map(sub => (
            <View
              key={sub}
              className="bg-orange-100 px-3 py-1 rounded-full"
            >
              <Text className="text-xs text-orange-700">{sub}</Text>
            </View>
          ))}
        </View>

        <Text className="text-lg font-bold text-orange-600">
          ${tutor.hourlyRate}/hour
        </Text>
      </View>

      {/* Form */}
      <View className="space-y-5">
        {/* Date */}
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">Date *</Text>
          <TouchableOpacity
            className="border border-gray-300 rounded-xl p-4 bg-white"
            onPress={() => setShowDatePicker(true)}
          >
            <Text className="text-gray-900">
              {selectedDate ? format(selectedDate, 'PPP') : 'Select date'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={handleDateChange}
            />
          )}
        </View>

        {/* Time */}
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">Time *</Text>
          <View className="border border-gray-300 rounded-xl bg-white overflow-hidden">
            <Picker
              selectedValue={selectedTime}
              onValueChange={(val) => setSelectedTime(val)}
              enabled={!!selectedDate && availableTimes.length > 0}
            >
              <Picker.Item label="Select time" value="" />
              {availableTimes.map(t => (
                <Picker.Item key={t} label={t} value={t} />
              ))}
            </Picker>
          </View>
          {selectedDate && availableTimes.length === 0 && (
            <Text className="text-xs text-red-600 mt-1">
              No availability on this day
            </Text>
          )}
        </View>

        {/* Subject */}
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">Subject *</Text>
          <View className="border border-gray-300 rounded-xl bg-white overflow-hidden">
            <Picker
              selectedValue={selectedSubject}
              onValueChange={setSelectedSubject}
            >
              <Picker.Item label="Select subject" value="" />
              {tutor.subjects.map(sub => (
                <Picker.Item key={sub} label={sub} value={sub} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Message / Notes */}
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">Message (optional)</Text>
          <TextInput
            className="border border-gray-300 rounded-xl p-4 bg-white min-h-[100px] text-gray-900"
            multiline
            placeholder="What would you like to learn or focus on?"
            value={message}
            onChangeText={setMessage}
            textAlignVertical="top"
          />
        </View>

        {/* Availability Info */}
        {availability.length > 0 && (
          <View className="bg-orange-50 p-4 rounded-xl border border-orange-100">
            <View className="flex-row items-center mb-2">
              <Text className="text-sm font-medium text-orange-800 mr-2">Tutor Availability</Text>
            </View>
            {availability.map(slot => (
              <Text key={slot.id} className="text-sm text-gray-700">
                {dayNames[slot.dayOfWeek]}: {slot.startTime} – {slot.endTime}
              </Text>
            ))}
          </View>
        )}

        {/* Submit */}
        <TouchableOpacity
          className={`rounded-xl py-4 items-center ${
            submitting ? 'bg-orange-300' : 'bg-orange-500'
          }`}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">Request Session</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}