import mongoose from "mongoose";

const jobsSchema = new mongoose.Schema({
    company: { type: 'string', required: [true, 'Company name is require'] },
    position: { type: 'string', required: [true, 'Job Position is require'] },
    status: { type: 'string', enum: ['pending', 'reject', 'interview'], default: 'pending' },
    worktype: { type: 'string', enum: ['full-time', 'part-time', 'internship', 'contaract'], default: 'full-time' },
    worklocation: { type: 'string', required: [true, 'Work location is required'], default: 'Surat' },
    createdBy: { type: mongoose.Types.ObjectId, ref: 'user' }
}, { timestamps: true });

export default mongoose.model('job', jobsSchema);