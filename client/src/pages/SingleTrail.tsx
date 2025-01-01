import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "../styles/SingleTrail.module.scss";
import { Libraries, LoadScript } from "@react-google-maps/api";
import TrailPlaceholder from "../assets/trailPlaceholder.webp";
import LoadingScreen from "../components/LoadingScreen";
import { useAuth0 } from "@auth0/auth0-react";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { SingleTrailData } from "../models/SingleTrail";
import { TrailHeader } from "../components/singleTrail/TrailHeader";
import { PackingList } from "../components/singleTrail/PackingList";
import { Comments } from "../components/singleTrail/Comments";
import { TrailInfo } from "../components/singleTrail/TrailInfo";
import { TrailMap } from "../components/singleTrail/TrailMap";

const libraries: Libraries = ["places"];

const SingleTrail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [trail, setTrail] = useState<SingleTrailData | null>(null);
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
  const [formData, setFormData] = useState<SingleTrailData | null>(null);
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
        setValidImage(trail.image || "");
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

  const fetchTrail = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trails/${id}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setTrail(data);
      setEditLatitude(data.latitude || 0);
      setEditLongitude(data.longitude || 0);
    } catch (error) {
      console.error("Error fetching trail data:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const addPackingListItem = async () => {
    if (!newPackingListItem.trim()) return;

    setIsAdding(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trails/${id}/packing-list`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: newPackingListItem,
            isFood,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add packing list item");
      }

      const updatedTrail = await response.json();
      setTrail(updatedTrail);
      setNewPackingListItem("");
    } catch (error) {
      console.error("Error adding packing list item:", error);
      alert(t("alerts.errorAddingPackingListItem"));
    } finally {
      setIsAdding(false);
    }
  };

  const removePackingListItem = async (itemId: string, isFood: boolean) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/trails/${id}/packing-list/${itemId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isFood }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove packing list item");
      }

      const updatedTrail = await response.json();
      setTrail(updatedTrail);
    } catch (error) {
      console.error("Error removing packing list item:", error);
      alert(t("alerts.errorRemovingPackingListItem"));
    }
  };

  const updatePackingListItem = async (
    itemId: string,
    isFood: boolean,
    isChecked: boolean
  ) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/trails/${id}/packing-list/${itemId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            isFood,
            isChecked,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update packing list item");
      }

      const updatedTrail = await response.json();
      setTrail(updatedTrail);
    } catch (error) {
      console.error("Error updating packing list item:", error);
      alert(t("alerts.errorUpdatingPackingList"));
    }
  };

  const addComment = async () => {
    if (newComment.trim() === "" || !trail) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trails/${id}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ text: newComment }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add comment: ${errorData.message}`);
      }

      const updatedTrail = await response.json();
      setTrail(updatedTrail);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const editComment = async (commentId: string, newText: string) => {
    if (newText.trim() === "") {
      return;
    }

    try {
      setIsSaving(true);
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
        throw new Error(`Failed to update comment: ${errorData.message}`);
      }

      const updatedTrail = await response.json();
      setTrail(updatedTrail);
      setEditingComment(null);
    } catch (error) {
      console.error("Error updating comment:", error);
    } finally {
      setIsSaving(false);
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
    setFormData((prev) => {
      if (!prev) return null;
      return { ...prev, [name]: value };
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setIsSaving(true);
    try {
      const updatedFormData = {
        ...formData,
        latitude: editLatitude,
        longitude: editLongitude,
        weather: trail?.weather,
        packingList: trail?.packingList,
        comments: trail?.comments,
      };

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
        throw new Error("Failed to update trail");
      }

      const updatedTrail = await response.json();
      setTrail(updatedTrail);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating trail data:", error);
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

  const handlePlaceSelected = async () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();

      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const location =
          place.formatted_address || place.name || t("unknownLocation");

        setEditLatitude(lat);
        setEditLongitude(lng);
        setFormData((prev) => ({
          ...prev!,
          latitude: lat,
          longitude: lng,
          location: location,
        }));
      } else {
        alert(t("noPlaceDataFound"));
      }
    }
  };

  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      setEditLatitude(lat);
      setEditLongitude(lng);
      setFormData((prev) => ({
        ...prev!,
        latitude: lat,
        longitude: lng,
      }));
    }
  };

  useEffect(() => {
    fetchTrail();
  }, [fetchTrail]);

  if (loading) return <LoadingScreen />;
  if (!trail) return <div>{t("notFound")}</div>;

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

      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        libraries={libraries}>
        <div className={styles.container}>
          <TrailHeader
            trail={trail}
            isEditing={isEditing}
            formData={formData}
            handleEditChange={handleEditChange}
          />

          <TrailInfo
            trail={trail}
            isEditing={isEditing}
            isSaving={isSaving}
            formData={formData}
            handleEditChange={handleEditChange}
            handleEditSubmit={handleEditSubmit}
            setIsEditing={setIsEditing}
            handleDelete={handleDelete}
            editLatitude={editLatitude}
            editLongitude={editLongitude}
            handleMapClick={handleMapClick}
            handlePlaceSelected={handlePlaceSelected}
            autocompleteRef={autocompleteRef}
          />

          <PackingList
            trail={trail}
            isPackingListOpen={isPackingListOpen}
            togglePackingList={togglePackingList}
            updatePackingListItem={updatePackingListItem}
            removePackingListItem={removePackingListItem}
            newPackingListItem={newPackingListItem}
            setNewPackingListItem={setNewPackingListItem}
            isFood={isFood}
            setIsFood={setIsFood}
            addPackingListItem={addPackingListItem}
            isAdding={isAdding}
          />

          <TrailMap latitude={trail.latitude} longitude={trail.longitude} />

          <Comments
            trail={trail}
            editingComment={editingComment}
            editedText={editedText}
            setEditedText={setEditedText}
            setEditingComment={setEditingComment}
            editComment={editComment}
            deleteComment={deleteComment}
            newComment={newComment}
            setNewComment={setNewComment}
            addComment={addComment}
            isSaving={isSaving}
          />
        </div>
      </LoadScript>

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
