export const appCookieOptions = (maxAge: number) => {
  return {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: maxAge,
  };
};
