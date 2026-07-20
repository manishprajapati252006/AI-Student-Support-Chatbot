from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from groq import Groq
import os

# ==========================================
# Load Environment Variables
# ==========================================

load_dotenv()

API_KEY = os.getenv("GROQ_API_KEY")

if not API_KEY:
    raise ValueError("GROQ_API_KEY not found in .env")

# ==========================================
# Groq Client
# ==========================================

client = Groq(api_key=API_KEY)

MODEL = "llama-3.3-70b-versatile"

# ==========================================
# Flask App
# ==========================================

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "reply": "No message received."
            })

        user_message = data.get("message", "").strip()

        if user_message == "":
            return jsonify({
                "reply": "Please type a message."
            })

        completion = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "system",
                    "content": """
You are AI Student Support Assistant.

You help students with:

• Programming
• Python
• Java
• C++
• DSA
• Web Development
• AI
• Machine Learning
• Deep Learning
• College Subjects
• Interview Preparation
• Resume
• Projects
• Career Guidance

Always explain in simple language.

If code is requested:

1. Explain first.
2. Give clean code.
3. Explain the code.
4. Mention time complexity if applicable.
"""
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ],
            temperature=0.7,
            max_tokens=1024
        )

        answer = completion.choices[0].message.content

        return jsonify({
            "reply": answer
        })

    except Exception as e:
        print(e)

        return jsonify({
            "reply": f"Error: {str(e)}"
        })


@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "reply": "Page not found."
    }), 404


@app.errorhandler(500)
def internal(error):
    return jsonify({
        "reply": "Internal server error."
    }), 500


if __name__ == "__main__":
    app.run(debug=True)