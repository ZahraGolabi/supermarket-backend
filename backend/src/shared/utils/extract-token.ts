import { accessTokenName } from '@shared/constants/jwt';
import { Request } from 'express';

export const extractTokenFromHeader = (
  authorizationHeader: string | undefined,
): string | undefined => {
  if (!authorizationHeader) return undefined;

  const [type, token] = authorizationHeader.split(' ');

  if (type.toLowerCase() !== 'bearer') {
    throw new Error('Invalid token type');
  }

  return token;
};

export const extractTokenFromCookie = (request: Request) => {
  return request.cookies?.[accessTokenName]
    ? request.cookies[accessTokenName]
    : undefined;
};
