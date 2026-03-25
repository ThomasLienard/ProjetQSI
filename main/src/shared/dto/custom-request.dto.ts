import { JwtPayloadDTO } from './jwt-payload.dto';
import { Request } from 'express';

export type CustomRequest = Request & { user: JwtPayloadDTO };
