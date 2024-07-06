export class AllowSpecialCharacterHelpers {
    replacingString(text: string) {
      const escapedSearch = text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      return escapedSearch;
    }
  }
  