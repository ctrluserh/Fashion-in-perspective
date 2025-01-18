from flask import Flask, request, jsonify
from api_keys import cohere_api_key
import cohere

app = Flask(__name__)

# Initialize Cohere client
cohere_client = cohere.ClientV2(cohere_api_key)

@app.route('/')
def home():
    return "Welcome to the Flask server with Cohere!"

@app.route('/generate/<prompt>', methods=['GET'])
def generate_text(prompt):
    print(prompt)
    if not prompt:
        return "No prompt"

    response = cohere_client.chat(
        model="command-r-plus", 
        messages=[{"role": "user", "content": prompt}]
    )
    return jsonify({"response": response.message.content[0].text})

if __name__ == '__main__':
    app.run(debug=True)