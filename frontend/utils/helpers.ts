export const getOtherParticipant = (
  participants: any[],
  currentUserId: string
) => {
  return participants.find((p) => p._id !== currentUserId) || participants[0];
};

export const truncateText = (text: string, maxLength: number = 40): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const generateTempId = (): string => {
  return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getFileExtension = (fileName: string): string => {
  return fileName.split('.').pop()?.toLowerCase() || '';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const isImageFile = (mimeType: string): boolean => {
  return mimeType.startsWith('image/');
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};
