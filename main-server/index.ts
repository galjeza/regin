import axios from "axios";

const phoneIp = "100.76.185.78";
const url = `http://${phoneIp}:8080/sms`;

axios.post(url, {
  to: "+38640123456",
  msg: "Test message from Axios"
})
  .then((res) => {
    console.log("✅ SMS server responded:", res.data);
  })
  .catch((err) => {
    console.error("❌ Failed to send SMS:", err.response?.data || err.message);
  });
