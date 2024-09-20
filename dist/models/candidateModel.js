"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = __importDefault(require("./userModel"));
const candidateSchema = new mongoose_1.default.Schema({
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
}, {
    timestamps: true,
});
const CandidateModel = userModel_1.default.discriminator('Candidate', candidateSchema);
exports.default = CandidateModel;
