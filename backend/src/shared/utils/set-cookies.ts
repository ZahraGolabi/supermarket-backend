import { Response } from 'express';

export interface CookieOptions {
  name: string;
  value: string;
  options?: Record<string, any>;
}

export function setCookies(res: Response, cookies: CookieOptions[]): void {
  cookies.forEach((cookie) => {
    res.cookie(cookie.name, cookie.value, cookie.options || {});
  });
}
