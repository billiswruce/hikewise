import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface GearItem {
  _id?: string;
  name: string;
  quantity: number;
  condition: string;
  packed: boolean;
  categories: string[];
  brand?: string; // Nytt fält
  color?: string; // Nytt fält
}

export const Gear = () => {
  const { t } = useTranslation();
  const [gearItems, setGearItems] = useState<GearItem[]>([]);
  const [type, setType] = useState<"Clothing" | "Equipment">("Clothing");
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 1,
    condition: "Good",
    brand: "",
    color: "",
  });

  // Hämta filtrerad gear
  const fetchGear = async (categoryType: string) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/owned-gear/filter?type=${categoryType}`,
        { credentials: "include" }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Ensure we always set an array, even if empty
      setGearItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching gear:", error);
      setGearItems([]); // Set empty array on error
    }
  };

  useEffect(() => {
    fetchGear(type);
  }, [type]);

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
            categories: [type],
            type: "Gear",
            brand: newItem.brand || undefined,
            color: newItem.color || undefined,
          }),
        }
      );

      const data = await response.json(); // Logga serverns respons
      console.log("Server response:", data);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchGear(type);
      setNewItem({
        name: "",
        quantity: 1,
        condition: "Good",
        brand: "",
        color: "",
      });
    } catch (error) {
      console.error("Error adding gear:", error);
    }
  };

  return (
    <div>
      <h1>{t("gear")}</h1>

      {/* Filter */}
      <div>
        <button onClick={() => setType("Clothing")}>{t("clothing")}</button>
        <button onClick={() => setType("Equipment")}>{t("equipment")}</button>
      </div>

      {/* Lista över Gear */}
      <ul>
        {gearItems.map((item) => (
          <li key={item._id}>
            {item.name} - {item.quantity} - {item.condition}
            {item.brand && ` - ${t("brand")}: ${item.brand}`}
            {item.color && ` - ${t("color")}: ${item.color}`}
            <input type="checkbox" checked={item.packed} readOnly />
          </li>
        ))}
      </ul>

      {/* Formulär för att lägga till ny Gear */}
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
        onChange={(e) => setNewItem({ ...newItem, condition: e.target.value })}>
        <option value="Good">{t("good")}</option>
        <option value="Okay">{t("okay")}</option>
        <option value="Poor">{t("poor")}</option>
      </select>
      <button onClick={addGearItem}>{t("add")}</button>
    </div>
  );
};

export default Gear;
