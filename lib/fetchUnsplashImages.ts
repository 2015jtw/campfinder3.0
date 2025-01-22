import fetch from "node-fetch"; // Install @types/node-fetch for TypeScript support

// Unsplash API details
const ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY; // Replace with your Unsplash Access Key
const COLLECTION_ID = "2207863"; // Collection ID for "night-scenes/moons"
const API_URL = `https://api.unsplash.com/collections/${COLLECTION_ID}/photos`;

interface UnsplashImage {
  urls: {
    regular: string; // URL for the regular-sized image
  };
}

// Fetch options
const PER_PAGE = 10; // Number of photos per page
const PAGE = 1; // Page number (useful for pagination)

// Function to fetch image data from Unsplash
async function fetchUnsplashImages(): Promise<void> {
  try {
    const url = `${API_URL}?client_id=${ACCESS_KEY}&per_page=${PER_PAGE}&page=${PAGE}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch images: ${response.statusText}`);
    }

    const data: UnsplashImage[] = (await response.json()) as UnsplashImage[]; // Cast response to the UnsplashImage[] type

    // Extract and log image URLs
    const imageUrls = data.map((item) => item.urls.regular); // Use 'regular' size image
    console.log("Fetched Image URLs:");
    console.log(imageUrls);

    // Optionally, write the URLs to a file or use them directly in your app
  } catch (error) {
    console.error("Error fetching images from Unsplash:", error);
  }
}

// Execute the function
fetchUnsplashImages();
