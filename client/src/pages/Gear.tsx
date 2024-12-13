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
      <div>
        <h1>{t("gear")}</h1>

        {/* Typval */}
        <div>
          <button onClick={() => setType("Clothing")}>{t("clothing")}</button>
          <button onClick={() => setType("Equipment")}>{t("equipment")}</button>
          <button onClick={() => setType("Food")}>{t("food")}</button>
        </div>

        {/* Dropdown för kategori */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">{t("allCategories")}</option>
          {Object.entries(CATEGORIES[type]).map(([subcategory, items]) => (
            <optgroup key={subcategory} label={t(subcategory.toLowerCase())}>
              {items.map((category) => (
                <option key={category} value={category}>
                  {t(category.toLowerCase())}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        {/* Lista över gear */}
        <ul>
          {gearItems.map((item) => (
            <li key={item._id}>
              {editingItem?._id === item._id ? (
                // Redigeringsformulär
                <div>
                  <input
                    type="text"
                    value={editingItem.name}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, name: e.target.value })
                    }
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
                  />
                  <select
                    value={editingItem.condition}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        condition: e.target.value,
                      })
                    }>
                    <option value="New">{t("new")}</option>
                    <option value="Good">{t("good")}</option>
                    <option value="Fair">{t("fair")}</option>
                    <option value="Poor">{t("poor")}</option>
                  </select>
                  <button
                    onClick={() => updateGearItem(item._id, editingItem)}
                    className={styles.saveButton}>
                    {t("save")}
                  </button>
                  <button
                    onClick={() => setEditingItem(null)}
                    className={styles.cancelButton}>
                    {t("cancel")}
                  </button>
                </div>
              ) : (
                // Visningsläge
                <div className={styles.gearItem}>
                  <div className={styles.gearInfo}>
                    <span>{item.name}</span>
                    <span>{item.quantity}</span>
                    <span>{t(item.condition.toLowerCase())}</span>
                    {item.brand && <span>{item.brand}</span>}
                    {item.color && <span>{item.color}</span>}
                  </div>
                  <div className={styles.gearActions}>
                    <input
                      type="checkbox"
                      checked={item.packed}
                      onChange={() =>
                        updateGearItem(item._id, { packed: !item.packed })
                      }
                    />
                    <button
                      onClick={() => setEditingItem(item)}
                      className={styles.editButton}>
                      {t("edit")}
                    </button>
                    <button
                      onClick={() => deleteGearItem(item._id)}
                      className={styles.deleteButton}>
                      {t("delete")}
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* Formulär för ny gear */}
        <h2>{t("addGear")}</h2>
        <input
          type="text"
          placeholder={t("name")}
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="number"
          min="1"
          placeholder={t("quantity")}
          value={newItem.quantity}
          onChange={(e) =>
            setNewItem({ ...newItem, quantity: Number(e.target.value) })
          }
        />
        <input
          type="text"
          placeholder={t("brand")}
          value={newItem.brand}
          onChange={(e) => setNewItem({ ...newItem, brand: e.target.value })}
        />
        <input
          type="text"
          placeholder={t("color")}
          value={newItem.color}
          onChange={(e) => setNewItem({ ...newItem, color: e.target.value })}
        />
        <select
          value={newItem.condition}
          onChange={(e) =>
            setNewItem({ ...newItem, condition: e.target.value })
          }>
          <option value="Good">{t("good")}</option>
          <option value="Fair">{t("fair")}</option>
          <option value="Poor">{t("poor")}</option>
        </select>
        <div>
          <h4>{t("selectCategories")}</h4>
          {Object.values(CATEGORIES[type])
            .flat()
            .map((category: string) => (
              <label key={category}>
                <input
                  type="checkbox"
                  checked={newItem.categories.includes(category)}
                  onChange={() =>
                    setNewItem((prev) => ({
                      ...prev,
                      categories: prev.categories.includes(category)
                        ? prev.categories.filter((c) => c !== category)
                        : [...prev.categories, category],
                    }))
                  }
                />
                {t(category.toLowerCase())}
              </label>
            ))}
        </div>
        <button onClick={addGearItem}>{t("add")}</button>
      </div>
    </>
  );
};

export default Gear;
