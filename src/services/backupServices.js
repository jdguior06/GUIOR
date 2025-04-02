import api from '../utils/api'; 
import { showNotification } from '../utils/toast';


export const downloadBackup = async () => {
  try {
    const response = await api.get('/backup/download', {
      responseType: 'blob', 
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'backup.sql'); 
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);

    showNotification.success("Backup descargado exitosamente.");
  } catch (error) {
    showNotification.error("Error al descargar el backup.");
  }
};

export const uploadBackup = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await api.post('/backup/upload', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    showNotification.success(response.data || "Backup restaurado exitosamente.");
  } catch (error) {
    const errorMessage = error.response?.data || "Error al cargar el backup. Revisa el log del servidor.";
    showNotification.error(errorMessage);
  }
};
