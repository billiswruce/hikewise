import { useTranslation } from "react-i18next";
import styles from "../../styles/SingleTrail.module.scss";
import { SingleTrailData } from "../../models/SingleTrail";

interface CommentsProps {
  trail: SingleTrailData;
  editingComment: string | null;
  editedText: string;
  setEditedText: (text: string) => void;
  setEditingComment: (id: string | null) => void;
  editComment: (id: string, text: string) => void;
  deleteComment: (id: string) => void;
  newComment: string;
  setNewComment: (text: string) => void;
  addComment: () => void;
  isSaving: boolean;
}

export const Comments = ({
  trail,
  editingComment,
  editedText,
  setEditedText,
  setEditingComment,
  editComment,
  deleteComment,
  newComment,
  setNewComment,
  addComment,
  isSaving,
}: CommentsProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.commentsSection}>
      <h2>{t("journal")}</h2>
      <ul>
        {trail.comments.map((comment) => (
          <li key={comment._id} className={styles.commentItem}>
            {editingComment === comment._id ? (
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
                      setEditingComment(null);
                      setEditedText("");
                    }}>
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
  );
};
