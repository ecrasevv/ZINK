/// example quiz, array of objects
const quizData = [
    {
        question: 'How much is 2+2?',
        options: ['5', '4', '10', '8'],
        answer: '4',
    },
    {
        question: 'What is the capital of Italy?',
        options: ['Rome', 'Tourin', 'Milan', 'Naples'],
        answer: 'Rome',
    }
]

const quizContainer = document.getElementById('quiz');
const quizResult = document.getElementById('quiz-result');
const submitButton = document.getElementById('submit');

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

function checkUserAnswer() {
    const userSelectedOption = document.querySelector('input[name="quiz"]:checked');

    if (userSelectedOption != null) {
        const answer = userSelectedOption.value;

        // for now the questions will be asked in the same order as they are present within quizData 
        if (answer === quizData[index].answer) {
            userScore++;
        } else {
            incorrectAnswer.push({
                question: quizData[index].question,
                incorrectAnswer: answer,
                corretAnswer: quizData[index].answer,
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
    quizResult.innerHTML = `You scored ${userScore} out of ${quizData.length}!`;
}

submitButton.addEventListener('click', checkUserAnswer);
displayQuestion()

