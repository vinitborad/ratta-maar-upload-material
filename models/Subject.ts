import mongoose, { Document, Schema } from 'mongoose';
// import Material from '@/models/Material';

export interface ISubject extends Document {
    name: string;
    notes: mongoose.Types.ObjectId[]; // References to Material documents for notes
    assignments: mongoose.Types.ObjectId[]; // References to Material documents for assignments
    manuals: mongoose.Types.ObjectId[]; // References to Material documents for manuals
    papers: mongoose.Types.ObjectId[]; // References to Material documents for papers
}

const SubjectSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Ensures the name is unique within the collection
    },
    notes: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Material', // This should match the name you've given your Material model
    }],
    assignments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Material',
    }],
    manuals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Material',
    }],
    // Papers means midsem papers
    papers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Material',
    }],
    pyq: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Material',
    }],
    cheatSheets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Material',
    }],
    syllabus: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Material',
    }],
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
    // toJSON: { virtuals: true }, // Include virtuals when document is converted to JSON
    // toObject: { virtuals: true }, // Include virtuals when document is converted to a plain object
});

// Optionally, if you need a virtual field for id (to mimic the behavior of some ORMs)
// SubjectSchema.virtual('id').get(function(this: ISubject) { // Explicitly type `this`
//     return this._id.toHexString();
// });

// export default mongoose.model<ISubject>('Subject', SubjectSchema);

const Subject = mongoose.models.Subject || mongoose.model('Subject', SubjectSchema);

export default Subject;
