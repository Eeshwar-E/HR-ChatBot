export const sendMessageToChatbot = async (message, context, token) => {
  const response = await fetch('http://localhost:5000/chat', {
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
