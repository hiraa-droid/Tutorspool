// screens/student/LearningGoals.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';
import {
  getStudentGoals,
  createLearningGoal,
  updateLearningGoal,
  deleteLearningGoal,
  LearningGoal,
} from '../../lib/firestore';

export default function LearningGoalsScreen() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const navigation = useNavigation<any>();

  const [goals, setGoals] = useState<LearningGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState<LearningGoal | null>(null);

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (userProfile?.uid) {
      fetchGoals(userProfile.uid);
    }
  }, [userProfile?.uid]);

  const fetchGoals = async (uid: string) => {
    try {
      const data = await getStudentGoals(uid);
      setGoals(data);
    } catch (err) {
      console.error('Failed to fetch goals:', err);
      toast({ title: 'Error', description: 'Failed to load goals', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setSubject('');
    setProgress(0);
    setEditingGoal(null);
  };

  const openModal = (goal?: LearningGoal) => {
    if (goal) {
      setEditingGoal(goal);
      setTitle(goal.title || '');
      setSubject(goal.subject || '');
      setProgress(goal.progress || 0);
    } else {
      resetForm();
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!userProfile?.uid || !title.trim() || !subject.trim()) {
      toast({ title: 'Error', description: 'Title and subject are required', variant: 'destructive' });
      return;
    }

    try {
      if (editingGoal?.id) {
        await updateLearningGoal(editingGoal.id, { title, subject, progress });
        toast({ title: 'Goal updated' });
      } else {
        await createLearningGoal({
          studentId: userProfile.uid,
          title,
          subject,
          progress: 0,
          createdAt: new Date().toISOString(),
        });
        toast({ title: 'Goal created' });
      }
      setModalVisible(false);
      resetForm();
      fetchGoals(userProfile.uid);
    } catch (err) {
      console.error('Save goal error:', err);
      toast({ title: 'Error', description: 'Failed to save goal', variant: 'destructive' });
    }
  };

  const handleDelete = (goalId?: string) => {
    if (!goalId) return;

    Alert.alert('Delete Goal', 'Are you sure you want to delete this goal?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteLearningGoal(goalId);
            toast({ title: 'Goal deleted' });
            fetchGoals(userProfile!.uid);
          } catch (err) {
            console.error('Delete goal error:', err);
            toast({ title: 'Error', description: 'Failed to delete goal', variant: 'destructive' });
          }
        },
      },
    ]);
  };

  const updateProgress = async (goal: LearningGoal, newProgress: number) => {
    if (!goal.id || !userProfile?.uid) return;

    try {
      await updateLearningGoal(goal.id, { progress: newProgress });
      fetchGoals(userProfile.uid);
    } catch (err) {
      console.error('Progress update failed:', err);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={styles.loadingText}>Loading your goals...</Text>
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
        <Text style={styles.title}>Learning Goals</Text>
      </View>

      {/* Add Goal Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.addButtonText}>Add New Goal</Text>
      </TouchableOpacity>

      {/* Goals List */}
      {goals.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="flag-outline" size={64} color="#d1d5db" />
          <Text style={styles.emptyText}>No learning goals yet</Text>
          <Text style={styles.emptySubtext}>Create your first goal to start tracking progress</Text>
        </View>
      ) : (
        goals.map((goal) => (
          <View key={goal.id} style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <View>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Text style={styles.goalSubject}>{goal.subject}</Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => openModal(goal)}>
                  <Ionicons name="pencil" size={20} color="#f97316" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(goal.id)}>
                  <Ionicons name="trash-outline" size={20} color="#ef4444" style={{ marginLeft: 12 }} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${goal.progress}%` }]} />
              </View>
              <Text style={styles.progressText}>{goal.progress}%</Text>
            </View>

            <View style={styles.progressButtons}>
              {[25, 50, 75, 100].map((val) => (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.progressBtn,
                    goal.progress >= val && styles.progressBtnActive,
                  ]}
                  onPress={() => updateProgress(goal, val)}
                >
                  <Text
                    style={[
                      styles.progressBtnText,
                      goal.progress >= val && styles.progressBtnTextActive,
                    ]}
                  >
                    {val}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))
      )}

      {/* Add/Edit Goal Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingGoal ? 'Edit Goal' : 'New Goal'}</Text>

            <Text style={styles.modalLabel}>Goal Title</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Master Calculus"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.modalLabel}>Subject</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Mathematics"
              value={subject}
              onChangeText={setSubject}
            />

            {editingGoal && (
              <>
                <Text style={styles.modalLabel}>Progress: {progress}%</Text>
                <View style={styles.sliderContainer}>
                  <Text style={{ fontSize: 16, color: '#f97316' }}>0</Text>
                  <View style={styles.sliderTrack}>
                    <View style={[styles.sliderFill, { width: `${progress}%` }]} />
                  </View>
                  <Text style={{ fontSize: 16, color: '#f97316' }}>100</Text>
                </View>
              </>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveText}>{editingGoal ? 'Update' : 'Create'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 20, paddingBottom: 80 },

  // ── Added missing style to fix TS error ──────────────────────────────
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: { paddingRight: 16 },
  title: { fontSize: 26, fontWeight: '700', color: '#1f2937' },

  addButton: {
    flexDirection: 'row',
    backgroundColor: '#f97316',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  addButtonText: { color: 'white', fontSize: 16, fontWeight: '600', marginLeft: 8 },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#4b5563', marginTop: 16 },
  emptySubtext: { fontSize: 15, color: '#6b7280', textAlign: 'center', marginTop: 8 },

  goalCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  goalTitle: { fontSize: 17, fontWeight: '600', color: '#1f2937' },
  goalSubject: { fontSize: 14, color: '#6b7280', marginTop: 2 },
  actions: { flexDirection: 'row', alignItems: 'center' },

  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressFill: { height: '100%', backgroundColor: '#f97316' },
  progressText: { fontSize: 15, fontWeight: '600', color: '#f97316', minWidth: 40, textAlign: 'right' },

  progressButtons: { flexDirection: 'row', gap: 8 },
  progressBtn: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  progressBtnActive: { backgroundColor: '#f97316' },
  progressBtnText: { fontSize: 14, fontWeight: '600', color: '#4b5563' },
  progressBtnTextActive: { color: 'white' },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: { fontSize: 22, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  modalLabel: { fontSize: 15, fontWeight: '500', color: '#374151', marginBottom: 6 },
  modalInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  sliderTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  sliderFill: { height: '100%', backgroundColor: '#f97316' },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelText: { fontSize: 16, fontWeight: '600', color: '#4b5563' },
  saveButton: {
    flex: 1,
    backgroundColor: '#f97316',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveText: { fontSize: 16, fontWeight: '600', color: 'white' },
});