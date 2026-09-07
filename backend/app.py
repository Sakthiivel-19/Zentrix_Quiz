from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)


# ==============================================================================
# SUBMISSION STORAGE
# ==============================================================================

SUBMISSIONS_FILE = os.path.join(
    os.path.dirname(__file__),
    "submissions.json"
)


def load_submissions():
    if not os.path.exists(SUBMISSIONS_FILE):
        return []

    try:
        with open(
            SUBMISSIONS_FILE,
            "r",
            encoding="utf-8"
        ) as file:
            return json.load(file)

    except (json.JSONDecodeError, OSError):
        return []


def save_submissions(submissions):
    with open(
        SUBMISSIONS_FILE,
        "w",
        encoding="utf-8"
    ) as file:
        json.dump(
            submissions,
            file,
            indent=4
        )


# ==============================================================================
# 20 OFFICIAL QUIZ QUESTIONS
# ==============================================================================

QUESTIONS = [
    {
        "id": 1,
        "category": "Programming",
        "question": """What is the output of the following C code?

int x = 5;
printf("%d", x++ + ++x);""",
        "options": {
            "A": "25",
            "B": "30",
            "C": "36",
            "D": "Undefined behavior"
        },
        "answer": "D"
    },
    {
        "id": 2,
        "category": "Programming",
        "question": "Which Python data structure provides average O(1) lookup by key?",
        "options": {
            "A": "List",
            "B": "Tuple",
            "C": "Dictionary",
            "D": "Set"
        },
        "answer": "C"
    },
    {
        "id": 3,
        "category": "Programming",
        "question": """What is the output?

x = [1, 2, 3]
y = x
y.append(4)
print(x)""",
        "options": {
            "A": "[1, 2, 3]",
            "B": "[4]",
            "C": "[1, 2, 3, 4]",
            "D": "Error"
        },
        "answer": "C"
    },
    {
        "id": 4,
        "category": "Programming",
        "question": "Which principle states that a class should have only one reason to change?",
        "options": {
            "A": "Open/Closed Principle",
            "B": "Single Responsibility Principle",
            "C": "Dependency Inversion Principle",
            "D": "Interface Segregation Principle"
        },
        "answer": "B"
    },
    {
        "id": 5,
        "category": "Programming",
        "question": "Which of the following is generally considered a compiled language?",
        "options": {
            "A": "Python",
            "B": "JavaScript",
            "C": "C",
            "D": "HTML"
        },
        "answer": "C"
    },
    {
        "id": 6,
        "category": "Data Structures",
        "question": "Which data structure is most suitable for implementing Breadth-First Search (BFS)?",
        "options": {
            "A": "Stack",
            "B": "Queue",
            "C": "Heap",
            "D": "Hash table"
        },
        "answer": "B"
    },
    {
        "id": 7,
        "category": "Data Structures",
        "question": "What is the worst-case time complexity of Quick Sort?",
        "options": {
            "A": "O(n)",
            "B": "O(log n)",
            "C": "O(n log n)",
            "D": "O(n²)"
        },
        "answer": "D"
    },
    {
        "id": 8,
        "category": "Data Structures",
        "question": "Which traversal of a Binary Search Tree produces values in sorted order?",
        "options": {
            "A": "Preorder",
            "B": "Postorder",
            "C": "Inorder",
            "D": "Level order"
        },
        "answer": "C"
    },
    {
        "id": 9,
        "category": "Data Structures",
        "question": "What is the space complexity of an adjacency matrix for a graph with V vertices?",
        "options": {
            "A": "O(V)",
            "B": "O(log V)",
            "C": "O(V²)",
            "D": "O(E)"
        },
        "answer": "C"
    },
    {
        "id": 10,
        "category": "Data Structures",
        "question": "Dynamic Programming primarily relies on which two properties?",
        "options": {
            "A": "Recursion and hashing",
            "B": "Overlapping subproblems and optimal substructure",
            "C": "Sorting and searching",
            "D": "Graphs and trees"
        },
        "answer": "B"
    },
    {
        "id": 11,
        "category": "DBMS",
        "question": "Which normal form eliminates partial dependency?",
        "options": {
            "A": "1NF",
            "B": "2NF",
            "C": "3NF",
            "D": "BCNF"
        },
        "answer": "B"
    },
    {
        "id": 12,
        "category": "DBMS",
        "question": """Consider the query:

SELECT department, COUNT(*)
FROM employees
GROUP BY department;

What does this query return?""",
        "options": {
            "A": "Total number of employees only",
            "B": "Number of employees in each department",
            "C": "Departments containing one employee",
            "D": "Employee names grouped alphabetically"
        },
        "answer": "B"
    },
    {
        "id": 13,
        "category": "DBMS",
        "question": "Which SQL clause is used to filter groups after GROUP BY?",
        "options": {
            "A": "WHERE",
            "B": "ORDER BY",
            "C": "HAVING",
            "D": "DISTINCT"
        },
        "answer": "C"
    },
    {
        "id": 14,
        "category": "DBMS",
        "question": "Which JOIN returns only rows having matching values in both tables?",
        "options": {
            "A": "LEFT JOIN",
            "B": "RIGHT JOIN",
            "C": "FULL OUTER JOIN",
            "D": "INNER JOIN"
        },
        "answer": "D"
    },
    {
        "id": 15,
        "category": "DBMS",
        "question": "What is the primary purpose of an index in a relational database?",
        "options": {
            "A": "Reduce table size",
            "B": "Improve data retrieval performance",
            "C": "Encrypt database records",
            "D": "Prevent all duplicate values"
        },
        "answer": "B"
    },
    {
        "id": 16,
        "category": "AI/ML",
        "question": "A model performs extremely well on training data but poorly on unseen test data. What is the most likely problem?",
        "options": {
            "A": "Underfitting",
            "B": "Overfitting",
            "C": "Normalization",
            "D": "Data augmentation"
        },
        "answer": "B"
    },
    {
        "id": 17,
        "category": "AI/ML",
        "question": "In binary classification, which metric is defined as:\nTP / (TP + FP)?",
        "options": {
            "A": "Recall",
            "B": "Accuracy",
            "C": "Precision",
            "D": "F1-score"
        },
        "answer": "C"
    },
    {
        "id": 18,
        "category": "AI/ML",
        "question": "Which activation function is most commonly used in hidden layers of modern deep neural networks because it helps mitigate the vanishing-gradient problem compared with sigmoid?",
        "options": {
            "A": "ReLU",
            "B": "Softmax",
            "C": "Linear",
            "D": "Step function"
        },
        "answer": "A"
    },
    {
        "id": 19,
        "category": "AI/ML",
        "question": "Which learning approach uses labeled training data?",
        "options": {
            "A": "Supervised learning",
            "B": "Unsupervised learning",
            "C": "Reinforcement learning",
            "D": "Self-organizing learning"
        },
        "answer": "A"
    },
    {
        "id": 20,
        "category": "AI/ML",
        "question": "In K-Means clustering, what does 'K' represent?",
        "options": {
            "A": "Number of features",
            "B": "Number of iterations only",
            "C": "Number of clusters",
            "D": "Number of training samples"
        },
        "answer": "C"
    }
]


# ==============================================================================
# GET QUESTIONS
# ==============================================================================

@app.route("/api/questions", methods=["GET"])
def get_questions():

    # Never send correct answers to participant.
    public_questions = []

    for q in QUESTIONS:
        public_questions.append({
            "id": q["id"],
            "category": q["category"],
            "question": q["question"],
            "options": q["options"]
        })

    return jsonify(public_questions)


# ==============================================================================
# SUBMIT QUIZ
# ==============================================================================

@app.route("/api/submit", methods=["POST"])
def submit_quiz():

    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "success": False,
            "message": "No submission data received"
        }), 400


    # Accept selectedAnswers from current frontend.
    answers = data.get("answers")

    if answers is None:
        answers = data.get(
            "selectedAnswers",
            {}
        )


    if not isinstance(answers, dict):
        answers = {}


    # --------------------------------------------------------------------------
    # Calculate score
    # --------------------------------------------------------------------------

    score = 0
    correct = 0

    for q in QUESTIONS:

        question_id = str(q["id"])

        selected_answer = answers.get(
            question_id
        )

        if selected_answer == q["answer"]:

            correct += 1
            score += 5


    total = len(QUESTIONS)


    wrong = sum(
        1
        for q in QUESTIONS
        if str(q["id"]) in answers
        and answers.get(str(q["id"])) != q["answer"]
    )


    unanswered = total - correct - wrong


    # --------------------------------------------------------------------------
    # Participant information
    # --------------------------------------------------------------------------

    participant_name = data.get(
        "participantName",
        "Unknown"
    )

    participant_id = data.get(
        "participantId",
        "Unknown"
    )


    # --------------------------------------------------------------------------
    # Create submission record
    # --------------------------------------------------------------------------

    submission = {

        "participantName":
            participant_name,

        "participantId":
            participant_id,

        "selectedAnswers":
            answers,

        "startTime":
            data.get("startTime"),

        "submissionTime":
            data.get("submissionTime"),

        "timeTakenSeconds":
            data.get(
                "timeTakenSeconds",
                0
            ),

        "tabSwitchViolations":
            data.get(
                "tabSwitchViolations",
                0
            ),

        "submissionStatus":
            data.get(
                "submissionStatus",
                "Submitted"
            ),

        "score":
            score,

        "maxScore":
            total * 5,

        "correct":
            correct,

        "wrong":
            wrong,

        "unanswered":
            unanswered,

        "total":
            total,

        "percentage":
            score
    }


    # --------------------------------------------------------------------------
    # Save submission
    # --------------------------------------------------------------------------

    submissions = load_submissions()

    # If the same participant ID submits again,
    # replace their previous submission.
    submissions = [
        existing
        for existing in submissions
        if existing.get("participantId")
        != participant_id
    ]

    submissions.append(submission)

    save_submissions(submissions)


    # --------------------------------------------------------------------------
    # Return result to participant
    # --------------------------------------------------------------------------

    return jsonify({

        "success": True,

        "score":
            score,

        "maxScore":
            total * 5,

        "correct":
            correct,

        "wrong":
            wrong,

        "unanswered":
            unanswered,

        "total":
            total,

        "percentage":
            score,

        "message":
            "Quiz submitted successfully"
    })


# ==============================================================================
# ADMIN - GET ALL PARTICIPANTS
# ==============================================================================

@app.route(
    "/api/admin/participants",
    methods=["GET"]
)
def get_admin_participants():

    submissions = load_submissions()

    participants = []

    for submission in submissions:

        participants.append({

            "participantName":
                submission.get(
                    "participantName",
                    ""
                ),

            "participantId":
                submission.get(
                    "participantId",
                    ""
                ),

            "score":
                submission.get(
                    "score",
                    0
                ),

            "maxScore":
                submission.get(
                    "maxScore",
                    100
                ),

            "correct":
                submission.get(
                    "correct",
                    0
                ),

            "wrong":
                submission.get(
                    "wrong",
                    0
                ),

            "unanswered":
                submission.get(
                    "unanswered",
                    0
                ),

            "total":
                submission.get(
                    "total",
                    len(QUESTIONS)
                ),

            "timeTakenSeconds":
                submission.get(
                    "timeTakenSeconds",
                    0
                ),

            "tabSwitchViolations":
                submission.get(
                    "tabSwitchViolations",
                    0
                ),

            "submissionStatus":
                submission.get(
                    "submissionStatus",
                    "Submitted"
                ),

            "submissionTime":
                submission.get(
                    "submissionTime"
                )
        })

    return jsonify({
        "success": True,
        "participants": participants
    })


# ==============================================================================
# ADMIN - GET ONE PARTICIPANT DETAILS
# ==============================================================================

@app.route(
    "/api/admin/participants/<participant_id>",
    methods=["GET"]
)
def get_participant_details(participant_id):

    submissions = load_submissions()

    for submission in submissions:

        if str(
            submission.get("participantId")
        ) == str(participant_id):

            return jsonify({
                "success": True,
                "participant": submission
            })


    return jsonify({
        "success": False,
        "message": "Participant not found"
    }), 404


# ==============================================================================
# ==============================================================================
# ADMIN - CLEAR ALL TEST SUBMISSIONS
# ==============================================================================

@app.route(
    "/api/admin/clear-test-data",
    methods=["DELETE"]
)
def clear_test_data():

    save_submissions([])

    return jsonify({
        "success": True,
        "message": "All test submissions cleared"
    })




# RUN SERVER
# ==============================================================================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )