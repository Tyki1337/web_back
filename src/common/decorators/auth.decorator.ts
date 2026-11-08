import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Token = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.token;
  },
);

export const UserId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user!.id;
  },
);
