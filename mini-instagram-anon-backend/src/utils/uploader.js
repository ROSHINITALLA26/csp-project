import multer from 'multer';
import fs from 'fs';
import path from 'path';

const maxMb = Number(process.env.MAX_UPLOAD_MB || 15);
const uploadDir = process.env.UPLOAD_DIR || 'uploads';

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\W+/g, '-').slice(0,40);
    const fname = `${Date.now()}-${base}${ext}`;
    cb(null, fname);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: maxMb * 1024 * 1024 }
});
