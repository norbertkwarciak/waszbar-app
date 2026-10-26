import { DateInput } from '@mantine/dates';
import { Group, Loader, Stack, Text } from '@mantine/core';
import { IconCalendar } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { FORM_PAGE_TRANSLATIONS } from '@/i18n/tKeys';
import { barOptions, outdoorTentOption, type BarOption } from '@/core/config/options';
import BarOptionBox from '@/components/BarOptionBox';
import CenteredGrid from '@/components/CenteredGrid';
import FormDivider from '@/components/FormDivider';

interface DateAndBarSectionProps {
  date: string | null;
  dateStatus: 'available' | 'unavailable' | null;
  isMobile: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  minDate: Date;
  maxDate?: Date;
  defaultDate?: Date;
  selectedBar: BarOption | null;
  outdoorTent: BarOption | null;
  onDateChange: (value: string | null) => void;
  onSelectBar: (bar: BarOption) => void;
  onToggleOutdoorTent: (option: BarOption) => void;
}

export default function DateAndBarSection({
  date,
  dateStatus,
  isMobile,
  isLoading,
  isDisabled,
  minDate,
  maxDate,
  defaultDate,
  selectedBar,
  outdoorTent,
  onDateChange,
  onSelectBar,
  onToggleOutdoorTent,
}: DateAndBarSectionProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <>
      <Stack gap={4}>
        <Text size="sm" fw={500}>
          {t(FORM_PAGE_TRANSLATIONS.checkDateLabel)}
          <Text span c="red" ml={4}>
            *
          </Text>
        </Text>
        <Group align="center" gap="sm" wrap="nowrap">
          <DateInput
            placeholder={t(FORM_PAGE_TRANSLATIONS.checkDateLabel)}
            value={date}
            onChange={onDateChange}
            valueFormat="YYYY-MM-DD"
            locale="pl"
            disabled={isDisabled}
            minDate={minDate}
            maxDate={maxDate}
            defaultDate={defaultDate}
            leftSection={<IconCalendar size={18} />}
            style={{ maxWidth: 250 }}
            inputMode="none"
          />
          {isLoading && (
            <>
              <Loader size="xs" />
              <Text size="sm" c="dimmed">
                {t(FORM_PAGE_TRANSLATIONS.loadingAvailability)}
              </Text>
            </>
          )}
        </Group>
      </Stack>

      {dateStatus === 'unavailable' && (
        <Text c="red" size="sm">
          {t(FORM_PAGE_TRANSLATIONS.dateUnavailable)}
        </Text>
      )}

      {dateStatus === 'available' && (
        <>
          <FormDivider
            label={
              <div style={{ maxWidth: '100%', whiteSpace: 'wrap', textAlign: 'center' }}>
                {t(FORM_PAGE_TRANSLATIONS.barSelectionTitle)}
                <Text component="span" c="red" ml={4}>
                  *
                </Text>
              </div>
            }
          />
          <CenteredGrid
            items={barOptions}
            getKey={(bar) => bar.value}
            isMobile={isMobile}
            renderItem={(bar) => (
              <BarOptionBox
                option={bar}
                isSelected={selectedBar?.value === bar.value}
                onSelect={() => onSelectBar(bar)}
              />
            )}
          />
          <FormDivider label={t(FORM_PAGE_TRANSLATIONS.outdoorTentSectionTitle)} />
          <CenteredGrid
            items={[outdoorTentOption]}
            getKey={(item) => item.value}
            isMobile={isMobile}
            renderItem={(item) => (
              <BarOptionBox
                option={item}
                isSelected={outdoorTent?.value === item.value}
                onSelect={() => onToggleOutdoorTent(item)}
              />
            )}
          />
        </>
      )}
    </>
  );
}
