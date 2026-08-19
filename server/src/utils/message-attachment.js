import { v2 as cloudinary } from "cloudinary";
import { uploadChatAttachmentFromBuffer } from "../middlewares/chat-upload.middleware.js";

const normalizeFileName = (originalName) => {
  if (!originalName) return originalName;

  const decoded = Buffer.from(originalName, "latin1").toString("utf8");

  return decoded.includes("�") ? originalName : decoded;
};

export const uploadAttachmentIfPresent = async (file) => {
  if (!file)
    return {
      attachmentFields: {},
      uploadedPublicId: null,
      uploadedResourceType: null,
    };

  const uploadResult = await uploadChatAttachmentFromBuffer(
    file.buffer,
    file.mimetype,
    file.originalname,
  );

  const uploadedPublicId = uploadResult.public_id;
  const uploadedResourceType = uploadResult.resource_type;

  const attachmentFields =
    uploadResult.resource_type === "image"
      ? { imgUrl: uploadResult.secure_url || uploadResult.url }
      : {
          fileUrl: uploadResult.secure_url || uploadResult.url,
          fileName: normalizeFileName(file.originalname),
          fileType: file.mimetype,
          fileSize: file.size,
        };

  return { attachmentFields, uploadedPublicId, uploadedResourceType };
};

export const cleanupUploadedAttachment = async (
  uploadedPublicId,
  uploadedResourceType,
  errorMessage = "Failed to cleanup uploaded attachment:",
) => {
  if (!uploadedPublicId) return;

  try {
    await cloudinary.uploader.destroy(uploadedPublicId, {
      resource_type: uploadedResourceType === "image" ? "image" : "raw",
    });
  } catch (destroyError) {
    console.error(errorMessage, destroyError);
  }
};
