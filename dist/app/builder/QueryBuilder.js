"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    //  search(searchableFields: string[]) {
    //     const searchTerm = this?.query?.searchTerm;
    //     if (searchTerm) {
    //       const orConditions: FilterQuery<T>[] = [];
    //       searchableFields.forEach((field) => {
    //         if (field === "bookingDate") {
    //           // Check if searchTerm is a valid date
    //           const date = new Date(searchTerm as string);
    //           if (!isNaN(date.getTime())) {
    //             const start = new Date(date);
    //             const end = new Date(date);
    //             end.setDate(end.getDate() + 1);
    //             orConditions.push({
    //               [field]: { $gte: start, $lt: end },
    //             } as FilterQuery<T>);
    //           } else {
    //             // Invalid date, skip bookingDate
    //             console.warn(`Invalid date for bookingDate search: ${searchTerm}`);
    //           }
    //         } else {
    //           // Regular regex search for other fields
    //           orConditions.push({
    //             [field]: { $regex: searchTerm, $options: "i" },
    //           } as FilterQuery<T>);
    //         }
    //       });
    //       if (orConditions.length > 0) {
    //         this.modelQuery = this.modelQuery.find({ $or: orConditions });
    //       }
    //     }
    //     return this;
    //   }
    search(searchableFields) {
        var _a;
        const searchTerm = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.searchTerm;
        if (searchTerm) {
            this.modelQuery = this.modelQuery.find({
                $or: searchableFields.map((field) => ({
                    [field]: { $regex: searchTerm, $options: 'i' },
                })),
            });
        }
        return this;
    }
    filter() {
        const queryObj = Object.assign({}, this.query); // copy
        // Filtering
        const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
        excludeFields.forEach((el) => delete queryObj[el]);
        this.modelQuery = this.modelQuery.find(queryObj);
        return this;
    }
    sort() {
        var _a, _b, _c;
        const sort = ((_c = (_b = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.sort) === null || _b === void 0 ? void 0 : _b.split(',')) === null || _c === void 0 ? void 0 : _c.join(' ')) || '-createdAt';
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }
    paginate() {
        var _a, _b;
        const page = Number((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
        const limit = Number((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.limit) || 10;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    fields() {
        var _a, _b, _c;
        const fields = ((_c = (_b = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.fields) === null || _b === void 0 ? void 0 : _b.split(',')) === null || _c === void 0 ? void 0 : _c.join(' ')) || '-__v';
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }
    countTotal() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const totalQueries = this.modelQuery.getFilter();
            const total = yield this.modelQuery.model.countDocuments(totalQueries);
            const page = Number((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
            const limit = Number((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.limit) || 10;
            const totalPage = Math.ceil(total / limit);
            return {
                page,
                limit,
                total,
                totalPage,
            };
        });
    }
}
exports.default = QueryBuilder;
// import { FilterQuery, Query } from 'mongoose';
// class QueryBuilder<T> {
//   public modelQuery: Query<T[], T>;
//   public query: Record<string, unknown>;
//   constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
//     this.modelQuery = modelQuery;
//     this.query = query;
//   }
//   search(searchableFields: string[]) {
//     const searchTerm = this?.query?.searchTerm;
//     if (searchTerm) {
//       this.modelQuery = this.modelQuery.find({
//         $or: searchableFields.map(
//           (field) =>
//             ({
//               [field]: { $regex: searchTerm, $options: 'i' },
//             }) as FilterQuery<T>,
//         ),
//       });
//     }
//     return this;
//   }
//   filter() {
//     const queryObj = { ...this.query }; // copy
//     // Filtering
//     const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
//     excludeFields.forEach((el) => delete queryObj[el]);
//     this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);
//     return this;
//   }
//   sort() {
//     const sort =
//       (this?.query?.sort as string)?.split(',')?.join(' ') || '-createdAt';
//     this.modelQuery = this.modelQuery.sort(sort as string);
//     return this;
//   }
//   paginate() {
//     const page = Number(this?.query?.page) || 1;
//     const limit = Number(this?.query?.limit) || 10;
//     const skip = (page - 1) * limit;
//     this.modelQuery = this.modelQuery.skip(skip).limit(limit);
//     return this;
//   }
//   fields() {
//     const fields =
//       (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';
//     this.modelQuery = this.modelQuery.select(fields);
//     return this;
//   }
//   async countTotal() {
//     const totalQueries = this.modelQuery.getFilter();
//     const total = await this.modelQuery.model.countDocuments(totalQueries);
//     const page = Number(this?.query?.page) || 1;
//     const limit = Number(this?.query?.limit) || 10;
//     const totalPage = Math.ceil(total / limit);
//     return {
//       page,
//       limit,
//       total,
//       totalPage,
//     };
//   }
// }
// export default QueryBuilder;
