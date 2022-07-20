import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WordfilterService } from './wordfilter.service';

@Injectable()
export class WordfilterInterceptor implements NestInterceptor {
  constructor(private readonly wordfilterService: WordfilterService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const wordfilters = await this.wordfilterService.getWordfilters();

    return next.handle().pipe(
      map((value) => {
        let stringifiedValue = JSON.stringify(value);

        for (const wordfilter of wordfilters) {
          const searchRegExp = new RegExp(wordfilter.input, 'g');
          stringifiedValue = stringifiedValue.replace(
            searchRegExp,
            wordfilter.output,
          );
        }

        return JSON.parse(stringifiedValue);
      }),
    );
  }
}
