import { StatusCodes } from "http-status-codes";
import AppError from "../../../errors/AppError";
import { ISuccessStory } from "./success.interface";
import SuccessStoryModel from "./success.model";

// Create Success Story
const createStoryIntoDB = async (payload: ISuccessStory) => {
  const story = await SuccessStoryModel.create(payload);
  return story;
};

// Get All Success Stories
const getAllStoriesFromDB = async () => {
  const stories = await SuccessStoryModel.find().sort({ createdAt: -1 });
  if (!stories) {
    throw new AppError(StatusCodes.NOT_FOUND, "No success stories found");
  }
  return stories;
};

export const successStoryServices = {
  createStoryIntoDB,
  getAllStoriesFromDB,
};
