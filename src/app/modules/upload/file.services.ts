// import fs from 'fs';
// import { Readable } from 'stream';
// import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// console.log("process.env.DO_SPACE_ENDPOINT: ", {  credentials: {
//     accessKeyId: process.env.DO_SPACE_ACCESS_KEY!,
//     secretAccessKey: process.env.DO_SPACE_SECRET_KEY!,
//   }})
// export const s3Client = new S3Client({
//   endpoint: process.env.DO_SPACE_ENDPOINT,
//   region: 'nyc3', 
//   credentials: {
//     accessKeyId: process.env.DO_SPACE_ACCESS_KEY!,
//     secretAccessKey: process.env.DO_SPACE_SECRET!,
//   },
// });

// export interface UploadResponse {
//   Location: string;
// }

// export const uploadToDigitalOceanAWS = async (
//   file: Express.Multer.File
// ): Promise<UploadResponse> => {
//   try {
//     await fs.promises.access(file.path, fs.constants.F_OK);
//     const fileStream: Readable = fs.createReadStream(file.path);

//     const command = new PutObjectCommand({
//       Bucket: process.env.DO_SPACE_BUCKET,
//       Key: file.filename,
//       Body: fileStream,
//       ACL: 'public-read',
//       ContentType: file.mimetype,
//     });

//     await s3Client.send(command);

//     const Location = `${process.env.DO_SPACE_ENDPOINT}/${process.env.DO_SPACE_BUCKET}/${file.filename}`;

//     await fs.promises.unlink(file.path); // local file delete

//     return { Location };
//   } catch (error) {
//     // try to delete local file even if upload fails
//     await fs.promises.unlink(file.path).catch(() => {});
//     console.error(`Error uploading file: ${file.path}`, error);
//     throw error;
//   }
// };

// export const deleteFromDigitalOceanAWS = async (fileUrl: string): Promise<void> => {
//   try {
//     const key = fileUrl.replace(`${process.env.DO_SPACE_ENDPOINT}/${process.env.DO_SPACE_BUCKET}/`, '');

//     const command = new DeleteObjectCommand({
//       Bucket: process.env.DO_SPACE_BUCKET,
//       Key: key,
//     });

//     await s3Client.send(command);

//     console.log(`Successfully deleted file: ${fileUrl}`);
//   } catch (error: any) {
//     console.error(`Error deleting file: ${fileUrl}`, error);
//     throw new Error(`Failed to delete file: ${error?.message}`);
//   }
// };
