// 복용 알림 시스템 채널 및 푸시 관련 상수
export const NOTIFICATION_CHANNEL_ID = 'pill-reminder';
export const NOTIFICATION_CHANNEL_NAME = '복용 알림';
export const NOTIFICATION_LIGHT_COLOR = '#2cb7de';
export const DEFAULT_NOTIFICATION_TITLE = '복용 알림';

// 진동 패턴 상수
export const ALARM_VIBRATION_PATTERN = [0, 500, 200, 500, 200, 500];
export const CHANNEL_VIBRATION_PATTERN = [0, 500, 200, 500];

// 알림 폴링 주기 및 토스트 노출 시간
export const NOTIFICATION_WATCHER_INTERVAL_MS = 15000;
export const NOTIFICATION_TOAST_VISIBILITY_MS = 5000;
