import { useState, useEffect } from "react";
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

interface Comment {
  _id: string;
  text: string;
  createdAt: string;
  userId: string;
}

export const SingleTrail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [trail, setTrail] = useState<Trail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newPackingListItem, setNewPackingListItem] = useState("");
  const [isFood, setIsFood] = useState(false);
  const [isPackingListOpen, setIsPackingListOpen] = useState(false);

  const togglePackingList = () => setIsPackingListOpen((prev) => !prev);

  const addPackingListItem = async () => {
    if (newPackingListItem.trim() === "" || !trail) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/trails/${id}/packing-list`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newPackingListItem,
            isFood: isFood,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to add item");

      const updatedTrail = await response.json();
      setTrail(updatedTrail);
      setNewPackingListItem("");
    } catch (error) {
      console.error("Error adding packing list item:", error);
    }
  };

  useEffect(() => {
    const fetchTrail = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/trails/${id}`);
        if (!response.ok) {
          throw new Error("Trail not found");
        }
        const data = await response.json();
        setTrail(data);
      } catch (error) {
        console.error("Error fetching trail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrail();
  }, [id]);

  if (loading) {
    return <div>{t("loading")}</div>;
  }

  if (!trail) {
    return <div>{t("notFound")}</div>;
  }

  return (
    <div className={styles.container}>
      <h1>{trail.name}</h1>

      {/* Hero image */}
      <div className={styles.heroImage}>
        {trail.image ? (
          <img src={trail.image} alt={trail.name} />
        ) : (
          <img src={TrailPlaceholder} alt="Trail placeholder" />
        )}
      </div>

      {/* Trail info */}
      <div className={styles.infoSection}>
        <div className={styles.basicInfo}>
          <p>{trail.length} km</p>
          <p>{t(trail.difficulty)}</p>
          <p>{new Date(trail.hikeDate).toLocaleDateString()}</p>
        </div>

        {/* Weather info */}
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

      {/* Map */}
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerClassName={styles.map}
          center={{ lat: trail.latitude, lng: trail.longitude }}
          zoom={13}>
          <Marker position={{ lat: trail.latitude, lng: trail.longitude }} />
        </GoogleMap>
      </LoadScript>

      {/* Packing List Accordion */}
      <div className={styles.packingListSection}>
        <button onClick={togglePackingList} className={styles.accordionButton}>
          {t("packingList")} {isPackingListOpen ? "▼" : "▶"}
        </button>
        {isPackingListOpen && (
          <div className={styles.packingListContent}>
            <div className={styles.packingListSection}>
              <h3>{t("gear")}</h3>
              <ul>
                {trail.packingList.gear.map((item) => (
                  <li key={item._id}>{item.name}</li>
                ))}
              </ul>

              <h3>{t("food")}</h3>
              <ul>
                {trail.packingList.food.map((item) => (
                  <li key={item._id}>{item.name}</li>
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
                <button onClick={addPackingListItem}>{t("add")}</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Comments section */}
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
      </div>
    </div>
  );
};

export default SingleTrail;
