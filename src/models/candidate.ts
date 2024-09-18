import mongoose, { Schema } from 'mongoose';
import { Candidate } from '../types/types';
import UserModel from './user';

const candidateSchema: Schema<Candidate> = new mongoose.Schema({
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
});

const CandidateModel = UserModel.discriminator<Candidate>(
  'Candidate',
  candidateSchema
);

export default CandidateModel;
