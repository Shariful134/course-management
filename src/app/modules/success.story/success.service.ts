import { StatusCodes } from "http-status-codes";
import AppError from "../../../errors/AppError";
import { ISuccessStory } from "./success.interface";
import SuccessStoryModel from "./success.model";
import QueryBuilder from "../../builder/QueryBuilder";

const SearchableFields = ["studentName", "courseName", "storyText"];

// Create Success Story
const createStoryIntoDB = async (payload: ISuccessStory) => {
  const story = await SuccessStoryModel.create(payload);
  return story;
};

// Get All Success Stories
const getAllStoriesFromDB = async (query: Record<string, unknown>) => {
  const story = new QueryBuilder(SuccessStoryModel.find(), query)
    .search(SearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await story.modelQuery;
  const meta = await story.countTotal();

  return { result, meta };
};

export const successStoryServices = {
  createStoryIntoDB,
  getAllStoriesFromDB,
};
