import { useCallback, useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import styles from "../../styles/Gear.module.scss";

interface GearTabsProps {
  type: "All" | "Clothing" | "Equipment" | "Food";
  onTypeChange: (type: "All" | "Clothing" | "Equipment" | "Food") => void;
}

export const GearTabs = ({ type, onTypeChange }: GearTabsProps) => {
  const { t } = useTranslation();
  const tabsRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScrollButtons = useCallback(() => {
    if (tabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
    }
  }, []);

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener("resize", checkScrollButtons);
    return () => window.removeEventListener("resize", checkScrollButtons);
  }, [checkScrollButtons]);

  const scroll = (direction: "left" | "right") => {
    if (tabsRef.current) {
      const scrollAmount = 200;
      const newScrollLeft =
        tabsRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      tabsRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={styles.tabs}>
      <button
        className={`${styles.scrollButton} ${styles.left} ${
          !showLeftArrow ? styles.hidden : ""
        }`}
        onClick={() => scroll("left")}
        aria-label="Scroll left">
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <div
        className={styles.tabsWrapper}
        ref={tabsRef}
        onScroll={checkScrollButtons}>
        <button
          type="button"
          onClick={() => onTypeChange("All")}
          className={`${styles.tab} ${type === "All" ? styles.active : ""}`}>
          {t("myGear.all")}
        </button>
        <button
          type="button"
          onClick={() => onTypeChange("Clothing")}
          className={`${styles.tab} ${
            type === "Clothing" ? styles.active : ""
          }`}>
          {t("myGear.clothing")}
        </button>
        <button
          type="button"
          onClick={() => onTypeChange("Equipment")}
          className={`${styles.tab} ${
            type === "Equipment" ? styles.active : ""
          }`}>
          {t("myGear.equipment")}
        </button>
        <button
          type="button"
          onClick={() => onTypeChange("Food")}
          className={`${styles.tab} ${type === "Food" ? styles.active : ""}`}>
          {t("myGear.food")}
        </button>
      </div>
      <button
        className={`${styles.scrollButton} ${styles.right} ${
          !showRightArrow ? styles.hidden : ""
        }`}
        onClick={() => scroll("right")}
        aria-label="Scroll right">
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
};

export default GearTabs;
