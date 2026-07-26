import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RemoveSensitiveDataInterceptor } from '@shared/interceptors';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RemoveSensitiveDataInterceptor,
    },
  ],
})
export class InterceptorsModule {}
