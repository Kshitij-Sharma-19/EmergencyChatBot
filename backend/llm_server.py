from flask import Flask, request, jsonify
from huggingface_hub import InferenceClient
import requests  # Make sure to import requests
import os
from langchain_community.llms import CTransformers  # Ensure you have this import for CTransformers

app = Flask(__name__)

def get_llama_response(prompt: str):
    """Generate a response from the LLaMA 2 model using a single prompt."""
    
    # Load the local LLaMA 2 model
    llm = CTransformers(model='models/llama-2-7b-chat.ggmlv3.q2_K.bin',
                        model_type='llama',
                        config={'max_new_tokens': 256,
                                'temperature': 0.01})

    # Generate the response from the LLaMA 2 model
    response = llm(prompt)
    print(response)
    return response

@app.route('/api/chat', methods=['POST'])
def chat():
    user_message = request.json.get("message")

    if not user_message:
        return jsonify({"reply": "Message cannot be empty."}), 400

    # Use the user message as the prompt for the LLaMA model
    bot_reply = get_llama_response(user_message)

    return jsonify({"reply": bot_reply})

if __name__ == '__main__':
    app.run(debug=True)
