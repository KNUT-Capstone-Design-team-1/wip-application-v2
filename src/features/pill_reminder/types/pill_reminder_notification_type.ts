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
