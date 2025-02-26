import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from openai import OpenAI

# Load API key from .env file
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

# Ensure API key is set
if not api_key:
    raise ValueError("API key not found! Make sure it's in the .env file.")

# Initialize OpenAI client
client = OpenAI(api_key=api_key)

# Set up Flask app
app = Flask(__name__)

# Disaster relief chatbot function
def get_disaster_response(user_input):
    system_prompt = (
        "You are a disaster relief chatbot. Provide accurate emergency information, "
        "evacuation guidelines, and disaster preparedness tips. If the query is unrelated to disasters, "
        "kindly redirect the user to focus on emergency response."
    )

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_input}
        ]
    )

    return response.choices[0].message.content.strip()

# API route to handle chatbot messages
@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "")

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    bot_response = get_disaster_response(user_message)
    return jsonify({"response": bot_response})

# Run the Flask server
if __name__ == "__main__":
    app.run(debug=True)
