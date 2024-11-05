from flask import Flask, render_template, request, jsonify
import time
import os
import markdown
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import SystemMessage,HumanMessage,AIMessage

from dotenv import load_dotenv
load_dotenv()

genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))

app = Flask(__name__)

def generate_bot_response(conversation_history):
    if len(conversation_history) == 1:
        user_query_dict = conversation_history[0]
        conversations = []
        if user_query_dict['type'] == "user":
            user_query = user_query_dict['text']
            # print(f"{user_query = }")
        else:
            print("User query not found!")
        print(f"{conversations = }")
    else:
        user_query_dict = conversation_history[-1]
        if user_query_dict['type'] == "user":
            user_query = user_query_dict['text']
            # print(f"{user_query = }")
        else:
            print("User query not found!")
        conversations = conversation_history[:-1]
        print(f"{conversations = }")

    generation_config = { "temperature": 0}    
    model = genai.GenerativeModel(model_name="gemini-1.5-flash", generation_config=generation_config)
    prompt = "You are a helpful AI assistant. User query: " + user_query
    response = model.generate_content(prompt, safety_settings={HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE})
    # response = response.text
    # return response
    response_html = markdown.markdown(response.text)
    return response_html

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/bot_response', methods=['POST'])
def bot_response():
    data = request.get_json()
    conversation_history = data.get('conversation_history', [])
    print(f"{conversation_history = }")
    if conversation_history:
        bot_response = generate_bot_response(conversation_history)
        print(f"{bot_response = }")
        return jsonify({"status": "success", "bot_message": bot_response})
    return jsonify({"status": "error", "message": "No conversation history provided."})

if __name__ == '__main__':
    app.run(debug=True)

# from flask import Flask, render_template, request, jsonify, Response
# import os
# import markdown
# from langchain_google_genai import ChatGoogleGenerativeAI
# from langchain.schema import HumanMessage
# from dotenv import load_dotenv

# load_dotenv()

# app = Flask(__name__)

# # Configure the Google Generative AI model with streaming enabled
# llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", streaming=True)

# def stream_bot_response(conversation_history):
#     # Extract the user query from the conversation history
#     if len(conversation_history) == 1:
#         user_query_dict = conversation_history[0]
#         conversations = []
#         if user_query_dict['type'] == "user":
#             user_query = user_query_dict['text']
#         else:
#             print("User query not found!")
#     else:
#         user_query_dict = conversation_history[-1]
#         if user_query_dict['type'] == "user":
#             user_query = user_query_dict['text']
#         else:
#             print("User query not found!")
#         conversations = conversation_history[:-1]

#     # Prepare the message in LangChain format
#     history_langchain_format = [HumanMessage(content=user_query)]

#     # Stream the response progressively
#     partial_message = ""
#     for response in llm.stream(history_langchain_format):
#         partial_message += response.content
#         yield markdown.markdown(partial_message)  # Convert the partial response to HTML and yield it progressively

# @app.route('/')
# def index():
#     return render_template('index.html')

# @app.route('/bot_response', methods=['POST'])
# def bot_response():
#     data = request.get_json()
#     conversation_history = data.get('conversation_history', [])
    
#     if conversation_history:
#         # Use Flask's Response object to stream data to the client
#         return Response(stream_bot_response(conversation_history), content_type='text/event-stream')
#     return jsonify({"status": "error", "message": "No conversation history provided."})

# if __name__ == '__main__':
#     app.run(debug=True)
