import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/provincias", async (req, res) => {
  try {
    const response = await axios.get("https://apis.datos.gob.ar/georef/api/provincias?campos=nombre");
    const data = response.data.provincias.map(p => ({
      id: p.id,
      nombre: p.nombre
    }));
    res.json(data);
  } catch (error) {
    console.error("Error al obtener provincias:", error);
    res.status(500).json({ message: "No se pudo obtener provincias" });
  }
});

export default router;