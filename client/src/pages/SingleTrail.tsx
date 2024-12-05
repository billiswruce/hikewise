import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "../styles/SingleTrail.module.scss";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

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
        <img src={trail.image} alt={trail.name} />
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

      {/* Comments section - to be implemented */}
      <div className={styles.commentsSection}>
        <h2>{t("comments")}</h2>
        {/* Add comment form and list here */}
      </div>
    </div>
  );
};

export default SingleTrail;
