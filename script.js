/**
 * ==============================================================================
 * BUZZER HUNT - PARTICIPANT FRONTEND SCRIPT
 * ==============================================================================
 *
 * Participant-facing quiz logic.
 *
 * IMPORTANT:
 * - Questions are loaded from the backend.
 * - Correct answers MUST NOT be stored in this file.
 * - Scoring is handled by the backend.
 * - Frontend only sends the participant's selected answers.
 * ==============================================================================
 */

// ==============================================================================
// 1. QUESTIONS
// ==============================================================================

// Questions will be loaded from the backend.
// DO NOT put correct answers in this array.
let questions = [];


// ==============================================================================
// 2. QUIZ CONFIGURATION
// ==============================================================================

const QUIZ_CONFIG = {
    totalQuestions: 0,
    timeLimitSeconds: 15 * 60, // 15 minutes
    pointsPerCorrect: 5,
    pointsPerWrong: 0,
    maxScore: 100
};


// ==============================================================================
// 3. QUIZ RUNTIME STATE
// ==============================================================================

const quizState = {
    participantName: "",
    participantId: "",

    startTime: null,
    submissionTime: null,

    currentIndex: 0,

    selectedAnswers: {},

    timeRemaining: QUIZ_CONFIG.timeLimitSeconds,

    timerInterval: null,

    violationCount: 0,

    isSubmitted: false
};


// ==============================================================================
// 4. STORAGE HELPERS
// ==============================================================================

function getStoredParticipant() {

    const name =
        sessionStorage.getItem("quiz_participant_name") || "";

    const id =
        sessionStorage.getItem("quiz_participant_id") || "";

    return {
        name,
        id
    };
}


function saveStoredParticipant(name, id) {

    sessionStorage.setItem(
        "quiz_participant_name",
        name.trim()
    );

    sessionStorage.setItem(
        "quiz_participant_id",
        id.trim()
    );
}


function clearSessionData() {

    sessionStorage.removeItem(
        "quiz_participant_name"
    );

    sessionStorage.removeItem(
        "quiz_participant_id"
    );

    sessionStorage.removeItem(
        "quiz_submission"
    );
}


// ==============================================================================
// 5. TIME FORMAT
// ==============================================================================

function formatTime(totalSeconds) {

    const mins =
        Math.floor(totalSeconds / 60);

    const secs =
        totalSeconds % 60;

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}


// ==============================================================================
// 6. PAGE 1 - LOGIN
// ==============================================================================

function initLogin() {

    const loginForm =
        document.getElementById("loginForm");

    const nameInput =
        document.getElementById("participantName");

    const idInput =
        document.getElementById("participantId");

    const alertBox =
        document.getElementById("loginAlert");


    if (!loginForm) {
        return;
    }


    // Clear previous participant data
    clearSessionData();


    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();


        const name =
            nameInput ? nameInput.value.trim() : "";

        const id =
            idInput ? idInput.value.trim() : "";


        // Validate both fields
        if (!name && !id) {

            showLoginError(
                "Please enter both Participant Name and Participant ID."
            );

            if (nameInput) {
                nameInput.focus();
            }

            return;
        }


        if (!name) {

            showLoginError(
                "Participant Name is required."
            );

            if (nameInput) {
                nameInput.focus();
            }

            return;
        }


        if (!id) {

            showLoginError(
                "Participant ID is required."
            );

            if (idInput) {
                idInput.focus();
            }

            return;
        }


        // Save participant details
        saveStoredParticipant(name, id);


        // Go to instructions
        window.location.href =
            "instructions.html";
    });


    function showLoginError(message) {

        if (alertBox) {

            alertBox.textContent = message;

            alertBox.classList.add("active");
        }
    }


    // Clear error while typing
    [nameInput, idInput].forEach((input) => {

        if (!input) {
            return;
        }

        input.addEventListener("input", () => {

            if (alertBox) {

                alertBox.classList.remove("active");
            }
        });
    });
}


// ==============================================================================
// 7. PAGE 2 - INSTRUCTIONS
// ==============================================================================

function initInstructions() {

    const participant =
        getStoredParticipant();


    const nameDisplay =
        document.getElementById(
            "participantNameDisplay"
        );


    const idDisplay =
        document.getElementById(
            "participantIdDisplay"
        );


    const ackCheckbox =
        document.getElementById(
            "acknowledgeCheck"
        );


    const startBtn =
        document.getElementById(
            "startQuizBtn"
        );


    if (!startBtn) {
        return;
    }


    // Make sure participant logged in
    if (!participant.name || !participant.id) {

        window.location.href =
            "login.html";

        return;
    }


    // Display participant information
    if (nameDisplay) {

        nameDisplay.textContent =
            participant.name;
    }


    if (idDisplay) {

        idDisplay.textContent =
            participant.id;
    }


    // Enable Start button only after acknowledgement
    if (ackCheckbox) {

        startBtn.disabled =
            !ackCheckbox.checked;


        ackCheckbox.addEventListener(
            "change",
            function () {

                startBtn.disabled =
                    !this.checked;
            }
        );
    }


    // Start quiz
    startBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "quiz.html";
        }
    );
}


// ==============================================================================
// 8. PAGE 3 - QUIZ INITIALIZATION
// ==============================================================================

async function initQuiz() {

    const quizMain =
        document.getElementById(
            "quizMainContainer"
        );


    if (!quizMain) {
        return;
    }


    const participant =
        getStoredParticipant();


    // Validate participant
    if (!participant.name || !participant.id) {

        window.location.href =
            "login.html";

        return;
    }


    // Save participant details in runtime state
    quizState.participantName =
        participant.name;

    quizState.participantId =
        participant.id;


    // Start timestamp
    quizState.startTime =
        new Date().toISOString();


    // Display participant information
    const nameEl =
        document.getElementById(
            "headerParticipantName"
        );


    const idEl =
        document.getElementById(
            "headerParticipantId"
        );


    if (nameEl) {

        nameEl.textContent =
            participant.name;
    }


    if (idEl) {

        idEl.textContent =
            participant.id;
    }


    // Load official questions
    const loaded =
        await loadQuestions();


    if (!loaded) {
        return;
    }


    if (questions.length === 0) {

        showQuestionLoadError(
            "No quiz questions are available."
        );

        return;
    }


    // Use actual question count
    QUIZ_CONFIG.totalQuestions =
        questions.length;


    // Build question navigation
    buildQuestionGrid();


    // Display first question
    renderQuestion(
        quizState.currentIndex
    );


    // Start timer
    startTimer();


    // Setup anti-cheating warning
    setupTabSwitchDetection();


    // Setup browser leave warning
    setupLeaveWarning();


    // Setup quiz buttons
    setupQuizControls();


    // Setup modals
    setupModals();
}


// ==============================================================================
// 9. LOAD QUESTIONS FROM BACKEND
// ==============================================================================

async function loadQuestions() {

    try {

        const response =
            await fetch("http://127.0.0.1:5000/api/questions");


        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );
        }


        const data =
            await response.json();


        /*
         * Backend may return:
         *
         * [
         *   {
         *     id: 1,
         *     question: "...",
         *     options: {
         *       A: "...",
         *       B: "...",
         *       C: "...",
         *       D: "..."
         *     }
         *   }
         * ]
         *
         * OR:
         *
         * {
         *   questions: [...]
         * }
         */


        if (Array.isArray(data)) {

            questions = data;

        } else if (
            data &&
            Array.isArray(data.questions)
        ) {

            questions = data.questions;

        } else {

            throw new Error(
                "Invalid question data received."
            );
        }


        return true;

    } catch (error) {

        console.error(
            "Failed to load questions:",
            error
        );


        showQuestionLoadError(
            "Unable to load the quiz questions. Please contact the event coordinator."
        );


        return false;
    }
}


// ==============================================================================
// 10. QUESTION LOAD ERROR
// ==============================================================================

function showQuestionLoadError(message) {

    const questionText =
        document.getElementById(
            "questionText"
        );


    const optionsContainer =
        document.getElementById(
            "optionsContainer"
        );


    const questionGrid =
        document.getElementById(
            "questionGrid"
        );


    if (questionText) {

        questionText.textContent =
            message;
    }


    if (optionsContainer) {

        optionsContainer.innerHTML = "";
    }


    if (questionGrid) {

        questionGrid.innerHTML = "";
    }
}


// ==============================================================================
// 11. QUESTION NAVIGATION GRID
// ==============================================================================

function buildQuestionGrid() {

    const grid =
        document.getElementById(
            "questionGrid"
        );


    if (!grid) {
        return;
    }


    grid.innerHTML = "";


    questions.forEach((question, index) => {

        const button =
            document.createElement(
                "button"
            );


        button.type = "button";

        button.className =
            "q-grid-btn";

        button.id =
            `grid-btn-${index}`;

        button.textContent =
            index + 1;

        button.title =
            `Jump to Question ${index + 1}`;


        button.addEventListener(
            "click",
            () => {

                goToQuestion(index);
            }
        );


        grid.appendChild(button);
    });


    updateGridStatus();
}


// ==============================================================================
// 12. UPDATE QUESTION GRID STATUS
// ==============================================================================

function updateGridStatus() {

    questions.forEach(
        (question, index) => {

            const button =
                document.getElementById(
                    `grid-btn-${index}`
                );


            if (!button) {
                return;
            }


            button.classList.remove(
                "current",
                "answered"
            );


            // Current question
            if (
                index ===
                quizState.currentIndex
            ) {

                button.classList.add(
                    "current"
                );
            }


            // Answered question
            if (
                quizState.selectedAnswers[
                    question.id
                ]
            ) {

                button.classList.add(
                    "answered"
                );
            }
        }
    );


    const answeredCount =
        Object.keys(
            quizState.selectedAnswers
        ).length;


    const answeredEl =
        document.getElementById(
            "answeredCountDisplay"
        );


    if (answeredEl) {

        answeredEl.textContent =
            `${answeredCount} of ${QUIZ_CONFIG.totalQuestions} Answered`;
    }
}


// ==============================================================================
// 13. RENDER QUESTION
// ==============================================================================

function renderQuestion(index) {

    quizState.currentIndex =
        index;


    const question =
        questions[index];


    if (!question) {
        return;
    }


    const questionNumberBadge =
        document.getElementById(
            "questionNumberBadge"
        );


    const questionText =
        document.getElementById(
            "questionText"
        );


    const optionsContainer =
        document.getElementById(
            "optionsContainer"
        );


    const prevBtn =
        document.getElementById(
            "prevBtn"
        );


    const nextBtn =
        document.getElementById(
            "nextBtn"
        );


    // Question number
    if (questionNumberBadge) {

        questionNumberBadge.textContent =
            `Question ${index + 1} of ${QUIZ_CONFIG.totalQuestions}`;
    }


    // Question text
    if (questionText) {

        questionText.textContent =
            question.question;
    }


    // Render options
    if (optionsContainer) {

        optionsContainer.innerHTML = "";


        const selectedOption =
            quizState.selectedAnswers[
                question.id
            ];


        ["A", "B", "C", "D"].forEach(
            (optionKey) => {

                const optionText =
                    question.options?.[
                        optionKey
                    ];


                // Skip missing options
                if (
                    optionText ===
                    undefined
                ) {

                    return;
                }


                const isChecked =
                    selectedOption ===
                    optionKey;


                // Create option card
                const label =
                    document.createElement(
                        "label"
                    );


                label.className =
                    `option-card ${isChecked ? "selected" : ""}`;


                label.id =
                    `option-card-${optionKey}`;


                // Radio button
                const radio =
                    document.createElement(
                        "input"
                    );


                radio.type = "radio";

                radio.name =
                    "quizOption";

                radio.value =
                    optionKey;

                radio.checked =
                    isChecked;


                // Option letter
                const keyDiv =
                    document.createElement(
                        "div"
                    );


                keyDiv.className =
                    "option-key";

                keyDiv.textContent =
                    optionKey;


                // Option text
                const textDiv =
                    document.createElement(
                        "div"
                    );


                textDiv.className =
                    "option-label";

                textDiv.textContent =
                    optionText;


                // Build card
                label.appendChild(
                    radio
                );

                label.appendChild(
                    keyDiv
                );

                label.appendChild(
                    textDiv
                );


                // Select option
                label.addEventListener(
                    "click",
                    () => {

                        selectOption(
                            question.id,
                            optionKey
                        );
                    }
                );


                optionsContainer.appendChild(
                    label
                );
            }
        );
    }


    // Previous button
    if (prevBtn) {

        prevBtn.disabled =
            index === 0;
    }


    // Next button
    if (nextBtn) {

        if (
            index ===
            QUIZ_CONFIG.totalQuestions - 1
        ) {

            nextBtn.textContent =
                "Finish & Review";

        } else {

            nextBtn.textContent =
                "Next Question →";
        }
    }


    updateGridStatus();
}


// ==============================================================================
// 14. SELECT OPTION
// ==============================================================================

function selectOption(
    questionId,
    optionKey
) {

    quizState.selectedAnswers[
        questionId
    ] = optionKey;


    // Remove selection from all cards
    document
        .querySelectorAll(
            ".option-card"
        )
        .forEach((card) => {

            card.classList.remove(
                "selected"
            );


            const radio =
                card.querySelector(
                    'input[type="radio"]'
                );


            if (radio) {

                radio.checked =
                    false;
            }
        });


    // Highlight selected card
    const activeCard =
        document.getElementById(
            `option-card-${optionKey}`
        );


    if (activeCard) {

        activeCard.classList.add(
            "selected"
        );


        const radio =
            activeCard.querySelector(
                'input[type="radio"]'
            );


        if (radio) {

            radio.checked =
                true;
        }
    }


    updateGridStatus();
}


// ==============================================================================
// 15. CLEAR CURRENT ANSWER
// ==============================================================================

function clearCurrentAnswer() {

    const currentQuestion =
        questions[
            quizState.currentIndex
        ];


    if (!currentQuestion) {
        return;
    }


    delete quizState.selectedAnswers[
        currentQuestion.id
    ];


    document
        .querySelectorAll(
            ".option-card"
        )
        .forEach((card) => {

            card.classList.remove(
                "selected"
            );


            const radio =
                card.querySelector(
                    'input[type="radio"]'
                );


            if (radio) {

                radio.checked =
                    false;
            }
        });


    updateGridStatus();
}


// ==============================================================================
// 16. NAVIGATION
// ==============================================================================

function goToQuestion(index) {

    if (
        index >= 0 &&
        index <
            QUIZ_CONFIG.totalQuestions
    ) {

        renderQuestion(index);
    }
}


function nextQuestion() {

    if (
        quizState.currentIndex <
        QUIZ_CONFIG.totalQuestions - 1
    ) {

        goToQuestion(
            quizState.currentIndex + 1
        );

    } else {

        openSubmitModal();
    }
}


function prevQuestion() {

    if (
        quizState.currentIndex > 0
    ) {

        goToQuestion(
            quizState.currentIndex - 1
        );
    }
}


// ==============================================================================
// 17. QUIZ CONTROL BUTTONS
// ==============================================================================

function setupQuizControls() {

    const prevBtn =
        document.getElementById(
            "prevBtn"
        );


    const nextBtn =
        document.getElementById(
            "nextBtn"
        );


    const clearBtn =
        document.getElementById(
            "clearSelectionBtn"
        );


    const submitBtn =
        document.getElementById(
            "submitQuizBtn"
        );


    const sidebarSubmitBtn =
        document.getElementById(
            "sidebarSubmitBtn"
        );


    if (prevBtn) {

        prevBtn.addEventListener(
            "click",
            prevQuestion
        );
    }


    if (nextBtn) {

        nextBtn.addEventListener(
            "click",
            nextQuestion
        );
    }


    if (clearBtn) {

        clearBtn.addEventListener(
            "click",
            clearCurrentAnswer
        );
    }


    if (submitBtn) {

        submitBtn.addEventListener(
            "click",
            openSubmitModal
        );
    }


    if (sidebarSubmitBtn) {

        sidebarSubmitBtn.addEventListener(
            "click",
            openSubmitModal
        );
    }
}


// ==============================================================================
// 18. COUNTDOWN TIMER
// ==============================================================================

function startTimer() {

    const timerDisplay =
        document.getElementById(
            "timerDisplay"
        );


    const timerPill =
        document.getElementById(
            "timerPill"
        );


    // Prevent duplicate timers
    if (quizState.timerInterval) {

        clearInterval(
            quizState.timerInterval
        );
    }


    quizState.timerInterval =
        setInterval(() => {

            quizState.timeRemaining--;


            if (timerDisplay) {

                timerDisplay.textContent =
                    formatTime(
                        quizState.timeRemaining
                    );
            }


            // Timer warning
            if (timerPill) {

                if (
                    quizState.timeRemaining <=
                    60
                ) {

                    timerPill.classList.remove(
                        "timer-warning"
                    );

                    timerPill.classList.add(
                        "timer-critical"
                    );

                } else if (
                    quizState.timeRemaining <=
                    120
                ) {

                    timerPill.classList.add(
                        "timer-warning"
                    );
                }
            }


            // Time expired
            if (
                quizState.timeRemaining <=
                0
            ) {

                clearInterval(
                    quizState.timerInterval
                );


                if (timerDisplay) {

                    timerDisplay.textContent =
                        "00:00";
                }


                handleAutoSubmit();
            }

        }, 1000);
}


// ==============================================================================
// 19. TAB SWITCH DETECTION
// ==============================================================================

function setupTabSwitchDetection() {

    document.addEventListener(
        "visibilitychange",
        () => {

            if (quizState.isSubmitted) {
                return;
            }


            if (document.hidden) {

                quizState.violationCount++;


                updateViolationUI();

            } else {

                showViolationModal();
            }
        }
    );
}


// ==============================================================================
// 20. UPDATE VIOLATION UI
// ==============================================================================

function updateViolationUI() {

    const badge =
        document.getElementById(
            "violationCounterBadge"
        );


    const countEl =
        document.getElementById(
            "violationCountNumber"
        );


    if (countEl) {

        countEl.textContent =
            quizState.violationCount;
    }


    if (
        badge &&
        quizState.violationCount > 0
    ) {

        badge.classList.add(
            "has-violations"
        );
    }
}


// ==============================================================================
// 21. VIOLATION MODAL
// ==============================================================================

function showViolationModal() {

    const modal =
        document.getElementById(
            "violationModal"
        );


    const modalCount =
        document.getElementById(
            "modalViolationCount"
        );


    if (modalCount) {

        modalCount.textContent =
            quizState.violationCount;
    }


    if (modal) {

        modal.classList.add(
            "active"
        );
    }
}


// ==============================================================================
// 22. LEAVE / REFRESH WARNING
// ==============================================================================

function setupLeaveWarning() {

    window.addEventListener(
        "beforeunload",
        beforeUnloadHandler
    );
}


function beforeUnloadHandler(e) {

    if (quizState.isSubmitted) {
        return;
    }


    e.preventDefault();


    e.returnValue =
        "Are you sure you want to leave? Your quiz progress will be lost.";


    return e.returnValue;
}


// ==============================================================================
// 23. MODAL SETUP
// ==============================================================================

function setupModals() {

    // --------------------------------------------------------------------------
    // Violation Modal
    // --------------------------------------------------------------------------

    const dismissViolationBtn =
        document.getElementById(
            "dismissViolationBtn"
        );


    const violationModal =
        document.getElementById(
            "violationModal"
        );


    if (
        dismissViolationBtn &&
        violationModal
    ) {

        dismissViolationBtn.addEventListener(
            "click",
            () => {

                violationModal.classList.remove(
                    "active"
                );
            }
        );
    }


    // --------------------------------------------------------------------------
    // Submit Modal - Cancel
    // --------------------------------------------------------------------------

    const cancelSubmitBtn =
        document.getElementById(
            "cancelSubmitBtn"
        );


    const submitModal =
        document.getElementById(
            "submitModal"
        );


    if (
        cancelSubmitBtn &&
        submitModal
    ) {

        cancelSubmitBtn.addEventListener(
            "click",
            () => {

                submitModal.classList.remove(
                    "active"
                );
            }
        );
    }


    // --------------------------------------------------------------------------
    // Submit Modal - Confirm
    // --------------------------------------------------------------------------

    const confirmSubmitBtn =
        document.getElementById(
            "confirmSubmitBtn"
        );


    if (confirmSubmitBtn) {

        confirmSubmitBtn.addEventListener(
            "click",
            () => {

                if (submitModal) {

                    submitModal.classList.remove(
                        "active"
                    );
                }


                finalizeSubmission(false);
            }
        );
    }
}


// ==============================================================================
// 24. OPEN SUBMIT MODAL
// ==============================================================================

function openSubmitModal() {

    const modal =
        document.getElementById(
            "submitModal"
        );


    const answeredCount =
        Object.keys(
            quizState.selectedAnswers
        ).length;


    const unansweredCount =
        QUIZ_CONFIG.totalQuestions -
        answeredCount;


    const answeredStat =
        document.getElementById(
            "modalAnsweredStat"
        );


    const unansweredStat =
        document.getElementById(
            "modalUnansweredStat"
        );


    if (answeredStat) {

        answeredStat.textContent =
            `${answeredCount} / ${QUIZ_CONFIG.totalQuestions}`;
    }


    if (unansweredStat) {

        unansweredStat.textContent =
            `${unansweredCount}`;
    }


    if (modal) {

        modal.classList.add(
            "active"
        );
    }
}


// ==============================================================================
// 25. AUTO SUBMISSION
// ==============================================================================

function handleAutoSubmit() {

    // Close open modals
    const violationModal =
        document.getElementById(
            "violationModal"
        );


    const submitModal =
        document.getElementById(
            "submitModal"
        );


    if (violationModal) {

        violationModal.classList.remove(
            "active"
        );
    }


    if (submitModal) {

        submitModal.classList.remove(
            "active"
        );
    }


    alert(
        "Time is up! Your 15-minute quiz time has expired. Your responses are being submitted automatically."
    );


    finalizeSubmission(true);
}


// ==============================================================================
// 26. FINALIZE SUBMISSION
// ==============================================================================

async function finalizeSubmission(
    isAutoSubmit
) {

    // Prevent duplicate submission
    if (quizState.isSubmitted) {
        return;
    }


    quizState.isSubmitted =
        true;


    quizState.submissionTime =
        new Date().toISOString();


    // Stop timer
    clearInterval(
        quizState.timerInterval
    );


    // Remove browser leave warning
    window.removeEventListener(
        "beforeunload",
        beforeUnloadHandler
    );


    // Calculate time taken
    const startMs =
        new Date(
            quizState.startTime
        ).getTime();


    const endMs =
        new Date(
            quizState.submissionTime
        ).getTime();


    const timeTakenSeconds =
        Math.max(
            0,
            Math.round(
                (endMs - startMs) /
                1000
            )
        );


    // --------------------------------------------------------------------------
    // IMPORTANT:
    // No score is calculated here.
    // No correct answer is accessed here.
    // Backend calculates the official score.
    // --------------------------------------------------------------------------

    const submissionPayload = {

        participantName:
            quizState.participantName,

        participantId:
            quizState.participantId,

        selectedAnswers:
            quizState.selectedAnswers,

        startTime:
            quizState.startTime,

        submissionTime:
            quizState.submissionTime,

        timeTakenSeconds:
            timeTakenSeconds,

        tabSwitchViolations:
            quizState.violationCount,

        submissionStatus:
            isAutoSubmit
                ? "Auto-Submitted (Time Expired)"
                : "Submitted by Participant"
    };


    try {

        const response =
            await fetch(
                "http://127.0.0.1:5000/api/submit",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            submissionPayload
                        )
                }
            );


        if (!response.ok) {

            throw new Error(
                `Submission failed: ${response.status}`
            );
        }


        const result =
            await response.json();


        // Combine backend result with submission information
        const finalResult = {

            ...submissionPayload,

            ...result
        };


        // Save returned result locally
        sessionStorage.setItem(
            "quiz_submission",
            JSON.stringify(
                finalResult
            )
        );


        // Display result
        displaySubmissionResults(
            finalResult
        );


    } catch (error) {

        console.error(
            "Submission error:",
            error
        );


        // Allow retry
        quizState.isSubmitted =
            false;


        alert(
            "Unable to submit your quiz. Please contact the event coordinator."
        );
    }
}


// ==============================================================================
// 27. DISPLAY SUBMISSION RESULTS
// ==============================================================================

function displaySubmissionResults(
    payload
) {

    const quizContent =
        document.querySelector(
            ".quiz-main-content"
        );


    const resultsContainer =
        document.getElementById(
            "resultsContainer"
        );


    // Hide quiz
    if (quizContent) {

        quizContent.style.display =
            "none";
    }


    // Show results
    if (resultsContainer) {

        resultsContainer.classList.add(
            "active"
        );


        const participantNameEl =
            document.getElementById(
                "resParticipantName"
            );


        const participantIdEl =
            document.getElementById(
                "resParticipantId"
            );


        const statusEl =
            document.getElementById(
                "resStatus"
            );


        const scoreEl =
            document.getElementById(
                "resScore"
            );


        const attemptedEl =
            document.getElementById(
                "resAttempted"
            );


        const timeTakenEl =
            document.getElementById(
                "resTimeTaken"
            );


        const violationsEl =
            document.getElementById(
                "resViolations"
            );


        // Participant name
        if (participantNameEl) {

            participantNameEl.textContent =
                payload.participantName || "";
        }


        // Participant ID
        if (participantIdEl) {

            participantIdEl.textContent =
                payload.participantId || "";
        }


        // Submission status
        if (statusEl) {

            statusEl.textContent =
                payload.submissionStatus || "";
        }


        // Official score from backend
        if (scoreEl) {

            if (
                payload.score !==
                undefined
            ) {

                scoreEl.textContent =
                    `${payload.score} / ${payload.maxScore ?? QUIZ_CONFIG.maxScore}`;

            } else {

                scoreEl.textContent =
                    "Submitted";
            }
        }


        // Attempted questions
        if (attemptedEl) {

            const attempted =
                Object.keys(
                    payload.selectedAnswers || {}
                ).length;


            const total =
                payload.totalQuestions ??
                QUIZ_CONFIG.totalQuestions;


            attemptedEl.textContent =
                `${attempted} / ${total}`;
        }


        // Time taken
        if (timeTakenEl) {

            const seconds =
                payload.timeTakenSeconds ||
                0;


            timeTakenEl.textContent =
                `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
        }


        // Tab violations
        if (violationsEl) {

            violationsEl.textContent =
                payload.tabSwitchViolations ??
                0;
        }


        // JSON payload display
        const jsonView =
            document.getElementById(
                "jsonPayloadDisplay"
            );


        if (jsonView) {

            jsonView.textContent =
                JSON.stringify(
                    payload,
                    null,
                    2
                );
        }
    }


    // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ==============================================================================
// 28. ROUTE CONTROLLER
// ==============================================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        // LOGIN PAGE
        if (
            document.getElementById(
                "loginForm"
            )
        ) {

            initLogin();


        // INSTRUCTIONS PAGE
        } else if (
            document.getElementById(
                "startQuizBtn"
            )
        ) {

            initInstructions();


        // QUIZ PAGE
        } else if (
            document.getElementById(
                "quizMainContainer"
            )
        ) {

            initQuiz();
        }
    }
);