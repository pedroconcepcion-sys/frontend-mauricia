const inputField = document.getElementById("userInput");
const messagesDiv = document.getElementById("messages");
const loader = document.getElementById("loader");
const sendBtn = document.getElementById("sendBtn");

const API_URL = "https://backend-mauricia.onrender.com/chat";
//const API_URL = "http://127.0.0.1:8000/chat";

inputField.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
    const text = inputField.value.trim();
    if (!text) return;

    // 1. Mostrar mensaje del usuario
    addMessage(text, "user");
    inputField.value = "";
    inputField.disabled = true;
    sendBtn.disabled = true;

    // 2. Mostrar loader
    loader.style.display = "block";
    scrollToBottom();

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mensaje: text }),
        });

        if (!response.ok) throw new Error("Error en la respuesta del servidor");
        
        const data = await response.json();
        loader.style.display = "none";

        // 3. Mostrar respuesta de MauricIA con efecto máquina de escribir
        addMessage(data.respuesta, "bot", true);

    } catch (error) {
        loader.style.display = "none";
        addMessage("⚠️ Lo siento, no pude conectarme. El servidor podría estar despertando, intenta de nuevo en unos segundos.", "bot");
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
        // Usar marked para parsear Markdown (negritas, listas, etc)
        div.innerHTML = sender === "bot" ? marked.parse(text) : text;
        scrollToBottom();
    }
}

function typeWriter(element, text) {
    let i = 0;
    const speed = 15; // Velocidad en ms
    
    function type() {
        if (i < text.length) {
            element.innerHTML = text.substring(0, i + 1) + '<span class="cursor">▌</span>';
            i++;
            scrollToBottom();
            setTimeout(type, speed);
        } else {
            element.innerHTML = marked.parse(text); // Al terminar, renderiza Markdown completo
            scrollToBottom();
        }
    }
    type();
}

function scrollToBottom() {
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}