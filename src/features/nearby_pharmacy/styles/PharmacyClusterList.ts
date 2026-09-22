import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_TEXT, COLOR_LINE } from '@constants/color';
import { px } from '@utils/responsive';

// 클러스터 약국 리스트 및 개별 항목 스타일
export const styles = StyleSheet.create({
  // 클러스터 리스트 모달 팝업 컨테이너
  clusterListContainer: {
    marginHorizontal: px(20),
    marginBottom: px(8),
    backgroundColor: COLOR_BG['surface'],
    borderRadius: px(16),
    paddingTop: px(10),
    paddingBottom: px(8),
    maxHeight: px(320),
    elevation: 10,
    shadowColor: COLOR['shadow'],
    shadowOffset: { width: 0, height: px(4) },
    shadowOpacity: 0.15,
    shadowRadius: px(8),
  },

  // 클러스터 리스트 상단 헤더 (타이틀 & 닫기 버튼)
  clusterListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: px(14),
    paddingBottom: px(6),
    borderBottomWidth: 1,
    borderBottomColor: COLOR_LINE['separator'],
  },

  // 클러스터 리스트 헤더 제목
  clusterListTitle: {
    color: COLOR_TEXT['sub'],
  },

  // 클러스터 리스트 닫기 버튼 터치 영역
  clusterListCloseButton: {
    padding: px(4),
  },

  // 클러스터 리스트 개별 약국 아이템 컨테이너
  clusterListItem: {
    paddingHorizontal: px(16),
    paddingVertical: px(12),
    borderBottomWidth: 1,
    borderBottomColor: COLOR_LINE['border'],
  },

  // 마지막 약국 아이템 하단 구분선 제거
  clusterListItemLast: {
    borderBottomWidth: 0,
  },

  // 개별 아이템 첫 번째 줄 헤더 (약국명/거리 & 영업상태)
  clusterListItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: px(4),
  },

  // 좌측 약국명과 거리 텍스트 묶음
  clusterListItemNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: px(8),
  },

  // 약국 이름 텍스트 (긴 경우 말줄임 처리)
  clusterListItemName: {
    color: COLOR_TEXT['title'],
    flexShrink: 1,
  },

  // 거리 텍스트
  clusterListItemDistance: {
    color: COLOR['primary'],
    marginLeft: px(8),
    flexShrink: 0,
  },

  // 영업 상태 텍스트 컨테이너
  clusterListItemStatus: {
    flexShrink: 0,
  },

  // 영업 중 상태 색상 (초록 계열)
  statusOpen: {
    color: COLOR.normal,
  },

  // 영업 종료 상태 색상 (서브 텍스트 회색)
  statusClosed: {
    color: COLOR_TEXT.sub,
  },

  // 약국 주소 텍스트 (두 번째 줄)
  clusterListItemAddress: {
    color: COLOR_TEXT['body'],
  },
});
