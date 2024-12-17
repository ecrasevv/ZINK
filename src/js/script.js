let chartData = JSON.parse(sessionStorage.getItem('charData')) || [0,0,0,0,0,0,0];
let userCoins = JSON.parse(sessionStorage.getItem("token")) || 0;
let username = JSON.parse(sessionStorage.getItem('username')) || null;
let password = JSON.parse(sessionStorage.getItem('password')) || null;

// example quiz
const quizData = [
    {
        question: 'What is the binary representation of the decimal number 5?',
        options: ['101', '110', '111', '100'],
        answer: '101',
        difficult: 0.4,
    },
    {
        question: 'Which of these is not a programming language?',
        options: ['Python', 'Java', 'HTML', 'C++'],
        answer: 'HTML',
        difficult: 0.2,
    },
    {
        question: 'Which data structure uses the LIFO principle?',
        options: ['Queue', 'Stack', 'Array', 'Graph'],
        answer: 'Stack',
        difficult: 0.3,
    },
    {
        question: 'What does HTTP stand for?',
        options: ['HyperText Transfer Protocol', 'HighText Transfer Protocol', 'Hyper Transfer Text Protocol', 'HyperText Transmission Path'],
        answer: 'HyperText Transfer Protocol',
        difficult: 0.2,
    },
    {
        question: 'Which of the following is used to syle web pages?',
        options: ['HTML', 'CSS', 'Python', 'SQL'],
        answer: 'CSS',
        difficult: 0.1,
    },
    {
        question: 'What is the time complexity of searching for an element in a binary search tree (average case)?',
        options: ['O(n)', 'O(log n)', 'O(n^2)', 'O(1)'],
        answer: 'O(log n)',
        difficult: 0.5,
    },
    {
        question: 'What is a correct syntax to output "Hello, World!" in Python?',
        options: [
            'echo "Hello, World!"',
            'console.log("Hello, World!")',
            'print("Hello, World!")',
            'System.out.println("Hello, World!");',
        ],
        answer: 'print("Hello, World!")',
        difficult: 0.2,
    },
    {
        question: 'Which of the following is a type of operating system?',
        options: ['Windows', 'Excel', 'Chrome', 'Photoshop'],
        answer: 'Windows',
        difficult: 0.1,
    },
    {
        question: 'What is the primary purpose of a compiler?',
        options: [
            'To execute the code directly',
            'To convert high-level code into machine code',
            'To interpret the code line by line',
            'To debug the code',
        ],
        answer: 'To convert high-level code into machine code',
        difficult: 0.3,
    },
    {
        question: 'Which of these is a correct variable name in most programming languages?',
        options: ['1variable', 'variable_1', 'variable-1', 'var iable'],
        answer: 'variable_1',
        difficult: 0.2,
    },
    {
        question: 'What does "RAM" stand for in computing?',
        options: [
            'Random Access Memory',
            'Read Access Memory',
            'Random Allocation Module',
            'Read Allocation Memory',
        ],
        answer: 'Random Access Memory',
        difficult: 0.1,
    },
    {
        question: 'What is the output of 7 % 3 in most programming languages?',
        options: ['1', '2', '3', '0'],
        answer: '1',
        difficult: 0.3,
    },
    {
        question: 'Which one of these is an example of an IDE?',
        options: ['Microsoft Word', 'PyCharm', 'Linux', 'Apache'],
        answer: 'PyCharm',
        difficult: 0.2,
    }
];


//for quiz
const quizContainer = document.getElementById('quiz');
const quizResult = document.getElementById('quiz-result');
const submitButton = document.getElementById('submit');
const showAnswer = document.getElementById('show-incorrect-ans');
const tokensEarned = document.getElementById('token-earned'); //also used to show tokens in profile page
const getHintButton = document.getElementById('get-Hint');

// for leaderboard
var tabs = document.querySelectorAll(".leaderboard-tabs ul li");
var today = document.querySelector(".today");
var month = document.querySelector(".month");
var year = document.querySelector(".year");
var items = document.querySelectorAll(".lboard_item");

//for profile customization
const editButton   = document.getElementById("edit-button");
const imageUpload  = document.getElementById("image-upload");
const profileImage = document.getElementById("default-profile");
const profileName  = document.getElementById("profile-name"); 

let index = 0;
let userScore = 0;
let incorrectAnswer = [];
let earnedCoinsDuringQuiz = 0;
let coinsEarned = 0;
let indexIncorrect = 0; //index to scroll through incorrect options for a question

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
    return quizItem.difficult * 10;
}

function checkUserAnswer() {
    const userSelectedOption = document.querySelector('input[name="quiz"]:checked');
    const todayIndex = new Date().getDay();

    if (userSelectedOption != null) {
        const answer = userSelectedOption.value;

        // for now the questions will be asked in the same order as they are present within quizData 
        if (answer === quizData[index].answer) {
            userScore++;
            coinsEarned = coinsEarned + quizData[index].difficult * 10;
			
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
            indexIncorrect = 0; //reset the index of the incorrect options for the new question
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
    getHintButton.style.display = 'none';
    tokensEarned.style.display = 'none';

    // if the user has answered at least one question incorrectly 
    if (incorrectAnswer.length > 0) {
        showAnswer.style.display = 'block';
        showAnswer.style.margin = '10px auto 0';
        showAnswer.style.textAlign = 'center';
    }
	
	userCoins += coinsEarned;
	sessionStorage.setItem("token", JSON.stringify(userCoins));

    quizResult.innerHTML = `You scored ${userScore} out of ${quizData.length}, coins earned: ${coinsEarned}!<br>`;
    coinsEarned = 0;
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

//Function to get hints on quiz
function getHint() {
    const questionInfo = quizData[index];
    const options = document.querySelectorAll('.single-option');
    //filter through and get incorrect answers as DOM elements
    const incorrectOptions = Array.from(options).filter(answ => {
        const radio = answ.querySelector('input[type= "radio"]'); 
        return radio && radio.value != questionInfo.answer;
    });

    if(userCoins <= 0) {
        alert("Not enough tokens!!");
        return;
    } 

    if(indexIncorrect >= 0 && indexIncorrect < incorrectOptions.length) {
        if(questionInfo.difficult >= 0.1 && questionInfo.difficult <= 0.2 && userCoins >= 1) {
			console.log("Difficulty: 0.1, 0.2 (-1) and userCoins before: ", userCoins);
            userCoins -= 1;
			console.log("Difficulty: 0.1, 0.2 and userCoins before: ", userCoins);
        } else if(questionInfo.difficult >= 0.3 && questionInfo.difficult <= 0.4  && userCoins >= 2) {
			console.log("Difficulty: 0.3, 0.4 (-2) and userCoins before: ", userCoins);
            userCoins -= 2;
			console.log("Difficulty: 0.3, 0.4 and userCoins after: ", userCoins);
        } else if(questionInfo.difficult === 0.5 && userCoins >= 3) {
			console.log("Difficulty: 0.5 (-3) and userCoins before: ", userCoins);
            userCoins -= 3;
			console.log("Difficulty: 0.5 and userCoins: ", userCoins);
        } else {
			alert("Not enough tokens!!");
			return;
		}

        incorrectOptions[indexIncorrect].classList.add('hint-wrong');
        indexIncorrect++;

        sessionStorage.setItem("token", JSON.stringify(userCoins));
        document.getElementById("token-earned").textContent = ` Your tokens: ${userCoins}`;
		
	
    } else {
        alert("No more hints!!");
    }
}

// using Chart.js to visualize user performance for the week
function showUserChart() {
    const xValuesDays = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
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

// get credentials
function getCredentials() {
    const loginButton = document.getElementById('login-button');
    loginButton.addEventListener('click', function(event) {
        event.preventDefault();
        username = document.getElementById('fiscal-code').value;
        password = document.getElementById('userpassword').value;
        sessionStorage.setItem('username', JSON.stringify(username));
        sessionStorage.setItem('password', JSON.stringify(password));
        callApi();
    });
}

// API for the login
async function callApi() {
    const baseUrl = "https://api.uniparthenope.it";
    const apiUrl = `${baseUrl}/UniparthenopeApp/v1/login`;

    const headers = new Headers({
        'Authorization': 'Basic ' + btoa(`${username}:${password}`)  
    });

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: headers
        });
        console.log("Response status: " + response.status);
        const responseBody = await response.json();
        console.log('Response API:', responseBody);

        if (response.status === 200) {
            window.location.href = 'index.html';
            sessionStorage.setItem("profileName", responseBody.user.firstName);
        } else {
            if (response.status === 401) {
                alert("Wrong credentials, try again!");
            } else {
                alert("Error, try again later.");
            }
        } 
    } catch (error) {
        console.log("error: " + error);
        alert("API error.");
    }
}

function checkPassword() {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', function(event) {
        const passwordInput = document.getElementById('userpassword');
        if (passwordInput.value.length < 8) {
            alert('Password must be minimum 8 characters long.');
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

// set the name of the user in the profile page
function setProfileName() {
    profileName.textContent = sessionStorage.getItem('username');
}

function showUserTokens() {
    tokensEarned.innerHTML = 
        `<br> Your tokens: ${userCoins}<br>`;

    tokensEarned.style.fontWeight = 'bold';

}

// change user profile name and profile image
function customizeProfile() {
    const savedProfileName = sessionStorage.getItem("profileName");
    const savedProfileImage = sessionStorage.getItem("profileImage");

    if (savedProfileName) {
        profileName.textContent = savedProfileName;
    }
    if (savedProfileImage) {
        profileImage.src = savedProfileImage;
    }

    editButton.addEventListener("click", () => {
        if (editButton.textContent === "Edit Profile") {
            profileName.textContent = "";
            profileName.contentEditable = "true";
            profileName.focus();
            editButton.textContent = "Save Profile";
            profileImage.style.cursor = "pointer";

            profileImage.addEventListener("click", () => {
                imageUpload.click();
            });

            imageUpload.addEventListener("change", (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        profileImage.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
        } else {
            profileName.contentEditable = "false";
            editButton.textContent = "Edit Profile";

            // save new name
            const newProfileName = profileName.textContent.trim();

            // check new name lenght and check for spaces with \s regExp
            if (newProfileName.length === 0 || newProfileName.length > 10 || /\s/.test(newProfileName)) {
                alert("The new name must not contain spaces and must be less than 10 characters!");
                profileName.contentEditable = "true";
                editButton.textContent = "Save Profile";
                return;
            }

            // save changes in sessionStorage
            sessionStorage.setItem("profileName", newProfileName);
            sessionStorage.setItem("profileImage", profileImage.src);
            alert("Profile updated successfully!");
        }
    });
}

// handle content based on page id
document.addEventListener("DOMContentLoaded", () => {
    const pageId = document.body.id;

    if (pageId == "profile-page") {
        showUserChart();
        showUserTokens();
        customizeProfile();
    }

    if (pageId == "quiz-page") {
        showUserTokens();
        displayQuestion()
        getHintButton.addEventListener('click', getHint);
        showAnswer.style.display = 'none';
        submitButton.addEventListener('click', checkUserAnswer);
        showAnswer.addEventListener('click', displayIncorrectAnswer);
    }

    if (pageId == "login-page") {
        checkPassword();
        getCredentials();
        showHidePassword();
    }
});
