import { Request, Response } from 'express';
import { deleteFromDigitalOceanAWS, uploadToDigitalOceanAWS } from './image.upload';

// import { uploadToDigitalOceanAWS, deleteFromDigitalOceanAWS } from '../services/digitalOceanService';

export const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const uploadedFile = await uploadToDigitalOceanAWS(req.file);

    res.status(200).json({
      message: 'File uploaded successfully',
      fileUrl: uploadedFile.Location,
    });
  } catch (error) {
    console.log("erorr: ", error)
    res.status(500).json({ message: 'Upload failed', error });
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  try {
    const { fileUrl } = req.body;
    if (!fileUrl) {
      return res.status(400).json({ message: 'File URL is required' });
    }

    await deleteFromDigitalOceanAWS(fileUrl);

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error });
  }
};
