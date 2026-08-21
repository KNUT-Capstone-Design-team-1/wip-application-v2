import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: px(20),
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: px(16),
    padding: px(24),
    alignItems: 'center',
  },
  title: {
    marginBottom: px(12),
    color: '#333',
  },
  description: {
    marginBottom: px(16),
    color: '#555',
    textAlign: 'center',
  },
  listContainer: {
    width: '100%',
    maxHeight: px(150),
    backgroundColor: '#f5f5f5',
    borderRadius: px(8),
    marginBottom: px(16),
  },
  listContent: {
    padding: px(12),
  },
  listItem: {
    marginBottom: px(8),
  },
  listTitle: {
    color: '#333',
  },
  listVersion: {
    color: '#666',
    marginLeft: px(12),
    marginTop: px(2),
  },
  warningContainer: {
    marginBottom: px(24),
    alignItems: 'center',
  },
  warningText: {
    color: '#E53935', // 빨간 글씨
    textAlign: 'center',
    lineHeight: px(16),
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: px(12),
  },
  cancelButton: {
    flex: 1,
    paddingVertical: px(12),
    backgroundColor: '#f0f0f0',
    borderRadius: px(8),
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: px(12),
    backgroundColor: '#357AE8',
    borderRadius: px(8),
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
  },
});
