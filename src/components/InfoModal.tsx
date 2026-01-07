import { Modal, Stack, Text, List, Anchor } from '@mantine/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { env } from '@/core/config/env';

export interface ModalContent {
  textBefore?: string[];
  textAfter?: string[];
  subtitle?: string;
  listItems: string[];
}

interface InfoModalProps {
  opened: boolean;
  onClose: () => void;
  titleKey: string;
  content: ModalContent;
  emailFirst?: boolean;
}

const EmailLink = (): React.JSX.Element => (
  <Text size="md">
    <Anchor href={`mailto:${env.ownerEmail}`} c="blue.6">
      {env.ownerEmail}
    </Anchor>
  </Text>
);

const InfoModal = ({
  opened,
  onClose,
  titleKey,
  content,
  emailFirst = false,
}: InfoModalProps): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={600} size="lg">
          {t(titleKey)}
        </Text>
      }
      centered
      size="xl"
    >
      <Stack pb="md">
        {emailFirst && <EmailLink />}
        {content.textBefore?.map((textKey, idx) => (
          <Text key={idx} size="md">
            {t(textKey)}
          </Text>
        ))}
        {!emailFirst && <EmailLink />}
        {content.subtitle && (
          <Text size="md" fw={600}>
            {t(content.subtitle)}
          </Text>
        )}
        <List spacing={6} size="md" withPadding listStyleType="disc">
          {content.listItems.map((itemKey, idx) => (
            <List.Item key={idx}>{t(itemKey)}</List.Item>
          ))}
        </List>
        {content.textAfter?.map((textKey, idx) => (
          <Text key={idx} size="md">
            {t(textKey)}
          </Text>
        ))}
      </Stack>
    </Modal>
  );
};

export default InfoModal;
