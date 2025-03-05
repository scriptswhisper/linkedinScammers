"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scammer = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Il resto del file rimane invariato
// Schema per i singoli report
const reportSchema = new mongoose_1.Schema({
    scamType: {
        type: String,
        required: true,
        enum: ['download-suspicios-repo', 'download-suspicios-software', 'investment-scam', 'romance-scam', 'other']
    },
    name: {
        type: String,
        required: false
    },
    company: {
        type: String,
        required: false
    },
    notes: {
        type: String,
        required: true
    },
    reportedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });
// Schema per lo scammer
const scammerSchema = new mongoose_1.Schema({
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
            const sortedReports = [...this.reports].sort((a, b) => a.createdAt && b.createdAt ? a.createdAt.getTime() - b.createdAt.getTime() : 0);
            // Imposta la prima data di segnalazione
            if (sortedReports[0]?.createdAt) {
                this.firstReportedAt = sortedReports[0].createdAt;
            }
            // Imposta l'ultima data di segnalazione
            if (sortedReports[sortedReports.length - 1]?.createdAt) {
                this.lastReportedAt = sortedReports[sortedReports.length - 1].createdAt;
            }
            else {
                this.lastReportedAt = new Date();
            }
        }
    }
    next();
});
exports.Scammer = mongoose_1.default.model('Scammer', scammerSchema);
//# sourceMappingURL=Scammer.js.map