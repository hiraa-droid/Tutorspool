// components/ReviewModal.tsx
import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useToast } from '../hooks/use-toast';
import { Session } from '../lib/firestore'; // adjust path

interface ReviewModalProps {
  visible: boolean;
  onClose: () => void;
  session: Session;
  onReviewSubmitted: () => void;
}

export default function ReviewModal({ visible, onClose, session, onReviewSubmitted }: ReviewModalProps) {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({ title: 'Error', description: 'Please select a rating', variant: 'destructive' });
      return;
    }

    try {
      // TODO: Call your Firestore function to save review
      // await createSessionReview(session.id, { rating, comment, studentId: ... });

      toast({ title: 'Review Submitted', description: 'Thank you for your feedback!' });
      onReviewSubmitted();
      onClose();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to submit review', variant: 'destructive' });
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Review Session</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <Text style={styles.sessionInfo}>
            {session.subject} with {session.tutorName}
          </Text>

          <Text style={styles.label}>Rating</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={32}
                  color={star <= rating ? '#fbbf24' : '#d1d5db'}
                  style={{ marginHorizontal: 4 }}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Comments (optional)</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Share your experience..."
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit Review</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: { fontSize: 20, fontWeight: '700' },
  sessionInfo: { fontSize: 16, color: '#4b5563', marginBottom: 16 },
  label: { fontSize: 15, fontWeight: '500', color: '#374151', marginBottom: 8 },
  ratingContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  textArea: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#f97316',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitText: { color: 'white', fontSize: 16, fontWeight: '600' },
});