const mongoose = require('mongoose')

// ── User Schema ──
const userSchema = new mongoose.Schema({
  guestId:     { type: String, required: true, unique: true, index: true },
  name:        { type: String, trim: true, index: true },
  email:       { type: String, trim: true, lowercase: true, index: true },
  password:    { type: String }, // Hashed using crypto.scrypt
  role:        { type: String, enum: ['user', 'admin'], default: 'user', index: true },
  isSuspended: { type: Boolean, default: false, index: true },
  totalScore:  { type: Number, default: 0 },
  lastLogin:   { type: Date },
  createdAt:   { type: Date, default: Date.now },
})
userSchema.index({ totalScore: -1 })
const User = mongoose.model('User', userSchema)

// ── ChallengeSession ──
const sessionSchema = new mongoose.Schema({
  sessionId:  { type: String, required: true, unique: true, index: true },
  guestId:    { type: String, required: true, index: true },
  startTime:  { type: Date, default: Date.now },
  endTime:    { type: Date },
  finalScore: { type: Number, default: 0 },
})
const Session = mongoose.model('Session', sessionSchema)

// ── Attempt ──
const attemptSchema = new mongoose.Schema({
  sessionId:     { type: String, required: true, index: true },
  gesturePrompt: { type: String, required: true },
  userGesture:   { type: String },
  isCorrect:     { type: Boolean, required: true },
  timeTakenMs:   { type: Number },
  timestamp:     { type: Date, default: Date.now },
})
const Attempt = mongoose.model('Attempt', attemptSchema)

module.exports = { User, Session, Attempt }
