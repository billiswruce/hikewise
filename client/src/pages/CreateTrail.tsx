import { useState } from "react";
import { LoadScript, Libraries } from "@react-google-maps/api";
import { useTranslation } from "react-i18next";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/CreateTrail.module.scss";
import backgroundImage from "../assets/bg.webp";
import TrailForm from "../components/trail/TrailForm";
import ConfirmationModal from "../components/ConfirmationModal";

const CreateTrail = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth0();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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

  const libraries: Libraries = ["places"];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      if (name === "hikeDate" && !prevData.hikeEndDate) {
        return {
          ...prevData,
          [name]: value,
          hikeEndDate: value,
        };
      }
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          image: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      alert(t("uploadImageError"));
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
            <TrailForm
              formData={formData}
              handleChange={handleChange}
              handleImageUpload={handleImageUpload}
              handleSubmit={handleSubmit}
            />
            <ConfirmationModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onNavigate={() => navigate("/trails")}
              message={t("trailCreatedSuccessfully")}
            />
          </div>

          <button
            type="button"
            className={styles.resetButton}
            onClick={() =>
              setFormData({
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
              })
            }>
            {t("reset")}
          </button>
        </div>
      </LoadScript>
    </>
  );
};

export default CreateTrail;
