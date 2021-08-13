const URL_API = "https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes"
let quizz;
let noRepetitionArray = [];


function comparador() { 
	return Math.random() - 0.5; 
}

function getQuizzes() {
    let promise = axios.get(`${URL_API}`);

    promise.then(listOtherQuizzes);
}

function chooseQuizz() {
    let promise = axios.get(`${URL_API}`);

    promise.then(startQuizz);
}

function listOtherQuizzes(response) {
    let listQuizzes = document.querySelector(".otherQuizzes");

    for (let i = 0; i < response.data.length; i++) {
        listQuizzes.innerHTML += `<li class="quizzContent quizzImageGradient" onclick="quizzSelected(this, ${i});"><span class="quizzTitle">${response.data[i].title}</span><img class="quizzImage" src="${response.data[i].image}"></li>`
    }
}

getQuizzes();

function quizzSelected(option, id) {
    quizz = id;

    let main = document.querySelector(".quizzesList");
    let quizzSelected = document.querySelector(".quizzSelected");

    main.classList.add("hide");
    quizzSelected.classList.remove("hide");

    chooseQuizz()
}

function startQuizz(response) {
    let quizzTitle = document.querySelector(".quizzSelectedTitle");

    quizzTitle.innerHTML = `<span class="quizzSelectedBackG"></span><span class="selectedTitle">${response.data[quizz].title}</span><img src="${response.data[quizz].image}">`;

    loadQuestions(response)
}

function hideContent(element) {
    element.closest(".quizzesList").classList.add("hide");
    quizzCreation.classList.remove("hide");
}

function loadQuestions(response) {
    let question = document.querySelector(".questions");

    for (let i = 0; i < response.data[quizz].questions.length; i++) {
        question.innerHTML +=
            `
            <div class="nthQuestion">
                <div class="qTitle q${i}">
                    <h3>${response.data[quizz].questions[i].title}</h3>
                </div>
                <ul class="answers a${i}"></ul>
            </div>
            `
        loadAnswers(response, i);
        loadTitleColor(response, i);
    }
}

function aleatoryArray(response, i) {
    let myArray = [];

    for(let k = 0; k < response.data[quizz].questions[i].answers.length; k++) {
        myArray.push(k);
        noRepetitionArray = [... new Set(myArray)]
        noRepetitionArray.sort(comparador);
    }

}

function loadAnswers(response, i) {
    let answer = document.querySelector(".answers.a" + i);
    
    aleatoryArray(response, i);

    for (let j = 0; j < response.data[quizz].questions[i].answers.length; j++) {
        answer.innerHTML +=
            `
            <li onclick="selectAnswer(this, ${i});">
                <div><img src="${response.data[quizz].questions[i].answers[noRepetitionArray[j]].image}"></div>
                <span class="hide" onclick="isCorrectAnswer(this)">${response.data[quizz].questions[i].answers[noRepetitionArray[j]].isCorrectAnswer}</span>
                <span>${response.data[quizz].questions[i].answers[noRepetitionArray[j]].text}</span>
            </li>
            `;
    }
}

function loadTitleColor(response, i) {
    document.querySelector(".qTitle.q" + i).style.backgroundColor = response.data[quizz].questions[i].color;
}

function selectAnswer(option, index) {
    let answersList = document.querySelectorAll(`.answers.a${index} li`);
    let trueOrFalse = option.querySelector(".hide").innerHTML;
    let textAnswer = option.querySelector("span:last-child");

    console.log(trueOrFalse)

    for(let z = 0; z < answersList.length; z++) {

        if(option.classList.contains("opacity")) {
            break;
        } else if(trueOrFalse === "true") {
            answersList[z].classList.add("opacity");
            option.classList.remove("opacity");
            textAnswer.style.color ="green";
        } else {
            answersList[z].classList.add("opacity");
            option.classList.remove("opacity");
            textAnswer.style.color ="red";
        }
    }
}

// function postQuizz {

    // let quizz = {
    //     id: 1,
    //     title: "Título do quizz",
    //     image: "https://http.cat/411.jpg",
    //     questions: [
    //         {
    //             title: "Título da pergunta 1",
    //             color: "#123456",
    //             answers: [
    //                 {
    //                     text: "Texto da resposta 1",
    //                     image: "https://http.cat/411.jpg",
    //                     isCorrectAnswer: true
    //                 },
    //                 {
    //                     text: "Texto da resposta 2",
    //                     image: "https://http.cat/412.jpg",
    //                     isCorrectAnswer: false
    //                 }
    //             ]
    //         },
    //         {
    //             title: "Título da pergunta 2",
    //             color: "#123456",
    //             answers: [
    //                 {
    //                     text: "Texto da resposta 1",
    //                     image: "https://http.cat/411.jpg",
    //                     isCorrectAnswer: true
    //                 },
    //                 {
    //                     text: "Texto da resposta 2",
    //                     image: "https://http.cat/412.jpg",
    //                     isCorrectAnswer: false
    //                 }
    //             ]
    //         },
    //         {
    //             title: "Título da pergunta 3",
    //             color: "#123456",
    //             answers: [
    //                 {
    //                     text: "Texto da resposta 1",
    //                     image: "https://http.cat/411.jpg",
    //                     isCorrectAnswer: true
    //                 },
    //                 {
    //                     text: "Texto da resposta 2",
    //                     image: "https://http.cat/412.jpg",
    //                     isCorrectAnswer: false
    //                 }
    //             ]
    //         }
    //     ],
    //     levels: [
    //         {
    //             title: "Título do nível 1",
    //             image: "https://http.cat/411.jpg",
    //             text: "Descrição do nível 1",
    //             minValue: 0
    //         },
    //         {
    //             title: "Título do nível 2",
    //             image: "https://http.cat/412.jpg",
    //             text: "Descrição do nível 2",
    //             minValue: 50
    //         }
    //     ]
    // }

    // let promisse = axios.postQuizz(`${URL_API}`, quizz);

// }

