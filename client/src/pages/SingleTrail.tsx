import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "../styles/SingleTrail.module.scss";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Libraries,
} from "@react-google-maps/api";
import TrailPlaceholder from "../assets/trailPlaceholder.webp";
import LoadingScreen from "../components/LoadingScreen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faCloud,
  faCloudRain,
  faSnowflake,
  faSmog,
  faBolt,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth0 } from "@auth0/auth0-react";
import ConfirmationDialog from "../components/ConfirmationDialog";
import TrailLocationPicker from "../components/trail/TrailLocationPicker";

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

// Lägg till denna enum för att matcha backend
enum Difficulty {
  Simple = "simple",
  Easy = "easy",
  Medium = "medium",
  Hard = "hard",
  Epic = "epic",
}

// Definiera libraries array
const libraries: Libraries = ["places"];

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
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Trail | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [editLatitude, setEditLatitude] = useState<number>(0);
  const [editLongitude, setEditLongitude] = useState<number>(0);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

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

  useEffect(() => {
    if (trail) {
      setFormData(trail);
    }
  }, [trail]);

  useEffect(() => {
    if (trail) {
      setEditLatitude(trail.latitude);
      setEditLongitude(trail.longitude);
    }
  }, [trail]);

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
    setLoading(true);
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
      setIsSaving(true); // Starta sparande
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
      setTrail(updatedTrail); // Uppdatera trail-data
      setEditingComment(null); // Stäng redigeringsläget
    } catch (error) {
      console.error("Error updating comment:", error);
    } finally {
      setIsSaving(false); // Slutför sparande
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
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete comment: ${errorData.message}`);
      }

      const updatedTrail = await response.json();
      setTrail(updatedTrail);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev!, [name]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Hämta senaste vädret innan vi sparar
      const latestWeather = await fetchWeather(editLatitude, editLongitude);

      const updatedFormData = {
        ...formData,
        latitude: editLatitude,
        longitude: editLongitude,
        weather: latestWeather || formData?.weather, // Använd det nya vädret eller behåll det gamla om hämtningen misslyckas
      };

      console.log("Sending update with data:", updatedFormData);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trails/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(updatedFormData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error(`Failed to update trail: ${errorData.message}`);
      }

      const updatedTrail = await response.json();
      console.log("Server response:", updatedTrail);

      await fetchTrail();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating trail:", error);
      alert(t("alerts.errorUpdatingTrail"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isAuthenticated) {
      alert(t("pleaseLogIn"));
      return;
    }
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trails/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete trail");
      }

      navigate("/trails");
    } catch (error) {
      console.error("Delete error:", error);
      alert(t("errorDeletingTrail"));
    } finally {
      setShowDeleteConfirmation(false);
    }
  };

  const fetchWeather = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/weather?lat=${lat}&lon=${lng}`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to fetch weather");
      return await response.json();
    } catch (error) {
      console.error("Error fetching weather:", error);
      return null;
    }
  };

  const handlePlaceSelected = async () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      console.log("Selected place:", place);

      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const location =
          place.formatted_address || place.name || t("unknownLocation");

        // Hämta väder för den nya platsen
        const weatherData = await fetchWeather(lat, lng);

        setEditLatitude(lat);
        setEditLongitude(lng);
        setFormData((prev) => ({
          ...prev!,
          latitude: lat,
          longitude: lng,
          location: location,
          weather: weatherData || prev!.weather, // Använd tidigare väder om hämtningen misslyckas
        }));
      } else {
        console.error("No geometry found for place:", place);
        alert(t("noPlaceDataFound"));
      }
    }
  };

  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      // Hämta väder för den nya platsen
      const weatherData = await fetchWeather(lat, lng);

      setEditLatitude(lat);
      setEditLongitude(lng);
      setFormData((prev) => ({
        ...prev!,
        latitude: lat,
        longitude: lng,
        weather: weatherData || prev!.weather,
      }));
    }
  };

  useEffect(() => {
    fetchTrail();
  }, [fetchTrail]);

  if (loading) return <LoadingScreen />;
  if (!trail) return <div>{t("notFound")}</div>;

  const weatherInfo = getWeatherIcon(trail.weather.description);

  return (
    <div>
      {/* Hero Image */}
      <div
        className={styles.heroImage}
        style={{
          backgroundImage: `url(${validImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Container för all information */}
      <div className={styles.container}>
        {/* Titel och väder */}
        <div className={styles.titleWeatherContainer}>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData?.name || ""}
              onChange={handleEditChange}
              className={styles.editInput}
            />
          ) : (
            <h2>{trail.name}</h2>
          )}
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
        <div className={styles.basicInfo}>
          {isEditing ? (
            isSaving ? (
              <LoadingScreen />
            ) : (
              <form onSubmit={handleEditSubmit} className={styles.editForm}>
                <div className={styles.formGroup}>
                  <label>{t("name")}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData?.name || ""}
                    onChange={handleEditChange}
                    className={styles.editInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>{t("length")}</label>
                  <input
                    type="number"
                    name="length"
                    value={formData?.length || ""}
                    onChange={handleEditChange}
                    className={styles.editInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>{t("difficulty")}</label>
                  <select
                    name="difficulty"
                    value={formData?.difficulty || ""}
                    onChange={handleEditChange}
                    className={styles.editSelect}>
                    {Object.values(Difficulty).map((diff) => (
                      <option key={diff} value={diff}>
                        {t(diff)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>{t("description")}</label>
                  <textarea
                    name="description"
                    value={formData?.description || ""}
                    onChange={handleEditChange}
                    className={styles.editTextarea}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>{t("location")}</label>
                  <TrailLocationPicker
                    latitude={editLatitude}
                    longitude={editLongitude}
                    onMapClick={handleMapClick}
                    onPlaceSelected={handlePlaceSelected}
                    autocompleteRef={autocompleteRef}
                  />
                </div>

                <div className={styles.dateGroup}>
                  <div className={styles.formGroup}>
                    <label>{t("startDate")}</label>
                    <input
                      type="date"
                      name="hikeDate"
                      value={formData?.hikeDate?.split("T")[0] || ""}
                      onChange={handleEditChange}
                      className={styles.editInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>{t("endDate")}</label>
                    <input
                      type="date"
                      name="hikeEndDate"
                      value={formData?.hikeEndDate?.split("T")[0] || ""}
                      onChange={handleEditChange}
                      className={styles.editInput}
                    />
                  </div>
                </div>

                <div className={styles.editButtons}>
                  <button type="submit" className={styles.saveButton}>
                    {t("save")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className={styles.cancelButton}>
                    {t("cancel")}
                  </button>
                </div>
              </form>
            )
          ) : (
            <>
              <div className={styles.infoHeader}>
                <div className={styles.infoContent}>
                  <p className={styles.trailLocation}>{trail.location}</p>
                  <p className={styles.trailDates}>
                    {new Date(trail.hikeDate).toLocaleDateString()} -{" "}
                    {new Date(trail.hikeEndDate).toLocaleDateString()}
                  </p>
                  <div className={styles.trailStats}>
                    <p className={styles.trailLength}>{trail.length} km</p>
                    <p className={styles.trailDifficulty}>
                      {t(trail.difficulty)}
                    </p>
                  </div>
                </div>
                <div className={styles.actionButtons}>
                  <button
                    onClick={() => setIsEditing(true)}
                    className={styles.editButton}>
                    {t("edit")}
                  </button>
                  <button
                    onClick={handleDelete}
                    className={styles.deleteButton}>
                    {t("delete")}
                  </button>
                </div>
              </div>
              <p className={styles.description}>{trail.description}</p>
            </>
          )}
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

                  {/* Lägg till item */}
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
        <LoadScript
          googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
          libraries={libraries}>
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
                  // Redigeringsläge
                  <div className={styles.commentEdit}>
                    <textarea
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      className={styles.commentInput}
                    />
                    <div className={styles.commentButtons}>
                      <button
                        onClick={() => editComment(comment._id, editedText)}
                        disabled={isSaving}>
                        {isSaving ? t("saving...") : t("save")}
                      </button>
                      <button
                        onClick={() => {
                          setEditingComment(null); // Avbryt redigering
                          setEditedText(""); // Rensa redigeringstext
                        }}>
                        {t("back")}
                      </button>
                    </div>
                  </div>
                ) : (
                  // Visningsläge
                  <div className={styles.commentContent}>
                    <p>{comment.text}</p>
                    <small>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </small>
                    <div className={styles.commentButtons}>
                      <button
                        onClick={() => {
                          setEditingComment(comment._id);
                          setEditedText(comment.text);
                        }}>
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

          {/* Lägg till kommentar */}
          <div className={styles.addCommentSection}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={t("addComment")}
              className={styles.commentBox}
            />
            <button
              onClick={addComment}
              className={styles.addCommentButton}
              disabled={isSaving}>
              {isSaving ? t("adding...") : t("add")}
            </button>
          </div>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showDeleteConfirmation}
        message={t("confirmDeleteTrail")}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirmation(false)}
      />
    </div>
  );
};

export default SingleTrail;
