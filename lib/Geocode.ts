export async function geocodeAddress(
  address: string
): Promise<{ latitude: number; longitude: number } | null> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const encodedAddress = encodeURIComponent(address);
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${token}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.features && data.features.length > 0) {
      // Mapbox returns [longitude, latitude]
      const [longitude, latitude] = data.features[0].center;
      return { latitude, longitude };
    }
  } catch (error) {
    console.error("Geocoding error:", error);
  }
  return null;
}
