const URL_API = "https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes"
let quizz;
let noRepetitionArray = [];

const quiz = {
    title: "",
    image: "",
    questions: [],
    levels: []
}


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
    element.classList.add("hide");
}

function loadQuestions(response) {
    let question = document.querySelector(".questions");

    for (let i = 0; i < response.data[quizz].questions.length; i++) {
        question.innerHTML +=
            `
            <div class="nthQuestion n${i}">
                <div class="qTitle q${i}">
                    <h3>${response.data[quizz].questions[i].title}</h3>
                </div>
                <ul class="answers a${i}"></ul>
            </div>
            `
        loadAnswers(response, i);
        loadTitleColor(response, i);    //console.log(visibleStructure)
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
    scrollNextQuestion(index);
}

function scrollNextQuestion(index) {
    let answersList = document.querySelectorAll(`.answers.a${index} li`);
    const nextList = document.querySelector(`.nthQuestion.n${index + 1}`);
    console.log(nextList);

    for(let z = 0; z < answersList.length; z++) {
        if(answersList[z].classList.contains("opacity")) {
            setTimeout(() => {nextList.scrollIntoView()}, 2000);
        }
    }
}

function loadInterface(element){
    const visibleStructure = element.closest("main");
    const invisibleStructure = visibleStructure.nextElementSibling;
    hideContent(visibleStructure);
    invisibleStructure.classList.remove("hide");
    fillQuestions(invisibleStructure.querySelector("section"));
}

function validateInput(element){
    let form = element.closest("section").querySelector("form");
    switch(form.className){
        case "quizInfoForm":
            if(form[0].value.length < 20 || form[0].value.length > 65 || !urlValidation(form[1].value) || form[2].value < 3 || form[3].value < 2){
                alert("Por favor, preencha os dados corretamente.");
                break;
            } else{
                quiz.name = form[0].value;
                quiz.image = form[1].value;
                quiz.questions.length = form[2].value;
                quiz.levels.length = form[3].value;
                loadInterface(element);
                break;
            }
        case "quizQuestionsForm":
            form = element.closest("section").querySelectorAll(".quizQuestionsForm");
            console.log(form[2][0])   
            
    }

}

function fillQuestions(element){
    if(quiz.questions.length === 0){
        return;
    }
    
    for(let i = 0; i < quiz.questions.length; i++){
        element.innerHTML += questionsStructure(i);
    }

    element.innerHTML += `<button class="quizzInfoButton" onclick="validateInput(this)">Prosseguir para criar níveis</button>`
}

const questionsStructure = function (i){
    const questions = 
    `<div class="quizzQuestionContainer">
        <div class="quizQuestionsFormUnfolded">
            <h1 class="quizQuestionsFormTitle">Pergunta ${i+1}</h1>
            <div class="hide">
                <form class="quizQuestionsForm">
                    <input type="text" placeholder="   Texto da pergunta" />
                    <input type="text" placeholder="   Cor de fundo da pergunta" />
                </form>
                <h1 class="quizQuestionsFormTitle">Resposta correta</h1>
                <form class="quizQuestionsForm">
                    <input type="text" placeholder="   Resposta correta" />
                    <input type="url" placeholder="   URL da imagem" />
                </form>
                <h1 class="quizQuestionsFormTitle">Respostas incorretas</h1>
                <form class="quizQuestionsForm">
                    <div class="quizQuestionsFormIncorrect">
                        <input type="text" placeholder="   Resposta incorreta 1" />
                        <input type="url" placeholder="   URL da imagem 1" />
                    </div>
                    <div class="quizQuestionsFormIncorrect">
                        <input type="text" placeholder="   Resposta incorreta 2" />
                        <input type="url" placeholder="   URL da imagem 2" />
                    </div>
                    <div class="quizQuestionsFormIncorrect">
                        <input type="text" placeholder="   Resposta incorreta 3" />
                        <input type="url" placeholder="   URL da imagem 3" />
                    </div>
                </form>
            </div>
            <ion-icon onclick="editQuestion(this)" name="create-outline"></ion-icon>
        </div>
    </div>`

    return questions;

}

function editQuestion(element){
    const questionsFoms = element.previousElementSibling;
    const questionContainers = element.closest(".quizzQuestions").querySelectorAll(".quizzQuestionContainer");

     for(let i=0; i < questionContainers.length; i++){
         if(questionContainers[i].childNodes[1].childNodes[3].classList.contains("hide") === false){
             questionContainers[i].childNodes[1].classList.add("quizQuestionsFormUnfolded");
             questionContainers[i].childNodes[1].childNodes[3].classList.add("hide");
             questionContainers[i].childNodes[1].childNodes[5].classList.remove("hide");
         }
    }
    
    questionsFoms.classList.remove("hide");
    questionsFoms.parentNode.classList.remove("quizQuestionsFormUnfolded");
    element.classList.add("hide");
}

function urlValidation(str){
    try{
        new URL(str);
    }
    catch(error){
        return false;
    }
    return true;
}

function hexValidation(str){
    return /^#((0x){0,1}|#{0,1})([0-9A-F]{8}|[0-9A-F]{6})$/.test(str);
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

