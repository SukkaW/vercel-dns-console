import { Modal, Text, Table } from '@geist-ui/core';
import { useCallback, useState } from 'react';
import type { RecordItem } from '.';
import { useVercelDNSRecords } from '@/hooks/use-vercel-dns';
import { useVercelApiToken } from '@/hooks/use-vercel-api-token';
import { fetcherWithAuthorization } from '@/lib/fetcher';
import { useToasts } from '@/hooks/use-toasts';
import { useVercelUser } from '@/hooks/use-vercel-user';
import { nullthrow } from 'foxts/guard';

function RecordsListTable(props: { records: RecordItem[] }) {
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
}

export interface DeleteRecordModalProps {
  domain: string,
  records: RecordItem[],
  visible: boolean,
  close: () => void
}

export function DeleteRecordModal({ domain, records, visible, close }: DeleteRecordModalProps) {
  const [token] = useVercelApiToken();
  const { mutate } = useVercelDNSRecords(domain);
  const { setToast } = useToasts();
  const { data: user, isLoading: userLoading } = useVercelUser();

  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = useCallback(async () => {
    setIsLoading(true);

    try {
      await Promise.all(
        records.map(record => fetcherWithAuthorization(
          [`/v2/domains/${domain}/records/${record.id}?teamId=${nullthrow(user).defaultTeamId}`, token!],
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
  }, [close, domain, mutate, records, setToast, token, user]);

  return (
    <Modal visible={visible} onClose={close}>
      <Modal.Title>Delete Record</Modal.Title>
      <Modal.Content>
        <Text p>
          You are about to delete the following DNS record{records.length > 1 ? 's' : ''}:
        </Text>
        <RecordsListTable records={records} />
      </Modal.Content>
      <Modal.Action passive onClick={close}>
        <Text span>
          Cancel
        </Text>
      </Modal.Action>
      <Modal.Action loading={userLoading || isLoading} onClick={handleDelete}>
        <Text span type="error">
          Delete
        </Text>
      </Modal.Action>
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
}
