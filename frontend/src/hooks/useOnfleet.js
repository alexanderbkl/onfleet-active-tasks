import { useQuery } from '@tanstack/react-query';
import { onfleetApi } from '../services/api';

export const useTeams = (apiKey) => {
  return useQuery({
    queryKey: ['teams', apiKey],
    queryFn: () => onfleetApi.getTeams(apiKey),
    enabled: !!apiKey,
    retry: 1,
  });
};

export const useWorkers = (apiKey) => {
  return useQuery({
    queryKey: ['workers', apiKey],
    queryFn: () => onfleetApi.getWorkers(apiKey),
    enabled: !!apiKey,
    retry: 1,
  });
};

export const useTasks = (apiKey, from, to) => {
  return useQuery({
    queryKey: ['tasks', apiKey, from, to],
    queryFn: () => onfleetApi.getTasks(apiKey, from, to),
    enabled: !!apiKey,
    retry: 1,
  });
};
