import { Dispatch, SetStateAction } from "react";
import styles from "../styles/Hiking.module.scss";

type SortOption = "name-asc" | "name-desc" | "date-asc" | "date-desc";

interface FilterProps {
  sortOption: SortOption;
  setSortOption: Dispatch<SetStateAction<SortOption>>;
}

const Filter = ({ sortOption, setSortOption }: FilterProps) => {
  return (
    <div className={styles.filterContainer}>
      <label htmlFor="sort-options">Sortera efter:</label>
      <select
        id="sort-options"
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value as SortOption)}>
        <option value="name-asc">Namn (A-Ö)</option>
        <option value="name-desc">Namn (Ö-A)</option>
        <option value="date-asc">Datum (Äldsta först)</option>
        <option value="date-desc">Datum (Nyaste först)</option>
      </select>
    </div>
  );
};

export default Filter;
