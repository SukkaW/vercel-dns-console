import { Modal, Text, Table } from '@geist-ui/core';
import { useState } from 'react';
import type { RecordItem } from '.';

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
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Modal visible={props.visible} onClose={props.close}>
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
      <Modal.Action loading={isLoading}>
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
};
