import API_BASE_URL from "../config/apiConfig";

export const sendMessageToChatbot = async (message, context, token) => {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ message, context }),
  });

  if (!response.ok) {
    throw new Error("Chat request failed");
  }

  return response.json();
};
