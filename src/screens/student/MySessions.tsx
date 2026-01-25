// screens/student/MySessions.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';
import { getStudentSessions, getSessionReview, Session } from '../../lib/firestore';
import ReviewModal from '../../components/ReviewModal';
export default function MySessionsScreen() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const navigation = useNavigation<any>();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [reviewedSessions, setReviewedSessions] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (userProfile?.uid) {
      fetchSessions(userProfile.uid);
    }
  }, [userProfile?.uid]);

  const fetchSessions = async (uid: string) => {
    try {
      const data = await getStudentSessions(uid);
      setSessions(data);

      // Check which completed sessions already have reviews
      const completed = data.filter((s) => s.status === 'completed');
      const reviewedIds = new Set<string>();

      for (const session of completed) {
        if (session.id) {
          const review = await getSessionReview(session.id);
          if (review) reviewedIds.add(session.id);
        }
      }

      setReviewedSessions(reviewedIds);
    } catch (err) {
      console.error('Failed to load sessions:', err);
      toast({ title: 'Error', description: 'Failed to load sessions', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const upcomingSessions = sessions.filter((s) => s.status === 'accepted');
  const pendingSessions = sessions.filter((s) => s.status === 'pending');
  const pastSessions = sessions.filter((s) =>
    ['completed', 'declined', 'cancelled'].includes(s.status)
  );

  const openReviewModal = (session: Session) => {
    setSelectedSession(session);
    setReviewModalVisible(true);
  };

  const SessionCard = ({ session }: { session: Session }) => {
    const hasReview = session.id ? reviewedSessions.has(session.id) : false;
    const canReview = session.status === 'completed' && !hasReview;

    const statusColor =
      session.status === 'accepted'
        ? '#10b981'
        : session.status === 'pending'
        ? '#f59e0b'
        : session.status === 'declined' || session.status === 'cancelled'
        ? '#ef4444'
        : '#6b7280';

    return (
      <View style={[styles.sessionCard, { borderLeftColor: statusColor }]}>
        <View style={styles.sessionHeader}>
          <View>
            <Text style={styles.sessionSubject}>{session.subject}</Text>
            <Text style={styles.sessionTutor}>with {session.tutorName}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.sessionInfo}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color="#6b7280" />
            <Text style={styles.infoText}>{session.date}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color="#6b7280" />
            <Text style={styles.infoText}>{session.time}</Text>
          </View>
        </View>

        {session.status === 'accepted' && session.zoomLink && (
          <TouchableOpacity
            style={styles.joinButton}
            onPress={() => {
              Linking.openURL(session.zoomLink!).catch(() =>
                Alert.alert('Error', 'Could not open Zoom link')
              );
            }}
          >
            <Ionicons name="videocam-outline" size={18} color="white" />
            <Text style={styles.joinButtonText}>Join Session</Text>
          </TouchableOpacity>
        )}

        {canReview && (
          <TouchableOpacity style={styles.reviewButton} onPress={() => openReviewModal(session)}>
            <Ionicons name="star-outline" size={18} color="#f97316" />
            <Text style={styles.reviewButtonText}>Leave Review</Text>
          </TouchableOpacity>
        )}

        {hasReview && (
          <View style={styles.reviewedBadge}>
            <Ionicons name="star" size={16} color="#fbbf24" />
            <Text style={styles.reviewedText}>Review submitted</Text>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={styles.loadingText}>Loading your sessions...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.title}>My Sessions</Text>
      </View>

      {/* Tabs-like section headers */}
      <View style={styles.tabsContainer}>
        <Text style={styles.tabTitle}>Upcoming ({upcomingSessions.length})</Text>
        {upcomingSessions.length === 0 ? (
          <Text style={styles.emptyText}>
            No upcoming sessions.{' '}
            <Text style={styles.linkText} onPress={() => navigation.navigate('Tutors')}>
              Book one now!
            </Text>
          </Text>
        ) : (
          upcomingSessions.map((session) => <SessionCard key={session.id} session={session} />)
        )}

        <Text style={[styles.tabTitle, { marginTop: 32 }]}>Pending ({pendingSessions.length})</Text>
        {pendingSessions.length === 0 ? (
          <Text style={styles.emptyText}>No pending requests</Text>
        ) : (
          pendingSessions.map((session) => <SessionCard key={session.id} session={session} />)
        )}

        <Text style={[styles.tabTitle, { marginTop: 32 }]}>Past ({pastSessions.length})</Text>
        {pastSessions.length === 0 ? (
          <Text style={styles.emptyText}>No past sessions</Text>
        ) : (
          pastSessions.map((session) => <SessionCard key={session.id} session={session} />)
        )}
      </View>

      {/* Review Modal */}
      {selectedSession && (
        <ReviewModal
          visible={reviewModalVisible}
          onClose={() => {
            setReviewModalVisible(false);
            setSelectedSession(null);
          }}
          session={selectedSession}
          onReviewSubmitted={() => {
            if (userProfile?.uid) fetchSessions(userProfile.uid);
          }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 20, paddingBottom: 80 },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: { marginTop: 16, fontSize: 16, color: '#6b7280' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: { paddingRight: 16 },
  title: { fontSize: 26, fontWeight: '700', color: '#1f2937' },

  tabsContainer: { marginTop: 16 },
  tabTitle: { fontSize: 20, fontWeight: '600', color: '#1f2937', marginBottom: 12 },

  sessionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sessionSubject: { fontSize: 17, fontWeight: '600', color: '#1f2937' },
  sessionTutor: { fontSize: 14, color: '#6b7280', marginTop: 2 },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: { fontSize: 12, fontWeight: '600' },

  sessionInfo: { marginBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  infoText: { fontSize: 14, color: '#6b7280', marginLeft: 6 },

  joinButton: {
    flexDirection: 'row',
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  joinButtonText: { color: 'white', fontWeight: '600', marginLeft: 8 },

  reviewButton: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  reviewButtonText: { color: '#f97316', fontWeight: '600', marginLeft: 8 },

  reviewedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  reviewedText: { color: '#fbbf24', fontSize: 14, marginLeft: 6 },

  emptyText: { textAlign: 'center', color: '#6b7280', fontSize: 15, marginVertical: 20 },
  linkText: { color: '#f97316', fontWeight: '600' },
});