let prompt = document.querySelector("#prompt");
let submitbtn = document.querySelector("#submit");
let chatContainer = document.querySelector(".chat-container");
let imagebtn = document.querySelector("#image");
let image = document.querySelector("#image img");
let imageinput = document.querySelector("#image input");
let loader = document.getElementById('loader');

const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyD0D1GTwjqmY7RlizcHuyFivlzEKAIqdAo";

const system_prompt = "You are Mitra, an AI chatbot designed to assist in disaster management. Your goal is to provide real-time information, emergency response guidance, resource allocation help, and crisis communication support.";

let user = {
    message: null,
    file: {
        mime_type: null,
        data: null
    }
};

async function generateResponse(aiChatBox) {
    let text = aiChatBox.querySelector(".ai-chat-area");
    let RequestOption = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "contents": [
                {
                    "parts": [
                        { "text": system_prompt },
                        { "text": user.message },
                        ...(user.file.data ? [{ "inline_data": user.file }] : [])
                    ]
                }
            ]
        })
    };
    try {
        let response = await fetch(Api_Url, RequestOption);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json();
        console.log("API Response:", data);

        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
            let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
            text.innerHTML = apiResponse;
        } else {
            text.innerHTML = "Sorry, I couldn't process your request.";
        }
    } catch (error) {
        console.error("Error generating response:", error);
        text.innerHTML = "Sorry, I couldn't process your request.";
    } finally {
        loader.style.display = 'none';
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
        image.src = `img.svg`;
        image.classList.remove("choose");
        user.file = {};
    }
}

function createChatBox(html, classes) {
    let div = document.createElement("div");
    div.innerHTML = html;
    div.classList.add(classes);
    return div;
}

function handleChatResponse(message) {
    user.message = message;

    let userHtml = `<img src="user-image.png" width="65" id="user-image">
        <br><br><br><br>
        <div class="user-chat-area">
            ${message}
            ${user.file.data ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />` : ""}
        </div>`;
    prompt.value = "";
    let userChatBox = createChatBox(userHtml, "user-chat-box");
    userChatBox.style.display = 'block';
    chatContainer.appendChild(userChatBox);
    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });

    setTimeout(() => {
        let aiHtml = `<img src="ai-image.png" width="65" id="ai-image" />
        <br><br><br><br>
        <div class="ai-chat-area"></div>`;
        let aiChatBox = createChatBox(aiHtml, "ai-chat-box");
        chatContainer.appendChild(aiChatBox);

        loader.style.display = 'block';
        generateResponse(aiChatBox);
    }, 600);
}

prompt.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        let message = prompt.value;
        if (message.trim() !== "") {
            handleChatResponse(message);
        }
    }
});

submitbtn.addEventListener("click", () => {
    let message = prompt.value;
    if (message.trim() !== "") {
        handleChatResponse(message);
    }
});

imageinput.addEventListener("change", () => {
    const file = imageinput.files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = (e) => {
        let base64string = e.target.result.split(",")[1];
        user.file = {
            mime_type: file.type,
            data: base64string
        };
        image.src = `data:${user.file.mime_type};base64,${user.file.data}`;
        image.classList.add("choose");
    };
    reader.readAsDataURL(file);
});

imagebtn.addEventListener("click", () => {
    imagebtn.querySelector("input").click();
});
