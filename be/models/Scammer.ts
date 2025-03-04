import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

// Interfaccia per i dati di input di un report (SENZA _id)
export interface IReportInput {
  scamType: string;
  name: string;
  company: string;
  notes: string;
  reportedBy: mongoose.Types.ObjectId | string;
}

// Interface per il report come documento Mongoose
export interface IReport extends Document {
  _id: mongoose.Types.ObjectId;
  scamType: string;
  name: string;
  company: string;
  notes: string;
  reportedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Interface per i dati di input di uno scammer
export interface IScammerInput {
  profileLink: string;
  reports: IReportInput[];
  totalReports?: number;
  firstReportedAt?: Date;
  lastReportedAt?: Date;
}

// Interface per lo scammer (documento completo)
export interface IScammer extends Document {
  _id: mongoose.Types.ObjectId;
  profileLink: string;
  reports: IReport[];
  totalReports: number;
  firstReportedAt: Date;
  lastReportedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Il resto del file rimane invariato
// Schema per i singoli report
const reportSchema = new Schema({
  scamType: {
    type: String,
    required: true,
    enum: ['download-suspicios-repo', 'download-suspicios-software', 'investment-scam', 'romance-scam', 'other']
  },
  name: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    required: true
  },
  reportedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });
// Schema per lo scammer
const scammerSchema = new Schema({
  profileLink: {
    type: String,
    required: true,
    unique: true
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
scammerSchema.index({
  profileLink: 1,
  'reports.reportedBy': 1
}, {
  unique: true,
  partialFilterExpression: { 'reports.reportedBy': { $exists: true } }
});

// Middleware per aggiornare automaticamente il conteggio e le date
scammerSchema.pre('save', function (next) {
  if (this.isModified('reports')) {
    // Aggiorna il conteggio totale
    this.totalReports = this.reports.length;

    // Aggiorna le date se necessario
    if (this.reports.length > 0) {
      // Ordina i report per data di creazione
      const sortedReports = [...this.reports].sort((a, b) =>
        a.createdAt && b.createdAt ? a.createdAt.getTime() - b.createdAt.getTime() : 0
      );

      // Imposta la prima data di segnalazione
      if (sortedReports[0]?.createdAt) {
        this.firstReportedAt = sortedReports[0].createdAt;
      }

      // Imposta l'ultima data di segnalazione
      if (sortedReports[sortedReports.length - 1]?.createdAt) {
        this.lastReportedAt = sortedReports[sortedReports.length - 1].createdAt;
      } else {
        this.lastReportedAt = new Date();
      }
    }
  }
  next();
});

export const Scammer = mongoose.model<IScammer>('Scammer', scammerSchema);