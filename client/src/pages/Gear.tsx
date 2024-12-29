import { useEffect, useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import styles from "../styles/Gear.module.scss";
import backgroundImage from "../assets/gearPlaceholder.jpg";
import LoadingScreen from "../components/LoadingScreen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { COLORS, RAINBOW_GRADIENT } from "../models/constants";
import { CirclePicker, ColorResult } from "react-color";
import buttonStyles from "../styles/Buttons.module.scss";
import ConfirmationDialog from "../components/ConfirmationDialog";

interface GearItem {
  _id: string;
  name: string;
  quantity: number;
  condition: string;
  categories: string[];
  brand?: string;
  color?: string | "rainbow";
  type: "Clothing" | "Equipment" | "Food";
}

interface EditingGearItem extends GearItem {
  _id: string;
}

const CATEGORIES = {
  Clothing: {
    All: ["All"],
    UpperBody: ["Jackets", "Base Layers"],
    LowerBody: ["Pants", "Socks"],
    Accessories: ["Rain Gear", "Gloves", "Hats", "Shoes"],
  },
  Equipment: {
    All: ["All"],
    Shelter: ["Tents", "Sleeping Bags", "Sleeping Pads"],
    Tools: ["Backpacks", "Cooking Equipment", "Water Filtration"],
    Navigation: ["Navigation", "Lighting", "Tools"],
    Safety: ["First Aid", "Electronics"],
  },
  Food: {
    All: ["All"],
    Meals: ["Freeze-Dried Meals", "Canned Food", "Instant Noodles"],
    Snacks: ["Trail Mix", "Energy Bars", "Dried Fruit"],
    Drinks: ["Instant Coffee", "Powdered Drink Mix", "Tea"],
  },
};

export const Gear = () => {
  const { t } = useTranslation();
  const [gearItems, setGearItems] = useState<GearItem[]>([]);
  const [type, setType] = useState<"All" | "Clothing" | "Equipment" | "Food">(
    "All"
  );
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [editingItem, setEditingItem] = useState<EditingGearItem | null>(null);

  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 1,
    condition: "Good",
    brand: "",
    color: "",
    categories: [] as string[],
    type: type === "All" ? null : (type as "Clothing" | "Equipment" | "Food"),
  });

  const tabsRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    isFood: boolean;
  } | null>(null);

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

  // Hämta gear
  const fetchGear = useCallback(async () => {
    if (isFirstLoading) setIsLoading(true);

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("type", type);

      const endpoint =
        type === "All"
          ? `${import.meta.env.VITE_API_URL}/api/owned-gear`
          : `${
              import.meta.env.VITE_API_URL
            }/api/owned-gear/filter?${queryParams}`;

      const response = await fetch(endpoint, {
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch data");
      }

      const data = await response.json();
      setGearItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching gear:", error);
    } finally {
      setIsLoading(false);
      setIsFirstLoading(false);
    }
  }, [type, isFirstLoading]);

  useEffect(() => {
    fetchGear();
  }, [fetchGear]);

  // Lägg till ny gear
  const addGearItem = async () => {
    if (!newItem.name) {
      alert(t("nameRequired"));
      return;
    }

    const itemType = type === "All" ? newItem.type : type;

    if (!itemType) {
      alert(t("typeRequired"));
      return;
    }

    const allowedTypes = ["Clothing", "Equipment", "Food"];
    if (!allowedTypes.includes(itemType)) {
      console.error("Invalid type:", itemType);
      alert(t("invalidGearType"));
      return;
    }

    const itemToSend = {
      name: newItem.name,
      quantity: newItem.quantity,
      condition: newItem.condition,
      brand: newItem.brand,
      color: newItem.color,
      type: itemType,
      categories: newItem.categories.length > 0 ? newItem.categories : ["All"],
      packed: false,
    };

    console.log("Item type:", itemType);
    console.log("Full item:", itemToSend);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/owned-gear`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(itemToSend),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error response:", errorData);
        throw new Error(errorData.message || "Failed to add gear");
      }

      await fetchGear();
      setNewItem({
        name: "",
        quantity: 1,
        condition: "Good",
        brand: "",
        color: "",
        categories: [],
        type:
          type === "All" ? null : (type as "Clothing" | "Equipment" | "Food"),
      });
    } catch (error) {
      console.error("Error adding gear:", error);
      alert(t("errorAddingGear"));
    }
  };

  const deleteGearItem = async (itemId: string, isFood: boolean) => {
    setItemToDelete({ id: itemId, isFood });
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/owned-gear/${itemToDelete.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete item");
      }

      await fetchGear();
    } catch (error) {
      console.error("Error deleting item:", error);
      alert(t("errorDeletingItem"));
    } finally {
      setItemToDelete(null);
    }
  };

  const updateGearItem = async (
    itemId: string,
    updatedItem: Partial<GearItem>
  ) => {
    try {
      // Ensure color is included in the update
      const itemToUpdate = {
        ...updatedItem,
        color: updatedItem.color || null, // Make sure color is explicitly set, even if empty
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/owned-gear/${itemId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(itemToUpdate),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update item");
      }

      await fetchGear();
      setEditingItem(null);
      setIsColorPickerOpen(false); // Close color picker after save
    } catch (error) {
      console.error("Error updating item:", error);
      alert(t("errorUpdatingItem"));
    }
  };

  const fetchGearByCategory = async (category: string) => {
    setIsLoading(true);
    try {
      if (category === "All") {
        await fetchGear();
        return;
      }

      const queryParams = new URLSearchParams({ category });
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/owned-gear/filter-by-category?${queryParams}`,
        { credentials: "include" }
      );

      if (!response.ok) throw new Error("Failed to fetch gear by category");

      const data = await response.json();
      setGearItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching gear by category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Banner */}
      <div
        className={styles.banner}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Första laddningsskärmen */}
      {isFirstLoading ? (
        <div className={styles.loading}>{LoadingScreen()}</div>
      ) : (
        <div className={styles.gearContainer}>
          <h1>{t("myGear.title")}</h1>
          <h4>{t("gearInfo")}</h4>

          {/* Tabs */}
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
                onClick={() => setType("All")}
                className={`${styles.tab} ${
                  type === "All" ? styles.active : ""
                }`}>
                {t("myGear.all")}
              </button>
              <button
                type="button"
                onClick={() => setType("Clothing")}
                className={`${styles.tab} ${
                  type === "Clothing" ? styles.active : ""
                }`}>
                {t("myGear.clothing")}
              </button>
              <button
                type="button"
                onClick={() => setType("Equipment")}
                className={`${styles.tab} ${
                  type === "Equipment" ? styles.active : ""
                }`}>
                {t("myGear.equipment")}
              </button>
              <button
                type="button"
                onClick={() => setType("Food")}
                className={`${styles.tab} ${
                  type === "Food" ? styles.active : ""
                }`}>
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

          {/* Filter Container */}
          <div className={styles.filterContainer}>
            {type !== "All" && (
              <label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    fetchGearByCategory(e.target.value);
                  }}>
                  <option value="">{t("myGear.selectCategory")}</option>
                  {Object.entries(CATEGORIES[type]).map(
                    ([subcategory, items]) => (
                      <optgroup
                        key={subcategory}
                        label={t(
                          `myGear.categories.${subcategory.toLowerCase()}`
                        )}>
                        {items.map((category) => (
                          <option key={category} value={category}>
                            {t(
                              `myGear.categories.${category
                                .toLowerCase()
                                .replace(/\s+/g, "")}`
                            )}
                          </option>
                        ))}
                      </optgroup>
                    )
                  )}
                </select>
              </label>
            )}
          </div>

          {/* Laddningsindikator under dataladdning */}
          {isLoading ? (
            <div className={styles.loading}>{LoadingScreen()}</div>
          ) : (
            <>
              {/* Gear List */}
              <ul className={styles.gearList}>
                {gearItems.map((item) => (
                  <li key={item._id} className={styles.gearItem}>
                    {editingItem?._id === item._id ? (
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
                          required
                        />
                        <div className={styles.colorPickerContainer}>
                          <label>{t("myGear.color")}</label>
                          <div className={styles.colorAccordion}>
                            <div
                              className={styles.selectedColor}
                              onClick={() =>
                                setIsColorPickerOpen(!isColorPickerOpen)
                              }>
                              <span
                                className={styles.colorPreview}
                                data-color={
                                  editingItem.color === "rainbow"
                                    ? "rainbow"
                                    : undefined
                                }
                                style={{
                                  backgroundColor:
                                    editingItem.color &&
                                    editingItem.color !== "rainbow"
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
                        <label htmlFor="editQuantity">
                          {t("myGear.quantity")}
                        </label>
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
                        <label htmlFor="editCondition">
                          {t("myGear.condition.label")}
                        </label>
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
                          <option value="New">
                            {t("myGear.condition.new")}
                          </option>
                          <option value="Good">
                            {t("myGear.condition.good")}
                          </option>
                          <option value="Fair">
                            {t("myGear.condition.fair")}
                          </option>
                          <option value="Poor">
                            {t("myGear.condition.poor")}
                          </option>
                        </select>
                        <div className={buttonStyles.editButtons}>
                          <button
                            className={buttonStyles.saveButton}
                            onClick={() =>
                              updateGearItem(item._id, editingItem)
                            }>
                            {t("myGear.actions.save")}
                          </button>
                          <button
                            className={buttonStyles.cancelButton}
                            onClick={() => setEditingItem(null)}>
                            {t("myGear.actions.cancel")}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.gearInfo}>
                        <div className={styles.gearHeader}>
                          <span className={styles.gearName}>{item.name}</span>
                          {item.brand && (
                            <span className={styles.gearBrand}>
                              {" "}
                              {item.brand}
                            </span>
                          )}
                          <div className={styles.gearActions}>
                            <button
                              onClick={() => setEditingItem(item)}
                              aria-label={t("myGear.actions.edit")}>
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              onClick={() =>
                                deleteGearItem(item._id, item.type === "Food")
                              }
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
                                data-color={
                                  item.color === "rainbow"
                                    ? "rainbow"
                                    : undefined
                                }
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
                            {t(
                              `myGear.condition.${item.condition.toLowerCase()}`
                            )}
                          </span>
                          <span className={styles.gearDetail}>
                            {t("myGear.quantity")}: {item.quantity}
                          </span>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>

              {/* Add New Gear Form */}
              <div className={styles.addGearForm}>
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
                          type: e.target.value as
                            | "Clothing"
                            | "Equipment"
                            | "Food",
                          categories: [], // Återställ kategorier när typen ändras
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
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  required
                />

                <label htmlFor="gearBrand">{t("myGear.brand")}</label>
                <input
                  id="gearBrand"
                  type="text"
                  placeholder={t("myGear.brand")}
                  value={newItem.brand}
                  onChange={(e) =>
                    setNewItem({ ...newItem, brand: e.target.value })
                  }
                  required
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

                <label htmlFor="gearColor">{t("myGear.selectColor")}</label>
                <div className={styles.colorPickerContainer}>
                  <div className={styles.colorAccordion}>
                    <div
                      className={styles.selectedColor}
                      onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}>
                      <span
                        className={styles.colorPreview}
                        data-color={
                          newItem.color === "rainbow" ? "rainbow" : undefined
                        }
                        style={{
                          backgroundColor:
                            newItem.color !== "rainbow"
                              ? newItem.color
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

                <label htmlFor="gearCategory">
                  {t("myGear.selectCategory")}
                </label>
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
                        label={t(
                          `myGear.categories.${subcategory.toLowerCase()}`
                        )}>
                        {items.map((category) => (
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

                <label htmlFor="gearCondition">
                  {t("myGear.condition.label")}
                </label>
                <select
                  id="gearCondition"
                  value={newItem.condition}
                  onChange={(e) =>
                    setNewItem({ ...newItem, condition: e.target.value })
                  }
                  required
                  className={styles.required}>
                  <option value="">{t("myGear.condition.label")}</option>
                  <option value="New">{t("myGear.condition.new")}</option>
                  <option value="Good">{t("myGear.condition.good")}</option>
                  <option value="Fair">{t("myGear.condition.fair")}</option>
                  <option value="Poor">{t("myGear.condition.poor")}</option>
                </select>

                <button
                  onClick={addGearItem}
                  className={buttonStyles.submitButton}>
                  {t("myGear.actions.add")}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <ConfirmationDialog
        isOpen={!!itemToDelete}
        message={t("myGear.messages.confirmDelete")}
        onConfirm={handleConfirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </>
  );
};

export default Gear;
