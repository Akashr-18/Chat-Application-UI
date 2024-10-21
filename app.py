from flask import Flask, render_template, request, jsonify
import time

app = Flask(__name__)

# Example bot response logic that uses the entire conversation history
def generate_bot_response(conversation_history):

    if len(conversation_history) == 1:
        print("****First user query****")
        user_query_dict = conversation_history[0]
        conversations = []
        if user_query_dict['type'] == "user":
            user_query = user_query_dict['text']
            print(f"{user_query = }")
        else:
            print("User query not found!")
        print(f"{conversations = }")
    else:
        print("****Consecutive user query****")
        user_query_dict = conversation_history[-1]
        if user_query_dict['type'] == "user":
            user_query = user_query_dict['text']
            print(f"{user_query = }")
        else:
            print("User query not found!")
        conversations = conversation_history[:-1]
        print(f"{conversations = }")

    time.sleep(10)
    response_text = "Response will be provided shortly....."

    return response_text

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/bot_response', methods=['POST'])
def bot_response():
    data = request.get_json()  # Get the JSON data sent from the client
    conversation_history = data.get('conversation_history', [])

    print(f"{conversation_history = }")

    if conversation_history:
        # Generate response using the entire conversation history
        bot_response = generate_bot_response(conversation_history)

        # Return the bot's response
        return jsonify({"status": "success", "bot_message": bot_response})
    
    return jsonify({"status": "error", "message": "No conversation history provided."})

if __name__ == '__main__':
    app.run(debug=True)
