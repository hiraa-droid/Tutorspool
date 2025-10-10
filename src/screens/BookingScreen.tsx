// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
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
//   const [selectedDate, setSelectedDate] = useState('');
//   const [selectedTime, setSelectedTime] = useState('');
//   const [duration, setDuration] = useState(60);
//   const [notes, setNotes] = useState('');

//   // Simplified time slots
//   const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

//   const handleSubmit = async () => {
//     try {
//       // Simplified booking creation
//       await apiClient.createBooking({
//         tutorId,
//         subjectId: selectedSubject,
//         startAtUTC: new Date(`${selectedDate}T${selectedTime}`).toISOString(),
//         endAtUTC: new Date(`${selectedDate}T${selectedTime}`).toISOString(),
//         priceCents: 2500,
//         currency: 'USD',
//       });
//       toast({ title: 'Booking Successful', description: 'Your session has been booked.' });
//       navigation.goBack();
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
//             <Picker
//               selectedValue={selectedSubject}
//               onValueChange={setSelectedSubject}
//             >
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
//             <Picker
//               selectedValue={selectedTime}
//               onValueChange={setSelectedTime}
//             >
//               <Picker.Item label="Select time" value="" />
//               {timeSlots.map(time => (
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
//       </div>
//     </ScrollView>
//   );
// }
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useToast } from '../hooks/use-toast';
import { apiClient } from '../lib/api';

export default function BookingScreen() {
  const route = useRoute();
  const { tutorId } = route.params as { tutorId: string };
  const navigation = useNavigation();
  const { toast } = useToast();

  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState(''); // YYYY-MM-DD
  const [selectedTime, setSelectedTime] = useState(''); // HH:mm
  const [duration, setDuration] = useState(60); // minutes (number)
  const [notes, setNotes] = useState('');

  // Simplified time slots
  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

  const handleSubmit = async () => {
    // Basic validation
    if (!selectedSubject || !selectedDate || !selectedTime) {
      toast({ title: 'Missing fields', description: 'Please pick a subject, date and time.', variant: 'destructive' });
      return;
    }

    // Build start Date and validate
    const start = new Date(`${selectedDate}T${selectedTime}`);
    if (isNaN(start.getTime())) {
      toast({ title: 'Invalid date/time', description: 'Please enter a valid date (YYYY-MM-DD) and time.', variant: 'destructive' });
      return;
    }

    // Compute end time by adding duration minutes
    const end = new Date(start.getTime() + duration * 60_000);

    try {
      await apiClient.createBooking({
        tutorId,
        subjectId: selectedSubject,
        startAtUTC: start.toISOString(),
        endAtUTC: end.toISOString(),
        priceCents: 2500, // keep same if that's intentional
        currency: 'USD',
    
      });

      toast({ title: 'Booking Successful', description: 'Your session has been booked.' });
      // goBack may need casting depending on your navigation typing
      (navigation as any).goBack();
    } catch (error) {
      toast({ title: 'Booking Failed', description: 'Please try again.', variant: 'destructive' });
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-6">
      <Text className="text-2xl font-bold text-gray-900 mb-4">Book a Session</Text>

      <View className="space-y-4">
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">Subject *</Text>
          <View className="border border-gray-300 rounded-xl bg-gray-50">
            <Picker selectedValue={selectedSubject} onValueChange={(v) => setSelectedSubject(String(v))}>
              <Picker.Item label="Select subject" value="" />
              {/* Fetch subjects or hardcode */}
              <Picker.Item label="Math" value="math" />
            </Picker>
          </View>
        </View>

        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">Date *</Text>
          <TextInput
            className="border border-gray-300 rounded-xl p-3 bg-gray-50"
            placeholder="YYYY-MM-DD"
            value={selectedDate}
            onChangeText={setSelectedDate}
          />
        </View>

        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">Time *</Text>
          <View className="border border-gray-300 rounded-xl bg-gray-50">
            <Picker selectedValue={selectedTime} onValueChange={(v) => setSelectedTime(String(v))}>
              <Picker.Item label="Select time" value="" />
              {timeSlots.map((time) => (
                <Picker.Item key={time} label={time} value={time} />
              ))}
            </Picker>
          </View>
        </View>

        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">Duration</Text>
          <View className="border border-gray-300 rounded-xl bg-gray-50">
            <Picker
              selectedValue={duration.toString()}
              onValueChange={(value) => setDuration(Number(value))}
            >
              <Picker.Item label="30 minutes" value="30" />
              <Picker.Item label="60 minutes" value="60" />
              <Picker.Item label="90 minutes" value="90" />
            </Picker>
          </View>
        </View>

        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">Notes</Text>
          <TextInput
            className="border border-gray-300 rounded-xl p-3 bg-gray-50 h-24"
            multiline
            value={notes}
            onChangeText={setNotes}
            placeholder="Any notes..."
          />
        </View>

        <TouchableOpacity className="bg-orange-500 rounded-xl py-3" onPress={handleSubmit}>
          <Text className="text-center text-white font-bold">Book and Pay</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
