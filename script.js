const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;

const API_URL = "";
const API_KEY = "";
const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent = className === "outgoing"
    ? `<p>${message}</p>`
    : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};

const generateResponse = (incomingChatLi) => {
  const messageElement = incomingChatLi.querySelector("p");

  fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      "model": "gpt-4-turbo",
      "messages": [
        { "role": "system", "content": "You are a helpful assistant." },
        { "role": "user", "content": userMessage }
      ]
    })
  })
    .then(res => res.json())
    .then(data => {
      messageElement.textContent = data.choices[0].message.content;
    })
    .catch((error) => {
      messageElement.textContent = "Oops! Something went wrong. Please try again.";
    });
};


const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;
  chatInput.value = "";

  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);
  chatInput.value = ""; // Clear input field

  setTimeout(() => {
    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLi);
  }, 600);
};

chatbotToggler.addEventListener("click",() => document.body.classList.toggle("show-chatbot"));
chatbotCloseBtn.addEventListener("click",() => document.body.classList.remove("show-chatbot"));
sendChatBtn.addEventListener("click", handleChat);
