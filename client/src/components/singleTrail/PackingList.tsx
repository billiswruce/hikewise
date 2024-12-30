import { useTranslation } from "react-i18next";
import styles from "../../styles/SingleTrail.module.scss";
import { SingleTrailData } from "../../models/SingleTrail";

interface PackingListProps {
  trail: SingleTrailData;
  isPackingListOpen: boolean;
  togglePackingList: () => void;
  updatePackingListItem: (
    itemId: string,
    isFood: boolean,
    isChecked: boolean
  ) => void;
  removePackingListItem: (itemId: string, isFood: boolean) => void;
  newPackingListItem: string;
  setNewPackingListItem: (value: string) => void;
  isFood: boolean;
  setIsFood: (value: boolean) => void;
  addPackingListItem: () => void;
  isAdding: boolean;
}

export const PackingList = ({
  trail,
  isPackingListOpen,
  togglePackingList,
  updatePackingListItem,
  removePackingListItem,
  newPackingListItem,
  setNewPackingListItem,
  isFood,
  setIsFood,
  addPackingListItem,
  isAdding,
}: PackingListProps) => {
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPackingListItem();
  };

  return (
    <div className={styles.packingListContainer}>
      <div className={styles.packingListSection}>
        <button onClick={togglePackingList} className={styles.accordionButton}>
          <span className={styles.accordionTitle}>{t("packingList")}</span>
          <span>{isPackingListOpen ? "▼" : "▶"}</span>
        </button>

        {isPackingListOpen && (
          <div className={styles.accordionContentWrapper}>
            <div className={styles.packingListContent}>
              <div className={styles.packingListGrid}>
                {/* Gear */}
                <div className={styles.packingColumn}>
                  <h4>{t("gear")}</h4>
                  <ul>
                    {trail.packingList.gear.map((item) => (
                      <li key={item._id} className={styles.item}>
                        <input
                          type="checkbox"
                          checked={item.isChecked}
                          onChange={(e) =>
                            updatePackingListItem(
                              item._id!,
                              false,
                              e.target.checked
                            )
                          }
                        />
                        <span>{item.name}</span>
                        <button
                          className={styles.deleteButton}
                          onClick={() =>
                            removePackingListItem(item._id!, false)
                          }>
                          x
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Food */}
                <div className={styles.packingColumn}>
                  <h4>{t("food")}</h4>
                  <ul>
                    {trail.packingList.food.map((item) => (
                      <li key={item._id} className={styles.item}>
                        <input
                          type="checkbox"
                          checked={item.isChecked}
                          onChange={(e) =>
                            updatePackingListItem(
                              item._id!,
                              true,
                              e.target.checked
                            )
                          }
                        />
                        <span>{item.name}</span>
                        <button
                          className={styles.deleteButton}
                          onClick={() =>
                            removePackingListItem(item._id!, true)
                          }>
                          x
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Add item form */}
              <form onSubmit={handleSubmit} className={styles.addPackingItem}>
                <input
                  type="text"
                  value={newPackingListItem}
                  onChange={(e) => setNewPackingListItem(e.target.value)}
                  placeholder={t("addItem")}
                />
                <select
                  value={isFood ? "food" : "gear"}
                  onChange={(e) => setIsFood(e.target.value === "food")}>
                  <option value="gear">{t("gear")}</option>
                  <option value="food">{t("food")}</option>
                </select>
                <button
                  type="submit"
                  className={styles.addButton}
                  disabled={isAdding || !newPackingListItem.trim()}>
                  {isAdding ? t("adding...") : t("add")}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
