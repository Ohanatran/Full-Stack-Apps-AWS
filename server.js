import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles, validateImageURL} from './util/util.js';

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

    /**************************************************************************** */

    app.get( "/filteredimage", async ( req, res ) => {
      const imageUrl = req.query.image_url;
      // Validate the image_url query parameter
      if (!imageUrl) {
        return res.status(400).send('Image URL is required');
      }
      const validation = await validateImageURL(imageUrl);
      if (!validation.isValid) {
        return res.status(validation.errorCode).send(validation.error);
      }

      try {
        // Filter the image and get the filtered image file path
        const filteredImagePath = await filterImageFromURL(imageUrl);

        // Send the filtered image in the response
        res.sendFile(filteredImagePath, {}, (err) => {
          // Delete the local files after sending the response
          if (!err) {
            deleteLocalFiles([filteredImagePath]);
          } else {
            console.error('Error sending file:', err);  
          }
        });
      } catch (error) {
        console.error('Error filtering image:', error);
        res.status(422).send('Error filtering image');
      }
    } );
  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
