import path from "path";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "application/zip",
  "application/x-zip-compressed",
  "video/mp4",
  "audio/mpeg",
  "audio/mp3",
]);

const blockedExtensions = new Set([
  ".exe",
  ".bat",
  ".cmd",
  ".sh",
  ".msi",
  ".dll",
  ".js",
  ".jar",
  ".app",
]);

const sanitizePublicId = (originalName) => {
  const name = path.basename(originalName || "attachment");
  const sanitized = name
    .replace(/[^a-zA-Z0-9_.\- ]+/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^[-_.]+|[-_.]+$/g, "");

  return sanitized || `attachment-${Date.now()}`;
};

const getFileExtension = (originalName) =>
  path.extname(originalName || "").toLowerCase();

const fileFilter = (req, file, cb) => {
  const fileExtension = getFileExtension(file.originalname);

  if (blockedExtensions.has(fileExtension))
    return cb(new Error(`Disallowed file extension: ${fileExtension}`));

  if (!allowedMimeTypes.has(file.mimetype))
    return cb(new Error(`Unsupported file type: ${file.mimetype}`));

  return cb(null, true);
};

export const uploadChatAttachment = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
  fileFilter,
});

export const uploadChatAttachmentSingle = (req, res, next) => {
  uploadChatAttachment.single("file")(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });

    next();
  });
};

export const uploadChatAttachmentFromBuffer = (
  buffer,
  mimetype,
  originalName,
) => {
  const isImage = mimetype.startsWith("image/");

  return new Promise((resolve, reject) => {
    const options = {
      folder: isImage ? "chat-app/messages/images" : "chat-app/messages/files",
      resource_type: isImage ? "image" : "raw",
    };

    if (isImage) {
      options.transformation = [{ width: 1600, height: 1600, crop: "limit" }];
    } else {
      const publicId = `${sanitizePublicId(originalName).replace(/\.[^/.]+$/, "")}-${Date.now()}`;
      options.public_id = publicId;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    uploadStream.end(buffer);
  });
};
