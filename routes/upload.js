const express = require('express');
const router = express.Router();
const cloudinary = require('../nft-uploader/utils/cloudinary');

router.post('/upload', async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const result = await cloudinary.uploader.upload(image, {
      folder: 'ano-nfts', // optional folder name in Cloudinary
    });

    res.status(200).json({ url: result.secure_url });
  } catch (err) {
    console.error('❌ Upload failed:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;
