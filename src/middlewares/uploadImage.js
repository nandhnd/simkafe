import multer from "multer";
import fs from "fs";
import path from "path";

// Fungsi membuat folder jika belum ada
function ensureDirExist(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export const uploadImage = (folderName = "images") => {
  const uploadPath = `uploads/${folderName}`;
  ensureDirExist(uploadPath);

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const fileName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
      cb(null, fileName);
    },
  });

  // Filter file gambar
  const fileFilter = (req, file, cb) => {
    const mime = file.mimetype;
    if (mime === "image/jpeg" || mime === "image/png" || mime === "image/jpg") {
      cb(null, true);
    } else {
      cb(new Error("File harus berupa gambar (jpg, jpeg, png)"), false);
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  });
};
