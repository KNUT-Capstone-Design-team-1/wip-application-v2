import React, { useState, useEffect, useCallback } from 'react';
import {
  parse24To12,
  format12To24,
} from '@features/pill_reminder/utils/reminder_format';
import { TPeriod } from '@features/pill_reminder/constants/pill_reminder_constant';

interface IUseTimePickerStateParams {
  visible: boolean;
  initialTime?: string;
}

// TimePickerModal 상태 관리 및 독립 증감/포맷팅 훅
export const useTimePickerState = ({
  visible,
  initialTime = '08:00',
}: IUseTimePickerStateParams) => {
  const [period, setPeriod] = useState<TPeriod>('오전');
  const [hour, setHour] = useState('08');
  const [minute, setMinute] = useState('00');
  const [activeField, setActiveField] = useState<'hour' | 'minute' | null>(
    null,
  );

  // 모달 열릴 때 초기 시간 파싱
  useEffect(() => {
    if (!visible) return;
    const parsed = parse24To12(initialTime);
    setPeriod(parsed.period);
    setHour(parsed.hour);
    setMinute(parsed.minute);
    setActiveField(null);
  }, [visible, initialTime]);

  // 시(Hour) 직접 입력 핸들러
  const handleHourChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned === '') {
      setHour('');
      return;
    }
    const num = parseInt(cleaned, 10);
    setHour(num > 12 ? '12' : cleaned);
  };

  // 시(Hour) 블러 핸들러
  const handleHourBlur = () => {
    setActiveField(null);
    const num = parseInt(hour, 10);
    if (isNaN(num) || num < 1) {
      setHour('12');
    } else {
      setHour(num.toString().padStart(2, '0'));
    }
  };

  // 분(Minute) 직접 입력 핸들러
  const handleMinuteChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned === '') {
      setMinute('');
      return;
    }
    const num = parseInt(cleaned, 10);
    setMinute(num > 59 ? '59' : cleaned);
  };

  // 분(Minute) 블러 핸들러
  const handleMinuteBlur = () => {
    setActiveField(null);
    const num = parseInt(minute, 10);
    if (isNaN(num) || num < 0) {
      setMinute('00');
    } else {
      setMinute(num.toString().padStart(2, '0'));
    }
  };

  // 프리셋 선택
  const handleSelectPreset = useCallback((presetTime: string) => {
    const parsed = parse24To12(presetTime);
    setPeriod(parsed.period);
    setHour(parsed.hour);
    setMinute(parsed.minute);
  }, []);

  // 시간(Hour) 독립 증감 (1~12 순환)
  const handleAdjustHour = useCallback((offsetHours: number) => {
    setHour((prevHour) => {
      const current = parseInt(prevHour, 10);
      const validCurrent = isNaN(current) || current < 1 ? 12 : current;
      let newHour = ((validCurrent - 1 + offsetHours) % 12) + 1;
      if (newHour <= 0) {
        newHour += 12;
      }
      return newHour.toString().padStart(2, '0');
    });
  }, []);

  // 분(Minute) 독립 증감 (0~59 순환, 시 불변)
  const handleAdjustMinute = useCallback((offsetMinutes: number) => {
    setMinute((prevMinute) => {
      const current = parseInt(prevMinute, 10);
      const validCurrent = isNaN(current) || current < 0 ? 0 : current;
      let newMinute = (validCurrent + offsetMinutes) % 60;
      if (newMinute < 0) {
        newMinute += 60;
      }
      return newMinute.toString().padStart(2, '0');
    });
  }, []);

  // 오전/오후 토글
  const handleTogglePeriod = useCallback((targetPeriod: TPeriod) => {
    setPeriod(targetPeriod);
  }, []);

  const currentTime24 = format12To24(period, hour, minute);

  return {
    period,
    hour,
    minute,
    activeField,
    currentTime24,
    setActiveField,
    handleHourChange,
    handleHourBlur,
    handleMinuteChange,
    handleMinuteBlur,
    handleSelectPreset,
    handleAdjustHour,
    handleAdjustMinute,
    handleTogglePeriod,
  };
};
