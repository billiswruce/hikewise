import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import styles from "../../styles/Gear.module.scss";
import buttonStyles from "../../styles/Buttons.module.scss";
import { CirclePicker, ColorResult } from "react-color";
import { COLORS, RAINBOW_GRADIENT } from "../../models/constants";
import { GearItemType } from "../../models/gear";

interface GearItemProps {
  item: GearItemType;
  onDelete: (id: string, isFood: boolean) => void;
  onUpdate: (itemId: string, updatedItem: Partial<GearItemType>) => void;
}

export const GearItem = ({ item, onDelete, onUpdate }: GearItemProps) => {
  const { t } = useTranslation();
  const [editingItem, setEditingItem] = useState<GearItemType | null>(null);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const handleEdit = () => {
    setEditingItem(item);
  };

  const handleUpdate = () => {
    if (editingItem) {
      onUpdate(item._id, editingItem);
      setEditingItem(null);
    }
  };

  if (editingItem) {
    return (
      <div className={styles.editForm}>
        <label htmlFor="editName">{t("myGear.name")}</label>
        <input
          id="editName"
          type="text"
          value={editingItem.name}
          onChange={(e) =>
            setEditingItem({
              ...editingItem,
              name: e.target.value,
            })
          }
          required
        />

        <label htmlFor="editBrand">{t("myGear.brand")}</label>
        <input
          id="editBrand"
          type="text"
          value={editingItem.brand || ""}
          onChange={(e) =>
            setEditingItem({
              ...editingItem,
              brand: e.target.value,
            })
          }
        />

        <div className={styles.colorPickerContainer}>
          <label>{t("myGear.color")}</label>
          <div className={styles.colorAccordion}>
            <div
              className={styles.selectedColor}
              onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}>
              <span
                className={styles.colorPreview}
                data-color={
                  editingItem.color === "rainbow" ? "rainbow" : undefined
                }
                style={{
                  backgroundColor:
                    editingItem.color && editingItem.color !== "rainbow"
                      ? editingItem.color
                      : undefined,
                }}
              />
              <span>{t("myGear.selectColor")}</span>
            </div>
            <div
              className={`${styles.colorOptions} ${
                isColorPickerOpen ? styles.open : ""
              }`}>
              <div className={styles.colorPickerWrapper}>
                <CirclePicker
                  colors={[...COLORS, RAINBOW_GRADIENT.type]}
                  color={editingItem.color}
                  onChange={(color: ColorResult) =>
                    setEditingItem({
                      ...editingItem,
                      color:
                        color.hex === RAINBOW_GRADIENT.type
                          ? RAINBOW_GRADIENT.type
                          : color.hex,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <label htmlFor="editQuantity">{t("myGear.quantity")}</label>
        <input
          id="editQuantity"
          type="number"
          value={editingItem.quantity}
          onChange={(e) =>
            setEditingItem({
              ...editingItem,
              quantity: Number(e.target.value),
            })
          }
          required
          min="1"
        />

        <label htmlFor="editCondition">{t("myGear.condition.label")}</label>
        <select
          id="editCondition"
          value={editingItem.condition}
          onChange={(e) =>
            setEditingItem({
              ...editingItem,
              condition: e.target.value,
            })
          }
          required>
          <option value="New">{t("myGear.condition.new")}</option>
          <option value="Good">{t("myGear.condition.good")}</option>
          <option value="Fair">{t("myGear.condition.fair")}</option>
          <option value="Poor">{t("myGear.condition.poor")}</option>
        </select>

        <div className={buttonStyles.editButtons}>
          <button className={buttonStyles.saveButton} onClick={handleUpdate}>
            {t("myGear.actions.save")}
          </button>
          <button
            className={buttonStyles.cancelButton}
            onClick={() => setEditingItem(null)}>
            {t("myGear.actions.cancel")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.gearInfo}>
      <div className={styles.gearHeader}>
        <span className={styles.gearName}>{item.name}</span>
        {item.brand && <span className={styles.gearBrand}> {item.brand}</span>}
        <div className={styles.gearActions}>
          <button onClick={handleEdit} aria-label={t("myGear.actions.edit")}>
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            onClick={() => onDelete(item._id, item.type === "Food")}
            aria-label={t("myGear.actions.delete")}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
      <div className={styles.gearDetails}>
        {item.color && (
          <span className={styles.gearDetail}>
            <span
              className={`${styles.colorDot} ${
                item.color === "rainbow" ? styles.rainbow : ""
              }`}
              data-color={item.color === "rainbow" ? "rainbow" : undefined}
              style={{
                backgroundColor:
                  item.color && item.color !== "rainbow"
                    ? item.color
                    : undefined,
              }}
            />
          </span>
        )}
        <span className={styles.gearDetail}>
          {t("myGear.condition.label")}:{" "}
          {t(`myGear.condition.${item.condition.toLowerCase()}`)}
        </span>
        <span className={styles.gearDetail}>
          {t("myGear.quantity")}: {item.quantity}
        </span>
      </div>
    </div>
  );
};

export default GearItem;
