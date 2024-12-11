let chartData = JSON.parse(sessionStorage.getItem('charData')) || [0,0,0,0,0,0,0];
let userCoins = JSON.parse(sessionStorage.getItem("token")) || 0;

/// example quiz
const quizData = [
    {
        question: 'How much is 2+2?',
        options: ['5', '4', '10', '8'],
        answer: '4',
        difficult: 0.1,
    },
    {
        question: 'What is the capital of Italy?',
        options: ['Rome', 'Tourin', 'Milan', 'Naples'],
        answer: 'Rome',
        difficult: 0.3,
    }
]

const quizContainer = document.getElementById('quiz');
const quizResult = document.getElementById('quiz-result');
const submitButton = document.getElementById('submit');
const showAnswer = document.getElementById('show-incorrect-ans');
const tokensEarned = document.getElementById('token-earned');
let profileName;

// for leaderboard
/*! try to use getElementById() */
var tabs = document.querySelectorAll(".leaderboard-tabs ul li");
var today = document.querySelector(".today");
var month = document.querySelector(".month");
var year = document.querySelector(".year");
var items = document.querySelectorAll(".lboard_item");

let index = 0;
let userScore = 0;
let incorrectAnswer = [];

function displayQuestion() {
    const questionInfo = quizData[index];

    const quizQuestionDiv = document.createElement('div');
    quizQuestionDiv.className = 'quiz-question';
    quizQuestionDiv.innerHTML = questionInfo.question;

    const quizOptionsDiv = document.createElement('div');
    quizOptionsDiv.className = 'quiz-options';

    // build the quiz and append it to the quizContainer
    for (let i = 0; i < questionInfo.options.length; ++i) {
        const option = document.createElement('label');
        option.className = 'single-option';

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'quiz';
        radio.value = questionInfo.options[i];

        const optionText = document.createTextNode(questionInfo.options[i]);

        option.appendChild(radio);
        option.appendChild(optionText);

        quizOptionsDiv.appendChild(option);
    }

    // clear and append
    quizContainer.innerHTML = ''; 
    quizContainer.appendChild(quizQuestionDiv);
    quizContainer.appendChild(quizOptionsDiv);
}

// multiply the difficult value of the passed question * 10
// add the result to the userCoin
function calculateCoins(quizItem) {
    userCoins = userCoins + quizItem.difficult * 10;
	sessionStorage.setItem("token", JSON.stringify(userCoins));
    return userCoins;
}

function checkUserAnswer() {
    const userSelectedOption = document.querySelector('input[name="quiz"]:checked');
    const todayIndex = new Date().getDay();

    if (userSelectedOption != null) {
        const answer = userSelectedOption.value;

        // for now the questions will be asked in the same order as they are present within quizData 
        if (answer === quizData[index].answer) {
            userScore++;
            userCoins = calculateCoins(quizData[index]);
        } else {
            incorrectAnswer.push({
                question: quizData[index].question,
                incorrect: answer,
                correct: quizData[index].answer,
            });
        }
        // increment -> goto next question in quizData
        index++;
        
        // reset
        userSelectedOption.checked = false;
        
        // < : next question
        // > : result
        if (index < quizData.length) {
            displayQuestion();
        } else {
            chartData[todayIndex] += userScore;
            sessionStorage.setItem('chartData', JSON.stringify(chartData));
            displayResult();
        }
    }
}

function displayResult() {
    quizContainer.style.display = 'none';
    submitButton.style.display = 'none';

    // if the user has answered at least one question incorrectly 
    if (incorrectAnswer.length > 0) {
        showAnswer.style.display = 'block';
        showAnswer.style.margin = '10px auto 0';
        showAnswer.style.textAlign = 'center';
    }

    quizResult.innerHTML = `You scored ${userScore} out of ${quizData.length}, coins earned: ${userCoins}!<br>`;

    if (document.body.id == "profile-page") {
        showUserChart();
    }
}

function displayIncorrectAnswer() {
    showAnswer.style.display = 'none';
    for (let i = 0; i < incorrectAnswer.length; i++) {
        quizResult.innerHTML += 
        `
        <br>Qestion: ${incorrectAnswer[i].question}<br>
        Your guess: ${incorrectAnswer[i].incorrect}<br>
        Correct guess: ${incorrectAnswer[i].correct}<br>
        `
    }
}

// using Chart.js to visualize user performance for the week
function showUserChart() {
    const xValuesDays = ["D", "L", "M", "M", "G", "V", "S"];
    const storedChartData = JSON.parse(sessionStorage.getItem('chartData')) || [0, 0, 0, 0, 0, 0, 0];

    new Chart("userProgressChart", {
        type: "bar",
        data: {
            labels: xValuesDays,
            datasets: [{
                data: storedChartData,
                backgroundColor: "rgba(150, 74, 189, 1)",
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: "Youre Score Per Day"
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

/**
 * API
 */
function callApi() {
}

function checkPassword() {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', function(event) {
        const passwordInput = document.getElementById('userpassword');
        if (passwordInput.value.length < 8) {
            alert('password must be minimum 8 characters long.');
            event.preventDefault();
        }
    });
}

function showHidePassword() {
    document.querySelector('.show-hide-b').addEventListener('click', function() {
        const passwordInput = document.getElementById('userpassword');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            this.textContent = 'HIDE';
        } else {
            passwordInput.type = 'password';
            this.textContent = 'SHOW';
        }
    });
}

// get the username from the login form
function getProfileName() {
}

// set the name of the user in the profile page
function setProfileName() {
}

function leaderboard() {
    /*! implement... */
    /* show only the content of the selected pane */
}

function showUserTokens() {
    tokensEarned.innerHTML = 
    `<br> Tokens: ${userCoins}<br>`;
}

// handle content based on page id
document.addEventListener("DOMContentLoaded", () => {
    const pageId = document.body.id;
    if (pageId == "profile-page") {
        showUserChart();
        showUserTokens();
    }
    if (pageId == "quiz-page") {
        displayQuestion()
        showAnswer.style.display = 'none';
        submitButton.addEventListener('click', checkUserAnswer);
        showAnswer.addEventListener('click', displayIncorrectAnswer);
    }
    if (pageId == "login-page") {
        // callApi();
        checkPassword();
        showHidePassword();
    }
});
