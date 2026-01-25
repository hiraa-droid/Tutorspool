// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useForm, Controller } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { useToast } from '../hooks/use-toast';
// import { useAuth } from '../contexts/AuthContext';

// type RootStackParamList = {
//   Splash: undefined;
//   Login: undefined;
//   SignUp: undefined;
//   Main: undefined;
// };

// type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// const loginSchema = z.object({
//   email: z.string().email('Invalid email address'),
//   password: z.string().min(6, 'Password must be at least 6 characters'),
// });

// type LoginForm = z.infer<typeof loginSchema>;

// export default function LoginScreen() {
//   const [showPassword, setShowPassword] = useState(false);
//   const navigation = useNavigation<NavigationProp>();
//   const { toast } = useToast();
//   const { signIn, sendPasswordReset, resendEmailConfirmation } = useAuth();

//   const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
//     resolver: zodResolver(loginSchema),
//   });

//   const onSubmit = async (data: LoginForm) => {
//     const { error } = await signIn(data.email, data.password);
//     if (error) {
//       const lower = error.toLowerCase();
//       if (lower.includes('email') && lower.includes('confirm')) {
//         toast({ title: 'Email not confirmed', description: 'Check your inbox or resend confirmation.' });
//       } else {
//         toast({ title: 'Login failed', description: error, variant: 'destructive' });
//       }
//       return;
//     }
//     toast({ title: 'Welcome back!', description: 'Successfully logged in.' });
//     navigation.navigate('Main');
//   };

//   return (
//     <KeyboardAvoidingView
//       className="flex-1 bg-gray-50"
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//     >
//       <View className="flex-1 justify-center px-6">
//         <View className="items-center mb-8">
//           <Image
//             source={require('../../assets/logo.png')}
//             style={{ width: 120, height: 48 }}
//           />
//           <Text className="text-2xl font-semibold text-gray-900 mt-4">Sign In to TutorsPool</Text>
//           <Text className="text-gray-600 text-center mt-2">
//             Access your account to start your learning or teaching journey.
//           </Text>
//         </View>

//         <Controller
//           control={control}
//           name="email"
//           render={({ field: { onChange, value } }) => (
//             <View className="mb-4">
//               <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
//               <TextInput
//                 className="border border-gray-300 rounded-xl p-3 bg-gray-50"
//                 placeholder="you@example.com"
//                 value={value}
//                 onChangeText={onChange}
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//               />
//               {errors.email && (
//                 <Text className="text-red-500 text-sm mt-1">{errors.email.message}</Text>
//               )}
//             </View>
//           )}
//         />

//         <Controller
//           control={control}
//           name="password"
//           render={({ field: { onChange, value } }) => (
//             <View className="mb-4">
//               <Text className="text-sm font-medium text-gray-700 mb-1">Password</Text>
//               <View className="relative">
//                 <TextInput
//                   className="border border-gray-300 rounded-xl p-3 bg-gray-50"
//                   placeholder="••••••••"
//                   secureTextEntry={!showPassword}
//                   value={value}
//                   onChangeText={onChange}
//                 />
//                 <TouchableOpacity
//                   className="absolute right-3 top-3"
//                   onPress={() => setShowPassword(!showPassword)}
//                 >
//                   <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#777" />
//                 </TouchableOpacity>
//               </View>
//               {errors.password && (
//                 <Text className="text-red-500 text-sm mt-1">{errors.password.message}</Text>
//               )}
//             </View>
//           )}
//         />

//         <TouchableOpacity
//           className="bg-orange-500 rounded-xl py-3 mb-4"
//           onPress={handleSubmit(onSubmit)}
//         >
//           <Text className="text-center text-white font-semibold">Sign In</Text>
//         </TouchableOpacity>

//         <View className="flex-row justify-between">
//           <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
//             <Text className="text-orange-500 font-medium">Create Account</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={async () => {
//               const email = control._formValues.email;
//               if (!email) {
//                 toast({ title: 'Enter your email', description: 'Please enter your email to reset password.' });
//                 return;
//               }
//               const { error } = await sendPasswordReset(email);
//               if (error) {
//                 toast({ title: 'Reset failed', description: error, variant: 'destructive' });
//               } else {
//                 toast({ title: 'Reset Email Sent', description: 'Check your inbox.' });
//               }
//             }}
//           >
//             <Text className="text-orange-500 font-medium">Forgot Password?</Text>
//           </TouchableOpacity>
//         </View>

//         <View className="mt-4">
//           <Text className="text-center text-gray-600 text-sm">
//             Didn’t get the confirmation email?{' '}
//             <TouchableOpacity
//               onPress={async () => {
//                 const email = control._formValues.email;
//                 if (!email) {
//                   toast({ title: 'Enter your email', description: 'Please enter your email to resend confirmation.' });
//                   return;
//                 }
//                 const { error } = await resendEmailConfirmation(email);
//                 if (error) {
//                   toast({ title: 'Resend failed', description: error, variant: 'destructive' });
//                 } else {
//                   toast({ title: 'Confirmation email sent', description: 'Check your inbox.' });
//                 }
//               }}
//             >
//               <Text className="text-orange-500 font-medium">Resend</Text>
//             </TouchableOpacity>
//           </Text>
//         </View>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useToast } from '../hooks/use-toast';
import { useAuth, UserRole } from '../contexts/AuthContext';

type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  StudentDashboard: undefined;
  TutorDashboard: undefined;
  AdminDashboard: undefined;
  Main: undefined; // fallback
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const { toast } = useToast();
  const { signIn, userProfile } = useAuth();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    const result = await signIn(data.email, data.password);
    if (result.error) {
      toast({
        title: 'Login Failed',
        description: result.error,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Welcome back!',
      description: 'You have been signed in successfully.',
    });

    // Simple role-based navigation
    let route: keyof RootStackParamList = 'Main';
    if (userProfile) {
      if (userProfile.role === 'student') route = 'StudentDashboard';
      else if (userProfile.role === 'tutor') route = 'TutorDashboard';
      else if (userProfile.role === 'admin') route = 'AdminDashboard';
    }

    navigation.replace(route as any);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f9fafb' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          {/* Replace with your logo */}
          <Text style={{ fontSize: 28, fontWeight: '700', color: '#1f2937', marginTop: 16 }}>
            TutorsPool
          </Text>
          <Text style={{ color: '#6b7280', marginTop: 8 }}>Sign in to continue</Text>
        </View>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 6 }}>
                Email
              </Text>
              <View style={{ position: 'relative' }}>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: errors.email ? '#ef4444' : '#d1d5db',
                    borderRadius: 12,
                    padding: 14,
                    paddingLeft: 48,
                    backgroundColor: '#f9fafb',
                  }}
                  placeholder="you@example.com"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#9ca3af"
                  style={{ position: 'absolute', left: 16, top: 16 }}
                />
              </View>
              {errors.email && (
                <Text style={{ color: '#ef4444', fontSize: 13, marginTop: 6 }}>
                  {errors.email.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 6 }}>
                Password
              </Text>
              <View style={{ position: 'relative' }}>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: errors.password ? '#ef4444' : '#d1d5db',
                    borderRadius: 12,
                    padding: 14,
                    paddingLeft: 48,
                    paddingRight: 48,
                    backgroundColor: '#f9fafb',
                  }}
                  placeholder="••••••••"
                  secureTextEntry={!showPassword}
                  value={value}
                  onChangeText={onChange}
                />
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#9ca3af"
                  style={{ position: 'absolute', left: 16, top: 16 }}
                />
                <TouchableOpacity
                  style={{ position: 'absolute', right: 16, top: 16 }}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#6b7280"
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={{ color: '#ef4444', fontSize: 13, marginTop: 6 }}>
                  {errors.password.message}
                </Text>
              )}
            </View>
          )}
        />

        <TouchableOpacity
          style={{
            backgroundColor: '#f97316',
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: 'center',
            marginBottom: 16,
          }}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Sign In</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={{ color: '#f97316', fontWeight: '500' }}>Create account</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={{ color: '#f97316', fontWeight: '500' }}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}