import mongoose from "mongoose";

export class JsonBuilderHelpers {
    async parseQuery(field, input, filteredQuery) {
        if (input) {
            const separatedArray = input
                .split(',')
                .map((ids) => new mongoose.Types.ObjectId(ids));
            if (separatedArray.length > 0) {
                filteredQuery[`${field}`] = { $in: separatedArray };
            }
        }
    }
}