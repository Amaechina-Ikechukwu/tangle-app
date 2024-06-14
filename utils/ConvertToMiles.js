function ConvertToMiles({ currentuserlocation, matchlocation }) {
  const lat1 = parseFloat(currentuserlocation.lat);
  const lon1 = parseFloat(currentuserlocation.lng);
  const lat2 = parseFloat(matchlocation.lat);
  const lon2 = parseFloat(matchlocation.lng);

  const R = 3958.8; // Radius of the Earth in miles
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}
export default ConvertToMiles;
