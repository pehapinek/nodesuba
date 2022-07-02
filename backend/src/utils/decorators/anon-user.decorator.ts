import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { v6tov4 } from '../ip-tools';
import { IAnonUser } from './anon-user.interface';

export const AnonUser: () => ParameterDecorator = createParamDecorator(
  (_, ctx: ExecutionContext): IAnonUser => {
    const ip = ctx.switchToHttp().getRequest()?.ip;

    return {
      ip: v6tov4(ip),
    };
  },
);
