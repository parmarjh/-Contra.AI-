from flask import Flask, request, jsonify
from flask_cors import CORS
from models import init_db, SessionLocal, ChatLog
from services import get_llm_service
import traceback

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes (necessary for React dev server)

# Initialize Database
init_db()

llm_service = get_llm_service()

@app.route('/api/status', methods=['GET'])
def status():
    return jsonify({"status": "ok", "service": "Contra.AI Backend"}), 200

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Invalid input: ensure JSON body is present."}), 400
            
        culture_label = data.get('culture', 'Universal')
        user_input = data.get('message', '')
        
        if not user_input.strip():
            return jsonify({"error": "Message cannot be empty."}), 400

        # Generate response using service layer
        response_text = llm_service.generate_response(culture_label, user_input)
        
        # Log interaction to Database
        try:
            session = SessionLocal()
            log = ChatLog(
                culture_label=culture_label,
                user_input=user_input,
                ai_response=response_text
            )
            session.add(log)
            session.commit()
            session.close()
        except Exception as db_err:
            print(f"Database Error: {db_err}")
            # We don't fail the request if logging fails, but we should log the error
            # Observability: In a real app, use logger.error

        return jsonify({
            "response": response_text,
            "culture": culture_label
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

@app.route('/api/history', methods=['GET'])
def update_history():
    """Retrieve chat history for observability."""
    try:
        session = SessionLocal()
        logs = session.query(ChatLog).order_by(ChatLog.timestamp.desc()).limit(50).all()
        session.close()
        return jsonify([log.to_dict() for log in logs])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
