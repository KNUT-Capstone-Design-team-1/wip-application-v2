import { Modal, Pressable, View, Text } from 'react-native';
import { styles } from '../../styles/organisms/CameraGuideModal';
import ImageSearchGuide from './ImageSearchGuide';
import { X } from 'lucide-react-native';
import { fontPx } from '@utils/responsive';
import { COLOR_GRAY } from '@constants/color';

interface ICameraGuideModalProps {
  visible: boolean;
  onClose: () => void;
}

const CameraGuideModal = ({ visible, onClose }: ICameraGuideModalProps) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.container} onPress={onClose}>
        <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
          <ImageSearchGuide />
          <Pressable
            style={({ pressed }) => [
              styles.closeButton,
              pressed && { opacity: 0.4 },
            ]}
            onPress={onClose}
          >
            <X size={fontPx(24)} strokeWidth={3} color={COLOR_GRAY[300]} />
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default CameraGuideModal;
