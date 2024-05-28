import dbConnect from '@/lib/database';
import Material from '@/models/Material';
import Subject from '@/models/Subject';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

async function putObject({ fileName, contentType, type, s3Client}: any) {
  const command = new PutObjectCommand({
    Bucket: 'ratta-maar',
    Key: `materials/${type}/${fileName}`,
    ContentType: contentType,
  });
  const url = await getSignedUrl(s3Client, command);
  return url;
}

export async function POST(req: NextRequest) {
  try {
    const data: any = await req.formData();
    const name = data.get('name');
    const description = data.get('description');
    const subjectName = data.get('subjectName');
    const type = data.get('type');
    const file = data.get('file');

    // console.log("api addmaterial is called ")
    // console.log("data from request is ", data);

    // Check if all required fields are provided and not empty
    if (!name || !description || !subjectName || !type || !file) {
      // If any field is missing or empty, return an error response
      return NextResponse.json({ message: "All feilds required !" }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ message: 'No file Uploaded !' }, { status: 400 });
    }

    // You can return a success response
    // return NextResponse.json({ message: 'File uploaded successfully to S3', objectUrl: fileUrl }, { status: 200 });

    await dbConnect();
    // console.log("db connected for api process");

    // Attempt to find the Subject, or create a new one if it doesn't exist
    let subject: any = await Subject.findOne({ name: subjectName });
    if (!subject) {
      subject = new Subject({ name: subjectName });
    }

    // Check if the combination of name, type, and subjectName already exists
    const doesCombinationExist = await Material.findOne({ name: name })
      .then(material => {
        if (!material) return false; // If no material is found by name, it's safe to proceed
        // Check if the subject already has a reference to this material in the specified type
        return subject[type] && subject[type].includes(material._id);
      });

    if (doesCombinationExist) {
      return NextResponse.json({ message: 'Material exist with same name, typs and subject. Please delete or change it and try again !' }, { status: 400 });
    } else {

      if (['notes', 'assignments', 'manuals', 'papers', 'cheatSheets', 'pyq'].includes(type)) {

        const byteData = await file.arrayBuffer();
        const buffer = Buffer.from(byteData);
        const fileName = `${Date.now()}-${data.get('name')}.pdf`;
        // const fileName = `${Date.now()+data.get('name')}`;
        // console.log("filename will be ", fileName);
        // console.log("file type will be ", file.type);

        // @ts-ignore
        const s3Client = new S3Client({
          region: "ap-south-1",
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_CODE,
            secretAccessKey: process.env.AWS_SECRETS_KEY_CODE
          }
        });

        const putUrl = await putObject({ fileName, contentType: 'application/pdf', type, s3Client });

        // console.log("put url is ", putUrl);

        const putResponse = await axios.put(putUrl, buffer, {
          headers: {
            'Content-Type': 'application/pdf', // Set the content type header to the file's MIME type
          },
        });

        // If the request is successful, log the response
        // console.log("File uploaded successfully:", putResponse.data);

        // async function getObjectUrl(key: string) {
        //   const command = new GetObjectCommand({
        //     Bucket: 'ratta-maar',
        //     Key: key
        //   });
        //   const url = getSignedUrl(s3Client, command);
        //   return url;
        // }

        // const getUrl = await getObjectUrl(`materials/temp/1712747557658-vinit.pdf`);

        // console.log("get url is ", getUrl);

        const url = `https://${process.env.AWS_BUCKET_NAME_CODE}.s3.ap-south-1.amazonaws.com/materials/${type}/${fileName}`;

        // console.log("file url which gonna to save in mongodb", url);
        // Create a new Material document if it does not exist
        const newMaterial = await Material.create({ name, url, description });

        subject[type] = subject[type] ? [...subject[type], newMaterial._id] : [newMaterial._id];
        await subject.save();
      } else {
        return NextResponse.json({ message: 'Invalid type of Material' }, { status: 400 });
      }
    }

    return NextResponse.json({ message: 'Material added successfully', subject }, { status: 200 });

  } catch (error: any) {
    console.log("[API_INTERNAL_ERROR]", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}