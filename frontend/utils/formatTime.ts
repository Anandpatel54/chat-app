import { format, parseISO } from 'date-fns';

export const formatTime = (dateString: string): string => {
  return format(parseISO(dateString), 'HH:mm');
};

export const formatFullTime = (dateString: string): string => {
  return format(parseISO(dateString), 'HH:mm:ss');
};
