import { useQuery } from '@tanstack/react-query';
import { env } from '@/core/config/env';

export type AvailabilityResponse = {
  takenDates: string[];
  lastCheckedDate: string | null;
};

const fetchAvailability = async (): Promise<AvailabilityResponse> => {
  const res = await fetch(env.netlify.functions.getAvailability);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const raw: unknown = await res.json();

  if (
    typeof raw === 'object' &&
    raw !== null &&
    'takenDates' in raw &&
    'lastCheckedDate' in raw &&
    Array.isArray(raw.takenDates)
  ) {
    return {
      takenDates: raw.takenDates.filter((d: unknown): d is string => typeof d === 'string'),
      lastCheckedDate: typeof raw.lastCheckedDate === 'string' ? raw.lastCheckedDate : null,
    };
  }

  return { takenDates: [], lastCheckedDate: null };
};

export const useAvailability = (): ReturnType<typeof useQuery<AvailabilityResponse>> => {
  return useQuery<AvailabilityResponse>({
    queryKey: ['availability'],
    queryFn: fetchAvailability,
    staleTime: 1000 * 60 * 1,
    refetchOnWindowFocus: false,
  });
};
