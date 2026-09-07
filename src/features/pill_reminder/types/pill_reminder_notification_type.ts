// OS에 등록된 알림 요약 모델
export type ScheduledNotificationSummarySource = {
  identifier: string;
  content: { title?: string | null; body?: string | null };
  trigger: {
    type?: string;
    weekday?: number;
    hour?: number;
    minute?: number;
    channelId?: string;
  } | null;
};

// 알림 권한과 Exact Alarm 권한을 분리해 표현하는 상태 타입.
export type NotificationPermissionState = {
  notificationGranted: boolean;
  exactAlarmGranted?: boolean;
};

// 재등록 실패 정보를 기록하기 위한 타입.
export type NotificationScheduleFailure = {
  reminderId: number;
  reason: string;
};

// 전체 재등록 결과를 요약해 로그와 UI에서 사용할 수 있게 한다.
export type NotificationRescheduleSummary = {
  total: number;
  success: number;
  failed: number;
  failures: NotificationScheduleFailure[];
};
