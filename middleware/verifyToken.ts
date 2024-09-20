import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { DecodedToken } from '../types/types';
import catchAsync from '../utils/catchAsync';

dotenv.config();

export const verifyToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).send({
        success: false,
        message: 'Forbidden Access!',
      });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN as string, (error, decoded) => {
      if (error) {
        return res.status(403).send({
          success: false,
          message: 'Unauthorized Access!',
        });
      }
      req.user = decoded as DecodedToken;
      next();
    });
  }
);
