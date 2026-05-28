const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({ 
  cloud_name: 'dfeq2ux5i', 
  api_key: '268959669917833', 
  api_secret: 'vuQYVBnKycnH_N2t5xvv9Tej3Rs' 
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
