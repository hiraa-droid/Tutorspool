// // SignUpScreen.tsx
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   Image,
//   Dimensions,
//   StyleSheet,
//   SafeAreaView,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { Provider as PaperProvider } from 'react-native-paper';
// import { TabsProvider, Tabs, TabScreen } from 'react-native-paper-tabs';
// import { useForm, Controller } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { useToast } from '../hooks/use-toast';
// import { useAuth } from '../contexts/AuthContext';
// import { Picker } from '@react-native-picker/picker';
// import { apiClient } from '../lib/api';

// type RootStackParamList = {
//   Splash: undefined;
//   Login: undefined;
//   SignUp: undefined;
//   Main: undefined;
// };

// type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// const { width } = Dimensions.get('window');

// const studentRegistrationSchema = z.object({
//   name: z.string().min(2, 'Name must be at least 2 characters'),
//   email: z.string().email('Invalid email address'),
//   password: z.string().min(6, 'Password must be at least 6 characters'),
//   phone: z.string().optional(),
//   country: z.string().min(1, 'Country is required'),
//   gradeLevel: z.string().min(1, 'Grade level is required'),
//   learningGoals: z.string().min(10, 'Learning goals must be at least 10 characters'),
//   preferredMode: z.enum(['ONLINE', 'OFFLINE']),
//   budgetMin: z.number().int().min(0, 'Minimum budget must be positive'),
//   budgetMax: z.number().int().min(0, 'Maximum budget must be positive'),
// });

// const tutorRegistrationSchema = z.object({
//   name: z.string().min(2, 'Name must be at least 2 characters'),
//   email: z.string().email('Invalid email address'),
//   password: z.string().min(6, 'Password must be at least 6 characters'),
//   phone: z.string().optional(),
//   country: z.string().min(1, 'Country is required'),
//   headline: z.string().min(10, 'Headline must be at least 10 characters'),
//   bio: z.string().min(50, 'Bio must be at least 50 characters'),
//   yearsExperience: z.number().int().min(0, 'Experience must be positive'),
//   subjects: z.array(z.string()).min(1, 'Select at least one subject'),
//   levels: z.array(z.string()).min(1, 'Select at least one level'),
//   hourlyRate: z.number().int().min(1, 'Rate must be at least $1'),
// });

// const adminRegistrationSchema = z.object({
//   name: z.string().min(2, 'Name must be at least 2 characters'),
//   email: z.string().email('Invalid email address'),
//   password: z.string().min(6, 'Password must be at least 6 characters'),
//   phone: z.string().optional(),
//   country: z.string().min(1, 'Country is required'),
//   adminCode: z.string().min(1, 'Admin code is required'),
// });

// type StudentRegistrationForm = z.infer<typeof studentRegistrationSchema>;
// type TutorRegistrationForm = z.infer<typeof tutorRegistrationSchema>;
// type AdminRegistrationForm = z.infer<typeof adminRegistrationSchema>;

// const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Other'];
// const GRADE_LEVELS = ['Elementary (K-5)', 'Middle School (6-8)', 'High School (9-12)', 'College/University'];
// const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science'];
// const LEVELS = ['Elementary (K-5)', 'Middle School (6-8)', 'High School (9-12)', 'College/University'];

// export default function SignUpScreen() {
//   const navigation = useNavigation<NavigationProp>();
//   const { toast } = useToast();

//   return (
//     <PaperProvider>
//       <KeyboardAvoidingView
//         style={styles.screen}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20}
//       >
//         <SafeAreaView style={{ flex: 1 }}>
//           {/* Outer ScrollView keeps header visible when tabs content is taller */}
//           <ScrollView
//             style={{ flex: 1 }}
//             contentContainerStyle={styles.scrollContent}
//             keyboardShouldPersistTaps="handled"
//             showsVerticalScrollIndicator={true}
//           >
//             <View style={styles.header}>
//               <Image
//                 source={require('../../assets/logo.png')}
//                 style={{ width: 120, height: 48, resizeMode: 'contain' }}
//               />
//               <Text style={styles.title}>Join TutorsPool</Text>
//               <Text style={styles.subtitle}>
//                 Create an account to start your learning or teaching journey.
//               </Text>
//             </View>

//             <View style={{ flex: 1 }}>
//               <TabsProvider defaultIndex={0}>
//                 <Tabs style={styles.tabsContainer}>
//                   <TabScreen label="Student" icon="school">
//                     <StudentRegistrationFormMobile />
//                   </TabScreen>

//                   <TabScreen label="Tutor" icon="account">
//                     <TutorRegistrationFormMobile />
//                   </TabScreen>

//                   <TabScreen label="Admin" icon="shield-check">
//                     <AdminRegistrationFormMobile />
//                   </TabScreen>
//                 </Tabs>
//               </TabsProvider>
//             </View>
//           </ScrollView>
//         </SafeAreaView>
//       </KeyboardAvoidingView>
//     </PaperProvider>
//   );
// }

// /* ---------------- Student Form ---------------- */
// const StudentRegistrationFormMobile: React.FC = () => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [showPassword, setShowPassword] = useState(false);
//   const { toast } = useToast();
//   const { register } = useAuth();
//   const navigation = useNavigation<NavigationProp>();

//   const { control, handleSubmit, formState: { errors }, trigger } = useForm<StudentRegistrationForm>({
//     resolver: zodResolver(studentRegistrationSchema),
//     defaultValues: { budgetMin: 0, budgetMax: 100, preferredMode: 'ONLINE' as 'ONLINE' },
//   });

//   const STEPS = [
//     { title: 'Basic Information' },
//     { title: 'Academic Details' },
//     { title: 'Learning Goals' },
//     { title: 'Budget & Requirements' },
//   ];

//   const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

//   const nextStep = async () => {
//     let valid = false;
//     switch (currentStep) {
//       case 1:
//         valid = await trigger(['name', 'email', 'password', 'country']);
//         break;
//       case 2:
//         valid = await trigger(['gradeLevel']);
//         break;
//       case 3:
//         valid = await trigger(['learningGoals', 'preferredMode']);
//         break;
//       case 4:
//         valid = await trigger(['budgetMin', 'budgetMax']);
//         break;
//     }
//     if (valid && currentStep < STEPS.length) {
//       setCurrentStep(currentStep + 1);
//     } else if (!valid) {
//       toast({ title: 'Validation Error', description: 'Please fill in all required fields correctly.', variant: 'destructive' });
//     }
//   };

//   const prevStep = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const onSubmit = async (data: StudentRegistrationForm) => {
//     try {
//       const registerResult = await register({
//         name: data.name,
//         email: data.email,
//         password: data.password,
//         phone: data.phone,
//         country: data.country,
//         role: 'STUDENT',
//       });

//       if ((registerResult as any).error) {
//         toast({ title: 'Registration Failed', description: (registerResult as any).error, variant: 'destructive' });
//         return;
//       }

//       await apiClient.createStudentProfile({
//         gradeLevel: data.gradeLevel,
//         learningGoals: data.learningGoals,
//         preferredMode: data.preferredMode,
//         budgetMin: data.budgetMin * 100,
//         budgetMax: data.budgetMax * 100,
//       });

//       toast({ title: 'Registration Successful', description: 'Your student profile has been created.' });
//       navigation.navigate('Main');
//     } catch (error) {
//       toast({ title: 'Registration Failed', description: 'Please try again.', variant: 'destructive' });
//     }
//   };

//   // IMPORTANT: wrap the entire form in a ScrollView so the tab content can scroll independently
//   return (
//     <ScrollView
//       contentContainerStyle={{ paddingBottom: 40 }} // allow space for keyboard and bottom buttons
//       keyboardShouldPersistTaps="handled"
//       showsVerticalScrollIndicator={true}
//     >
//       <View style={styles.formContainer}>
//         <Text style={styles.formTitle}>Student Registration</Text>
//         <Text style={styles.formSubtitle}>Find your perfect tutor to achieve your learning goals.</Text>

//         {/* Progress */}
//         <View style={styles.progressWrap}>
//           <Text style={styles.progressText}>Step {currentStep} of {STEPS.length}</Text>
//           <View style={styles.progressBar}>
//             <View style={[styles.progressFill, { width: `${progress}%` }]} />
//           </View>
//         </View>

//         {/* Step 1 */}
//         {currentStep === 1 && (
//           <View style={styles.spaceY}>
//             <Controller
//               control={control}
//               name="name"
//               render={({ field: { onChange, value } }) => (
//                 <View style={styles.field}>
//                   <Text style={styles.label}>Full Name *</Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Enter your full name"
//                     placeholderTextColor="#9CA3AF"
//                     value={value ?? ''}
//                     onChangeText={onChange}
//                   />
//                   {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
//                 </View>
//               )}
//             />

//             <Controller
//               control={control}
//               name="email"
//               render={({ field: { onChange, value } }) => (
//                 <View style={styles.field}>
//                   <Text style={styles.label}>Email Address *</Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Enter your email"
//                     placeholderTextColor="#9CA3AF"
//                     value={value ?? ''}
//                     onChangeText={onChange}
//                     keyboardType="email-address"
//                     autoCapitalize="none"
//                   />
//                   {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
//                 </View>
//               )}
//             />

//             <Controller
//               control={control}
//               name="password"
//               render={({ field: { onChange, value } }) => (
//                 <View style={styles.field}>
//                   <Text style={styles.label}>Password *</Text>
//                   <View style={styles.passwordWrap}>
//                     <TextInput
//                       style={[styles.input, styles.passwordInput]}
//                       placeholder="••••••••"
//                       placeholderTextColor="#9CA3AF"
//                       secureTextEntry={!showPassword}
//                       value={value ?? ''}
//                       onChangeText={onChange}
//                     />
//                     <TouchableOpacity
//                       style={styles.eyeButton}
//                       onPress={() => setShowPassword(!showPassword)}
//                       hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
//                     >
//                       <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#374151" />
//                     </TouchableOpacity>
//                   </View>
//                   {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
//                 </View>
//               )}
//             />

//             <Controller
//               control={control}
//               name="phone"
//               render={({ field: { onChange, value } }) => (
//                 <View style={styles.field}>
//                   <Text style={styles.label}>Phone Number</Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Enter your phone number"
//                     placeholderTextColor="#9CA3AF"
//                     value={value ?? ''}
//                     onChangeText={onChange}
//                     keyboardType="phone-pad"
//                   />
//                 </View>
//               )}
//             />

//             <Controller
//               control={control}
//               name="country"
//               render={({ field: { onChange, value } }) => (
//                 <View style={styles.field}>
//                   <Text style={styles.label}>Country *</Text>
//                   <View style={styles.pickerWrap}>
//                     <Picker
//                       selectedValue={value ?? ''}
//                       onValueChange={(v) => onChange(v)}
//                       style={styles.picker}
//                       mode="dropdown"
//                     >
//                       <Picker.Item label="Select your country" value="" />
//                       {COUNTRIES.map((country) => (
//                         <Picker.Item key={country} label={country} value={country} />
//                       ))}
//                     </Picker>
//                   </View>
//                   {errors.country && <Text style={styles.errorText}>{errors.country.message}</Text>}
//                 </View>
//               )}
//             />
//           </View>
//         )}

//         {/* Step 2 */}
//         {currentStep === 2 && (
//           <View style={styles.spaceY}>
//             <Controller
//               control={control}
//               name="gradeLevel"
//               render={({ field: { onChange, value } }) => (
//                 <View style={styles.field}>
//                   <Text style={styles.label}>Grade Level *</Text>
//                   <View style={styles.pickerWrap}>
//                     <Picker
//                       selectedValue={value ?? ''}
//                       onValueChange={(v) => onChange(v)}
//                       style={styles.picker}
//                       mode="dropdown"
//                     >
//                       <Picker.Item label="Select your grade level" value="" />
//                       {GRADE_LEVELS.map((level) => (
//                         <Picker.Item key={level} label={level} value={level} />
//                       ))}
//                     </Picker>
//                   </View>
//                   {errors.gradeLevel && <Text style={styles.errorText}>{errors.gradeLevel.message}</Text>}
//                 </View>
//               )}
//             />
//           </View>
//         )}

//         {/* Step 3 */}
//         {currentStep === 3 && (
//           <View style={styles.spaceY}>
//             <Controller
//               control={control}
//               name="learningGoals"
//               render={({ field: { onChange, value } }) => (
//                 <View style={styles.field}>
//                   <Text style={styles.label}>Learning Goals *</Text>
//                   <TextInput
//                     style={[styles.input, styles.textArea]}
//                     placeholder="Describe your learning goals..."
//                     placeholderTextColor="#9CA3AF"
//                     multiline
//                     textAlignVertical="top"
//                     value={value ?? ''}
//                     onChangeText={onChange}
//                   />
//                   {errors.learningGoals && <Text style={styles.errorText}>{errors.learningGoals.message}</Text>}
//                 </View>
//               )}
//             />

//             <Controller
//               control={control}
//               name="preferredMode"
//               render={({ field: { onChange, value } }) => (
//                 <View style={styles.field}>
//                   <Text style={styles.label}>Preferred Learning Mode *</Text>
//                   <View style={styles.pickerWrap}>
//                     <Picker
//                       selectedValue={value ?? ''}
//                       onValueChange={(v) => onChange(v)}
//                       style={styles.picker}
//                       mode="dropdown"
//                     >
//                       <Picker.Item label="Select learning mode" value="" />
//                       <Picker.Item label="Online (Video calls)" value="ONLINE" />
//                       <Picker.Item label="In-person meetings" value="OFFLINE" />
//                     </Picker>
//                   </View>
//                   {errors.preferredMode && <Text style={styles.errorText}>{errors.preferredMode.message}</Text>}
//                 </View>
//               )}
//             />
//           </View>
//         )}

//         {/* Step 4 */}
//         {currentStep === 4 && (
//           <View style={styles.spaceY}>
//             <Controller
//               control={control}
//               name="budgetMin"
//               render={({ field: { onChange, value } }) => (
//                 <View style={styles.field}>
//                   <Text style={styles.label}>Minimum Budget ($/hr) *</Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="0"
//                     placeholderTextColor="#9CA3AF"
//                     keyboardType="numeric"
//                     value={value?.toString() ?? ''}
//                     onChangeText={(text) => onChange(Number(text) || 0)}
//                   />
//                   {errors.budgetMin && <Text style={styles.errorText}>{errors.budgetMin.message}</Text>}
//                 </View>
//               )}
//             />
//             <Controller
//               control={control}
//               name="budgetMax"
//               render={({ field: { onChange, value } }) => (
//                 <View style={styles.field}>
//                   <Text style={styles.label}>Maximum Budget ($/hr) *</Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="100"
//                     placeholderTextColor="#9CA3AF"
//                     keyboardType="numeric"
//                     value={value?.toString() ?? ''}
//                     onChangeText={(text) => onChange(Number(text) || 0)}
//                   />
//                   {errors.budgetMax && <Text style={styles.errorText}>{errors.budgetMax.message}</Text>}
//                 </View>
//               )}
//             />
//           </View>
//         )}

//         <View style={styles.buttonRow}>
//           <TouchableOpacity
//             style={[styles.button, styles.buttonSecondary, currentStep === 1 && styles.buttonDisabled]}
//             onPress={prevStep}
//             disabled={currentStep === 1}
//           >
//             <Text style={styles.buttonTextSecondary}>Previous</Text>
//           </TouchableOpacity>

//           {currentStep < STEPS.length ? (
//             <TouchableOpacity
//               style={[styles.button, styles.buttonPrimary]}
//               onPress={nextStep}
//             >
//               <Text style={styles.buttonTextPrimary}>Next</Text>
//             </TouchableOpacity>
//           ) : (
//             <TouchableOpacity
//               style={[styles.button, styles.buttonPrimary]}
//               onPress={handleSubmit(onSubmit)}
//             >
//               <Text style={styles.buttonTextPrimary}>Complete Registration</Text>
//             </TouchableOpacity>
//           )}
//         </View>

//         <TouchableOpacity
//           style={styles.linkWrap}
//           onPress={() => navigation.navigate('Login')}
//         >
//           <Text style={styles.linkText}>Already have an account? Sign In</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// /* ---------------- Tutor Form ---------------- */
// const TutorRegistrationFormMobile: React.FC = () => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [showPassword, setShowPassword] = useState(false);
//   const { toast } = useToast();
//   const { register } = useAuth();
//   const navigation = useNavigation<NavigationProp>();

//   const { control, handleSubmit, formState: { errors }, trigger } = useForm<TutorRegistrationForm>({
//     resolver: zodResolver(tutorRegistrationSchema),
//     defaultValues: { yearsExperience: 0, hourlyRate: 25, subjects: [], levels: [] },
//   });

//   const STEPS = [
//     { title: 'Basic Information' },
//     { title: 'Professional Details' },
//     { title: 'Subjects & Pricing' },
//   ];

//   const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

//   const nextStep = async () => {
//     let valid = false;
//     switch (currentStep) {
//       case 1:
//         valid = await trigger(['name', 'email', 'password', 'country']);
//         break;
//       case 2:
//         valid = await trigger(['headline', 'bio', 'yearsExperience']);
//         break;
//       case 3:
//         valid = await trigger(['subjects', 'levels', 'hourlyRate']);
//         break;
//     }
//     if (valid && currentStep < STEPS.length) {
//       setCurrentStep(currentStep + 1);
//     } else if (!valid) {
//       toast({ title: 'Validation Error', description: 'Please fill in all required fields correctly.', variant: 'destructive' });
//     }
//   };

//   const prevStep = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const onSubmit = async (data: TutorRegistrationForm) => {
//     try {
//       const registerResult = await register({
//         name: data.name,
//         email: data.email,
//         password: data.password,
//         phone: data.phone,
//         country: data.country,
//         role: 'TUTOR',
//       });

//       if ((registerResult as any).error) {
//         toast({ title: 'Registration Failed', description: (registerResult as any).error, variant: 'destructive' });
//         return;
//       }

//       await apiClient.createTutorProfile({
//         headline: data.headline,
//         bio: data.bio,
//         hourlyRateCents: data.hourlyRate * 100,
//         currency: 'USD',
//         yearsExperience: data.yearsExperience,
//         subjects: data.subjects,
//         levels: data.levels,
//         slug: data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
//       });

//       toast({ title: 'Registration Successful', description: 'Your tutor profile has been created.' });
//       navigation.navigate('Main');
//     } catch (error) {
//       toast({ title: 'Registration Failed', description: 'Please try again.', variant: 'destructive' });
//     }
//   };

//   return (
//     <ScrollView
//       contentContainerStyle={{ paddingBottom: 40 }}
//       keyboardShouldPersistTaps="handled"
//       showsVerticalScrollIndicator={true}
//     >
//       <View style={styles.formContainer}>
//         <Text style={styles.formTitle}>Tutor Registration</Text>
//         <Text style={styles.formSubtitle}>Share your knowledge and help students succeed.</Text>

//         {/* Progress */}
//         <View style={styles.progressWrap}>
//           <Text style={styles.progressText}>Step {currentStep} of {STEPS.length}</Text>
//           <View style={styles.progressBar}>
//             <View style={[styles.progressFill, { width: `${progress}%` }]} />
//           </View>
//         </View>

//         {currentStep === 1 && (
//           <View style={styles.spaceY}>
//             <Controller
//               control={control}
//               name="name"
//               render={({ field: { onChange, value } }) => (
//                 <View style={styles.field}>
//                   <Text style={styles.label}>Full Name *</Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Enter your full name"
//                     placeholderTextColor="#9CA3AF"
//                     value={value ?? ''}
//                     onChangeText={onChange}
//                   />
//                   {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
//                 </View>
//               )}
//             />

//             <Controller
//               control={control}
//               name="email"
//               render={({ field: { onChange, value } }) => (
//                 <View style={styles.field}>
//                   <Text style={styles.label}>Email Address *</Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Enter your email"
//                     placeholderTextColor="#9CA3AF"
//                     value={value ?? ''}
//                     onChangeText={onChange}
//                     keyboardType="email-address"
//                     autoCapitalize="none"
//                   />
//                   {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
//                 </View>
//               )}
//             />

//             <Controller
//               control={control}
//               name="password"
//               render={({ field: { onChange, value } }) => (
//                 <View style={styles.field}>
//                   <Text style={styles.label}>Password *</Text>
//                   <View style={styles.passwordWrap}>
//                     <TextInput
//                       style={[styles.input, styles.passwordInput]}
//                       placeholder="••••••••"
//                       placeholderTextColor="#9CA3AF"
//                       secureTextEntry={!showPassword}
//                       value={value ?? ''}
//                       onChangeText={onChange}
//                     />
//                     <TouchableOpacity
//                       style={styles.eyeButton}
//                       onPress={() => setShowPassword(!showPassword)}
//                       hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
//                     >
//                       <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#374151" />
//                     </TouchableOpacity>
//                   </View>
//                   {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
//                 </View>
//               )}
//             />

//             <Controller
//               control={control}
//               name="phone"
//               render={({ field: { onChange, value } }) => (
//                 <View style={styles.field}>
//                   <Text style={styles.label}>Phone Number</Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Enter your phone number"
//                     placeholderTextColor="#9CA3AF"
//                     value={value ?? ''}
//                     onChangeText={onChange}
//                     keyboardType="phone-pad"
//                   />
//                 </View>
//               )}
//             />

//             <Controller
//               control={control}
//               name="country"
//               render={({ field: { onChange, value } }) => (
//                 <View style={styles.field}>
//                   <Text style={styles.label}>Country *</Text>
//                   <View style={styles.pickerWrap}>
//                     <Picker
//                       selectedValue={value ?? ''}
//                       onValueChange={(v) => onChange(v)}
//                       style={styles.picker}
//                       mode="dropdown"
//                     >
//                       <Picker.Item label="Select your country" value="" />
//                       {COUNTRIES.map((country) => (
//                         <Picker.Item key={country} label={country} value={country} />
//                       ))}
//                     </Picker>
//                   </View>
//                   {errors.country && <Text style={styles.errorText}>{errors.country.message}</Text>}
//                 </View>
//               )}
//             />
//           </View>
//         )}

//         {currentStep === 2 && (
//           <View style={styles.spaceY}>
//             <Controller
//               control={control}
//               name="headline"
//               render={({ field: { onChange, value } }) => (
//                 <View style={styles.field}>
//                   <Text style={styles.label}>Professional Headline *</Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="e.g., Experienced Math Tutor"
//                     placeholderTextColor="#9CA3AF"
//                     value={value ?? ''}
//                     onChangeText={onChange}
//                   />
//                   {errors.headline && <Text style={styles.errorText}>{errors.headline.message}</Text>}
//                 </View>
//               )}
//             />

//             <Controller
//               control={control}
//               name="bio"
//               render={({ field: { onChange, value } }) => (
//                 <View style={styles.field}>
//                   <Text style={styles.label}>Bio *</Text>
//                   <TextInput
//                     style={[styles.input, styles.textArea]}
//                     placeholder="Tell students about your experience..."
//                     placeholderTextColor="#9CA3AF"
//                     multiline
//                     textAlignVertical="top"
//                     value={value ?? ''}
//                     onChangeText={onChange}
//                   />
//                   {errors.bio && <Text style={styles.errorText}>{errors.bio.message}</Text>}
//                 </View>
//               )}
//             />

//             <Controller
//               control={control}
//               name="yearsExperience"
//               render={({ field: { onChange, value } }) => (
//                 <View style={styles.field}>
//                   <Text style={styles.label}>Years of Experience *</Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="0"
//                     placeholderTextColor="#9CA3AF"
//                     keyboardType="numeric"
//                     value={value?.toString() ?? ''}
//                     onChangeText={(text) => onChange(Number(text) || 0)}
//                   />
//                   {errors.yearsExperience && <Text style={styles.errorText}>{errors.yearsExperience.message}</Text>}
//                 </View>
//               )}
//             />
//           </View>
//         )}

//         {currentStep === 3 && (
//           <View style={styles.spaceY}>
//             <Text style={styles.label}>Subjects *</Text>
//             <Controller
//               control={control}
//               name="subjects"
//               render={({ field: { onChange, value } }) => (
//                 <View style={{ marginBottom: 8 }}>
//                   {SUBJECTS.map((subject) => (
//                     <TouchableOpacity
//                       key={subject}
//                       style={styles.choiceRow}
//                       onPress={() => {
//                         const newSubjects = value.includes(subject)
//                           ? value.filter((s) => s !== subject)
//                           : [...value, subject];
//                         onChange(newSubjects);
//                       }}
//                     >
//                       <Ionicons
//                         name={value.includes(subject) ? 'checkbox-outline' : 'square-outline'}
//                         size={20}
//                         color="#F97316"
//                       />
//                       <Text style={styles.choiceText}>{subject}</Text>
//                     </TouchableOpacity>
//                   ))}
//                   {errors.subjects && <Text style={styles.errorText}>{errors.subjects.message}</Text>}
//                 </View>
//               )}
//             />

//             <Text style={[styles.label, { marginTop: 12 }]}>Levels *</Text>
//             <Controller
//               control={control}
//               name="levels"
//               render={({ field: { onChange, value } }) => (
//                 <View style={{ marginBottom: 8 }}>
//                   {LEVELS.map((level) => (
//                     <TouchableOpacity
//                       key={level}
//                       style={styles.choiceRow}
//                       onPress={() => {
//                         const newLevels = value.includes(level)
//                           ? value.filter((l) => l !== level)
//                           : [...value, level];
//                         onChange(newLevels);
//                       }}
//                     >
//                       <Ionicons
//                         name={value.includes(level) ? 'checkbox-outline' : 'square-outline'}
//                         size={20}
//                         color="#F97316"
//                       />
//                       <Text style={styles.choiceText}>{level}</Text>
//                     </TouchableOpacity>
//                   ))}
//                   {errors.levels && <Text style={styles.errorText}>{errors.levels.message}</Text>}
//                 </View>
//               )}
//             />

//             <Controller
//               control={control}
//               name="hourlyRate"
//               render={({ field: { onChange, value } }) => (
//                 <View style={styles.field}>
//                   <Text style={styles.label}>Hourly Rate ($/hr) *</Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="25"
//                     placeholderTextColor="#9CA3AF"
//                     keyboardType="numeric"
//                     value={value?.toString() ?? ''}
//                     onChangeText={(text) => onChange(Number(text) || 0)}
//                   />
//                   {errors.hourlyRate && <Text style={styles.errorText}>{errors.hourlyRate.message}</Text>}
//                 </View>
//               )}
//             />
//           </View>
//         )}

//         <View style={styles.buttonRow}>
//           <TouchableOpacity
//             style={[styles.button, styles.buttonSecondary, currentStep === 1 && styles.buttonDisabled]}
//             onPress={prevStep}
//             disabled={currentStep === 1}
//           >
//             <Text style={styles.buttonTextSecondary}>Previous</Text>
//           </TouchableOpacity>

//           {currentStep < STEPS.length ? (
//             <TouchableOpacity
//               style={[styles.button, styles.buttonPrimary]}
//               onPress={nextStep}
//             >
//               <Text style={styles.buttonTextPrimary}>Next</Text>
//             </TouchableOpacity>
//           ) : (
//             <TouchableOpacity
//               style={[styles.button, styles.buttonPrimary]}
//               onPress={handleSubmit(onSubmit)}
//             >
//               <Text style={styles.buttonTextPrimary}>Complete Registration</Text>
//             </TouchableOpacity>
//           )}
//         </View>

//         <TouchableOpacity
//           style={styles.linkWrap}
//           onPress={() => navigation.navigate('Login')}
//         >
//           <Text style={styles.linkText}>Already have an account? Sign In</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// /* ---------------- Admin Form ---------------- */
// const AdminRegistrationFormMobile: React.FC = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const { toast } = useToast();
//   const { register } = useAuth();
//   const navigation = useNavigation<NavigationProp>();

//   const { control, handleSubmit, formState: { errors } } = useForm<AdminRegistrationForm>({
//     resolver: zodResolver(adminRegistrationSchema),
//   });

//   const onSubmit = async (data: AdminRegistrationForm) => {
//     if (data.adminCode !== 'ADMIN2024') {
//       toast({ title: 'Invalid Admin Code', description: 'Please enter the correct admin verification code.', variant: 'destructive' });
//       return;
//     }

//     try {
//       const { error } = await register({
//         name: data.name,
//         email: data.email,
//         password: data.password,
//         phone: data.phone,
//         country: data.country,
//         role: 'ADMIN',
//       });

//       if (error) {
//         toast({ title: 'Registration Failed', description: error, variant: 'destructive' });
//         return;
//       }

//       toast({ title: 'Admin Account Created', description: 'Welcome to the admin panel.' });
//       navigation.navigate('Main');
//     } catch (error) {
//       toast({ title: 'Registration Failed', description: 'Please try again.', variant: 'destructive' });
//     }
//   };

//   return (
//     <ScrollView
//       contentContainerStyle={{ paddingBottom: 40 }}
//       keyboardShouldPersistTaps="handled"
//       showsVerticalScrollIndicator={true}
//     >
//       <View style={styles.formContainer}>
//         <Text style={styles.formTitle}>Admin Registration</Text>
//         <Text style={styles.formSubtitle}>Manage tutors, students, and platform operations.</Text>

//         <Controller
//           control={control}
//           name="name"
//           render={({ field: { onChange, value } }) => (
//             <View style={styles.field}>
//               <Text style={styles.label}>Full Name *</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter your full name"
//                 placeholderTextColor="#9CA3AF"
//                 value={value ?? ''}
//                 onChangeText={onChange}
//               />
//               {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
//             </View>
//           )}
//         />

//         <Controller
//           control={control}
//           name="email"
//           render={({ field: { onChange, value } }) => (
//             <View style={styles.field}>
//               <Text style={styles.label}>Email Address *</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter your email"
//                 placeholderTextColor="#9CA3AF"
//                 value={value ?? ''}
//                 onChangeText={onChange}
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//               />
//               {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
//             </View>
//           )}
//         />

//         <Controller
//           control={control}
//           name="password"
//           render={({ field: { onChange, value } }) => (
//             <View style={styles.field}>
//               <Text style={styles.label}>Password *</Text>
//               <View style={styles.passwordWrap}>
//                 <TextInput
//                   style={[styles.input, styles.passwordInput]}
//                   placeholder="••••••••"
//                   placeholderTextColor="#9CA3AF"
//                   secureTextEntry={!showPassword}
//                   value={value ?? ''}
//                   onChangeText={onChange}
//                 />
//                 <TouchableOpacity
//                   style={styles.eyeButton}
//                   onPress={() => setShowPassword(!showPassword)}
//                   hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
//                 >
//                   <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#374151" />
//                 </TouchableOpacity>
//               </View>
//               {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
//             </View>
//           )}
//         />

//         <Controller
//           control={control}
//           name="phone"
//           render={({ field: { onChange, value } }) => (
//             <View style={styles.field}>
//               <Text style={styles.label}>Phone Number</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter your phone number"
//                 placeholderTextColor="#9CA3AF"
//                 value={value ?? ''}
//                 onChangeText={onChange}
//                 keyboardType="phone-pad"
//               />
//             </View>
//           )}
//         />

//         <Controller
//           control={control}
//           name="country"
//           render={({ field: { onChange, value } }) => (
//             <View style={styles.field}>
//               <Text style={styles.label}>Country *</Text>
//               <View style={styles.pickerWrap}>
//                 <Picker
//                   selectedValue={value ?? ''}
//                   onValueChange={(v) => onChange(v)}
//                   style={styles.picker}
//                   mode="dropdown"
//                 >
//                   <Picker.Item label="Select your country" value="" />
//                   {COUNTRIES.map((country) => (
//                     <Picker.Item key={country} label={country} value={country} />
//                   ))}
//                 </Picker>
//               </View>
//               {errors.country && <Text style={styles.errorText}>{errors.country.message}</Text>}
//             </View>
//           )}
//         />

//         <Controller
//           control={control}
//           name="adminCode"
//           render={({ field: { onChange, value } }) => (
//             <View style={styles.field}>
//               <Text style={styles.label}>Admin Code *</Text>
//               <View style={styles.passwordWrap}>
//                 <TextInput
//                   style={[styles.input, styles.passwordInput]}
//                   placeholder="Enter admin verification code"
//                   placeholderTextColor="#9CA3AF"
//                   secureTextEntry={!showPassword}
//                   value={value ?? ''}
//                   onChangeText={onChange}
//                 />
//                 <TouchableOpacity
//                   style={styles.eyeButton}
//                   onPress={() => setShowPassword(!showPassword)}
//                   hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
//                 >
//                   <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#374151" />
//                 </TouchableOpacity>
//               </View>
//               {errors.adminCode && <Text style={styles.errorText}>{errors.adminCode.message}</Text>}
//             </View>
//           )}
//         />

//         <TouchableOpacity
//           style={[styles.button, styles.buttonPrimary]}
//           onPress={handleSubmit(onSubmit)}
//         >
//           <Text style={styles.buttonTextPrimary}>Create Admin Account</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.linkWrap}
//           onPress={() => navigation.navigate('Login')}
//         >
//           <Text style={styles.linkText}>Already have an account? Sign In</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// /* ---------------- Styles ---------------- */
// const styles = StyleSheet.create({
//   screen: { flex: 1, backgroundColor: '#F9FAFB' },
//   scrollContent: { padding: 20, paddingBottom: 40, flexGrow: 1 },
//   header: { alignItems: 'center', marginBottom: 18 },
//   title: { fontSize: 20, fontWeight: '600', color: '#111827', marginTop: 12 },
//   subtitle: { color: '#6B7280', textAlign: 'center', marginTop: 6 },

//   tabsContainer: { backgroundColor: '#fff', borderRadius: 12, padding: 6, elevation: 2 },

//   formContainer: {
//     padding: 12,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     marginTop: 12,
//     // shadow for iOS
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.06,
//     shadowRadius: 12,
//     // elevation for Android
//     elevation: 2,
//     width: '100%',
//     maxWidth: 760,
//     alignSelf: 'center',
//   },
//   formTitle: { fontSize: 18, fontWeight: '600', color: '#111827', textAlign: 'center', marginBottom: 6 },
//   formSubtitle: { color: '#6B7280', textAlign: 'center', marginBottom: 12 },

//   progressWrap: { marginBottom: 12 },
//   progressText: { color: '#374151', marginBottom: 6 },
//   progressBar: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 999, overflow: 'hidden' },
//   progressFill: { height: 8, backgroundColor: '#F97316', borderRadius: 999 },

//   spaceY: { marginBottom: 6 },
//   field: { marginBottom: 12 },

//   label: { fontSize: 13, color: '#374151', marginBottom: 6 },
//   input: {
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//     borderRadius: 14,
//     paddingHorizontal: 12,
//     paddingVertical: Platform.OS === 'ios' ? 12 : 10,
//     backgroundColor: '#F9FAFB',
//     color: '#111827',
//   },
//   textArea: { height: 120 },

//   passwordWrap: { position: 'relative', justifyContent: 'center' },
//   passwordInput: { paddingRight: 44 },
//   eyeButton: { position: 'absolute', right: 10, top: Platform.OS === 'ios' ? 12 : 11 },

//   pickerWrap: {
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//     borderRadius: 14,
//     overflow: 'hidden',
//     backgroundColor: '#F9FAFB',
//   },
//   picker: { height: 48, width: '100%' },

//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 12,
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   button: { flex: 1, borderRadius: 14, paddingVertical: 12, alignItems: 'center', minWidth: 120 },
//   buttonPrimary: { backgroundColor: '#F97316', marginLeft: 8 },
//   buttonSecondary: { backgroundColor: '#E5E7EB', marginRight: 8 },
//   buttonDisabled: { opacity: 0.6 },
//   buttonTextPrimary: { color: '#fff', fontWeight: '700' },
//   buttonTextSecondary: { color: '#374151', fontWeight: '600' },

//   linkWrap: { marginTop: 12, alignItems: 'center' },
//   linkText: { color: '#F97316', fontWeight: '600' },

//   errorText: { color: '#DC2626', marginTop: 6 },

//   choiceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
//   choiceText: { marginLeft: 8, color: '#374151' },
// });

// screens/SignUpScreen.tsx
// screens/SignUpScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
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
  Main: undefined;
  StudentDashboard: undefined;
  TutorDashboard: undefined;
  AdminDashboard: undefined;
  // add other routes as needed
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// In production → move to .env or secure config / secrets manager
const ADMIN_SECURITY_KEY = 'TutorsPool2024Admin!';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    role: z.enum(['student', 'tutor', 'admin']),
    adminKey: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function SignUpScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  const navigation = useNavigation<NavigationProp>();
  const { toast } = useToast();
  const { signUp } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'student',
      adminKey: '',
    },
  });

  const currentRole = watch('role') as UserRole;

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setValue('role', role);
    if (role !== 'admin') {
      setValue('adminKey', '');
    }
  };

  const onSubmit = async (data: RegisterForm) => {
    if (data.role === 'admin' && data.adminKey !== ADMIN_SECURITY_KEY) {
      toast({
        title: 'Invalid Security Key',
        description: 'Please enter the correct admin security key.',
        variant: 'destructive',
      });
      return;
    }

    const result = await signUp(
      data.email,
      data.password,
      data.name,
      data.role,
      data.role === 'admin' ? data.adminKey : undefined
    );

    if (result.error) {
      toast({
        title: 'Registration Failed',
        description: result.error,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Account Created!',
      description: `Welcome to TutorsPool as ${data.role}!`,
    });

    // Adjust route names according to your actual navigator setup
    // Currently all go to 'Main' – you can customize per role later
    if (data.role === 'student') navigation.replace('StudentDashboard');
    else if (data.role === 'tutor') navigation.replace('TutorDashboard');
    else if (data.role === 'admin') navigation.replace('AdminDashboard');
    else navigation.replace('Main');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Join TutorsPool</Text>
          <Text style={styles.subtitle}>
            Create your account and start your learning or teaching journey
          </Text>
        </View>

        {/* Role Selection */}
        <View style={styles.roleContainer}>
          <Text style={styles.label}>I want to register as</Text>
          <View style={styles.roleButtons}>
            {(['student', 'tutor', 'admin'] as UserRole[]).map((role) => (
              <TouchableOpacity
                key={role}
                style={[
                  styles.roleButton,
                  selectedRole === role && styles.roleButtonActive,
                ]}
                onPress={() => handleRoleSelect(role)}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    selectedRole === role && styles.roleButtonTextActive,
                  ]}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          {/* Full Name */}
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <View style={styles.field}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color="#9ca3af"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, errors.name && styles.inputError]}
                    placeholder="John Doe"
                    value={value ?? ''}
                    onChangeText={onChange}
                    autoCapitalize="words"
                  />
                </View>
                {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
              </View>
            )}
          />

          {/* Email */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <View style={styles.field}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color="#9ca3af"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    placeholder="you@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={value ?? ''}
                    onChangeText={onChange}
                  />
                </View>
                {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
              </View>
            )}
          />

          {/* Password */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <View style={styles.field}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#9ca3af"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, errors.password && styles.inputError, { paddingRight: 48 }]}
                    placeholder="••••••••"
                    secureTextEntry={!showPassword}
                    value={value ?? ''}
                    onChangeText={onChange}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color="#6b7280"
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
              </View>
            )}
          />

          {/* Confirm Password */}
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <View style={styles.field}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#9ca3af"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, errors.confirmPassword && styles.inputError, { paddingRight: 48 }]}
                    placeholder="••••••••"
                    secureTextEntry
                    value={value ?? ''}
                    onChangeText={onChange}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color="#6b7280"
                    />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
                )}
              </View>
            )}
          />

          {/* Admin Security Key – shown only for admin */}
          {currentRole === 'admin' && (
            <Controller
              control={control}
              name="adminKey"
              render={({ field: { onChange, value } }) => (
                <View style={styles.field}>
                  <Text style={styles.label}>Admin Security Key</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="key-outline"
                      size={20}
                      color="#9ca3af"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, errors.adminKey && styles.inputError]}
                      placeholder="Enter admin security key"
                      secureTextEntry
                      value={value ?? ''}
                      onChangeText={onChange}
                    />
                  </View>
                  {errors.adminKey && (
                    <Text style={styles.errorText}>{errors.adminKey.message}</Text>
                  )}
                  <Text style={styles.helperText}>
                    Contact an existing administrator to obtain the key.
                  </Text>
                </View>
              )}
            />
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>
              Create {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} Account
            </Text>
          </TouchableOpacity>

          {/* Login link */}
          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginLinkText}>
              Already have an account? <Text style={styles.loginLinkHighlight}>Sign in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 60,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  roleContainer: {
    marginBottom: 32,
  },
  roleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  roleButtonActive: {
    borderColor: '#f97316',
    backgroundColor: '#fff7ed',
  },
  roleButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#4b5563',
  },
  roleButtonTextActive: {
    color: '#f97316',
    fontWeight: '600',
  },
  form: {
    gap: 8,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 14,
    paddingLeft: 48,           // ← space for icon
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#111827',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  inputIcon: {
    position: 'absolute',
    left: 14,
    top: 14,
    zIndex: 1,
  },
  eyeIcon: {
    position: 'absolute',
    right: 14,
    top: 14,
    zIndex: 1,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 13,
    marginTop: 6,
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 6,
  },
  submitButton: {
    backgroundColor: '#f97316',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 24,
  },
  loginLinkText: {
    fontSize: 15,
    color: '#4b5563',
  },
  loginLinkHighlight: {
    color: '#f97316',
    fontWeight: '600',
  },
});