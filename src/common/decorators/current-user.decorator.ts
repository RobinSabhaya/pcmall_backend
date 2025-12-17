import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { User } from '../../user/schema/user.schema';

export const CurrentUser = createParamDecorator(
  // eslint-disable-next-line @typescript-eslint/naming-convention
  (_: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
