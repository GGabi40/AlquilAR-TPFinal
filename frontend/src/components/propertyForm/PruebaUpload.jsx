import React, { useState } from "react";
import axios from "axios";

function PruebaUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Seleccioná un archivo primero");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await axios.post("http://localhost:3000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUrl(res.data.url);
    } catch (error) {
      console.error(error);
      alert("Error al subir el archivo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ margin: "2rem" }}>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit" disabled={uploading}>
          {uploading ? "Subiendo..." : "Subir"}
        </button>
      </form>

      {url && (
        <div>
          <p>Archivo subido:</p>
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        </div>
      )}
    </div>
  );
}

export default PruebaUpload;
