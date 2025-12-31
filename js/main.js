const inputField = document.getElementById("userInput");
const messagesDiv = document.getElementById("messages");
const loader = document.getElementById("loader");
const sendBtn = document.getElementById("sendBtn");

// ✅ PON ESTO (Tu enlace de producción):
const API_URL = "https://backend-mauricia.onrender.com/chat";

inputField.addEventListener("keypress", function (event) {
  if (event.key === "Enter") sendMessage();
});

async function sendMessage() {
  const text = inputField.value.trim();
  if (!text) return;

  addMessage(text, "user");
  inputField.value = "";
  inputField.disabled = true;
  sendBtn.disabled = true;

  // Mostrar la animación de los puntitos
  loader.style.display = "block";
  scrollToBottom();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensaje: text }),
    });

    if (!response.ok) throw new Error("Error API");
    const data = await response.json();

    // Ocultar puntitos antes de mostrar respuesta
    loader.style.display = "none";
    addMessage(data.respuesta, "bot", true);
  } catch (error) {
    loader.style.display = "none";
    addMessage("⚠️ Error de conexión.", "bot");
  } finally {
    inputField.disabled = false;
    sendBtn.disabled = false;
    inputField.focus();
  }
}

function addMessage(text, sender, animate = false) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  messagesDiv.appendChild(div);

  if (sender === "bot" && animate) {
    typeWriter(div, text);
  } else {
    div.innerHTML = sender === "bot" ? marked.parse(text) : text;
    scrollToBottom();
  }
}

function typeWriter(element, text) {
  let i = 0;
  const speed = 20;
  element.innerHTML = '<span class="cursor">▌</span>';

  function type() {
    if (i < text.length) {
      element.innerHTML =
        text.substring(0, i + 1) + '<span class="cursor">▌</span>';
      i++;
      scrollToBottom();
      setTimeout(type, speed);
    } else {
      element.innerHTML = marked.parse(text);
      scrollToBottom();
    }
  }
  type();
}

function scrollToBottom() {
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
