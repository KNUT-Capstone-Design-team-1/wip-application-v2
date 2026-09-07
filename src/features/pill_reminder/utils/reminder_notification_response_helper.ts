import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { pillReminderNotificationRepository } from '@features/pill_reminder/data/repositories/pill_reminder_notification_repository';
import { pillReminderQueryService } from '@features/pill_reminder/services/pill_reminder_query_service';
import {
  DEFAULT_NOTIFICATION_TITLE,
  NOTIFICATION_TOAST_VISIBILITY_MS,
  NOTIFICATION_ACTION_CONFIRM,
  NOTIFICATION_ACTION_SNOOZE,
  NOTIFICATION_ACTION_DISMISS,
  SNOOZE_DELAY_SECONDS,
} from '@features/pill_reminder/constants/reminder_notification_constant';
import { NotificationReminderData } from '@features/pill_reminder/types/pill_reminder_notification_type';
import logger from '@utils/logger';

// 네이티브 오류 정보를 JSON으로 보존한다.
export const describeNotificationError = (error: unknown): string => {
  if (error instanceof Error) {
    const details = Object.getOwnPropertyNames(error).reduce<
      Record<string, unknown>
    >((result, key) => {
      result[key] = (error as unknown as Record<string, unknown>)[key];
      return result;
    }, {});

    return JSON.stringify({
      name: error.name,
      message: error.message,
      ...details,
    });
  }

  return String(error);
};

// 알림 응답 데이터에서 유효한 복용 알림 ID를 추출한다.
export const getReminderId = (
  response: Notifications.NotificationResponse,
): number | undefined => {
  const data = response.notification.request.content
    .data as NotificationReminderData;
  const value = data?.reminderId;
  const reminderId =
    typeof value === 'string' ? Number.parseInt(value, 10) : value;

  return typeof reminderId === 'number' &&
    Number.isInteger(reminderId) &&
    reminderId > 0
    ? reminderId
    : undefined;
};

// 알림 본체 탭에 해당하는 화면으로 이동한다.
export const openReminderFromNotification = (reminderId?: number): void => {
  if (reminderId) {
    router.push({
      pathname: '/pill-reminder-setting',
      params: { reminderId: reminderId.toString() },
    });
    return;
  }

  router.push('/pill-reminder');
};

// 복용 완료 액션의 안내 토스트를 표시한다.
export const handleConfirmAction = (): void => {
  Toast.show({
    type: 'default',
    text1: '복용 완료 처리되었어요.',
    visibilityTime: NOTIFICATION_TOAST_VISIBILITY_MS,
  });
};

// 다시 알림 액션을 5분 뒤 예약한다.
export const handleSnoozeAction = async (
  reminderId?: number,
): Promise<void> => {
  let targetReminderId = reminderId;
  let reminderTitle = DEFAULT_NOTIFICATION_TITLE;
  let itemNames = '';

  let reminderMemo = '';

  if (targetReminderId) {
    const reminder =
      await pillReminderQueryService.getReminderById(targetReminderId);
    if (reminder) {
      reminderTitle = reminder.title || DEFAULT_NOTIFICATION_TITLE;
      reminderMemo = reminder.memo || '';
      itemNames = reminder.items
        .map((item) => `${item.item_name} ${item.dosage ?? 1}정`)
        .join(', ');
    }
  } else {
    // reminderId가 없는 경우 가장 가까운 활성 알림 조회
    const reminders = await pillReminderQueryService.getReminders();
    const activeReminder = reminders.find((r) => r.is_enabled) || reminders[0];
    if (activeReminder) {
      targetReminderId = activeReminder.id;
      reminderTitle = activeReminder.title || DEFAULT_NOTIFICATION_TITLE;
      reminderMemo = activeReminder.memo || '';
      itemNames = activeReminder.items
        .map((item) => `${item.item_name} ${item.dosage ?? 1}정`)
        .join(', ');
    }
  }

  const bodyLines: string[] = [itemNames || '약 복용할 시간이에요!'];
  const trimmedMemo = reminderMemo.trim();
  if (trimmedMemo) {
    bodyLines.push(`[${trimmedMemo}]`);
  }

  await pillReminderNotificationRepository.scheduleSnoozeNotification({
    title: `${reminderTitle} (다시 알림)`,
    body: bodyLines.join('\n'),
    seconds: SNOOZE_DELAY_SECONDS,
    data: { reminderId: targetReminderId ?? 0 },
  });

  Toast.show({
    type: 'default',
    text1: '5분 뒤 다시 알림이 설정되었습니다.',
    visibilityTime: NOTIFICATION_TOAST_VISIBILITY_MS,
  });
};

// 알림 닫기 액션을 로그로 기록한다.
export const handleDismissAction = (reminderId?: number): void => {
  logger.info(
    `[NOTIFICATION-SERVICE] Reminder dismissed for ID: ${reminderId ?? 'n/a'}`,
  );
};

// 사용자 알림 액션 응답 디스패처
export const dispatchNotificationResponse = async (
  response: Notifications.NotificationResponse,
): Promise<void> => {
  try {
    const actionId = response.actionIdentifier;
    const reminderId = getReminderId(response);

    logger.info(
      `[NOTIFICATION-SERVICE] Notification action received: ${actionId}, reminderId: ${reminderId}`,
    );

    if (actionId === Notifications.DEFAULT_ACTION_IDENTIFIER) {
      openReminderFromNotification(reminderId);
      return;
    }

    if (actionId === NOTIFICATION_ACTION_CONFIRM) {
      handleConfirmAction();
      return;
    }

    if (actionId === NOTIFICATION_ACTION_SNOOZE) {
      await handleSnoozeAction(reminderId);
      return;
    }

    if (actionId === NOTIFICATION_ACTION_DISMISS) {
      handleDismissAction(reminderId);
      return;
    }
  } catch (e) {
    logger.error(
      `[NOTIFICATION-SERVICE] Failed to handle notification response: ${e}`,
    );
  }
};
