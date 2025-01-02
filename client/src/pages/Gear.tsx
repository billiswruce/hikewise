import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import styles from "../styles/Gear.module.scss";
import backgroundImage from "../assets/gearPlaceholder.jpg";
import LoadingScreen from "../components/LoadingScreen";
import ConfirmationDialog from "../components/ConfirmationDialog";
import AddGearForm from "../components/gear/AddGearForm";
import GearItem from "../components/gear/GearItem";
import GearTabs from "../components/gear/GearTabs";
import { GearItemType, NewGearItem } from "../models/gear";
import { CATEGORIES, GearType } from "../models/gearCategories";

export const Gear = () => {
  const { t } = useTranslation();
  const [gearItems, setGearItems] = useState<GearItemType[]>([]);
  const [type, setType] = useState<GearType>("All");
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    isFood: boolean;
  } | null>(null);

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

  const addGearItem = async (newItem: NewGearItem): Promise<boolean> => {
    const itemType = type === "All" ? newItem.type : type;

    if (!itemType) {
      alert(t("typeRequired"));
      return false;
    }

    const allowedTypes = ["Clothing", "Equipment", "Food"];
    if (!allowedTypes.includes(itemType)) {
      console.error("Invalid type:", itemType);
      alert(t("invalidGearType"));
      return false;
    }

    const itemToSend = {
      ...newItem,
      type: itemType,
      categories: newItem.categories.length > 0 ? newItem.categories : ["All"],
      packed: false,
    };

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
        throw new Error(errorData.message || "Failed to add gear");
      }

      await fetchGear();
      return true;
    } catch (error) {
      console.error("Error adding gear:", error);
      alert(t("errorAddingGear"));
      return false;
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
    updatedItem: Partial<GearItemType>
  ) => {
    try {
      const itemToUpdate = {
        ...updatedItem,
        color: updatedItem.color || null,
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
      <div
        className={styles.banner}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {isFirstLoading ? (
        <div className={styles.loading}>{LoadingScreen()}</div>
      ) : (
        <div className={styles.gearContainer}>
          <h1>{t("myGear.title")}</h1>
          <h4>{t("gearInfo")}</h4>
          <GearTabs type={type} onTypeChange={setType} />

          <div className={styles.filterContainer}>
            {type !== "All" && (
              <>
                {/* <label htmlFor="category-select">
                  {t("myGear.selectCategory")}
                </label> */}
                <select
                  id="category-select"
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
                    )
                  )}
                </select>
              </>
            )}
          </div>
          {isLoading ? (
            <div className={styles.loading}>{LoadingScreen()}</div>
          ) : (
            <>
              {/* Gear List */}
              <ul className={styles.gearList}>
                {gearItems.map((item) => (
                  <li key={item._id} className={styles.gearItem}>
                    <GearItem
                      item={item}
                      onDelete={deleteGearItem}
                      onUpdate={updateGearItem}
                    />
                  </li>
                ))}
              </ul>

              <AddGearForm type={type} onAdd={addGearItem} />
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
