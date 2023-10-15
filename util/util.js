import fs from "fs";
import Jimp from "jimp";
import axios from "axios";

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
 export async function filterImageFromURL(inputURL) {
  return new Promise(async (resolve, reject) => {
    try {
      const photo = await Jimp.read(inputURL);
      const outpath =
        "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(outpath, (img) => {
          resolve(outpath);
        });
    } catch (error) {
      console.error('Error filtering image:', error);
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
 export async function deleteLocalFiles(files) {
  files.forEach(filePath => {
    fs.unlink(filePath, err => {
      if (err) {
        console.error(`Error deleting file: ${filePath}`, err);
      } else {
        console.log(`Deleted file: ${filePath}`);
      }
    });
  });
}

export async function validateImageURL(url) {
  try {
    const response = await axios.head(url); // Send a HEAD request to get only the headers

    // Check if the Content-Type header indicates an image
    if (response.headers['content-type'] && response.headers['content-type'].startsWith('image/')) {
     return {
        isValid: true,
      };
    }

    return {
      isValid: false,
      errorCode: 400,
      error: 'Invalid image format',
    };
  } catch (error) {
    // Error occurred while validating the image URL
    console.error('Error validating image URL:', error);
    return {
      isValid: false,
      errorCode: 500,
      error: `Error validating image URL`,
    };
  }
}