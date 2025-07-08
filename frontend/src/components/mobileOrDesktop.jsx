import api from "./Api";
const BackEndUrl = import.meta.env.VITE_BACKEND_URL;

const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
console.log("the device detector ", navigator.userAgent); 

async function CheckDevice() {
    if (isMobile()) {
        console.log("The device is mobile")
        try {
            const token = localStorage.getItem("accessToken");
            const response = await api.get(`${BackEndUrl}/get-wallet-address`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
            const address = response.data?.address || null;
            return {
                desktop: false,
                address,
            };
        } catch (error) {
            console.error("Error fetching wallet address:", error);
            return {
                desktop: false,
                address: null,
            };
        }
    } else {
        console.log("The device is desktop")
        return {
            desktop: true,
            address: null,
        };
    }
}

export default CheckDevice;
