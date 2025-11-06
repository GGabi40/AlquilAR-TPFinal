import cloudinary from "../config/cloudinary.js";
import { Property } from "../models/Property.js";
import fs from 'fs';

export const uploadFile = async (req,res) => {
    try {
        if(!req.file) {
            return res.status(400).json({ message: "No se cargó ningún archivo." });
        }

         /* const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: "alquilar",
                public_id: "user-test",  // idUsuario-idPropiedad
                resource_type: "auto"
            }
        )

        fs.unlinkSync(req.file.path);

        console.log(uploadResult);
        
        const optimizeUrl = cloudinary.url('test', {
            fetch_format: 'auto',
            quality: 'auto'
        }); */
        
        res.status(200).json({ message: "Archivo cargado correctamente.", url: optimizeUrl, public_id: public_id });
    } catch (error) {
        console.error("Error al subir archivos");
        res.status(500).json({ message: "Error al subir archivo." });
    }
};
