import { Stack, Text } from '@mantine/core';

interface SubmitValidationMessageProps {
  message: string;
  missingLabels: string[];
}

export default function SubmitValidationMessage({
  message,
  missingLabels,
}: SubmitValidationMessageProps): React.JSX.Element {
  return (
    <Stack gap={4} py={4}>
      <Text size="sm">{message}</Text>
      <ul
        style={{
          margin: 0,
          paddingLeft: '1.25rem',
          listStyleType: 'disc',
          listStylePosition: 'outside',
        }}
      >
        {missingLabels.map((label) => (
          <li key={label} style={{ marginBottom: 2 }}>
            <Text span size="sm">
              {label}
            </Text>
          </li>
        ))}
      </ul>
    </Stack>
  );
}
