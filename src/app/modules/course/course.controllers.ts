import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";

import { ICourse } from "./course.interface";
import { courseServices } from "./course.service";

// Create Course (Admin Only)
const createCourse = catchAsync(async (req, res) => {
  const result = await courseServices.createCourseIntoDB(req.body);
  sendResponse<ICourse>(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Course Created Successfully",
    data: result,
  });
});

// Update Course (Admin Only)
const updateCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await courseServices.updateCourseIntoDB(id, req.body);
  sendResponse<ICourse>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Course Updated Successfully",
    data: result,
  });
});

// Delete Course (Admin Only)
const deleteCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await courseServices.deleteCourseIntoDB(id);
  sendResponse<ICourse>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Course Deleted Successfully",
    data: result,
  });
});

// Get All Courses
const getAllCourses = catchAsync(async (req, res) => {
  const { result, meta } = await courseServices.getAllCoursesFromDB(req.query);
  sendResponse<ICourse[]>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All Courses Retrieved Successfully",
    meta,
    data: result,
  });
});

// Get Single Course
const getSingleCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await courseServices.getSingleCourseFromDB(id);
  sendResponse<ICourse>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Course Retrieved Successfully",
    data: result,
  });
});

// Get Popular Courses
const getPopularCourses = catchAsync(async (req, res) => {
  const result = await courseServices.getPopularCoursesFromDB();
  sendResponse<ICourse[]>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Popular Courses Retrieved Successfully",
    data: result,
  });
});

export const courseControllers = {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getSingleCourse,
  getPopularCourses,
};
