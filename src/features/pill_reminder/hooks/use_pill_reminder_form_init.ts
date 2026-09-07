import {
  IUsePillReminderFormInitParams,
  IUsePillReminderFormInitReturn,
} from '@features/pill_reminder/types';
import { pillReminderService } from '@features/pill_reminder/services/pill_reminder_service';
import { pillReminderNotificationService } from '@features/pill_reminder/services/pill_reminder_notification_service';
import { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';

// 복용 알림 폼의 초기 데이터 로드 훅
export const usePillReminderFormInit = ({
  reminderId,
  initialItemSeqs,
  setTitle,
  setMemo,
  setTimes,
  setDays,
  setSelectedPills,
  setSelectedFolderId,
  setSelectedFolderName,
}: IUsePillReminderFormInitParams): IUsePillReminderFormInitReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState<boolean>(true);
  const isEditMode = Boolean(reminderId);

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);

      try {
        const granted =
          await pillReminderNotificationService.initPermissions(true);
        setHasPermission(granted);

        if (isEditMode && reminderId) {
          const reminder = await pillReminderService.getReminderById(
            parseInt(reminderId, 10),
          );

          if (reminder) {
            setTitle(reminder.title || '');
            setMemo(reminder.memo || '');

            const initialTimes =
              reminder.times && reminder.times.length > 0
                ? reminder.times
                : [reminder.time || '08:00'];

            setTimes(initialTimes);
            setDays(reminder.days);
            setSelectedFolderId(reminder.folder_id);

            setSelectedPills(
              reminder.items.map((item) => ({
                item_seq: item.item_seq,
                item_name: item.item_name,
                dosage: item.dosage || 1,
                item_image: item.item_image,
                class_name: item.class_name,
                entp_name: item.entp_name,
              })),
            );

            const firstSeq = reminder.items[0]?.item_seq;
            if (firstSeq) {
              const folderInfo =
                await pillReminderService.getFolderInfoByItemSeq(firstSeq);
              if (folderInfo) {
                setSelectedFolderId(folderInfo.id);
                setSelectedFolderName(folderInfo.name);
              }
            }
          }

          return;
        }

        let seqs: string[] = [];
        if (initialItemSeqs) {
          try {
            seqs = JSON.parse(initialItemSeqs);
          } catch {
            seqs = [initialItemSeqs];
          }
        }

        if (seqs.length > 0) {
          const pillsInfo = await pillReminderService.getPillsBySeqs(seqs);

          setSelectedPills(
            pillsInfo.map((p) => ({
              item_seq: p.item_seq,
              item_name: p.item_name,
              dosage: 1,
              item_image: p.item_image,
              class_name: p.class_name,
              entp_name: p.entp_name,
            })),
          );

          const firstSeq = seqs[0];
          if (firstSeq) {
            const folderInfo =
              await pillReminderService.getFolderInfoByItemSeq(firstSeq);
            if (folderInfo) {
              setSelectedFolderId(folderInfo.id);
              setSelectedFolderName(folderInfo.name);
            }
          }
        }
      } catch {
        Toast.show({
          type: 'error',
          text1: '알림 정보를 불러오는데 실패했습니다.',
        });
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [
    reminderId,
    initialItemSeqs,
    isEditMode,
    setTitle,
    setMemo,
    setTimes,
    setDays,
    setSelectedPills,
    setSelectedFolderId,
    setSelectedFolderName,
  ]);

  return { loading, hasPermission, isEditMode };
};
