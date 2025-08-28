import { useQuery } from '@tanstack/react-query';
import { env } from '@/core/config/env';

export type AvailabilityEntry = {
  date: string;
  available: boolean;
};

const fetchAvailability = async (): Promise<AvailabilityEntry[]> => {
  const res = await fetch(env.netlify.functions.getAvailability);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const raw: unknown = await res.json();

  if (!Array.isArray(raw)) return [];

  return raw
    .filter((d): d is string => typeof d === 'string' && d.trim().length > 0)
    .map((date) => ({
      date,
      available: true,
    }));
};

export const useAvailability = (): ReturnType<typeof useQuery<AvailabilityEntry[]>> => {
  return useQuery<AvailabilityEntry[]>({
    queryKey: ['availability'],
    queryFn: fetchAvailability,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
