// screens/student/StudentDashboard.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';
import { getStudentSessions, getStudentGoals, Session, LearningGoal } from '../../lib/firestore';

type RootStackParamList = {
  StudentDashboard: undefined;
  Sessions: undefined;
  Goals: undefined;
  Tutors: undefined;
  // add your other routes here
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

interface CareerSuggestion {
  career: string;
  description: string;
  matchScore: number;
}

export default function StudentDashboardScreen() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const navigation = useNavigation<NavigationProp>();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [goals, setGoals] = useState<LearningGoal[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<CareerSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (userProfile?.uid) {
      fetchData(userProfile.uid);
    }
  }, [userProfile?.uid]);

  const fetchData = async (uid: string) => {
    try {
      const [sessionsData, goalsData] = await Promise.all([
        getStudentSessions(uid),
        getStudentGoals(uid),
      ]);

      setSessions(sessionsData);
      setGoals(goalsData);

      if (goalsData.length > 0) {
        generateAISuggestions(goalsData);
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Local fallback version of career suggestions (same logic as your web version)
  const generateAISuggestions = (goalsList: LearningGoal[]) => {
    setAiLoading(true);

    // You can replace this with real Supabase / AI call if you want
    const suggestions = buildLocalSuggestions(goalsList);
    setAiSuggestions(suggestions);

    setAiLoading(false);
  };

  const buildLocalSuggestions = (goalsList: LearningGoal[]): CareerSuggestion[] => {
    const subjects = [...new Set(goalsList.map((g) => g.subject))];
    const avgProgress = goalsList.reduce((sum, g) => sum + g.progress, 0) / (goalsList.length || 1);

    const careerMap: Record<string, CareerSuggestion[]> = {
      Mathematics: [
        { career: 'Data Scientist', description: 'Analyze complex data', matchScore: 95 },
        { career: 'Financial Analyst', description: 'Quantitative financial planning', matchScore: 88 },
      ],
      Physics: [
        { career: 'Engineer', description: 'Design real-world solutions', matchScore: 92 },
        { career: 'Aerospace Engineer', description: 'Aircraft & spacecraft', matchScore: 87 },
      ],
      Chemistry: [
        { career: 'Pharmacist', description: 'Develop medications', matchScore: 90 },
        { career: 'Chemical Engineer', description: 'Chemical processes', matchScore: 88 },
      ],
      Biology: [
        { career: 'Medical Doctor', description: 'Diagnose & treat patients', matchScore: 94 },
        { career: 'Biotechnologist', description: 'Biological products', matchScore: 89 },
      ],
      'Computer Science': [
        { career: 'Software Engineer', description: 'Build applications', matchScore: 96 },
        { career: 'AI Engineer', description: 'Develop intelligent systems', matchScore: 93 },
      ],
      // Add more subjects as needed
    };

    const suggestions: CareerSuggestion[] = [];
    subjects.forEach((subject) => {
      const careers = careerMap[subject] || careerMap['Computer Science'] || [];
      suggestions.push(...careers.slice(0, 2));
    });

    return suggestions
      .map((s) => ({
        ...s,
        matchScore: Math.round(s.matchScore * (0.7 + (avgProgress / 100) * 0.3)),
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);
  };

  const completedSessions = sessions.filter((s) => s.status === 'completed').length;
  const upcomingSessions = sessions.filter(
    (s) => s.status === 'accepted' && new Date(s.date) >= new Date()
  );
  const totalHours = completedSessions; // assuming 1h per session
  const avgGoalProgress =
    goals.length > 0 ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length) : 0;

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Greeting */}
      <Text style={styles.greeting}>
        Welcome back, {userProfile?.fullName?.split(' ')[0] || 'Student'}!
      </Text>
      <Text style={styles.subtitle}>Track your progress and keep learning</Text>

      {/* Stats */}
      <View style={styles.statsGrid}>
        {[
          { label: 'Sessions Completed', value: completedSessions, icon: 'videocam-outline', color: '#f97316' },
          { label: 'Learning Goals', value: goals.length, icon: 'flag-outline', color: '#10b981' },
          { label: 'Hours Learned', value: totalHours, icon: 'time-outline', color: '#f59e0b' },
          { label: 'Avg Progress', value: `${avgGoalProgress}%`, icon: 'trending-up-outline', color: '#f97316' },
        ].map((stat, i) => (
          <View key={i} style={styles.statCard}>
            <View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
            <Ionicons name={stat.icon as any} size={32} color={stat.color} />
          </View>
        ))}
      </View>

      {/* Upcoming Sessions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Sessions')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {upcomingSessions.length === 0 ? (
          <Text style={styles.emptyText}>No upcoming sessions</Text>
        ) : (
          upcomingSessions.slice(0, 3).map((session) => (
            <View key={session.id} style={styles.sessionItem}>
              <View>
                <Text style={styles.sessionSubject}>{session.subject}</Text>
                <Text style={styles.sessionTutor}>with {session.tutorName}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.sessionDate}>
                  {new Date(session.date).toLocaleDateString()}
                </Text>
                <Text style={styles.sessionTime}>{session.time}</Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* AI Career Suggestions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>AI Career Insights</Text>
          <Ionicons name="sparkles-outline" size={20} color="#f59e0b" />
        </View>

        {aiLoading ? (
          <ActivityIndicator size="small" color="#f97316" style={{ marginVertical: 20 }} />
        ) : aiSuggestions.length === 0 ? (
          <Text style={styles.emptyText}>Add learning goals to see career suggestions</Text>
        ) : (
          aiSuggestions.map((s, i) => (
            <View key={i} style={styles.suggestionCard}>
              <View style={styles.suggestionHeader}>
                <Text style={styles.suggestionTitle}>{s.career}</Text>
                <View style={styles.matchBadge}>
                  <Text style={styles.matchText}>{s.matchScore}% match</Text>
                </View>
              </View>
              <Text style={styles.suggestionDesc}>{s.description}</Text>
            </View>
          ))
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Goals')}>
          <Ionicons name="flag-outline" size={24} color="white" />
          <Text style={styles.actionText}>Manage Goals</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Tutors')}>
          <Ionicons name="people-outline" size={24} color="white" />
          <Text style={styles.actionText}>Find Tutors</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },

  // ── Fixed: added missing center style ──────────────────────────────
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 16,
    color: '#6b7280',
    fontSize: 16,
  },

  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },

  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  seeAll: {
    color: '#f97316',
    fontWeight: '600',
  },

  sessionItem: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionSubject: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  sessionTutor: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  sessionDate: {
    fontSize: 14,
    fontWeight: '500',
  },
  sessionTime: {
    fontSize: 13,
    color: '#6b7280',
  },

  suggestionCard: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  matchBadge: {
    backgroundColor: '#fefce8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  matchText: {
    color: '#ca8a04',
    fontSize: 12,
    fontWeight: '600',
  },
  suggestionDesc: {
    fontSize: 14,
    color: '#4b5563',
  },

  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 15,
    paddingVertical: 20,
  },

  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#f97316',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  actionText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
});