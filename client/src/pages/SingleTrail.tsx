import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "../styles/SingleTrail.module.scss";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import TrailPlaceholder from "../assets/trailPlaceholdersquare.webp";

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
  const [isPackingListOpen, setIsPackingListOpen] = useState(false);

  // Hardcoded packing list items
  const packingListItems = [
    "Backpack",
    "Water",
    "Food",
    "First Aid Kit",
    "Map",
    "Compass",
  ];

  // Hardcoded comments
  const comments = [
    {
      _id: "1",
      text: "Great trail!",
      createdAt: "2023-10-01",
      userId: "user1",
    },
    {
      _id: "2",
      text: "Loved the scenery.",
      createdAt: "2023-10-02",
      userId: "user2",
    },
    {
      _id: "3",
      text: "Challenging but worth it.",
      createdAt: "2023-10-03",
      userId: "user3",
    },
  ];

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

  const togglePackingList = () => {
    setIsPackingListOpen(!isPackingListOpen);
  };

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
          {t("packingList")}
        </button>
        {isPackingListOpen && (
          <div
            className={`${styles.packingListContent} ${
              isPackingListOpen ? "open" : ""
            }`}>
            <ul>
              {packingListItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Comments section */}
      <div className={styles.commentsSection}></div>
      <h2>{t("comments")}</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment._id}>
            <p>{comment.text}</p>
            <small>{new Date(comment.createdAt).toLocaleDateString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SingleTrail;
