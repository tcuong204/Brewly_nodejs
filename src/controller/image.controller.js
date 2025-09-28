import Image from "../models/image.model.js";

export const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadedImages = [];

    for (const file of req.files) {
      const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        file.filename
      }`;

      const image = new Image({
        filename: file.filename,
        path: imageUrl,
        contentType: file.mimetype,
      });

      await image.save();
      uploadedImages.push({
        imageId: image._id,
        imageUrl: imageUrl,
      });
    }

    res.status(201).json({ images: uploadedImages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).send("Image not found");
    }
    res.json(image);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
