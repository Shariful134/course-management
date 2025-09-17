// src/app/modules/successStories/successStory.controller.ts
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { successStoryServices } from "./success.service";
import { ISuccessStory } from "./success.interface";

// Create Story (Admin Only)
const createStory = catchAsync(async (req: Request, res: Response) => {
  const result = await successStoryServices.createStoryIntoDB(req.body);
  sendResponse<ISuccessStory>(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Success Story Added Successfully",
    data: result,
  });
});

// Get All Stories
const getAllStories = catchAsync(async (req: Request, res: Response) => {
  const result = await successStoryServices.getAllStoriesFromDB();
  sendResponse<ISuccessStory[]>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All Success Stories Retrieved",
    data: result,
  });
});

export const successStoryControllers = {
  createStory,
  getAllStories,
};
