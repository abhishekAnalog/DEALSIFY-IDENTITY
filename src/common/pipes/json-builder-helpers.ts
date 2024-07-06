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
  async generateEscapedTextSearchingAndAddRegex(
    fieldName: string,
    escapedSearch: string,
  ) {
    return {
      [fieldName]: {
        $regex: `.*${escapedSearch}.*`,
        $options: 'i',
      },
    };
  }

  async manageAutoGenSeq(companyPreferenceData, transactionType) {
    try {
      const transactionCustomizationData =
        companyPreferenceData?.data?.transactionCustomize;
      const transactionCustomizationIndex =
        transactionCustomizationData.findIndex(
          (data) => data.transactionType === transactionType,
        );

      if (transactionCustomizationIndex >= 0) {
        let sequenceNo =
          transactionCustomizationData[transactionCustomizationIndex]?.sequence;
        let series =
          transactionCustomizationData[transactionCustomizationIndex]?.series;
        let delimiter =
          transactionCustomizationData[transactionCustomizationIndex]
            ?.delimiter;
        let sequenceLength =
          transactionCustomizationData[transactionCustomizationIndex]
            ?.sequenceLength;
        let sequenceNoFormattedString =
          series?.toString() +
          delimiter?.toString() +
          sequenceNo?.toString().padStart(sequenceLength, '0');

        transactionCustomizationData[transactionCustomizationIndex].sequence =
          sequenceNo + 1;
        return {
          sequenceNoFormattedString,
          companyPreference:
            transactionCustomizationData[transactionCustomizationIndex],
        };
      }
    } catch (error) {
      // Handle the error as per your application's requirement
    }
  }
}