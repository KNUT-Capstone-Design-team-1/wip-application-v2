// 복용 알림 시스템 채널 및 푸시 관련 상수
export const NOTIFICATION_CHANNEL_ID = 'pill-reminder';
export const NOTIFICATION_CHANNEL_NAME = '복용 알림';
export const NOTIFICATION_LIGHT_COLOR = '#2cb7de';
export const DEFAULT_NOTIFICATION_TITLE = '복용 알림';

// 알림 카테고리 및 대화형 액션 ID 상수
export const NOTIFICATION_CATEGORY_REMINDER = 'PILL_REMINDER_CATEGORY';
export const NOTIFICATION_ACTION_CONFIRM = 'ACTION_CONFIRM';
export const NOTIFICATION_ACTION_SNOOZE = 'ACTION_SNOOZE';
export const NOTIFICATION_ACTION_DISMISS = 'ACTION_DISMISS';

// 진동 패턴 상수
export const CHANNEL_VIBRATION_PATTERN = [0, 500, 200, 500];

// 토스트 노출 시간 및 스누즈 딜레이
export const NOTIFICATION_TOAST_VISIBILITY_MS = 5000;
export const SNOOZE_DELAY_SECONDS = 300; // 5분
