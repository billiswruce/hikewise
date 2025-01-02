import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CirclePicker, ColorResult } from "react-color";
import styles from "../../styles/Gear.module.scss";
import buttonStyles from "../../styles/Buttons.module.scss";
import { COLORS, RAINBOW_GRADIENT } from "../../models/constants";
import { NewGearItem } from "../../models/gear";
import { GearType, CATEGORIES } from "../../models/gearCategories";
import { getColorName } from "../../utils/colorUtils";

interface AddGearFormProps {
  type: GearType;
  onAdd: (newItem: NewGearItem) => Promise<boolean>;
}

export const AddGearForm = ({ type, onAdd }: AddGearFormProps) => {
  const { t } = useTranslation();
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [newItem, setNewItem] = useState<NewGearItem>({
    name: "",
    quantity: 1,
    condition: "Good",
    brand: "",
    color: "",
    categories: [],
    type: type === "All" ? null : type,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const itemType = type === "All" ? newItem.type : type;
    if (!itemType) {
      alert(t("formValidation.typeRequired"));
      return;
    }

    const success = await onAdd(newItem);
    if (success) {
      setNewItem({
        name: "",
        quantity: 1,
        condition: "Good",
        brand: "",
        color: "",
        categories: [],
        type: type === "All" ? null : type,
      });
    }
  };

  return (
    <form className={styles.addGearForm} onSubmit={handleSubmit}>
      <h2>{t("myGear.addGear")}</h2>

      {type === "All" && (
        <>
          <label htmlFor="gearType">{t("myGear.type")}</label>
          <select
            id="gearType"
            value={newItem.type || ""}
            onChange={(e) =>
              setNewItem({
                ...newItem,
                type: e.target.value as Exclude<GearType, "All">,
                categories: [],
              })
            }
            required
            className={styles.required}>
            <option value="">{t("myGear.selectType")}</option>
            <option value="Clothing">{t("myGear.clothing")}</option>
            <option value="Equipment">{t("myGear.equipment")}</option>
            <option value="Food">{t("myGear.food")}</option>
          </select>
        </>
      )}

      <label htmlFor="gearName">{t("myGear.name")}</label>
      <input
        id="gearName"
        type="text"
        placeholder={t("myGear.name")}
        value={newItem.name}
        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        required
      />

      <label htmlFor="gearBrand">{t("myGear.brand")}</label>
      <input
        id="gearBrand"
        type="text"
        placeholder={t("myGear.brand")}
        value={newItem.brand}
        onChange={(e) => setNewItem({ ...newItem, brand: e.target.value })}
      />

      <label htmlFor="gearQuantity">{t("myGear.quantity")}</label>
      <input
        id="gearQuantity"
        type="number"
        placeholder={t("myGear.quantity")}
        value={newItem.quantity}
        onChange={(e) =>
          setNewItem({ ...newItem, quantity: Number(e.target.value) })
        }
        required
        min="1"
      />

      <span id="color-picker-label" className={styles.colorLabel}>
        {t("myGear.selectColor")}
      </span>
      <div
        className={styles.colorPickerContainer}
        role="combobox"
        aria-labelledby="color-picker-label"
        aria-expanded={isColorPickerOpen}
        aria-controls="color-picker-options"
        aria-haspopup="listbox"
        tabIndex={0}>
        <div className={styles.colorAccordion}>
          <div
            className={styles.selectedColor}
            onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}>
            <span
              className={styles.colorPreview}
              data-color={newItem.color === "rainbow" ? "rainbow" : undefined}
              style={{
                backgroundColor:
                  newItem.color !== "rainbow" ? newItem.color : undefined,
              }}
            />
            <span>
              {newItem.color
                ? t(
                    getColorName(newItem.color).startsWith("#")
                      ? "myGear.selectColor"
                      : `colors.${getColorName(newItem.color)}`
                  )
                : t("myGear.selectColor")}
            </span>
          </div>
          <div
            id="color-picker-options"
            role="listbox"
            className={`${styles.colorOptions} ${
              isColorPickerOpen ? styles.open : ""
            }`}>
            <div className={styles.colorPickerWrapper}>
              <CirclePicker
                colors={[...COLORS, RAINBOW_GRADIENT.type]}
                color={newItem.color}
                onChange={(color: ColorResult) =>
                  setNewItem({
                    ...newItem,
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

      <label htmlFor="gearCategory">{t("myGear.selectCategory")}</label>
      <select
        id="gearCategory"
        value={newItem.categories[0] || ""}
        onChange={(e) =>
          setNewItem({ ...newItem, categories: [e.target.value] })
        }
        className={`${styles.categorySelect} ${styles.required}`}
        required>
        <option value="">{t("myGear.selectCategory")}</option>
        {(type === "All" && newItem.type
          ? CATEGORIES[newItem.type]
          : type !== "All"
          ? CATEGORIES[type]
          : null) &&
          Object.entries(
            type === "All" && newItem.type
              ? CATEGORIES[newItem.type]
              : CATEGORIES[type as Exclude<typeof type, "All">]
          ).map(([subcategory, items]) => (
            <optgroup
              key={subcategory}
              label={t(`myGear.categories.${subcategory.toLowerCase()}`)}>
              {items.map((category: string) => (
                <option key={category} value={category}>
                  {t(
                    `myGear.categories.${category
                      .toLowerCase()
                      .replace(/\s+/g, "")}`
                  )}
                </option>
              ))}
            </optgroup>
          ))}
      </select>

      <label htmlFor="gearCondition">{t("myGear.condition.label")}</label>
      <select
        id="gearCondition"
        value={newItem.condition}
        onChange={(e) => setNewItem({ ...newItem, condition: e.target.value })}
        required
        className={styles.required}>
        <option value="">{t("myGear.condition.label")}</option>
        <option value="New">{t("myGear.condition.new")}</option>
        <option value="Good">{t("myGear.condition.good")}</option>
        <option value="Fair">{t("myGear.condition.fair")}</option>
        <option value="Poor">{t("myGear.condition.poor")}</option>
      </select>

      <button type="submit" className={buttonStyles.submitButton}>
        {t("myGear.actions.add")}
      </button>
    </form>
  );
};

export default AddGearForm;
