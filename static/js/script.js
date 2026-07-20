

// ===============================
// DOM Elements
// ===============================

const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const themeToggle = document.getElementById("themeToggle");
const typing = document.getElementById("typing");

// ===============================
// Theme
// ===============================

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {

    document.body.classList.add("light");
    themeToggle.textContent = "☀️";

}else{

    themeToggle.textContent = "🌙";

}

themeToggle.addEventListener("click",()=>{

    document.body.classList.toggle("light");

    if(document.body.classList.contains("light")){

        themeToggle.textContent="☀️";
        localStorage.setItem("theme","light");

    }else{

        themeToggle.textContent="🌙";
        localStorage.setItem("theme","dark");

    }

});

// ===============================
// Auto Resize Textarea
// ===============================

userInput.addEventListener("input",()=>{

    userInput.style.height="auto";
    userInput.style.height=userInput.scrollHeight+"px";

});

// ===============================
// Enter To Send
// ===============================

userInput.addEventListener("keydown",(e)=>{

    if(e.key==="Enter" && !e.shiftKey){

        e.preventDefault();

        sendMessage();

    }

});

// ===============================
// Send Button
// ===============================

sendBtn.addEventListener("click",()=>{

    sendMessage();

});

// ===============================
// Auto Scroll
// ===============================

function scrollBottom(){

    chatBox.scrollTop=chatBox.scrollHeight;

}

// ===============================
// Typing Indicator
// ===============================

function showTyping(){

    typing.classList.remove("hidden");

    scrollBottom();

}

function hideTyping(){

    typing.classList.add("hidden");

}
/*====================================================
    MESSAGE FUNCTIONS
====================================================*/

// ===============================
// Create Message
// ===============================

function createMessage(role, message){

    const messageDiv = document.createElement("div");

    messageDiv.className = `message ${role}`;


    // Avatar
    const avatar = document.createElement("div");

    avatar.className = "avatar";

    avatar.innerHTML = role === "user" ? "👤" : "🤖";


    // Bubble
    const bubble = document.createElement("div");

    bubble.className = "bubble";


    // AI Message
    if(role === "ai"){

        bubble.innerHTML = marked.parse(message);

    }

    // User Message
    else{

        bubble.textContent = message;

    }


    messageDiv.appendChild(avatar);

    messageDiv.appendChild(bubble);

    chatBox.appendChild(messageDiv);

    scrollBottom();


    // Add Copy Buttons
    if(role === "ai"){

        addCopyButtons(bubble);

    }

}



// ===============================
// Copy Button
// ===============================

function addCopyButtons(container){

    const codeBlocks = container.querySelectorAll("pre");

    codeBlocks.forEach((block)=>{

        const button = document.createElement("button");

        button.className = "copy-btn";

        button.innerText = "Copy";


        button.addEventListener("click",()=>{

            const code = block.querySelector("code");

            navigator.clipboard.writeText(code.innerText);

            button.innerText = "Copied ✓";

            setTimeout(()=>{

                button.innerText = "Copy";

            },1500);

        });


        block.prepend(button);

    });

}



// ===============================
// Loading Message
// ===============================

function showLoading(){

    showTyping();

}

function hideLoading(){

    hideTyping();

}



// ===============================
// Clear Input
// ===============================

function clearInput(){

    userInput.value="";

    userInput.style.height="auto";

}



// ===============================
// Disable Send
// ===============================

function disableSend(){

    sendBtn.disabled=true;

    sendBtn.style.opacity=".6";

}



// ===============================
// Enable Send
// ===============================

function enableSend(){

    sendBtn.disabled=false;

    sendBtn.style.opacity="1";

}
/*====================================================
    GEMINI API COMMUNICATION
====================================================*/

// ===============================
// Send Message
// ===============================

async function sendMessage(){

    const message = userInput.value.trim();

    if(message === "") return;

    // Add User Message
    createMessage("user", message);

    // Clear Input
    clearInput();

    // Disable Button
    disableSend();

    // Show Typing Animation
    showLoading();

    try{

        const response = await fetch("/chat",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                message:message

            })

        });


        if(!response.ok){

            throw new Error("Server Error");

        }


        const data = await response.json();


        hideLoading();

        enableSend();


        createMessage(

            "ai",

            data.reply

        );

    }

    catch(error){

        hideLoading();

        enableSend();

        console.error(error);

        createMessage(

            "ai",

            `⚠️ Sorry, something went wrong.

Please check:

• Internet Connection

• Flask Server

• Gemini API Key

• Console Errors`

        );

    }

}



// ===============================
// Initial Scroll
// ===============================

window.addEventListener("load",()=>{

    scrollBottom();

});



// ===============================
// Focus Input
// ===============================

window.addEventListener("load",()=>{

    userInput.focus();

});



// ===============================
// Prevent Empty Spaces
// ===============================

userInput.addEventListener("paste",()=>{

    setTimeout(()=>{

        userInput.style.height="auto";

        userInput.style.height=userInput.scrollHeight+"px";

    },10);

});



// ===============================
// Auto Focus After Reply
// ===============================

chatBox.addEventListener("click",()=>{

    userInput.focus();

});



// ===============================
// Escape Key
// ===============================

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        userInput.blur();

    }

});
