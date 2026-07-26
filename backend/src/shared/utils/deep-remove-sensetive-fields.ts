import { sensitiveFields } from '@shared/constants';

export const deepRemoveSensitiveFields = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((item) => deepRemoveSensitiveFields(item));
  } else if (obj && typeof obj === 'object') {
    const sanitized = {};

    for (const [key, value] of Object.entries(obj)) {
      if (!sensitiveFields.includes(key)) {
        sanitized[key] = deepRemoveSensitiveFields(value);
      }
    }

    return sanitized;
  }

  return obj;
};
