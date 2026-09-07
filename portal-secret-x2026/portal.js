// ==========================================
// QUIZ ADMIN - JAVASCRIPT
// ==========================================

const API_BASE = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") && (window.location.port === "5500" || window.location.port === "8000" || window.location.port === "3000")
    ? "http://127.0.0.1:5000"
    : "";

// Mock admin login credentials
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "QuizAdmin@2026";


// ==========================================
// 20 OFFICIAL QUESTIONS
// ==========================================

const questions = [
    {
        id: 1,
        category: "Programming",
        question: `What is the output of the following C code?

int x = 5;
printf("%d", x++ + ++x);`,

        options: {
            A: "25",
            B: "30",
            C: "36",
            D: "Undefined behavior"
        },

        correctAnswer: "D"
    },

    {
        id: 2,
        category: "Programming",
        question: "Which Python data structure provides average O(1) lookup by key?",

        options: {
            A: "List",
            B: "Tuple",
            C: "Dictionary",
            D: "Set"
        },

        correctAnswer: "C"
    },

    {
        id: 3,
        category: "Programming",
        question: `What is the output?

x = [1, 2, 3]
y = x
y.append(4)
print(x)`,

        options: {
            A: "[1, 2, 3]",
            B: "[4]",
            C: "[1, 2, 3, 4]",
            D: "Error"
        },

        correctAnswer: "C"
    },

    {
        id: 4,
        category: "Programming",
        question: "Which principle states that a class should have only one reason to change?",

        options: {
            A: "Open/Closed Principle",
            B: "Single Responsibility Principle",
            C: "Dependency Inversion Principle",
            D: "Interface Segregation Principle"
        },

        correctAnswer: "B"
    },

    {
        id: 5,
        category: "Programming",
        question: "Which of the following is generally considered a compiled language?",

        options: {
            A: "Python",
            B: "JavaScript",
            C: "C",
            D: "HTML"
        },

        correctAnswer: "C"
    },

    {
        id: 6,
        category: "Data Structures",
        question: "Which data structure is most suitable for implementing Breadth-First Search (BFS)?",

        options: {
            A: "Stack",
            B: "Queue",
            C: "Heap",
            D: "Hash table"
        },

        correctAnswer: "B"
    },

    {
        id: 7,
        category: "Data Structures",
        question: "What is the worst-case time complexity of Quick Sort?",

        options: {
            A: "O(n)",
            B: "O(log n)",
            C: "O(n log n)",
            D: "O(n²)"
        },

        correctAnswer: "D"
    },

    {
        id: 8,
        category: "Data Structures",
        question: "Which traversal of a Binary Search Tree produces values in sorted order?",

        options: {
            A: "Preorder",
            B: "Postorder",
            C: "Inorder",
            D: "Level order"
        },

        correctAnswer: "C"
    },

    {
        id: 9,
        category: "Data Structures",
        question: "What is the space complexity of an adjacency matrix for a graph with V vertices?",

        options: {
            A: "O(V)",
            B: "O(log V)",
            C: "O(V²)",
            D: "O(E)"
        },

        correctAnswer: "C"
    },

    {
        id: 10,
        category: "Data Structures",
        question: "Dynamic Programming primarily relies on which two properties?",

        options: {
            A: "Recursion and hashing",
            B: "Overlapping subproblems and optimal substructure",
            C: "Sorting and searching",
            D: "Graphs and trees"
        },

        correctAnswer: "B"
    },

    {
        id: 11,
        category: "DBMS",
        question: "Which normal form eliminates partial dependency?",

        options: {
            A: "1NF",
            B: "2NF",
            C: "3NF",
            D: "BCNF"
        },

        correctAnswer: "B"
    },

    {
        id: 12,
        category: "DBMS",
        question: `Consider the query:

SELECT department, COUNT(*)
FROM employees
GROUP BY department;

What does this query return?`,

        options: {
            A: "Total number of employees only",
            B: "Number of employees in each department",
            C: "Departments containing one employee",
            D: "Employee names grouped alphabetically"
        },

        correctAnswer: "B"
    },

    {
        id: 13,
        category: "DBMS",
        question: "Which SQL clause is used to filter groups after GROUP BY?",

        options: {
            A: "WHERE",
            B: "ORDER BY",
            C: "HAVING",
            D: "DISTINCT"
        },

        correctAnswer: "C"
    },

    {
        id: 14,
        category: "DBMS",
        question: "Which JOIN returns only rows having matching values in both tables?",

        options: {
            A: "LEFT JOIN",
            B: "RIGHT JOIN",
            C: "FULL OUTER JOIN",
            D: "INNER JOIN"
        },

        correctAnswer: "D"
    },

    {
        id: 15,
        category: "DBMS",
        question: "What is the primary purpose of an index in a relational database?",

        options: {
            A: "Reduce table size",
            B: "Improve data retrieval performance",
            C: "Encrypt database records",
            D: "Prevent all duplicate values"
        },

        correctAnswer: "B"
    },

    {
        id: 16,
        category: "AI/ML",
        question: "A model performs extremely well on training data but poorly on unseen test data. What is the most likely problem?",

        options: {
            A: "Underfitting",
            B: "Overfitting",
            C: "Normalization",
            D: "Data augmentation"
        },

        correctAnswer: "B"
    },

    {
        id: 17,
        category: "AI/ML",
        question: "In binary classification, which metric is defined as:\nTP / (TP + FP)?",

        options: {
            A: "Recall",
            B: "Accuracy",
            C: "Precision",
            D: "F1-score"
        },

        correctAnswer: "C"
    },

    {
        id: 18,
        category: "AI/ML",
        question: "Which activation function is most commonly used in hidden layers of modern deep neural networks because it helps mitigate the vanishing-gradient problem compared with sigmoid?",

        options: {
            A: "ReLU",
            B: "Softmax",
            C: "Linear",
            D: "Step function"
        },

        correctAnswer: "A"
    },

    {
        id: 19,
        category: "AI/ML",
        question: "Which learning approach uses labeled training data?",

        options: {
            A: "Supervised learning",
            B: "Unsupervised learning",
            C: "Reinforcement learning",
            D: "Self-organizing learning"
        },

        correctAnswer: "A"
    },

    {
        id: 20,
        category: "AI/ML",
        question: "In K-Means clustering, what does 'K' represent?",

        options: {
            A: "Number of features",
            B: "Number of iterations only",
            C: "Number of clusters",
            D: "Number of training samples"
        },

        correctAnswer: "C"
    }
];


// ==========================================
// REAL PARTICIPANT DATA FROM BACKEND
// ==========================================

let participants = [];


// ==========================================
// LOAD PARTICIPANTS
// ==========================================

async function loadParticipants() {

    try {

        const response = await fetch(
            `${API_BASE}/api/admin/participants`,
            {
                headers: {
                    "X-Admin-Token": ADMIN_PASSWORD
                }
            }
        );

        if (!response.ok) {
            throw new Error(
                `Server returned ${response.status}`
            );
        }

        const data = await response.json();

        participants = data.participants.map(participant => ({
            name: participant.participantName,
            id: participant.participantId,

            score: participant.score,

            time: participant.timeTakenSeconds
                ? formatTime(participant.timeTakenSeconds)
                : "—",

            correct: participant.correct,
            wrong: participant.wrong,

            violations:
                participant.tabSwitchViolations || 0,

            status:
                participant.submissionStatus ===
                "Submitted by Participant"
                    ? "Submitted"
                    : participant.submissionStatus

        }));

        updateSummary();
        displayParticipants();

    } catch (error) {

        console.error(
            "Failed to load participants:",
            error
        );

        alert(
            "Could not load participant data. Make sure the Flask backend is running."
        );
    }
}


// ==========================================
// FORMAT TIME
// ==========================================

function formatTime(seconds) {

    const minutes =
        Math.floor(seconds / 60);

    const remainingSeconds =
        seconds % 60;

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(remainingSeconds).padStart(2, "0")
    );
}


// ==========================================
// LOGIN
// ==========================================

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;

    const error =
        document.getElementById("loginError");


    if (username === "" || password === "") {

        error.textContent =
            "Please enter username and password.";

        return;
    }


    if (
        username.toLowerCase() === ADMIN_USERNAME.toLowerCase() &&
        password === ADMIN_PASSWORD
    ) {

        error.textContent = "";

        showDashboard();
    } else {
        error.textContent =
            "Invalid username or password.";

    }

});


// ==========================================
// SHOW / HIDE PASSWORD
// ==========================================

document
    .getElementById("togglePassword")
    .addEventListener("click", function() {

        const password =
            document.getElementById("password");

        if (password.type === "password") {

            password.type = "text";

            this.textContent = "Hide";

        } else {

            password.type = "password";

            this.textContent = "Show";

        }

    });


// ==========================================
// SHOW DASHBOARD
// ==========================================

function showDashboard() {

    const loginView = document.getElementById("loginView");
    const dashboardView = document.getElementById("dashboardView");
    const detailsView = document.getElementById("detailsView");

    loginView.hidden = true;
    loginView.style.display = "none";

    dashboardView.hidden = false;
    dashboardView.style.display = "block";

    detailsView.hidden = true;
    detailsView.style.display = "none";

    loadParticipants();
}


// ==========================================
// UPDATE SUMMARY
// ==========================================

function updateSummary() {

    const total = participants.length;

    const submitted =
        participants.filter(
            participant =>
                participant.status === "Submitted"
        ).length;

    const notSubmitted =
        total - submitted;

    const highestScore =
        Math.max(
            ...participants.map(
                participant => participant.score
            )
        );


    document.getElementById(
        "totalParticipants"
    ).textContent = total;


    document.getElementById(
        "submitted"
    ).textContent = submitted;


    document.getElementById(
        "notSubmitted"
    ).textContent = notSubmitted;


    document.getElementById(
        "highestScore"
    ).textContent = highestScore + "/100";
}


// ==========================================
// DISPLAY PARTICIPANTS
// ==========================================

function displayParticipants() {

    const tableBody =
        document.getElementById(
            "participantsBody"
        );


    tableBody.innerHTML = "";


    participants.forEach(
        (participant, index) => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${participant.name}
                </td>

                <td>
                    ${participant.id}
                </td>

                <td>
                    <strong>
                        ${participant.score}
                    </strong>
                </td>

                <td>
                    ${participant.time}
                </td>

                <td>
                    ${participant.correct}
                </td>

                <td>
                    ${participant.wrong}
                </td>

                <td>
                    ${participant.violations}
                </td>

                <td>

                    <span class="status ${
                        participant.status === "Submitted"
                            ? "submitted"
                            : "pending"
                    }">

                        ${participant.status}

                    </span>

                </td>

                <td>

                    <button
                        class="details-btn"
                        onclick="viewParticipant(${index})"
                    >

                        View Details

                    </button>

                </td>

            `;


            tableBody.appendChild(row);

        }
    );
}


// ==========================================
// VIEW PARTICIPANT DETAILS
// ==========================================

function viewParticipant(index) {

    const participant =
        participants[index];


    const dashboardView = document.getElementById("dashboardView");
    const detailsView = document.getElementById("detailsView");

    dashboardView.hidden = true;
    dashboardView.style.display = "none";

    detailsView.hidden = false;
    detailsView.style.display = "block";


    document.getElementById(
        "detailName"
    ).textContent = participant.name;


    document.getElementById(
        "detailId"
    ).textContent = participant.id;


    document.getElementById(
        "detailScore"
    ).textContent =
        participant.score + "/100";


    document.getElementById(
        "detailTime"
    ).textContent = participant.time;


    document.getElementById(
        "detailCorrect"
    ).textContent = participant.correct;


    document.getElementById(
        "detailWrong"
    ).textContent = participant.wrong;


    document.getElementById(
        "detailViolations"
    ).textContent =
        participant.violations;


    document.getElementById(
        "detailStatus"
    ).textContent =
        participant.status;


    displayQuestionResults(index);
}


// ==========================================
// DISPLAY QUESTION RESULTS
// ==========================================

// ==========================================
// DISPLAY QUESTION RESULTS
// ==========================================

async function displayQuestionResults(participantIndex) {

    const participant = participants[participantIndex];

    const questionContainer =
        document.getElementById("questionResults");

    questionContainer.innerHTML = "<p>Loading answers...</p>";

    try {

        const response = await fetch(
            `${API_BASE}/api/admin/participants/${encodeURIComponent(participant.id)}`,
            {
                headers: {
                    "X-Admin-Token": ADMIN_PASSWORD
                }
            }
        );

        if (!response.ok) {
            throw new Error(
                `Server returned ${response.status}`
            );
        }

        const data = await response.json();

        const savedParticipant = data.participant;

        const selectedAnswers =
            savedParticipant.selectedAnswers || {};

        questionContainer.innerHTML = "";

        questions.forEach(question => {

            const selectedAnswer =
                selectedAnswers[String(question.id)] || "Not Answered";

            const isCorrect =
                selectedAnswer === question.correctAnswer;

            const card =
                document.createElement("article");

            card.className =
                "question-card " +
                (isCorrect ? "correct" : "wrong");

            let optionsHTML = "";

            for (const letter in question.options) {

                let optionClass = "";

                if (letter === question.correctAnswer) {
                    optionClass += " correct-option";
                }

                if (
                    letter === selectedAnswer &&
                    !isCorrect
                ) {
                    optionClass += " selected-wrong";
                }

                optionsHTML += `
                    <div class="${optionClass}">
                        <b>${letter})</b>
                        ${question.options[letter]}
                    </div>
                `;
            }

            card.innerHTML = `
                <div class="question-head">

                    <span>
                        Question ${question.id}
                    </span>

                    <span class="result">
                        ${
                            isCorrect
                                ? "✓ Correct"
                                : "✕ Wrong"
                        }
                    </span>

                </div>

                <h3>
                    ${question.question.replace(/\n/g, "<br>")}
                </h3>

                <div class="options">
                    ${optionsHTML}
                </div>

                <p>
                    <b>Participant Answer:</b>
                    ${selectedAnswer}

                    &nbsp;&nbsp;

                    <b>Correct Answer:</b>
                    ${question.correctAnswer}
                </p>
            `;

            questionContainer.appendChild(card);

        });

    } catch (error) {

        console.error(
            "Failed to load participant answers:",
            error
        );

        questionContainer.innerHTML =
            "<p>Could not load participant answers.</p>";
    }
}

// ==========================================
// BACK TO DASHBOARD
// ==========================================

document
    .getElementById("backBtn")
    .addEventListener("click", function() {

        const dashboardView = document.getElementById("dashboardView");
        const detailsView = document.getElementById("detailsView");

        dashboardView.hidden = false;
        dashboardView.style.display = "block";

        detailsView.hidden = true;
        detailsView.style.display = "none";

    });


// ==========================================
// LOGOUT
// ==========================================

document
    .getElementById("logoutBtn")
    .addEventListener("click", function() {

        const loginView = document.getElementById("loginView");
        const dashboardView = document.getElementById("dashboardView");
        const detailsView = document.getElementById("detailsView");

        loginView.hidden = false;
        loginView.style.display = "flex";

        dashboardView.hidden = true;
        dashboardView.style.display = "none";

        detailsView.hidden = true;
        detailsView.style.display = "none";


        document.getElementById(
            "loginForm"
        ).reset();


        document.getElementById(
            "loginError"
        ).textContent = "";

    });
    // ==========================================
// CLEAR ALL TEST DATA
// ==========================================

document
.getElementById("clearTestDataBtn")
.addEventListener("click", async function() {

    const confirmClear = confirm(
        "Are you sure you want to clear ALL participant submissions?"
    );

    if (!confirmClear) {
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE}/api/admin/clear-test-data`,
            {
                method: "DELETE",
                headers: {
                    "X-Admin-Token": ADMIN_PASSWORD
                }
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(
                data.message || "Failed to clear test data"
            );
        }

        alert("All test submissions have been cleared.");

        loadParticipants();

    } catch (error) {

        console.error(
            "Failed to clear test data:",
            error
        );

        alert(
            "Could not clear test data. Make sure the Flask backend is running."
        );
    }

});