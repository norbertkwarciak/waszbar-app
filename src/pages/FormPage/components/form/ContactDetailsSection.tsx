import {
  SimpleGrid,
  TextInput,
  Textarea,
  type TextInputProps,
  type TextareaProps,
} from '@mantine/core';
import Turnstile from 'react-turnstile';
import { useTranslation } from 'react-i18next';
import { FORM_PAGE_TRANSLATIONS } from '@/i18n/tKeys';
import FormDivider from '@/pages/FormPage/components/FormDivider';

interface ContactDetailsSectionProps {
  siteKey: string;
  notesProps: TextareaProps;
  fullNameProps: TextInputProps;
  emailProps: TextInputProps;
  phoneProps: TextInputProps;
  honeypotProps: TextInputProps;
  onCaptchaVerify: (token: string) => void;
}

export default function ContactDetailsSection({
  siteKey,
  notesProps,
  fullNameProps,
  emailProps,
  phoneProps,
  honeypotProps,
  onCaptchaVerify,
}: ContactDetailsSectionProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <>
      <FormDivider label={t(FORM_PAGE_TRANSLATIONS.additionalInfoLabel)} />
      <Textarea
        label={t(FORM_PAGE_TRANSLATIONS.additionalInfoLabel)}
        placeholder={t(FORM_PAGE_TRANSLATIONS.additionalInfoPlaceholder)}
        autosize
        minRows={6}
        maxLength={2000}
        {...notesProps}
      />
      <FormDivider label={t(FORM_PAGE_TRANSLATIONS.contactTitle)} />
      <TextInput
        label={t(FORM_PAGE_TRANSLATIONS.nameLabel)}
        placeholder={t(FORM_PAGE_TRANSLATIONS.namePlaceholder)}
        required
        maxLength={80}
        {...fullNameProps}
      />
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        <TextInput
          label={t(FORM_PAGE_TRANSLATIONS.emailLabel)}
          placeholder={t(FORM_PAGE_TRANSLATIONS.emailPlaceholder)}
          type="email"
          required
          maxLength={254}
          {...emailProps}
        />
        <TextInput
          label={t(FORM_PAGE_TRANSLATIONS.phoneLabel)}
          placeholder={t(FORM_PAGE_TRANSLATIONS.phonePlaceholder)}
          type="tel"
          required
          maxLength={30}
          {...phoneProps}
        />
      </SimpleGrid>
      <Turnstile sitekey={siteKey} onVerify={onCaptchaVerify} />
      <TextInput
        name="website"
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '0',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
        {...honeypotProps}
      />
    </>
  );
}
