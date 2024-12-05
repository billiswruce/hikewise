import { Trail } from "../models/Trail";

export const useTrailSort = (trails: Trail[], sortOption: string) => {
  const sortedTrails = [...trails].sort((a, b) => {
    if (sortOption === "name-asc") {
      return a.name.localeCompare(b.name);
    } else if (sortOption === "name-desc") {
      return b.name.localeCompare(a.name);
    } else if (sortOption === "date-asc") {
      return new Date(a.hikeDate).getTime() - new Date(b.hikeDate).getTime();
    } else if (sortOption === "date-desc") {
      return new Date(b.hikeDate).getTime() - new Date(a.hikeDate).getTime();
    }
    return 0;
  });

  return sortedTrails;
}; 

export default useTrailSort;