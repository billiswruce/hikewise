import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "../styles/SingleTrail.module.scss";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import TrailPlaceholder from "../assets/trailPlaceholder.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faCloud,
  faCloudRain,
  faSnowflake,
  faSmog,
  faBolt,
} from "@fortawesome/free-solid-svg-icons";

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
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editedText, setEditedText] = useState("");
  const [validImage, setValidImage] = useState<string>("");

  useEffect(() => {
    if (trail?.image) {
      const img = new Image();
      img.src = trail.image;

      img.onload = () => {
        setValidImage(trail.image);
      };

      img.onerror = () => {
        setValidImage(TrailPlaceholder);
      };
    }
  }, [trail?.image]);

  const togglePackingList = () => setIsPackingListOpen((prev) => !prev);

  const getWeatherIcon = (description: string) => {
    const desc = description.toLowerCase();

    if (desc.includes("clear sky") || desc.includes("sunny"))
      return { icon: faSun, label: t("weather.clearSky") };
    if (desc.includes("few clouds") || desc.includes("clouds"))
      return { icon: faCloud, label: t("weather.clouds") };
    if (desc.includes("rain") || desc.includes("shower"))
      return { icon: faCloudRain, label: t("weather.rain") };
    if (desc.includes("thunderstorm"))
      return { icon: faBolt, label: t("weather.thunderstorm") };
    if (desc.includes("snow"))
      return { icon: faSnowflake, label: t("weather.snow") };
    if (desc.includes("mist") || desc.includes("fog") || desc.includes("haze"))
      return { icon: faSmog, label: t("weather.mist") };

    return { icon: faSun, label: t("weather.default") };
  };

  const fetchTrail = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trails/${id}`,
        {
          credentials: "include",
        }
      );
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
        `${import.meta.env.VITE_API_URL}/api/trails/${id}/packing-list`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
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
        `${
          import.meta.env.VITE_API_URL
        }/api/trails/${id}/packing-list/${itemId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
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
        `${
          import.meta.env.VITE_API_URL
        }/api/trails/${id}/packing-list/${itemId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
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
        `${import.meta.env.VITE_API_URL}/api/trails/${id}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
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

  const editComment = async (commentId: string, newText: string) => {
    if (newText.trim() === "") {
      console.error("Validation failed: Comment text is empty.");
      return;
    }

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/trails/${id}/comments/${commentId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ text: newText }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Response error data:", errorData);
        throw new Error(`Failed to update comment: ${errorData.message}`);
      }

      const updatedTrail = await response.json();
      setTrail(updatedTrail);
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/trails/${id}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to delete comment");

      const updatedTrail = await response.json();
      setTrail(updatedTrail);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  useEffect(() => {
    fetchTrail();
  }, [fetchTrail]);

  if (loading) return <div>{t("loading")}</div>;
  if (!trail) return <div>{t("notFound")}</div>;

  const weatherInfo = getWeatherIcon(trail.weather.description);

  return (
    <div>
      <div
        className={styles.heroImage}
        style={{
          backgroundImage: `url(${validImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Innehåll i vit container */}
      <div className={styles.container}>
        <div className={styles.titleWeatherContainer}>
          <h1>{trail.name}</h1>
          <div className={styles.weatherInfo}>
            <FontAwesomeIcon
              icon={weatherInfo.icon}
              size="2x"
              title={weatherInfo.label}
            />
            <p>{Math.floor(trail.weather.temperature)}°C</p>
            <p>{weatherInfo.label}</p>
          </div>
        </div>

        {/* Grundläggande Information */}
        <div className={styles.infoSection}>
          <div className={styles.basicInfo}>
            <p>{trail.length} km</p>
            <p>{t(trail.difficulty)}</p>
            <p>{new Date(trail.hikeDate).toLocaleDateString()}</p>
          </div>
          <p className={styles.description}>{trail.description}</p>
        </div>

        {/* Packlista */}
        <div className={styles.packingListContainer}>
          <div className={styles.packingListSection}>
            <button
              onClick={togglePackingList}
              className={styles.accordionButton}>
              <span className={styles.accordionTitle}>{t("packingList")}</span>
              <span>{isPackingListOpen ? "▼" : "▶"}</span>
            </button>

            {isPackingListOpen && (
              <div className={styles.accordionContentWrapper}>
                <div className={styles.packingListContent}>
                  <div className={styles.packingListGrid}>
                    {/* Gear */}
                    <div className={styles.packingColumn}>
                      <h4>{t("gear")}</h4>
                      <ul>
                        {trail.packingList.gear.map((item) => (
                          <li key={item._id} className={styles.item}>
                            <input
                              type="checkbox"
                              checked={item.isChecked}
                              onChange={(e) =>
                                updatePackingListItem(
                                  item._id!,
                                  false,
                                  e.target.checked
                                )
                              }
                            />
                            <span>{item.name}</span>
                            <button
                              className={styles.deleteButton}
                              onClick={() =>
                                removePackingListItem(item._id!, false)
                              }>
                              x
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Food */}
                    <div className={styles.packingColumn}>
                      <h4>{t("food")}</h4>
                      <ul>
                        {trail.packingList.food.map((item) => (
                          <li key={item._id} className={styles.item}>
                            <input
                              type="checkbox"
                              checked={item.isChecked}
                              onChange={(e) =>
                                updatePackingListItem(
                                  item._id!,
                                  true,
                                  e.target.checked
                                )
                              }
                            />
                            <span>{item.name}</span>
                            <button
                              className={styles.deleteButton}
                              onClick={() =>
                                removePackingListItem(item._id!, true)
                              }>
                              x
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Add Item */}
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
                    <button
                      className={styles.addButton}
                      onClick={addPackingListItem}
                      disabled={isAdding}>
                      {isAdding ? t("adding...") : t("add")}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Karta */}
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerClassName={styles.map}
            center={{ lat: trail.latitude, lng: trail.longitude }}
            zoom={13}>
            <Marker position={{ lat: trail.latitude, lng: trail.longitude }} />
          </GoogleMap>
        </LoadScript>

        {/* Kommentarer */}
        <div className={styles.commentsSection}>
          <h2>{t("journal")}</h2>
          <ul>
            {trail.comments.map((comment) => (
              <li key={comment._id} className={styles.commentItem}>
                {editingComment === comment._id ? (
                  <div className={styles.commentEdit}>
                    <textarea
                      defaultValue={comment.text}
                      onChange={(e) => setEditedText(e.target.value)}
                      className={styles.commentInput}
                    />
                    <div className={styles.commentButtons}>
                      <button
                        onClick={() => editComment(comment._id, editedText)}>
                        {t("save")}
                      </button>
                      <button onClick={() => setEditingComment(null)}>
                        {t("back")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.commentContent}>
                    <p>{comment.text}</p>
                    <small>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </small>
                    <div className={styles.commentButtons}>
                      <button onClick={() => setEditingComment(comment._id)}>
                        {t("edit")}
                      </button>
                      <button onClick={() => deleteComment(comment._id)}>
                        {t("delete")}
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div className={styles.addCommentSection}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={t("addComment")}
              className={styles.commentBox}
            />
            <button onClick={addComment} className={styles.addCommentButton}>
              {t("add")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleTrail;
