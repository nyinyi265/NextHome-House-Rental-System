import api from "../config/api";

async function sendMessage(data) {
  const response = await fetch(api.messages(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const err = await response.json();
    throw err;
  }
  
  return response.json();
}

const publicService = {
  sendMessage,
};
export default publicService;