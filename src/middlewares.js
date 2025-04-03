// create createThumbnail function, use sharp, use after file upload
// save thumbnail image in uploads with suffix _thumb
// use promise version of sharp

import sharp from "sharp";

const createThumbnail = async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  console.log(req.file.path);
  // TODO: use file path to create 160x160 png thumbnail with sharp
  const inputPath = req.file.path;
  const outputPath = `${req.file.destination}/${req.file.filename}_thumb.png`;
  console.log(outputPath);
  await sharp(inputPath)
    .resize(160, 160)
    .toFile(outputPath, (err, info) => {
      if (err) {
        console.error("Error creating thumbnail:", err);
        return next(err);
      }
      console.log("Thumbnail created:", info);
    });
  next();
};

export { createThumbnail };
