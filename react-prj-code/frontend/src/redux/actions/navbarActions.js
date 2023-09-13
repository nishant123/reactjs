export const SELECT_SEARCHBY = "SELECT_SEARCHBY";
export const SEARCH_CHARACTORS = "SEARCH_CHARACTORS";
export const SEARCH_TYPE = "SEARCH_TYPE";

export const selectSearchBy = (searchBy) => {
  return {
    type: SELECT_SEARCHBY,
    SearchBy: searchBy,
  };
};
