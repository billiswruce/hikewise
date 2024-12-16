import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
// import LoadingScreen from "../components/LoadingScreen";
import styles from "../styles/Gear.module.scss";
import backgroundImage from "../assets/gearPlaceholder.jpg";

interface GearItem {
  _id: string;
  name: string;
  quantity: number;
  condition: string;
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
      });

      if (!response.ok) throw new Error("Failed to fetch data");

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
        <div className={styles.loading}>Laddar innehåll...</div>
      ) : (
        <div className={styles.gearContainer}>
          <h1>{t("myGear.title")}</h1>

          {/* Tabs */}
          <div className={styles.tabs}>
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

          {/* Category selection */}
          {type !== "All" ? (
            <>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  fetchGearByCategory(e.target.value);
                }}
                className={styles.categorySelect}>
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
            </>
          ) : null}

          {/* Laddningsindikator under dataladdning */}
          {isLoading ? (
            <div className={styles.loading}>Laddar data...</div>
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
                          value={editingItem.brand}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              brand: e.target.value,
                            })
                          }
                        />
                        <input
                          type="text"
                          value={editingItem.color}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              color: e.target.value,
                            })
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
                        <span className={styles.gearName}>{item.name}</span>
                        <span className={styles.gearQuantity}>
                          {item.quantity}
                        </span>
                        <span className={styles.gearCondition}>
                          {t(
                            `myGear.condition.${item.condition.toLowerCase()}`
                          )}
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
                    setNewItem({ ...newItem, quantity: Number(e.target.value) })
                  }
                />
                <input
                  type="text"
                  placeholder={t("myGear.color")}
                  value={newItem.color}
                  onChange={(e) =>
                    setNewItem({ ...newItem, color: e.target.value })
                  }
                />
                {/* Välj kategori */}
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
                  {type !== "All" &&
                    Object.entries(CATEGORIES[type]).map(
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

                <select
                  value={newItem.condition}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      condition: e.target.value,
                    })
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
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Gear;
