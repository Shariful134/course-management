import { StatusCodes } from "http-status-codes";
import AppError from "../../../errors/AppError";
import CourseModel from "./course.model";
import { ICourse } from "./course.interface";
import { User } from "../auth/auth.model";
import QueryBuilder from "../../builder/QueryBuilder";

const SearchableFields = ["description", "title"];

// Create Course (Admin)
const createCourseIntoDB = async (payload: ICourse) => {
  const instructor = await User.findById(payload?.instructor);

  if (!instructor) {
    throw new AppError(StatusCodes.NOT_FOUND, "Instructor is not found!");
  }

  // Check if the user has role 'instructor'
  if (instructor.role !== "instructor") {
    throw new AppError(StatusCodes.UNAUTHORIZED, "User is not an instructor!");
  }
  const course = await CourseModel.create(payload);
  return course;
};

// Update Course (Admin)
const updateCourseIntoDB = async (id: string, payload: Partial<ICourse>) => {
  const updatedCourse = await CourseModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!updatedCourse)
    throw new AppError(StatusCodes.NOT_FOUND, "Course not found!");
  return updatedCourse;
};

// Delete Course (Admin)
const deleteCourseIntoDB = async (id: string) => {
  const deletedCourse = await CourseModel.findByIdAndDelete(id);
  if (!deletedCourse)
    throw new AppError(StatusCodes.NOT_FOUND, "Course not found!");
  return deletedCourse;
};

// Get All Courses
const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const course = new QueryBuilder(
    CourseModel.find().populate("instructor"),
    query
  )
    .search(SearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await course.modelQuery;
  const meta = await course.countTotal();

  return { result, meta };
};

// Get Single Course
const getSingleCourseFromDB = async (id: string) => {
  const course = await CourseModel.findById(id).populate(
    "instructor",
    "name email role"
  );
  if (!course) throw new AppError(StatusCodes.NOT_FOUND, "Course not found!");
  return course;
};

// Get Popular Courses
const getPopularCoursesFromDB = async () => {
  const courses = await CourseModel.find({ isPopular: true }).populate(
    "instructor",
    "name email role"
  );
  return courses;
};

export const courseServices = {
  createCourseIntoDB,
  updateCourseIntoDB,
  deleteCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  getPopularCoursesFromDB,
};
