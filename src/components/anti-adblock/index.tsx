import { memo, useState } from 'react';

import { Modal, Text, Code, Link } from '@geist-ui/core';
import { useDetectAdBlock } from '@/hooks/use-detect-adblock';
import { useReadonlyMode } from '@/hooks/use-readonly-mode';
import { useRouter } from 'next/router';

export const AntiAdBlockModal = memo(() => {
  const router = useRouter();
  const isAdBlockEnabled = useDetectAdBlock();
  const [readOnlyMode, setReadonlyMode] = useReadonlyMode();
  const [showModal, setShowModal] = useState(!readOnlyMode && isAdBlockEnabled);

  if (!readOnlyMode && !showModal && isAdBlockEnabled) {
    setShowModal(true);
  }

  return (
    <Modal visible={showModal} w={2} onClose={() => setReadonlyMode(true)}>
      <Modal.Title>You appear to have ADBlock enabled</Modal.Title>
      <Modal.Content>
        <Text>
          We understand why you have ADBlock enabled (we really do!).
          <br />
          However, the filtering rules you are using have <Text b>incorrectly</Text> blocked <Text b>legitimate API requests</Text>.
        </Text>
        <Text>
          Here is what you can do:
        </Text>
        <ul>
          <li>
            <Text>
              Disable your ADBlock for domain <Code>skk.moe</Code> and all its subdomains (<Text b>Recommended</Text>).
            </Text>
          </li>
          <li>
            <Text>
              Disable / remove the following rule from your ADBlock:
            </Text>
            <Code block>
              skk.moe##+js(no-fetch-if, method:POST)
            </Code>
          </li>
          <li>
            <Text>
              Report the issue to the filtering rules maintainer
              {' '}
              <Link
                href="https://github.com/uBlockOrigin/uAssets/issues"
                target="_blank"
                rel="noopener noreferrer nofollow external"
                icon
                color
              >
                here
              </Link>.
            </Text>
          </li>
        </ul>
        <Text p>
          Please reload after you have disabled the ADBlock or disabled / removed the rule.
        </Text>
        <Text p>
          You can also continue with ADBlock enabled.
          {' '}
          <Text b>
            However, you will have to enter read-only mode and you can&apos;t create, edit, or delete any DNS records.
          </Text>
        </Text>
      </Modal.Content>
      <Modal.Action
        passive
        onClick={() => {
          router.reload();
        }}>
        <Text type="success" b>
          I have disabled my ADBlock, reload
        </Text>
      </Modal.Action>
      <Modal.Action
        passive
        onClick={() => {
          setShowModal(false);
          setReadonlyMode(true);
        }}>
        <Text type="error" b>
          Enter read-only mode
        </Text>
      </Modal.Action>
    </Modal>
  );
});

if (process.env.NODE_ENV !== 'production') {
  AntiAdBlockModal.displayName = 'AntiAdBlockModal';
}
