import Toast from 'react-native-toast-message';

export const useToast = () => {
  const toast = ({ title, description, variant }: { title: string; description?: string; variant?: 'default' | 'destructive' }) => {
    Toast.show({
      type: variant === 'destructive' ? 'error' : 'info',
      text1: title,
      text2: description,
      position: 'top',
    });
  };

  return { toast };
};