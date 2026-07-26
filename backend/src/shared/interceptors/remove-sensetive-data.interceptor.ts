import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { deepRemoveSensitiveFields } from '@shared/utils';

import { map, Observable } from 'rxjs';

@Injectable()
export class RemoveSensitiveDataInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<void> {
    return next.handle().pipe(map((data) => deepRemoveSensitiveFields(data)));
  }
}
