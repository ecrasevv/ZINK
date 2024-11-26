/// example quiz, array of objects
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

let index = 0;
let userScore = 0;
let userCoins = 0;
let incorrectAnswer = [];

let chartData = JSON.parse(localStorage.getItem('charData')) || [0,0,0,0,0,0,0];

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
    return userCoins;
}

function updateChart() {
	let dayIndex = new Date().getDay();
	
	data.datasets[0].data[dayIndex]++;
	chart.update();
	
	localStorage.setItem('charData',JSON.stringify(data.datasets[0].data));
	
	console.log('Dati salvati e aggiornati:', data.datasets[0].data);
}

function checkUserAnswer() {
    const userSelectedOption = document.querySelector('input[name="quiz"]:checked');

    if (userSelectedOption != null) {
        const answer = userSelectedOption.value;

        // for now the questions will be asked in the same order as they are present within quizData 
        if (answer === quizData[index].answer) {
            userScore++;
            userCoins = calculateCoins(quizData[index]);
			
			updateChart();
			
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

showAnswer.style.display = 'none';
submitButton.addEventListener('click', checkUserAnswer);
showAnswer.addEventListener('click', displayIncorrectAnswer);
displayQuestion()
