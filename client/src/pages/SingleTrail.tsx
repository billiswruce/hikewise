import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "../styles/SingleTrail.module.scss";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import TrailPlaceholder from "../assets/trailPlaceholdersquare.webp";

interface PackingItem {
  _id?: string;
  name: string;
  isChecked: boolean;
}

interface Comment {
  _id: string;
  text: string;
  createdAt: string;
  userId?: string;
}

interface Trail {
  _id: string;
  name: string;
  image: string;
  location: string;
  length: number;
  difficulty: string;
  description: string;
  latitude: number;
  longitude: number;
  hikeDate: string;
  hikeEndDate: string;
  weather: {
    temperature: number;
    description: string;
    icon: string;
  };
  comments: Comment[];
  packingList: {
    gear: PackingItem[];
    food: PackingItem[];
  };
}

const SingleTrail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [trail, setTrail] = useState<Trail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newPackingListItem, setNewPackingListItem] = useState("");
  const [isFood, setIsFood] = useState(false);
  const [isPackingListOpen, setIsPackingListOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newComment, setNewComment] = useState("");

  const togglePackingList = () => setIsPackingListOpen((prev) => !prev);

  const fetchTrail = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/trails/${id}`);
      if (!response.ok) throw new Error("Trail not found");
      const data = await response.json();
      setTrail(data);
    } catch (error) {
      console.error("Error fetching trail:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const addPackingListItem = async () => {
    if (newPackingListItem.trim() === "" || !trail) return;

    setIsAdding(true);
    try {
      const response = await fetch(
        `http://localhost:3001/api/trails/${id}/packing-list`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newPackingListItem, isFood }),
        }
      );

      if (!response.ok) throw new Error("Failed to add item");

      const updatedTrail = await response.json();
      setTrail(updatedTrail);
      setNewPackingListItem("");
    } catch (error) {
      console.error("Error adding packing list item:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const removePackingListItem = async (itemId: string, isFood: boolean) => {
    if (!trail) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/trails/${id}/packing-list/${itemId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isFood }),
        }
      );

      if (!response.ok) throw new Error("Failed to remove item");

      const updatedTrail = await response.json();
      setTrail(updatedTrail);
    } catch (error) {
      console.error("Error removing packing list item:", error);
    }
  };

  const updatePackingListItem = async (
    itemId: string,
    isFood: boolean,
    isChecked: boolean
  ) => {
    if (!trail) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/trails/${id}/packing-list/${itemId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isFood, isChecked }),
        }
      );

      if (!response.ok) throw new Error("Failed to update packing list item");

      const updatedTrail = await response.json();
      setTrail(updatedTrail);
    } catch (error) {
      console.error("Error updating packing list item:", error);
    }
  };

  const addComment = async () => {
    if (newComment.trim() === "" || !trail) {
      console.error("Validation failed: Comment is empty or trail is null.");
      return;
    }

    try {
      console.log("Sending comment:", { text: newComment });
      console.log("Trail ID:", id);

      const response = await fetch(
        `http://localhost:3001/api/trails/${id}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: newComment }),
        }
      );

      console.log("Response status:", response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Response error data:", errorData);
        throw new Error(`Failed to add comment: ${errorData.message}`);
      }

      const updatedTrail = await response.json();
      console.log("Updated trail data received:", updatedTrail);
      setTrail(updatedTrail);
      setNewComment("");
    } catch (error) {
      console.error("Error caught in addComment:");
      console.error("Full error object:", error);
    }
  };

  useEffect(() => {
    fetchTrail();
  }, [fetchTrail]);

  if (loading) return <div>{t("loading")}</div>;
  if (!trail) return <div>{t("notFound")}</div>;

  return (
    <div className={styles.container}>
      <h1>{trail.name}</h1>
      <div className={styles.heroImage}>
        <img
          src={trail.image || TrailPlaceholder}
          alt={trail.name || "Trail placeholder"}
        />
      </div>
      <div className={styles.infoSection}>
        <div className={styles.basicInfo}>
          <p>{trail.length} km</p>
          <p>{t(trail.difficulty)}</p>
          <p>{new Date(trail.hikeDate).toLocaleDateString()}</p>
        </div>
        <div className={styles.weather}>
          <img
            src={`http://openweathermap.org/img/w/${trail.weather.icon}.png`}
            alt={trail.weather.description}
          />
          <p>{trail.weather.temperature}°C</p>
          <p>{trail.weather.description}</p>
        </div>
        <p className={styles.description}>{trail.description}</p>
      </div>
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerClassName={styles.map}
          center={{ lat: trail.latitude, lng: trail.longitude }}
          zoom={13}>
          <Marker position={{ lat: trail.latitude, lng: trail.longitude }} />
        </GoogleMap>
      </LoadScript>
      <div className={styles.packingListSection}>
        <button onClick={togglePackingList} className={styles.accordionButton}>
          {t("packingList")} {isPackingListOpen ? "▼" : "▶"}
        </button>
        {isPackingListOpen && (
          <div className={styles.packingListContent}>
            <h3>{t("gear")}</h3>
            <ul>
              {trail.packingList.gear.map((item) => (
                <li key={item._id}>
                  <input
                    type="checkbox"
                    checked={item.isChecked}
                    onChange={(e) =>
                      updatePackingListItem(item._id!, false, e.target.checked)
                    }
                  />
                  {item.name}
                  <button
                    onClick={() => removePackingListItem(item._id!, false)}>
                    {t("remove")}
                  </button>
                </li>
              ))}
            </ul>
            <h3>{t("food")}</h3>
            <ul>
              {trail.packingList.food.map((item) => (
                <li key={item._id}>
                  <input
                    type="checkbox"
                    checked={item.isChecked}
                    onChange={(e) =>
                      updatePackingListItem(item._id!, true, e.target.checked)
                    }
                  />
                  {item.name}
                  <button
                    onClick={() => removePackingListItem(item._id!, true)}>
                    {t("remove")}
                  </button>
                </li>
              ))}
            </ul>
            <div className={styles.addPackingItem}>
              <input
                type="text"
                value={newPackingListItem}
                onChange={(e) => setNewPackingListItem(e.target.value)}
                placeholder={t("addItem")}
              />
              <select
                value={isFood ? "food" : "gear"}
                onChange={(e) => setIsFood(e.target.value === "food")}>
                <option value="gear">{t("gear")}</option>
                <option value="food">{t("food")}</option>
              </select>
              <button onClick={addPackingListItem} disabled={isAdding}>
                {isAdding ? t("adding...") : t("add")}
              </button>
            </div>
          </div>
        )}
      </div>
      <div className={styles.commentsSection}>
        <h2>{t("comments")}</h2>
        <ul>
          {trail.comments.map((comment) => (
            <li key={comment._id}>
              <p>{comment.text}</p>
              <small>{new Date(comment.createdAt).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
        <div className={styles.addComment}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t("addComment")}
          />
          <button onClick={addComment}>{t("add")}</button>
        </div>
      </div>
    </div>
  );
};

export default SingleTrail;
