// mongoose.ts
import mongoose from 'mongoose';
// import Subject from '@/models/Subject';

export interface IMaterial {
  name: string;
  subject: string;
  type: string;
  url: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const MaterialSchema = new mongoose.Schema<IMaterial>(
  {
    name: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true, // This will automatically add createdAt and updatedAt fields
  }
);

// const Material = mongoose.model<IMaterial>('Material', MaterialSchema);

// export default Material;


const Material = mongoose.models.Material || mongoose.model('Material', MaterialSchema);

export default Material;
