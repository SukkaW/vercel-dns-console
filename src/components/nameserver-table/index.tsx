import { Table, Text } from '@geist-ui/core';
import { memo, useMemo } from 'react';

export const NameServerListTable = memo((props: {
  intended: string[] | undefined,
  actual: string[] | undefined
}) => {
  const { intended, actual } = props;
  const data = useMemo(() => {
    if (intended && actual) {
      const result = new Array(Math.max(intended.length, actual.length));

      for (let i = 0; i < result.length; i++) {
        result[i] ??= {};
        result[i].intended = intended[i] ?? '';

        if (actual[i]) {
          if (intended.includes(actual[i])) {
            result[i].actual = actual[i];
          } else {
            result[i].actual = (
              <Text type="error">
                {actual[i]}
              </Text>
            );
          }
        } else {
          result[i].actual = '';
        }
      }

      return result;
    }
    return [];
  }, [intended, actual]);

  return (
    <Table data={data} emptyText="Unknown">
      <Table.Column prop="intended" label="Intended Nameservers" />
      <Table.Column prop="actual" label="Actual Nameservers" />
    </Table>
  );
});

if (process.env.NODE_ENV !== 'production') {
  NameServerListTable.displayName = 'NameServerListTable';
}
