import { useMutation } from '@tanstack/react-query';
import { env } from '@/core/config/env';

export interface InquiryPayload {
  date: string;
  fullName: string;
  email: string;
  phone: string;
  numberOfGuests: number;
  venueLocation: string;
  selectedPackage: string | null;
  selectedBar: string | null;
  selectedServices: string[];
  notes: string;
  turnstileToken: string | null;
}

// eslint-disable-next-line
export const useSubmitInquiry = () => {
  return useMutation({
    mutationFn: async (payload: InquiryPayload) => {
      const response = await fetch(env.netlify.functions.submitInquiry, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error || 'Unknown error during submission');
      }

      return response.json();
    },
  });
};
