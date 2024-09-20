// express.d.ts
import { DecodedToken } from './types';

declare module 'express-serve-static-core' {
  interface Request {
    user?: DecodedToken;
  }
}
