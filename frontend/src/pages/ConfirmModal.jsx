import React from "react";
import { CircleHelp } from "lucide-react";
import { useTranslation } from 'react-i18next';

function ConfirmModal({ open, message, onConfirm, onCancel }) {
  if (!open) return null;
  const { t } = useTranslation();

  return (
    <div id="confirm-modal" style={styles.overlay}>
      <div style={styles.modal} >
        <div className="flex justify-start space-x-3 items-center mb-4">
          <CircleHelp className=" w-8 h-8 text-blue-600 mb-4" />
          <span className="label-text text-blue-900 font-bold">{message}</span>
        </div>

        <div style={{ marginTop: 16 }}>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition" style={styles.button}>{t('tr: Confirm')}</button>
          <button onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition" style={styles.button}>Annuler</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000
  },
  modal: {
    background: "#fff", padding: 24, borderRadius: 8, textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
  },
  button: {
    margin: "0 8px", padding: "8px 16px", borderRadius: 14, border: "none", cursor: "pointer"
  }
};

export default ConfirmModal;
