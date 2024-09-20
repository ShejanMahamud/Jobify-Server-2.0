import { Document } from 'mongoose';

export interface User extends Document {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  profile_picture: string;
  password?: string;
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
  location: string;
  phone: number;
  job_alerts: {
    role: string;
    location: string;
  };
  profile_privacy: boolean;
  resume_privacy: boolean;
  notifications: {
    shortlisted: boolean;
    rejected: boolean;
    savedProfile: boolean;
    jobAlertsCount: number;
  };
}

export interface Company extends User {
  company_logo: string;
  company_banner: string;
  company_name: string;
  about_us: string;
  organization_type: string;
  industry_type: string;
  team_size: string;
  yoe: string;
  website: string;
  company_vision: string;
  socials: {
    [key: string]: string;
  };
  location: string;
  phone: number;
  plan: 'free' | 'basic' | 'standard' | 'premium';
  job_post_limit?: number;
  urgent_job_limit?: number;
  resume_access_limit?: number;
  featured_job_limit?: number;
  featured_company?: boolean;
  saved_candidate_limit?: number;
}
export interface DecodedToken {
  token: string;
}
