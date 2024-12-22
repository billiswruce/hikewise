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
    type: "Clothing" as "Clothing" | "Equipment" | "Food",
  });

  const tabsRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

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

    const allowedTypes = ["Clothing", "Equipment", "Food"];
    if (!allowedTypes.includes(newItem.type)) {
      console.error("Invalid type:", newItem.type);
      alert(t("invalidGearType"));
      return;
    }

    const itemToSend = {
      name: newItem.name,
      quantity: newItem.quantity,
      condition: newItem.condition,
      brand: newItem.brand,
      color: newItem.color,
      type: newItem.type,
      categories: newItem.categories.length > 0 ? newItem.categories : [type],
      packed: false,
    };

    console.log("Item type:", newItem.type);
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
        type: "Clothing" as "Clothing" | "Equipment" | "Food",
      });
    } catch (error) {
      console.error("Error adding gear:", error);
      alert(t("errorAddingGear"));
    }
  };

  // Update type when it changes
  useEffect(() => {
    setNewItem((prev) => ({
      ...prev,
      type: type as "Clothing" | "Equipment" | "Food",
    }));
  }, [type]);

  const deleteGearItem = async (itemId: string) => {
    if (!window.confirm(t("confirmDelete"))) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/owned-gear/${itemId}`,
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
    }
  };

  const updateGearItem = async (
    itemId: string,
    updatedItem: Partial<GearItem>
  ) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/owned-gear/${itemId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(updatedItem),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update item");
      }

      await fetchGear();
      setEditingItem(null);
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
                        <input
                          type="text"
                          value={editingItem.name}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              name: e.target.value,
                            })
                          }
                          placeholder={t("myGear.name")}
                        />
                        <input
                          type="text"
                          value={editingItem.brand || ""}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              brand: e.target.value,
                            })
                          }
                          placeholder={t("myGear.brand")}
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
                                style={{
                                  background:
                                    editingItem.color === "rainbow"
                                      ? RAINBOW_GRADIENT.gradient
                                      : editingItem.color || "#fff",
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
                        <input
                          type="number"
                          value={editingItem.quantity}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              quantity: Number(e.target.value),
                            })
                          }
                          placeholder={t("myGear.quantity")}
                          min="1"
                        />
                        <select
                          value={editingItem.condition}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              condition: e.target.value,
                            })
                          }>
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
                        <div className={styles.editButtons}>
                          <button
                            onClick={() =>
                              updateGearItem(item._id, editingItem)
                            }>
                            {t("myGear.actions.save")}
                          </button>
                          <button onClick={() => setEditingItem(null)}>
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
                              onClick={() => deleteGearItem(item._id)}
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
                                style={{
                                  backgroundColor:
                                    item.color !== "rainbow"
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
                <input
                  type="text"
                  placeholder={t("myGear.name")}
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder={t("myGear.brand")}
                  value={newItem.brand}
                  onChange={(e) =>
                    setNewItem({ ...newItem, brand: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder={t("myGear.quantity")}
                  value={newItem.quantity}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      quantity: Number(e.target.value),
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
                        style={{
                          background:
                            newItem.color === "rainbow"
                              ? RAINBOW_GRADIENT.gradient
                              : newItem.color || "#fff",
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
                {type === "All" && (
                  <select
                    value={newItem.type}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        type: e.target.value as
                          | "Clothing"
                          | "Equipment"
                          | "Food",
                        categories: [],
                      })
                    }
                    className={styles.categorySelect}>
                    <option value="">{t("myGear.selectType")}</option>
                    <option value="Clothing">{t("myGear.clothing")}</option>
                    <option value="Equipment">{t("myGear.equipment")}</option>
                    <option value="Food">{t("myGear.food")}</option>
                  </select>
                )}
                <select
                  value={newItem.categories[0] || ""}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      categories: [e.target.value],
                    })
                  }
                  className={styles.categorySelect}>
                  <option value="">{t("myGear.selectCategory")}</option>
                  {(type === "All"
                    ? CATEGORIES[newItem.type]
                    : CATEGORIES[type]) &&
                    Object.entries(
                      type === "All"
                        ? CATEGORIES[newItem.type]
                        : CATEGORIES[type]
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
                <select
                  value={newItem.condition}
                  onChange={(e) =>
                    setNewItem({ ...newItem, condition: e.target.value })
                  }>
                  <option value="New">{t("myGear.condition.new")}</option>
                  <option value="Good">{t("myGear.condition.good")}</option>
                  <option value="Fair">{t("myGear.condition.fair")}</option>
                  <option value="Poor">{t("myGear.condition.poor")}</option>
                </select>
                <button onClick={addGearItem}>{t("myGear.actions.add")}</button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Gear;
