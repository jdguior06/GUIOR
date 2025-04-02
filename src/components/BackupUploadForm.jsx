import { useState } from "react";
import { uploadBackup } from "../services/backupServices";
import { showNotification } from "../utils/toast";

const BackupUploadForm = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      await uploadBackup(file);
    } else {
      showNotification.info("Por favor selecciona un archivo de backup.");
    }
  };

  return (
    <div className="space-y-4">
      <input type="file" onChange={handleFileChange} className="border p-2" />
      <button
        onClick={handleUpload}
        className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
      >
        Cargar Backup
      </button>
    </div>
  );
};

export default BackupUploadForm;
