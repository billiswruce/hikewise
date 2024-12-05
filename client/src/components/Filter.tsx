import { Dispatch, SetStateAction } from "react";
import styles from "../styles/Hiking.module.scss";
import { useTranslation } from "react-i18next";

type SortOption = "name-asc" | "name-desc" | "date-asc" | "date-desc";

interface FilterProps {
  sortOption: SortOption;
  setSortOption: Dispatch<SetStateAction<SortOption>>;
}

const Filter = ({ sortOption, setSortOption }: FilterProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.filterContainer}>
      <label htmlFor="sort-options">{t("filter.sortLabel")}</label>
      <select
        id="sort-options"
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value as SortOption)}>
        <option value="name-asc">{t("filter.options.nameAsc")}</option>
        <option value="name-desc">{t("filter.options.nameDesc")}</option>
        <option value="date-asc">{t("filter.options.dateAsc")}</option>
        <option value="date-desc">{t("filter.options.dateDesc")}</option>
      </select>
    </div>
  );
};

export default Filter;
