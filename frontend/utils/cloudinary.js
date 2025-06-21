export function getCloudinaryUrl(publicId, options = {}) {
  const cloudName = "da9mdueux"; // your Cloudinary cloud name
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;

  // Optional: include transformation (e.g., width, crop)
  const transformation = options.transformation || ""; // e.g., "w_300,c_fill"

  // Optional: set file extension
  const extension = options.extension || "jpg"; // default to .jpg

  return `${baseUrl}/${
    transformation ? transformation + "/" : ""
  }${publicId}.${extension}`;
}
