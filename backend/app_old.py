from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Temporary questions
# IMPORTANT: answers stay on the backend.
QUESTIONS = [
    {
        "id": 1,
        "question": "What does AI stand for?",
        "options": {
            "A": "Artificial Intelligence",
            "B": "Automated Internet",
            "C": "Advanced Information",
            "D": "Artificial Interface"
        },
        "answer": "A"
    },
    {
        "id": 2,
        "question": "Which language is commonly used for AI and Machine Learning?",
        "options": {
            "A": "HTML",
            "B": "Python",
            "C": "CSS",
            "D": "XML"
        },
        "answer": "B"
    }
]


# Send questions to the frontend WITHOUT answers
@app.route("/api/questions", methods=["GET"])
def get_questions():
    public_questions = []

    for q in QUESTIONS:
        public_questions.append({
            "id": q["id"],
            "question": q["question"],
            "options": q["options"]
        })

    return jsonify(public_questions)


# Receive answers and calculate score on the server
@app.route("/api/submit", methods=["POST"])
def submit_quiz():
    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "No submission data received"
        }), 400

    answers = data.get("answers", {})

    score = 0

    for q in QUESTIONS:
        question_id = str(q["id"])
        selected_answer = answers.get(question_id)

        if selected_answer == q["answer"]:
            score += 1

    return jsonify({
        "success": True,
        "score": score,
        "total": len(QUESTIONS),
        "message": "Quiz submitted successfully"
    })


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)