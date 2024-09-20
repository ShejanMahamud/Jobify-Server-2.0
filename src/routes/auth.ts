import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import UserModel from '../models/userModel';
dotenv.config();

const router = express.Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: '/auth/google/callback',
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done
    ) => {
      try {
        const email = profile.emails?.[0].value;
        const fullName = profile.displayName;
        const profile_picture =
          profile.photos?.[0].value || 'https://i.ibb.co.com/6F9w4Ps/boy.png';

        if (!email) {
          return done(new Error('No email found'), false);
        }

        let user = await UserModel.findOne({ email });

        if (!user) {
          user = new UserModel({
            fullName,
            email,
            profile_picture,
            role: 'candidate',
          });
          await user.save();
        }

        const token = jwt.sign(
          { email: user.email, role: user.role },
          process.env.ACCESS_TOKEN as string,
          {
            expiresIn: '1h',
          }
        );

        return done(null, { token });
      } catch (error) {
        return done(error as Error, false);
      }
    }
  )
);

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated.',
      });
    }
    const { token } = req.user;
    res.json({
      success: true,
      message: 'Successfully logged in with Google!',
      token: token,
    });
  }
);

export default router;
