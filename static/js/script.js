/*====================================================
    AI Student Support Chatbot
    script.js
====================================================*/

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



// ===============================
// End of Part 3
// ===============================
/*====================================================
    PREMIUM FEATURES
====================================================*/

// ===============================
// Smooth Message Animation
// ===============================

function animateLatestMessage(){

    const messages = document.querySelectorAll(".message");

    if(messages.length===0) return;

    const latest = messages[messages.length-1];

    latest.animate(

        [

            {
                opacity:0,
                transform:"translateY(20px)"
            },

            {
                opacity:1,
                transform:"translateY(0)"
            }

        ],

        {

            duration:350,
            easing:"ease-out"

        }

    );

}



// ===============================
// Observe New Messages
// ===============================

const observer = new MutationObserver(()=>{

    animateLatestMessage();

    scrollBottom();

});

observer.observe(chatBox,{

    childList:true

});



// ===============================
// Theme Icon Animation
// ===============================

themeToggle.addEventListener("click",()=>{

    themeToggle.animate(

        [

            {

                transform:"rotate(0deg) scale(1)"

            },

            {

                transform:"rotate(180deg) scale(1.2)"

            },

            {

                transform:"rotate(360deg) scale(1)"

            }

        ],

        {

            duration:450

        }

    );

});



// ===============================
// Button Click Animation
// ===============================

sendBtn.addEventListener("mousedown",()=>{

    sendBtn.style.transform="scale(.92)";

});

sendBtn.addEventListener("mouseup",()=>{

    sendBtn.style.transform="scale(1)";

});

sendBtn.addEventListener("mouseleave",()=>{

    sendBtn.style.transform="scale(1)";

});



// ===============================
// Placeholder Animation
// ===============================

const placeholders=[

    "Ask anything...",

    "Explain Machine Learning...",

    "Write Python code...",

    "Explain DBMS...",

    "Help with DSA...",

    "Ask your AI Assistant..."

];

let placeholderIndex=0;

setInterval(()=>{

    placeholderIndex++;

    if(placeholderIndex>=placeholders.length){

        placeholderIndex=0;

    }

    userInput.placeholder=placeholders[placeholderIndex];

},4000);



// ===============================
// Welcome Console
// ===============================

console.log(

`=========================================

AI Student Support Chatbot

Frontend Loaded Successfully

=========================================`

);



// ===============================
// Prevent Double Click
// ===============================

let busy=false;

const originalSend=sendMessage;

sendMessage=async function(){

    if(busy) return;

    busy=true;

    try{

        await originalSend();

    }

    finally{

        busy=false;

    }

};



// ===============================
// End of File
// ===============================

console.log("script.js loaded successfully.");