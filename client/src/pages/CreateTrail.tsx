import { useState } from "react";
import { LoadScript } from "@react-google-maps/api";
import { useTranslation } from "react-i18next";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/CreateTrail.module.scss";
import backgroundImage from "../assets/bg.webp";
import TrailForm from "../components/createTrail/TrailForm";
import ConfirmationModal from "../components/ConfirmationModal";
import LoadingScreen from "../components/LoadingScreen";
import { compressImage } from "../utils/imageCompression";
import { libraries } from "../components/createTrail/TrailLocationPicker";
import { FormData } from "../models/FormData";

type CustomChangeEvent = {
  target: { name: string; value: string | number };
};

const CreateTrail = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth0();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    length: "",
    difficulty: "",
    description: "",
    latitude: 57.7089,
    longitude: 11.9746,
    location: "Göteborg, Sweden",
    hikeDate: "",
    hikeEndDate: "",
    image: "",
    packingList: {
      gear: [],
      food: [],
    },
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      | CustomChangeEvent
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      if (name === "latitude" || name === "longitude") {
        return {
          ...prevData,
          [name]: Number(value),
        };
      }

      if (name === "hikeDate") {
        return {
          ...prevData,
          hikeDate: String(value),
          hikeEndDate: !prevData.hikeEndDate
            ? String(value)
            : prevData.hikeEndDate,
        };
      }

      if (name === "hikeEndDate" && prevData.hikeDate) {
        const startDate = new Date(prevData.hikeDate);
        const newEndDate = new Date(value);
        if (newEndDate < startDate) {
          alert(t("endDateBeforeStart"));
          return prevData;
        }
      }

      return {
        ...prevData,
        [name]: String(value),
      };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedImage = await compressImage(file);
        setFormData((prevData) => ({
          ...prevData,
          image: compressedImage,
        }));
      } catch (error) {
        console.error("Error compressing image:", error);
        alert(t("uploadImageError"));
      }
    }
  };

  const formatDate = (date: string): string => {
    const dateFormatter = new Intl.DateTimeFormat(i18n.language, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const parsedDate = new Date(date);
    return dateFormatter.format(parsedDate);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.length ||
      !formData.latitude ||
      !formData.longitude ||
      !formData.hikeDate ||
      !formData.hikeEndDate
    ) {
      alert(t("fillRequiredFields"));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trails`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ...formData,
            packingList: formData.packingList,
            creatorId: user?.sub,
            formattedHikeDate: formatDate(formData.hikeDate),
            formattedHikeEndDate: formatDate(formData.hikeEndDate),
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsModalOpen(true);
        console.log("Trail saved:", data);
      } else {
        const errorData = await response.json();
        alert(`${t("error")}: ${errorData.message}`);
      }
    } catch (error) {
      console.error(t("errorSubmittingTrail"), error);
      alert(t("failedToCreateTrail"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""}
        libraries={libraries}>
        <div>
          <div
            className={styles.banner}
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <div className={styles.formContainer}>
            {isLoading ? (
              <LoadingScreen />
            ) : (
              <TrailForm
                formData={formData}
                handleChange={handleChange}
                handleImageUpload={handleImageUpload}
                handleSubmit={handleSubmit}
              />
            )}
            <ConfirmationModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onNavigate={() => navigate("/trails")}
              message={t("trailCreatedSuccessfully")}
            />
          </div>
        </div>
      </LoadScript>
    </>
  );
};

export default CreateTrail;
