import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LoadingScreen from "../components/LoadingScreen";

interface GearItem {
  _id?: string;
  name: string;
  quantity: number;
  condition: string;
  packed: boolean;
  categories: string[];
  brand?: string;
  color?: string;
}

const CATEGORIES = {
  Clothing: [
    "Jackets",
    "Pants",
    "Base Layers",
    "Socks",
    "Rain Gear",
    "Gloves",
    "Hats",
    "Shoes",
  ],
  Equipment: [
    "Tents",
    "Sleeping Bags",
    "Sleeping Pads",
    "Backpacks",
    "Cooking Equipment",
    "Water Filtration",
    "Navigation",
    "Lighting",
    "Tools",
    "First Aid",
    "Electronics",
  ],
};

export const Gear = () => {
  const { t } = useTranslation();
  const [gearItems, setGearItems] = useState<GearItem[]>([]);
  const [type, setType] = useState<"Clothing" | "Equipment">("Clothing");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 1,
    condition: "Good",
    brand: "",
    color: "",
    categories: [] as string[],
  });

  const [isLoading, setIsLoading] = useState(false);

  // Hämta gear
  const fetchGear = async () => {
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
  };

  useEffect(() => {
    fetchGear();
  }, [type, selectedCategory]);

  // Lägg till ny gear
  const addGearItem = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/owned-gear`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            ...newItem,
            type,
            categories: newItem.categories.length ? newItem.categories : [type],
          }),
        }
      );

      if (!response.ok) throw new Error(`HTTP error! ${response.status}`);

      await fetchGear();
      setNewItem({
        name: "",
        quantity: 1,
        condition: "Good",
        brand: "",
        color: "",
        categories: [],
      });
    } catch (error) {
      console.error("Error adding gear:", error);
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
        </div>

        {/* Dropdown för kategori */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">{t("allCategories")}</option>
          {CATEGORIES[type].map((category) => (
            <option key={category} value={category}>
              {t(category.toLowerCase())}
            </option>
          ))}
        </select>

        {/* Lista över gear */}
        <ul>
          {gearItems.map((item) => (
            <li key={item._id}>
              {item.name} - {item.quantity} - {item.condition}{" "}
              {item.brand && `(${t("brand")}: ${item.brand})`}{" "}
              {item.color && `(${t("color")}: ${item.color})`}
              <input type="checkbox" checked={item.packed} readOnly />
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
          {CATEGORIES[type].map((category) => (
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
