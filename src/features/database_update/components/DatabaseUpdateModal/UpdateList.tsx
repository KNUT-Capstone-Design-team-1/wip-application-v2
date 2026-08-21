import React from 'react';
import { View, ScrollView } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { TABLE_NAME_MAP, TDataTable } from '@services/database/types';
import { styles } from '../../styles/DatabaseUpdateModal.styles';
import { IUpdateNeeded } from '../../utils/updateCheck';

export const UpdateListItem = ({ u }: { u: IUpdateNeeded }) => {
  const tableName = TABLE_NAME_MAP[u.table as TDataTable] || u.table;
  const oldStr =
    u.oldSchemaVer !== undefined
      ? `s${u.oldSchemaVer}-v${u.oldDataVer}`
      : '신규';
  const newStr = `s${u.schemaVer}-v${u.dataVer}`;

  return (
    <View style={styles.listItem}>
      <BaseText size={14} weight="medium" style={styles.listTitle}>
        - {tableName}
      </BaseText>
      <BaseText size={13} style={styles.listVersion}>
        현재: {oldStr}
        {'\n'}최신: {newStr}
      </BaseText>
    </View>
  );
};

export const UpdateList = ({ data }: { data: IUpdateNeeded[] }) => (
  <ScrollView
    style={styles.listContainer}
    contentContainerStyle={styles.listContent}
  >
    {data.map((u, index) => (
      <UpdateListItem key={index} u={u} />
    ))}
  </ScrollView>
);
