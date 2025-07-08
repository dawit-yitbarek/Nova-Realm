import api from './Api';
const BackEndUrl = import.meta.env.VITE_BACKEND_URL;
import { jwtDecode } from "jwt-decode";


const isAccessTokenExpired = (accessToken) => {
  try {

    const decoded = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000; // Current time in seconds
    return decoded.exp < currentTime; // Expired if the current time is greater than the expiration time
  } catch (error) {
    console.log("error on refresh ", error)
    return true; // If decoding fails or token is invalid, consider it expired
  }
};

const checkAndRefreshToken = async () => {
  const accessToken = localStorage.getItem("accessToken");
  const isExpired = isAccessTokenExpired(accessToken)

  if ( !accessToken || isExpired) {
    try {
      // Call backend to refresh token
      const response = await api.post(`${BackEndUrl}/refresh`);

      const data = await response.data;
      if (data.newAccessToken) {
        localStorage.setItem("accessToken", data.newAccessToken);
        return true;
      } else {
        console.error("Failed to refresh access token.");
        return false;
      }
    } catch (err) {
      console.error("Error refreshing access token:", err);
      return false;
    }
  }

  return true;
};

export default checkAndRefreshToken ;


