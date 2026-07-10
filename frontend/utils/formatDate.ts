import { format, isToday, isYesterday, isThisWeek, parseISO } from 'date-fns';

export const formatMessageTime = (dateString: string): string => {
  const date = parseISO(dateString);
  return format(date, 'HH:mm');
};

export const formatLastSeen = (dateString: string): string => {
  const date = parseISO(dateString);

  if (isToday(date)) {
    return `last seen today at ${format(date, 'HH:mm')}`;
  }
  if (isYesterday(date)) {
    return `last seen yesterday at ${format(date, 'HH:mm')}`;
  }
  return `last seen ${format(date, 'dd/MM/yyyy')} at ${format(date, 'HH:mm')}`;
};

export const formatChatListTime = (dateString: string): string => {
  const date = parseISO(dateString);

  if (isToday(date)) {
    return format(date, 'HH:mm');
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  if (isThisWeek(date)) {
    return format(date, 'EEEE');
  }
  return format(date, 'dd/MM/yyyy');
};

export const formatDateSeparator = (dateString: string): string => {
  const date = parseISO(dateString);

  if (isToday(date)) {
    return 'Today';
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  return format(date, 'MMMM dd, yyyy');
};
