import { useState, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
  Libraries,
} from "@react-google-maps/api";
import styles from "../styles/CreateTrail.module.scss";
import placeholderImage from "../assets/trailPlaceholder.webp";
import backgroundImage from "../assets/bg.webp";

const CreateTrail = () => {
  const { getAccessTokenSilently, user } = useAuth0();

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
          console.warn("Ingen adress hittades för dessa koordinater.");
          console.warn("Geocoding API Status:", data.status);
        }
      } catch (error) {
        console.error("Fel vid hämtning av adress:", error);
      }
    }
  };

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const location =
          place.formatted_address || place.name || "Unknown location";
        setFormData((prevData) => ({
          ...prevData,
          latitude: lat,
          longitude: lng,
          location,
        }));
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
      alert("Please fill in all required fields!");
      return;
    }

    try {
      const token = await getAccessTokenSilently();

      const response = await fetch("http://localhost:3001/api/trails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          creatorId: user?.sub,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Trail created successfully!");
        console.log("Trail saved:", data);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting trail:", error);
      alert("Failed to create trail. Please try again later.");
    }
  };

  return (
    <div>
      {/* Banner Section */}
      <div
        className={styles.banner}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}></div>

      {/* Form Section */}
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h1 className={styles.title}>Create Trail</h1>
          <input
            className={styles.input}
            type="text"
            name="name"
            placeholder="Trail name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            className={styles.input}
            type="number"
            name="length"
            placeholder="Length (km)"
            value={formData.length}
            onChange={handleChange}
          />
          <select
            className={styles.select}
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}>
            <option value="">Select Difficulty</option>
            <option value="simple">Simple Walk</option>
            <option value="easy">Easy Hike</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="epic">Epic</option>
          </select>
          <textarea
            className={styles.textarea}
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />
          <input
            className={styles.input}
            type="date"
            name="hikeDate"
            placeholder="Hike Date"
            value={formData.hikeDate}
            onChange={handleChange}
          />
          <input
            className={styles.input}
            type="date"
            name="hikeEndDate"
            placeholder="Hike End Date"
            value={formData.hikeEndDate}
            onChange={handleChange}
          />
          <input
            className={styles.fileInput}
            type="file"
            accept="image/*"
            onChange={(e) => {
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
              }
            }}
          />
          <div className={styles.imageContainer}>
            {formData.image ? (
              <>
                <img
                  src={formData.image}
                  alt="Uploaded"
                  className={styles.image}
                />
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() =>
                    setFormData((prevData) => ({ ...prevData, image: "" }))
                  }>
                  Remove Image
                </button>
              </>
            ) : (
              <img
                src={placeholderImage}
                alt="Placeholder"
                className={styles.image}
              />
            )}
          </div>
          <button type="submit" className={styles.submitButton}>
            Create Trail
          </button>
        </form>
      </div>

      {/* Map Section */}
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""}
        libraries={libraries}>
        <div>
          <Autocomplete
            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
            onPlaceChanged={handlePlaceChanged}>
            <input
              className={styles.input}
              type="text"
              placeholder="Search for location"
            />
          </Autocomplete>
          {formData.location && (
            <p className={styles.location}>
              Selected Location: {formData.location}
            </p>
          )}
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "400px" }}
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
            {formData.latitude && formData.longitude && (
              <Marker
                position={{ lat: formData.latitude, lng: formData.longitude }}
              />
            )}
          </GoogleMap>
        </div>
      </LoadScript>

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
        Reset
      </button>
    </div>
  );
};

export default CreateTrail;
