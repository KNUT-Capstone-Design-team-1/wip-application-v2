import dayjs from 'dayjs';

/**
 * 날짜를 'YYYY-MM-DD HH:mm' 형식으로 포맷팅
 * @param dateString - 포맷팅할 날짜 문자열
 * @returns 포맷팅된 날짜 문자열
 */
export const formatDate = (dateString: string): string => {
  return dayjs(dateString).format('YYYY-MM-DD HH:mm');
};

/**
 * 두 날짜가 다른지 확인
 * @param date1 - 첫 번째 날짜 문자열
 * @param date2 - 두 번째 날짜 문자열
 * @returns 두 날짜가 다르면 true, 같으면 false
 */
export const isDifferentDate = (date1: string, date2: string): boolean => {
  return date1 !== date2;
};

/**
 * 등록일과 수정일이 다른지 확인
 * @param createDate - 등록일
 * @param updateDate - 수정일
 * @returns 수정되었으면 true, 아니면 false
 */
export const isModified = (createDate: string, updateDate: string): boolean => {
  return isDifferentDate(createDate, updateDate);
};
