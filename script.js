const urlParams = new URLSearchParams(window.location.search);
const quizCode = urlParams.get("quiz");

if (quizCode) {
    loadQuizFromLink(quizCode);
} else {
    setupHomePage();
}


function setupHomePage() {

    const createBtn = document.getElementById("createBtn");

    if (!createBtn) {
        return;
    }

    createBtn.addEventListener("click", function() {

        const creatorName =
            document.getElementById("creatorName").value.trim();

        if (creatorName === "") {
            alert("Please enter your name.");
            return;
        }

        showQuizCreator(creatorName);
    });
}


function showQuizCreator(creatorName) {

    const container = document.querySelector(".container");

    let questionsHTML = "";

    for (let i = 1; i <= 10; i++) {

        questionsHTML += `
            <div class="question-card">

                <div class="question-number">
                    QUESTION ${i}
                </div>

                <input
                    type="text"
                    class="question-input"
                    id="question${i}"
                    placeholder="Enter your question"
                    maxlength="200"
                >

                <div class="options">

                    <div class="option-row">
                        <input
                            type="text"
                            id="q${i}option1"
                            placeholder="Option 1"
                            maxlength="100"
                        >

                        <input
                            type="radio"
                            name="correct${i}"
                            value="1"
                        >
                    </div>

                    <div class="option-row">
                        <input
                            type="text"
                            id="q${i}option2"
                            placeholder="Option 2"
                            maxlength="100"
                        >

                        <input
                            type="radio"
                            name="correct${i}"
                            value="2"
                        >
                    </div>

                    <div class="option-row">
                        <input
                            type="text"
                            id="q${i}option3"
                            placeholder="Option 3"
                            maxlength="100"
                        >

                        <input
                            type="radio"
                            name="correct${i}"
                            value="3"
                        >
                    </div>

                    <div class="option-row">
                        <input
                            type="text"
                            id="q${i}option4"
                            placeholder="Option 4"
                            maxlength="100"
                        >

                        <input
                            type="radio"
                            name="correct${i}"
                            value="4"
                        >
                    </div>

                </div>

                <div class="correct-label">
                    Select the correct answer →
                </div>

            </div>
        `;
    }

    container.innerHTML = `

        <div class="quiz-creator">

            <div class="creator-header">

                <div class="logo">KNOW ME</div>

                <h1>Create Your Quiz</h1>

                <p>
                    Hey ${escapeHTML(creatorName)}, create 10 questions
                    and see how well your friends know you.
                </p>

            </div>

            <div id="questions-container">
                ${questionsHTML}
            </div>

            <button id="generateBtn">
                Generate My Quiz Link
            </button>

        </div>
    `;

    document
        .getElementById("generateBtn")
        .addEventListener("click", function() {

            generateQuiz(creatorName);

        });
}


function generateQuiz(creatorName) {

    const questions = [];

    for (let i = 1; i <= 10; i++) {

        const question =
            document.getElementById(`question${i}`).value.trim();

        const option1 =
            document.getElementById(`q${i}option1`).value.trim();

        const option2 =
            document.getElementById(`q${i}option2`).value.trim();

        const option3 =
            document.getElementById(`q${i}option3`).value.trim();

        const option4 =
            document.getElementById(`q${i}option4`).value.trim();

        const correct =
            document.querySelector(
                `input[name="correct${i}"]:checked`
            );

        if (
            question === "" ||
            option1 === "" ||
            option2 === "" ||
            option3 === "" ||
            option4 === ""
        ) {

            alert(`Please complete Question ${i}.`);
            return;
        }

        if (!correct) {

            alert(
                `Please select the correct answer for Question ${i}.`
            );

            return;
        }

        questions.push({

            question: question,

            options: [
                option1,
                option2,
                option3,
                option4
            ],

            correct: Number(correct.value)

        });
    }

    const quizData = {

        creator: creatorName,

        questions: questions

    };

    const encodedQuiz =
        btoa(
            encodeURIComponent(
                JSON.stringify(quizData)
            )
        );

    const quizLink =
        window.location.origin +
        window.location.pathname +
        "?quiz=" +
        encodedQuiz;

    showQuizLink(
        quizLink,
        creatorName
    );
}


function showQuizLink(quizLink, creatorName) {

    const container =
        document.querySelector(".container");

    container.innerHTML = `

        <div class="card">

            <div class="logo">
                KNOW ME
            </div>

            <h1>
                Your quiz is ready.
            </h1>

            <p class="subtitle">
                Your quiz has been created successfully,
                ${escapeHTML(creatorName)}.
                Send this link to your friends.
            </p>

            <div class="link-box">

                <input
                    type="text"
                    id="quizLink"
                    value="${quizLink}"
                    readonly
                >

                <button id="copyBtn">
                    Copy Link
                </button>

            </div>

            <p
                id="copyMessage"
                class="copy-message"
            ></p>

        </div>
    `;

    document
        .getElementById("copyBtn")
        .addEventListener("click", function() {

            const linkInput =
                document.getElementById("quizLink");

            navigator.clipboard
                .writeText(linkInput.value);

            document.getElementById(
                "copyMessage"
            ).textContent =
                "Link copied! Send it to your friends.";

        });
}


function loadQuizFromLink(code) {

    try {

        const decodedQuiz =
            decodeURIComponent(
                atob(code)
            );

        const quizData =
            JSON.parse(decodedQuiz);

        showNameEntry(quizData);

    } catch (error) {

        document.querySelector(".container").innerHTML = `

            <div class="card">

                <div class="logo">
                    KNOW ME
                </div>

                <h1>
                    Invalid Quiz Link
                </h1>

                <p class="subtitle">
                    This quiz link is invalid or has been damaged.
                </p>

            </div>
        `;
    }
}


function showNameEntry(quizData) {

    const container =
        document.querySelector(".container");

    container.innerHTML = `

        <div class="card">

            <div class="logo">
                KNOW ME
            </div>

            <h1>
                ${escapeHTML(quizData.creator)}'s Quiz
            </h1>

            <p class="subtitle">
                Let's see how well you know
                ${escapeHTML(quizData.creator)}.
            </p>

            <div class="name-section">

                <label for="playerName">
                    Your Name
                </label>

                <input
                    type="text"
                    id="playerName"
                    placeholder="Enter your name"
                    maxlength="30"
                >

            </div>

            <button id="startQuizBtn">
                Start Quiz
            </button>

        </div>
    `;

    document
        .getElementById("startQuizBtn")
        .addEventListener("click", function() {

            const playerName =
                document
                    .getElementById("playerName")
                    .value
                    .trim();

            if (playerName === "") {

                alert("Please enter your name.");

                return;
            }

            startQuiz(
                quizData,
                playerName
            );

        });
}


function startQuiz(quizData, playerName) {

    const container =
        document.querySelector(".container");

    let questionsHTML = "";

    quizData.questions.forEach(
        function(item, index) {

            let optionsHTML = "";

            item.options.forEach(
                function(option, optionIndex) {

                    optionsHTML += `

                        <label class="answer-option">

                            <input
                                type="radio"
                                name="question${index}"
                                value="${optionIndex}"
                            >

                            <span>
                                ${escapeHTML(option)}
                            </span>

                        </label>

                    `;
                }
            );

            questionsHTML += `

                <div class="question-card">

                    <div class="question-number">
                        QUESTION ${index + 1} OF 10
                    </div>

                    <h2>
                        ${escapeHTML(item.question)}
                    </h2>

                    <div class="answer-options">
                        ${optionsHTML}
                    </div>

                </div>

            `;
        }
    );

    container.innerHTML = `

        <div class="quiz-creator">

            <div class="creator-header">

                <div class="logo">
                    KNOW ME
                </div>

                <h1>
                    ${escapeHTML(quizData.creator)}'s Quiz
                </h1>

                <p>
                    Good luck, ${escapeHTML(playerName)}.
                </p>

            </div>

            ${questionsHTML}

            <button id="submitQuizBtn">
                Finish Quiz
            </button>

        </div>

    `;

    document
        .getElementById("submitQuizBtn")
        .addEventListener("click", function() {

            submitQuiz(
                quizData,
                playerName
            );

        });
}


function submitQuiz(quizData, playerName) {

    let score = 0;

    for (
        let i = 0;
        i < quizData.questions.length;
        i++
    ) {

        const selected =
            document.querySelector(
                `input[name="question${i}"]:checked`
            );

        if (!selected) {

            alert(
                `Please answer Question ${i + 1} before finishing.`
            );

            return;
        }

        if (
            Number(selected.value) ===
            quizData.questions[i].correct - 1
        ) {

            score++;

        }
    }

    showResult(
        quizData.creator,
        playerName,
        score
    );
}


function showResult(
    creatorName,
    playerName,
    score
) {

    const container =
        document.querySelector(".container");

    container.innerHTML = `

        <div class="card result-card">

            <div class="logo">
                KNOW ME
            </div>

            <p class="result-player">
                ${escapeHTML(playerName)}
            </p>

            <h1>
                Quiz Complete.
            </h1>

            <div class="score">
                ${score}<span>/10</span>
            </div>

            <p class="result-message">
                You just completed
                ${escapeHTML(creatorName)}'s quiz.
            </p>

            <div class="screenshot-message">

                <strong>
                    One last thing
                </strong>

                <p>
                    Take a screenshot of your score
                    and send it to
                    ${escapeHTML(creatorName)}.
                </p>

            </div>

        </div>
    `;
}


function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}