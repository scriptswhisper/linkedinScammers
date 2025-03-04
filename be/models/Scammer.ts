import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scamType: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const scammerSchema = new mongoose.Schema({
  profileLink: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  reports: [reportSchema],
  totalReports: {
    type: Number,
    default: 1
  },
  firstReportedAt: {
    type: Date,
    default: Date.now
  },
  lastReportedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create a compound index to prevent duplicate reports from same user
// This makes the combination of profileLink + reportedBy unique
scammerSchema.index({
  profileLink: 1,
  'reports.reportedBy': 1
}, {
  unique: true,
  partialFilterExpression: { 'reports.reportedBy': { $exists: true } }
});

export const Scammer = mongoose.model('Scammer', scammerSchema);