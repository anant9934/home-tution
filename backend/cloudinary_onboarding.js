const cloudinary = require('cloudinary').v2;

// Configure Cloudinary using environment variables
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

async function run() {
  try {
    console.log("Uploading image...");
    
    // 2. Upload an image
    const uploadResult = await cloudinary.uploader.upload('https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg');
    console.log("Upload Secure URL:", uploadResult.secure_url);
    console.log("Upload Public ID:", uploadResult.public_id);
    
    // 3. Get image details
    console.log("\nImage Metadata:");
    console.log("Width:", uploadResult.width);
    console.log("Height:", uploadResult.height);
    console.log("Format:", uploadResult.format);
    console.log("File size (bytes):", uploadResult.bytes);
    
    // 4. Transform the image
    // Generate a transformed URL with f_auto (automatically chooses the most efficient image format)
    // and q_auto (automatically adjusts compression quality to minimize file size without visible degradation)
    const transformUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: 'auto',
      quality: 'auto'
    });
    
    console.log("\nDone! Click link below to see optimized version of the image. Check the size and the format.");
    console.log(transformUrl);
    
  } catch (error) {
    console.error("Error running Cloudinary script:", error);
  }
}

run();
