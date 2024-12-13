import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import LoadingScreen from "../components/LoadingScreen";
import styles from "../styles/Gear.module.scss";

interface GearItem {
  _id: string;
  name: string;
  quantity: number;
  condition: string;
  packed: boolean;
  categories: string[];
  brand?: string;
  color?: string;
  type: "Clothing" | "Equipment" | "Food";
}

interface EditingGearItem extends GearItem {
  _id: string;
}

const CATEGORIES = {
  Clothing: {
    UpperBody: ["Jackets", "Base Layers"],
    LowerBody: ["Pants", "Socks"],
    Accessories: ["Rain Gear", "Gloves", "Hats", "Shoes"],
  },
  Equipment: {
    Shelter: ["Tents", "Sleeping Bags", "Sleeping Pads"],
    Tools: ["Backpacks", "Cooking Equipment", "Water Filtration"],
    Navigation: ["Navigation", "Lighting", "Tools"],
    Safety: ["First Aid", "Electronics"],
  },
  Food: {
    Meals: ["Freeze-Dried Meals", "Canned Food", "Instant Noodles"],
    Snacks: ["Trail Mix", "Energy Bars", "Dried Fruit"],
    Drinks: ["Instant Coffee", "Powdered Drink Mix", "Tea"],
  },
};

export const Gear = () => {
  const { t } = useTranslation();
  const [gearItems, setGearItems] = useState<GearItem[]>([]);
  const [type, setType] = useState<"Clothing" | "Equipment" | "Food">(
    "Clothing"
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 1,
    condition: "Good",
    brand: "",
    color: "",
    categories: [] as string[],
    type: "Clothing" as "Clothing" | "Equipment" | "Food",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<EditingGearItem | null>(null);

  // Hämta gear
  const fetchGear = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        type,
        category: selectedCategory,
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/owned-gear/filter?${queryParams}`,
        { credentials: "include" }
      );
      if (!response.ok) throw new Error(`HTTP error! ${response.status}`);

      const data = await response.json();
      setGearItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching gear:", error);
    } finally {
      setIsLoading(false);
    }
  }, [type, selectedCategory]);

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
    setNewItem((prev) => ({ ...prev, type }));
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

  return (
    <>
      {isLoading && <LoadingScreen />}
      <div className={styles.gearContainer}>
        <h1>{t("myGear.title")}</h1>

        {/* Type selection */}
        <div className={styles.typeButtons}>
          <button
            onClick={() => setType("Clothing")}
            className={type === "Clothing" ? styles.active : ""}>
            {t("myGear.clothing")}
          </button>
          <button
            onClick={() => setType("Equipment")}
            className={type === "Equipment" ? styles.active : ""}>
            {t("myGear.equipment")}
          </button>
          <button
            onClick={() => setType("Food")}
            className={type === "Food" ? styles.active : ""}>
            {t("myGear.food")}
          </button>
        </div>

        {/* Category selection */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={styles.categorySelect}>
          <option value="">{t("myGear.categories.label")}</option>
          {Object.entries(CATEGORIES[type]).map(([subcategory, items]) => (
            <optgroup
              key={subcategory}
              label={t(`myGear.categories.${subcategory.toLowerCase()}`)}>
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

        {/* Gear list */}
        <ul className={styles.gearList}>
          {gearItems.map((item) => (
            <li key={item._id} className={styles.gearItem}>
              {editingItem?._id === item._id ? (
                <div className={styles.editForm}>
                  <input
                    type="text"
                    value={editingItem.name}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, name: e.target.value })
                    }
                    placeholder={t("myGear.name")}
                  />
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
                  />
                  <select
                    value={editingItem.condition}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        condition: e.target.value,
                      })
                    }>
                    <option value="New">{t("myGear.condition.new")}</option>
                    <option value="Good">{t("myGear.condition.good")}</option>
                    <option value="Fair">{t("myGear.condition.fair")}</option>
                    <option value="Poor">{t("myGear.condition.poor")}</option>
                  </select>
                  <select
                    value={editingItem.categories[0] || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        categories: [e.target.value],
                      })
                    }
                    className={styles.categorySelect}>
                    <option value="">{t("myGear.categories.label")}</option>
                    {Object.entries(CATEGORIES[editingItem.type]).map(
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
                  <div className={styles.editButtons}>
                    <button
                      onClick={() => updateGearItem(item._id, editingItem)}>
                      {t("myGear.actions.save")}
                    </button>
                    <button onClick={() => setEditingItem(null)}>
                      {t("myGear.actions.cancel")}
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.gearInfo}>
                  <span className={styles.gearName}>{item.name}</span>
                  <span className={styles.gearQuantity}>{item.quantity}</span>
                  <span className={styles.gearCondition}>
                    {t(`myGear.condition.${item.condition.toLowerCase()}`)}
                  </span>
                  {item.brand && (
                    <span className={styles.gearBrand}>{item.brand}</span>
                  )}
                  {item.color && (
                    <span className={styles.gearColor}>{item.color}</span>
                  )}
                  <div className={styles.gearActions}>
                    <button onClick={() => setEditingItem(item)}>
                      {t("myGear.actions.edit")}
                    </button>
                    <button onClick={() => deleteGearItem(item._id)}>
                      {t("myGear.actions.delete")}
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* Add new gear form */}
        <div className={styles.addGearForm}>
          <h2>{t("myGear.addGear")}</h2>
          <input
            type="text"
            placeholder={t("myGear.name")}
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <input
            type="number"
            placeholder={t("myGear.quantity")}
            value={newItem.quantity}
            onChange={(e) =>
              setNewItem({ ...newItem, quantity: Number(e.target.value) })
            }
          />
          <input
            type="text"
            placeholder={t("myGear.brand")}
            value={newItem.brand}
            onChange={(e) => setNewItem({ ...newItem, brand: e.target.value })}
          />
          <input
            type="text"
            placeholder={t("myGear.color")}
            value={newItem.color}
            onChange={(e) => setNewItem({ ...newItem, color: e.target.value })}
          />

          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setNewItem({
                ...newItem,
                categories: [e.target.value],
                type: type,
              });
            }}
            className={styles.categorySelect}>
            <option value="">{t("myGear.categories.label")}</option>
            {Object.entries(CATEGORIES[type]).map(([subcategory, items]) => (
              <optgroup
                key={subcategory}
                label={t(`myGear.categories.${subcategory.toLowerCase()}`)}>
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
          <button onClick={addGearItem} className={styles.addButton}>
            {t("myGear.actions.add")}
          </button>
        </div>
      </div>
    </>
  );
};

export default Gear;
