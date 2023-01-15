import { Modal, Text, Table } from '@geist-ui/core';
import { useCallback, useState } from 'react';
import type { RecordItem } from '.';
import { useVercelDNSRecords } from '@/hooks/use-vercel-dns';
import { useVercelApiToken } from '@/hooks/use-vercel-api-token';
import { fetcherWithAuthorization } from '@/lib/fetcher';
import { useToasts } from '@/hooks/use-toasts';

const RecordsListTable = (props: { records: RecordItem[] }) => {
  const data = props.records.map(record => ({
    name: record.name,
    type: record.type,
    value: record.value
  }));

  return (
    <div>
      <Table data={data} hover={false}>
        <Table.Column
          prop="name"
          label="name"
          render={(value) => (
            <div className="cell-text-overflow">
              {value}
            </div>
          )}
        />
        <Table.Column prop="type" label="type" width={50} />
        <Table.Column
          prop="value"
          label="value"
          render={(value) => (
            <div className="cell-text-overflow">
              {value}
            </div>
          )}
        />
      </Table>
      <style jsx>{`
        div {
          overflow-x: auto;
        }
      `}</style>
    </div>
  );
};

export const DeleteRecordModal = (props: {
  domain: string,
  records: RecordItem[],
  visible: boolean,
  close: () => void
}) => {
  const { domain, records, visible, close } = props;
  const [token] = useVercelApiToken();
  const { mutate } = useVercelDNSRecords(props.domain);
  const { setToast } = useToasts();

  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = useCallback(async () => {
    setIsLoading(true);

    try {
      await Promise.all(
        records.map(record => fetcherWithAuthorization(
          [`/v2/domains/${domain}/records/${record.id}`, token!],
          {
            method: 'DELETE'
          }
        ))
      );
      await mutate();
      close();
      setIsLoading(false);
    } catch {
      setToast({
        text: `Fail to delete DNS record${records.length > 1 ? 's' : ''}`,
        type: 'error',
        delay: 3000
      });
      setIsLoading(false);
    }
  }, [close, domain, mutate, records, setToast, token]);

  return (
    <Modal visible={visible} onClose={close}>
      <Modal.Title>Delete Record</Modal.Title>
      <Modal.Content>
        <Text p>
          You are about to delete the following DNS record{props.records.length > 1 ? 's' : ''}:
        </Text>
        <RecordsListTable records={props.records} />
      </Modal.Content>
      <Modal.Action passive onClick={props.close}>
        <Text span>
          Cancel
        </Text>
      </Modal.Action>
      <Modal.Action loading={isLoading} onClick={handleDelete}>
        <Text span type="error">
          Delete
        </Text>
      </Modal.Action>
      {/* eslint-disable-next-line react/no-unknown-property -- style jsx */}
      <style jsx global>{`
        .cell-text-overflow {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow-wrap: break-word;
          word-break: keep-all;
        }
      `}</style>
    </Modal>
  );
};
