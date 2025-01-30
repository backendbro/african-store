const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.cloudinary_name,
  api_key: process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_secret,
});

export const uploadSingleFile = async (file) => {
  const { createReadStream, filename, mimetype } = file;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "africanstore",
        public_id: filename.split(".")[0],
      },

      (error) => {
        if (error) {
          console.error("Error uploading to Cloudinary:", error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    createReadStream().pipe(stream);
  });
};

export const uploadFiles = async (files) => {
  const results = [];

  for (const file of files) {
    console.log(file);
    try {
      const result = await uploadSingleFile(file);
      console.log(result);
      results.push(
        JSON.stringify({
          url: result.secure_url,
          resource_type: result.resource_type,
        })
      );
    } catch (error) {
      console.error(`Failed to upload ${file.filename}:`, error);
    }
  }

  return results;
};
