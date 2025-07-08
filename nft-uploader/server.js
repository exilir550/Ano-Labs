const express = require('express');
const multer = require('multer');
const cloudinary = require('./utils/cloudinary');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// For file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const base64 = `data:${req.file.mimetype};base64,${fileBuffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: 'nfts',
    });

    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
