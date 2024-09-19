import mongoose, { Schema } from 'mongoose';
import { Candidate } from '../types/types';
import UserModel from './userModel';

const candidateSchema: Schema<Candidate> = new mongoose.Schema(
  {
    portfolio: { type: String },
    education: { type: String },
    experience: { type: Number },
    title: { type: String },
    resume: { type: String },
    nationality: { type: String },
    dob: { type: String },
    gender: { type: String },
    marital_status: { type: String },
    biography: { type: String },
    socials: { type: Map, of: String },
    location: {
      type: String,
    },
    phone: {
      type: Number,
    },
    job_alerts: {
      role: { type: String },
      location: { type: String },
    },
    profile_privacy: {
      type: Boolean,
      default: false,
    },
    resume_privacy: {
      type: Boolean,
      default: false,
    },
    notifications: {
      shortlisted: { type: Boolean, default: true },
      rejected: { type: Boolean, default: true },
      savedProfile: { type: Boolean, default: true },
      jobAlertsCount: { type: Number, default: 5 },
    },
  },
  {
    timestamps: true,
  }
);

const CandidateModel = UserModel.discriminator<Candidate>(
  'Candidate',
  candidateSchema
);

export default CandidateModel;
