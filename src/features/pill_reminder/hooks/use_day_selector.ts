import { useMemo } from 'react';
import {
  ALL_DAYS,
  WEEKDAYS,
  WEEKENDS,
} from '@features/pill_reminder/constants/pill_reminder_constant';

// 요일 선택기 상태 및 프리셋 토글 로직 훅 (0: 일, 1: 월, ..., 6: 토)
export const useDaySelector = (
  selectedDays: number[],
  onChange: (days: number[]) => void,
) => {
  // 개별 요일 토글 (0개까지 해제 가능)
  const toggleDay = (day: number) => {
    const isAlreadySelected = selectedDays.includes(day);

    if (isAlreadySelected) {
      onChange(selectedDays.filter((d) => d !== day));
      return;
    }

    onChange([...selectedDays, day].sort((a, b) => a - b));
  };

  // 매일 (0~6) 토글
  const handleSelectAll = () => {
    const isFullWeek = selectedDays.length === 7;

    if (isFullWeek) {
      onChange([]);
      return;
    }

    onChange(ALL_DAYS);
  };

  // 평일 (1~5) 토글
  const handleSelectWeekdays = () => {
    const isWeekdaysActive =
      selectedDays.length === 5 &&
      WEEKDAYS.every((d) => selectedDays.includes(d));

    if (isWeekdaysActive) {
      onChange([]);
      return;
    }

    onChange(WEEKDAYS);
  };

  // 주말 (0, 6) 토글
  const handleSelectWeekends = () => {
    const isWeekendsActive =
      selectedDays.length === 2 &&
      WEEKENDS.every((d) => selectedDays.includes(d));

    if (isWeekendsActive) {
      onChange([]);
      return;
    }

    onChange(WEEKENDS);
  };

  const isEveryday = selectedDays.length === 7;

  const isWeekdays = useMemo(
    () =>
      selectedDays.length === 5 &&
      WEEKDAYS.every((d) => selectedDays.includes(d)),
    [selectedDays],
  );

  const isWeekends = useMemo(
    () =>
      selectedDays.length === 2 &&
      WEEKENDS.every((d) => selectedDays.includes(d)),
    [selectedDays],
  );

  return {
    toggleDay,
    handleSelectAll,
    handleSelectWeekdays,
    handleSelectWeekends,
    isEveryday,
    isWeekdays,
    isWeekends,
  };
};
