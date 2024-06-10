import dbConnect from '@/lib/database';
import Material from '@/models/Material';
import Subject from '@/models/Subject';
import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

type UploadResult = {
  secure_url: string;
};

async function uploadToCloudinary(buffer: Buffer, subjectName: string, type: string, fileName: string): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const sanitizedFileName = fileName.replace(/[^\w-]/g, '_');
    // const sanitizedSubjectName = subjectName.replace(/[^\w-]/g, '_');

    const publicId = `materials/${subjectName}/${type}/${sanitizedFileName}`;
    console.log("Uploading to Cloudinary with public_id:", publicId);

    cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw', // specify resource type as 'raw' for non-image/video files
        public_id: publicId, // set the public ID (path and filename)
        format: 'pdf', // ensure the format is PDF
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else {
          resolve(result as UploadResult);
        }
      }
    ).end(buffer);
  });
}


export async function POST(req: NextRequest) {
  try {
    const data: any = await req.formData();
    const name = data.get('name');
    const description = data.get('description');
    const subjectName = data.get('subjectName');
    const type = data.get('type');
    const file = data.get('file');

    // Check if all required fields are provided and not empty
    if (!name || !description || !subjectName || !type || !file) {
      // If any field is missing or empty, return an error response
      return NextResponse.json({ message: "All feilds required !" }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ message: 'No file Uploaded !' }, { status: 400 });
    }

    await dbConnect();

    // Attempt to find the Subject, or create a new one if it doesn't exist
    let subject: any = await Subject.findOne({ name: subjectName });
    if (!subject) {
      subject = new Subject({ name: subjectName });
    }

    const material = await Material.findOne({ name, type, subject: subjectName });

    let doesCombinationExist = false;
    if (material) {
      doesCombinationExist = true;
    }

    if (doesCombinationExist) {
      return NextResponse.json({ message: 'Material exist with same name, typs and subject. Please delete or change it and try again !' }, { status: 400 });
    } else {

      if (['notes', 'assignments', 'manuals', 'papers', 'cheatSheets', 'pyq', 'syllabus'].includes(type)) {

        // Convert the file to a buffer
        const byteData = await file.arrayBuffer();
        const buffer = Buffer.from(byteData);

        // Generate a unique file name with a .pdf extension
        const fileName = `${name}-${Date.now()}.pdf`;

        // Upload the file to Cloudinary
        const uploadResult = await uploadToCloudinary(buffer, subjectName, type, fileName);

        // Get the URL of the uploaded PDF
        const fileUrl = uploadResult.secure_url;

        // Create a new Material document if it does not exist
        const newMaterial = await Material.create({ name, url: fileUrl, description, subject: subjectName, type });

        subject[type] = subject[type] ? [...subject[type], newMaterial._id] : [newMaterial._id];
        await subject.save();
      } else {
        return NextResponse.json({ message: 'Invalid type of Material' }, { status: 400 });
      }
    }

    return NextResponse.json({ message: 'Material added successfully', subject }, { status: 200 });

  } catch (error: any) {
    console.log("[API_INTERNAL_ERROR]", error);
    return NextResponse.json({ message: error.message, error }, { status: 500 });
  }
}