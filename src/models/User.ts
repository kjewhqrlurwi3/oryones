import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const EducationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  major: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  description: { type: String },
});

const WorkExperienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  description: { type: String },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },
  profilePicture: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  activities: {
    type: [String],
    default: [],
  },
  education: {
    type: [EducationSchema],
    default: [],
  },
  workExperience: {
    type: [WorkExperienceSchema],
    default: [],
  },
  age: {
    type: Number,
  },
  achievements: {
    type: [String],
    default: [],
  },
  futureGoals: {
    type: String,
    default: '',
  },
  isShowcasingWork: {
    type: Boolean,
    default: false,
  },
  lookingForHelp: {
    type: Boolean,
    default: false,
  },
  lookingToHire: {
    type: Boolean,
    default: false,
  },
  verificationStatus: {
    studentId: {
      verified: { type: Boolean, default: false },
      documentUrl: String,
      verifiedAt: Date
    },
    nationalId: {
      verified: { type: Boolean, default: false },
      documentUrl: String,
      verifiedAt: Date
    },
    professionalTest: {
      completed: { type: Boolean, default: false },
      score: Number,
      completedAt: Date
    }
  },
  skills: [{
    name: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert']
    },
    verified: { type: Boolean, default: false }
  }],
  teachingProfile: {
    isTeacher: { type: Boolean, default: false },
    subjects: [{
      name: String,
      description: String,
      pricePerHour: Number,
      isSubscriptionOnly: { type: Boolean, default: false }
    }],
    availability: [{
      day: String,
      startTime: String,
      endTime: String
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to check if password matches
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', userSchema);