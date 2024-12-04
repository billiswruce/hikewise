import { useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
  Libraries,
} from "@react-google-maps/api";
import { useTranslation } from "react-i18next";
import styles from "../styles/CreateTrail.module.scss";
import placeholderImage from "../assets/trailPlaceholdersquare.webp";
import backgroundImage from "../assets/bg.webp";
import { useAuth0 } from "@auth0/auth0-react";
import stylesButton from "../styles/Buttons.module.scss";

const CreateTrail = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth0();

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
  });

  const libraries: Libraries = ["places"];
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    const adjustAutocompleteDropdown = () => {
      const pacContainer = document.querySelector(
        ".pac-container"
      ) as HTMLElement;
      const autocompleteWrapper = document.querySelector(
        `.${styles.autocompleteWrapper}`
      ) as HTMLElement;

      if (pacContainer && autocompleteWrapper) {
        const rect = autocompleteWrapper.getBoundingClientRect();
        pacContainer.style.position = "absolute";
        pacContainer.style.top = `${rect.bottom}px`;
        pacContainer.style.left = `${rect.left}px`;
        pacContainer.style.width = `${rect.width}px`;
        pacContainer.style.zIndex = "1000";
      }
    };

    adjustAutocompleteDropdown();
    const observer = new MutationObserver(adjustAutocompleteDropdown);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setFormData((prevData) => ({
        ...prevData,
        latitude: lat,
        longitude: lng,
      }));

      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${
            import.meta.env.VITE_GOOGLE_MAPS_API_KEY
          }`
        );
        const data = await response.json();
        console.log("Geocoding API Response:", data);

        if (data.status === "OK" && data.results && data.results[0]) {
          setFormData((prevData) => ({
            ...prevData,
            location: data.results[0].formatted_address,
          }));
        } else {
          console.warn(t("noAddressFound"));
        }
      } catch (error) {
        console.error(t("errorFetchingAddress"), error);
      }
    }
  };

  const handlePlaceSelected = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const location =
          place.formatted_address || place.name || t("unknownLocation");

        setFormData((prevData) => ({
          ...prevData,
          latitude: lat,
          longitude: lng,
          location,
        }));
      } else {
        alert(t("noPlaceDataFound"));
      }
    }
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
      const response = await fetch("http://localhost:3001/api/trails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          creatorId: user?.sub,
          formattedHikeDate: formatDate(formData.hikeDate),
          formattedHikeEndDate: formatDate(formData.hikeEndDate),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(t("trailCreatedSuccessfully"));
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
          }}></div>

        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <h1 className={styles.title}>{t("createTrail")}</h1>
            <input
              className={styles.input}
              type="text"
              name="name"
              placeholder={t("trailName")}
              value={formData.name}
              onChange={handleChange}
            />
            <input
              className={styles.input}
              type="number"
              name="length"
              placeholder={t("length")}
              value={formData.length}
              onChange={handleChange}
            />
            <select
              className={styles.select}
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}>
              <option value="">{t("difficulty")}</option>
              <option value="easy">{t("easy")}</option>
              <option value="medium">{t("medium")}</option>
              <option value="hard">{t("hard")}</option>
              <option value="epic">{t("epic")}</option>
            </select>
            <textarea
              className={styles.textarea}
              name="description"
              placeholder={t("description")}
              value={formData.description}
              onChange={handleChange}
            />
            <label className={styles.dateInputContainer}>
              <input
                className={styles.dateInput}
                type="date"
                name="hikeDate"
                value={formData.hikeDate}
                onChange={handleChange}
              />
              <span>{t("hikeDate")}</span>
            </label>

            <label className={styles.dateInputContainer}>
              <input
                className={styles.dateInput}
                type="date"
                name="hikeEndDate"
                value={formData.hikeEndDate}
                onChange={handleChange}
              />
              <span>{t("hikeEndDate")}</span>
            </label>

            <div className={styles.fileInputWrapper}>
              <div className={styles.fileInputContainer}>
                <label htmlFor="fileInput">{t("chooseFile")}</label>
                <input
                  id="fileInput"
                  className={styles.fileInput}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
              <span className={styles.fileStatus}>
                {formData.image
                  ? formData.image.split("/").pop()
                  : t("noFileChosen")}
              </span>
            </div>

            <div className={styles.imageContainer}>
              {formData.image ? (
                <>
                  <img
                    src={formData.image}
                    alt={t("uploadedImage")}
                    className={styles.image}
                  />
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() =>
                      setFormData((prevData) => ({ ...prevData, image: "" }))
                    }>
                    {t("removeImage")}
                  </button>
                </>
              ) : (
                <img
                  src={placeholderImage}
                  alt={t("placeholderImage")}
                  className={styles.image}
                />
              )}
            </div>
            <button type="submit" className={stylesButton.button}>
              {t("createTrail")}
            </button>
            <div className={styles.googleMapContainer}>
              <div className={styles.autocompleteWrapper}>
                <Autocomplete
                  onLoad={(autocomplete) =>
                    (autocompleteRef.current = autocomplete)
                  }
                  onPlaceChanged={handlePlaceSelected}>
                  <input
                    type="text"
                    placeholder={t("searchLocation")}
                    className={styles.input}
                  />
                </Autocomplete>
              </div>
              <GoogleMap
                mapContainerClassName={styles.googleMapContainer}
                zoom={10}
                center={{
                  lat: formData.latitude,
                  lng: formData.longitude,
                }}
                options={{
                  disableDefaultUI: false,
                  gestureHandling: "greedy",
                  keyboardShortcuts: true,
                }}
                onClick={handleMapClick}>
                <Marker
                  position={{
                    lat: formData.latitude,
                    lng: formData.longitude,
                  }}
                />
              </GoogleMap>
            </div>
          </form>
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
            })
          }>
          {t("reset")}
        </button>
      </div>
    </LoadScript>
  );
};

export default CreateTrail;
