import { useForm, type UseFormReturnType } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { FORM_PAGE_TRANSLATIONS } from '@/i18n/tKeys';
import { countDigits } from '@/core/utils/helpers';
import { regex } from '@/core/utils/regex';
import type { MenuPackage, SelectedService } from '@/types';
import type { BarOption } from '@/core/config/options';

const POSTAL_CODE_REGEX = /^\d{2}-\d{3}$/;

export type FormValues = {
  date: string | null;
  postalCode: string;
  city: string;
  numberOfGuests: number | '';
  selectedBar: BarOption | null;
  outdoorTent: BarOption | null;
  selectedPackage: MenuPackage | null;
  selectedServices: SelectedService[];
  notes: string;
  fullName: string;
  email: string;
  phone: string;
  captchaToken: string | null;
  hpCompany: string;
};

export const INQUIRY_FIELD_ORDER = [
  'date',
  'selectedBar',
  'postalCode',
  'city',
  'travelCost',
  'numberOfGuests',
  'selectedPackage',
  'fullName',
  'email',
  'phone',
  'captcha',
] as const;

export const useInquiryForm = (initialDate: string | null): UseFormReturnType<FormValues> => {
  const { t } = useTranslation();

  const validateEmail = (value: string): string | null => {
    const normalizedValue = value.trim();
    if (!normalizedValue) {
      return t(FORM_PAGE_TRANSLATIONS.emailValidationRequired);
    }

    if (!regex.email.test(normalizedValue)) {
      return t(FORM_PAGE_TRANSLATIONS.emailValidationInvalid);
    }

    return null;
  };

  const validatePhone = (value: string): string | null => {
    const normalizedValue = value.trim();
    if (!normalizedValue) {
      return t(FORM_PAGE_TRANSLATIONS.phoneValidationRequired);
    }

    if (!regex.phone.test(normalizedValue)) {
      return t(FORM_PAGE_TRANSLATIONS.phoneValidationInvalid);
    }

    const digits = countDigits(normalizedValue);
    if (digits < 9 || digits > 15) {
      return t(FORM_PAGE_TRANSLATIONS.phoneValidationLength);
    }

    return null;
  };

  return useForm<FormValues>({
    initialValues: {
      date: initialDate,
      postalCode: '',
      city: '',
      numberOfGuests: 100,
      selectedBar: null,
      outdoorTent: null,
      selectedPackage: null,
      selectedServices: [],
      notes: '',
      fullName: '',
      email: '',
      phone: '',
      captchaToken: null,
      hpCompany: '',
    },
    validateInputOnChange: ['email', 'phone'],
    validate: {
      date: (value) => (value ? null : 'required'),
      postalCode: (value) =>
        !value
          ? t(FORM_PAGE_TRANSLATIONS.fieldValidationMessageLabel.postalCode)
          : !POSTAL_CODE_REGEX.test(value)
            ? t(FORM_PAGE_TRANSLATIONS.postalCodeInvalidError)
            : null,
      city: (value) => (value.trim() ? null : t(FORM_PAGE_TRANSLATIONS.cityRequiredError)),
      numberOfGuests: (value) => (typeof value === 'number' && value > 0 ? null : 'required'),
      selectedBar: (value) => (value ? null : 'required'),
      selectedPackage: (value) => (value ? null : 'required'),
      fullName: (value) => (value ? null : t(FORM_PAGE_TRANSLATIONS.nameValidationRequired)),
      email: validateEmail,
      phone: validatePhone,
    },
  });
};
