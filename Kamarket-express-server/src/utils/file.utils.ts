import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(__dirname, "../../uploads");
const CATEGORY_DIR = path.join(UPLOAD_DIR, "category");
const BRAND_DIR = path.join(UPLOAD_DIR, "brand");

// Ensure upload directories exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
if (!fs.existsSync(CATEGORY_DIR)) {
  fs.mkdirSync(CATEGORY_DIR, { recursive: true });
}
if (!fs.existsSync(BRAND_DIR)) {
  fs.mkdirSync(BRAND_DIR, { recursive: true });
}

export const saveFile = (
  file: Express.Multer.File,
  type: string = "default"
): string => {
  const fileName = `${Date.now()}-${file.originalname}`;
  let targetDir = UPLOAD_DIR;
  let returnPath = `/uploads/${fileName}`;

  if (type === "category") {
    targetDir = CATEGORY_DIR;
    returnPath = `/uploads/category/${fileName}`;
  } else if (type === "brand") {
    targetDir = BRAND_DIR;
    returnPath = `/uploads/brand/${fileName}`;
  }

  const filePath = path.join(targetDir, fileName);
  fs.writeFileSync(filePath, file.buffer);

  return returnPath;
};

export const deleteFile = (filePath: string): void => {
  const fullPath = path.join(__dirname, "../../", filePath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};
