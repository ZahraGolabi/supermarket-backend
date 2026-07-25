import { SetMetadata } from '@nestjs/common';
import { SKIP_AUTH } from '@shared/constants/tokens';

export const SkipAuth = () => {
  return SetMetadata(SKIP_AUTH, true);
};
