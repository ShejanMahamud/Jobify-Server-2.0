import { Document } from 'mongoose';

export interface User extends Document {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  profile_picture: string;
}

export interface Candidate extends User {
  portfolio: string;
  education: string;
  experience: number;
  title: string;
  resume: string;
  nationality: string;
  dob: string;
  gender: string;
  marital_status: string;
  biography: string;
  socials: {
    [key: string]: string;
  };
}
