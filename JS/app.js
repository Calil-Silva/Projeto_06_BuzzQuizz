const URL_API = "https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes"
let quizz;
let myQuizz;
let noRepetitionArray = [];
let rights = 0;
let score = 0;
let counterOne = 0;
let quizzScoreCard;
let numQuestions;
let numLevels;

let array = [];
let myArray = [];
let thisArray = [];

let myIds;

let arrayIds = [];

let arrayIdDeserialized = JSON.parse(localStorage.getItem("array"));

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

function chooseMyQuizz(id) {
    let promise = axios.get(`${URL_API}/${id}`);

    promise.then(startMyQuizz);

}

function loadScore() {
    let promise = axios.get(`${URL_API}`);

    promise.then(quizzResult);
}

function loadMyScore(id) {
    let promise = axios.get(`${URL_API}/${id}`);

    promise.then(myQuizzResult);
}

function listOtherQuizzes(response) {
    let listQuizzes = document.querySelector(".otherQuizzes");
    
    if(arrayIdDeserialized !== null) {
        for (let i = 0; i < response.data.length; i++) {
            array.push(response.data[i].id);
            myArray.push(response.data[i].id);
        }
    
        for(let i = 0; i < arrayIdDeserialized.length; i++) {
            let indx = array.indexOf(arrayIdDeserialized[i]);
            array[indx] = "";
        }
        for (let k = 0; k < response.data.length; k++) {
            if(response.data[k].id === array[k]) {
                listQuizzes.innerHTML += `
                    <li class="quizzContent quizzImageGradient" onclick="quizzSelected(this, ${k});">
                        <span class="quizzTitle">${response.data[k].title}</span>
                        <img class="quizzImage" src="${response.data[k].image}">
                    </li>`
            }
    }
    CreatedQuizzes()
} 

    
    if(arrayIdDeserialized === null) {
        for (let k = 0; k < response.data.length; k++) {
                listQuizzes.innerHTML += `
                    <li class="quizzContent quizzImageGradient" onclick="quizzSelected(this, ${k});">
                        <span class="quizzTitle">${response.data[k].title}</span>
                        <img class="quizzImage" src="${response.data[k].image}">
                    </li>`
            }
            nonCreatedQuizzes()
    }
}

getQuizzes();

function quizzSelected(option, id) {
    quizz = id;

    let main = document.querySelector(".quizzesList");
    let quizzSelected = document.querySelector(".quizzSelected");

    main.classList.add("hide");
    quizzSelected.classList.remove("hide");

    chooseQuizz();
}

function myQuizzSelected(option, id) {
    myQuizz = id
    let main = document.querySelector(".quizzesList");
    let quizzSelected = document.querySelector(".quizzSelected");

    main.classList.add("hide");
    quizzSelected.classList.remove("hide");

    chooseMyQuizz(id);
}

function startQuizz(response) {
    let quizzTitle = document.querySelector(".quizzSelectedTitle");

    quizzTitle.innerHTML =
        `<span class="quizzSelectedBackG"></span>
         <span class="selectedTitle">${response.data[quizz].title}</span>
         <img src="${response.data[quizz].image}">
         `;

    loadQuestions(response)
}

function startMyQuizz(response) {
    let quizzTitle = document.querySelector(".quizzSelectedTitle");

    quizzTitle.innerHTML =
        `<span class="quizzSelectedBackG"></span>
         <span class="selectedTitle">${response.data.title}</span>
         <img src="${response.data.image}">
         `;

    loadMyQuestions(response)
}

function hideContent(element) {
    element.classList.add("hide");
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
                <div class="nextQuestions n${i}"></div>
            </div>
            `;
        loadAnswers(response, i);
        loadTitleColor(response, i);    
    }
}

function loadMyQuestions(response) {
    let question = document.querySelector(".questions");

    for (let i = 0; i < response.data.questions.length; i++) {
        question.innerHTML +=
            `
            <div class="nthQuestion">
                <div class="qTitle q${i}">
                    <h3>${response.data.questions[i].title}</h3>
                </div>
                <ul class="answers a${i}"></ul>
                <div class="nextQuestions n${i}"></div>
            </div>
            `;
        loadMyAnswers(response, i);
        loadMyTitleColor(response, i);    
    }
}

function aleatoryArray(response, i) {
    let myArray = [];

    for (let k = 0; k < response.data[quizz].questions[i].answers.length; k++) {
        myArray.push(k);
        noRepetitionArray = [... new Set(myArray)]
        noRepetitionArray.sort(comparador);
    }

}

function myAleatoryArray(response, i) {
    let myArray = [];

    for (let k = 0; k < response.data.questions[i].answers.length; k++) {
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
                <div class="container"><img src="${response.data[quizz].questions[i].answers[noRepetitionArray[j]].image}"></div>
                <span class="hide" onclick="isCorrectAnswer(this)">${response.data[quizz].questions[i].answers[noRepetitionArray[j]].isCorrectAnswer}</span>
                <span>${response.data[quizz].questions[i].answers[noRepetitionArray[j]].text}</span>
            </li>
            `;//console.log(visibleStructure)
    }
}

function loadMyAnswers(response, i) {
    let answer = document.querySelector(".answers.a" + i);

    myAleatoryArray(response, i);

    for (let j = 0; j < response.data.questions[i].answers.length; j++) {
        answer.innerHTML +=
            `
            <li onclick="selectAnswer(this, ${i}, ${response.data.id});">
                <div class="container"><img src="${response.data.questions[i].answers[noRepetitionArray[j]].image}"></div>
                <span class="hide" onclick="isCorrectAnswer(this)">${response.data.questions[i].answers[noRepetitionArray[j]].isCorrectAnswer}</span>
                <span>${response.data.questions[i].answers[noRepetitionArray[j]].text}</span>
            </li>
            `;
    }
}

function loadTitleColor(response, i) {
    document.querySelector(".qTitle.q" + i).style.backgroundColor = response.data[quizz].questions[i].color;
}

function loadMyTitleColor(response, i) {
    document.querySelector(".qTitle.q" + i).style.backgroundColor = response.data.questions[i].color;
}

function selectAnswer(option, index, id) {
    let answersList = document.querySelectorAll(`.answers.a${index} li`);
    let trueOrFalse = option.querySelector(".hide").innerHTML;
    let textAnswer = option.querySelector("span:last-child");
    let answers = document.querySelectorAll(".answers");
    let z = 0;

    for (let z = 0; z < answersList.length; z++) {

        if (option.classList.contains("opacity")) {
            break;
        } else if (trueOrFalse === "true") {
            answersList[z].classList.add("opacity");
            answersList[z].onclick = null;
            option.classList.remove("opacity");
            textAnswer.style.color = "green";
        } else {
            answersList[z].classList.add("opacity");
            answersList[z].onclick = null;
            option.classList.remove("opacity");
            textAnswer.style.color = "red";
        }
    }

    if (trueOrFalse === "true") {
        rights++;

        score = Math.round((rights / answers.length) * 100);

    };

    counterOne++

    scrollNextQuestion(index);

    if (counterOne === answers.length && !id) {
        loadScore();
    } else if (counterOne === answers.length){
        loadMyScore(myQuizz);
    }

}

function scrollNextQuestion(index) {
    let answersList = document.querySelectorAll(`.answers.a${index} li`);
    const nextList = document.querySelector(`.nextQuestions.n${index}`);

    for (let z = 0; z < answersList.length; z++) {
        if (answersList[z].classList.contains("opacity")) {
            setTimeout(() => { nextList.scrollIntoView() }, 2000);
        }
    }
}

function quizzResult(response) {
    let quizzScoreCard = document.querySelector(".result");
    let restartButton = document.querySelector(".restartQuizz");
    let homePageButton = document.querySelector(".homePage")
    let counterTwo = 0;

    quizzScoreCard.style.display = "flex";
    restartButton.style.display = "block";
    homePageButton.style.display = "block";

    for (let z = 0; z < response.data[quizz].levels.length; z++) {

        if (response.data[quizz].levels[z].minValue <= score) {
            counterTwo++;
        };
        quizzScoreCard.innerHTML =
            `
    <div class="resultTitle">
                <h3>${score}% de acerto: ${response.data[quizz].levels[counterTwo - 1].title}</h3>
            </div>
            <div>
                <span><img src="${response.data[quizz].levels[counterTwo - 1].image}"></span>
                <p>${response.data[quizz].levels[counterTwo - 1].text}</p>
            </div>
    `;
    };
}

function myQuizzResult(response) {
    let quizzScoreCard = document.querySelector(".result");
    let restartButton = document.querySelector(".restartQuizz");
    let homePageButton = document.querySelector(".homePage")
    let counterTwo = 0;

    quizzScoreCard.style.display = "flex";
    restartButton.style.display = "block";
    homePageButton.style.display = "block";

    for (let z = 0; z < response.data.levels.length; z++) {

        if (response.data.levels[z].minValue <= score) {
            counterTwo++;
        };
        quizzScoreCard.innerHTML =
            `
    <div class="resultTitle">
                <h3>${score}% de acerto: ${response.data.levels[counterTwo - 1].title}</h3>
            </div>
            <div>
                <span><img src="${response.data.levels[counterTwo - 1].image}"></span>
                <p>${response.data.levels[counterTwo - 1].text}</p>
            </div>
    `;
    };
}

function restartQuizz() {
    let quizzScoreCard = document.querySelector(".result");
    let question = document.querySelector(".questions");
    let restartButton = document.querySelector(".restartQuizz");
    let homePageButton = document.querySelector(".homePage");

    rights = 0;
    score = 0;
    counterOne = 0;


    quizzScoreCard.style.display = "none";
    quizzScoreCard.innerHTML = "";

    question.innerHTML = "";

    if(quizz !== undefined) {
        chooseQuizz();
    } else {
        chooseMyQuizz(myQuizz);
    }

    restartButton.style.display = "none";
    homePageButton.style.display = "none";

}

function backHomePage() {
    window.location.reload();
}

function loadInterface(element, type) {
    const visibleStructure = element.closest("main");
    const invisibleStructure = visibleStructure.nextElementSibling;
    hideContent(visibleStructure);
    invisibleStructure.classList.remove("hide");
    fillElements(invisibleStructure.querySelector("section"), type);
}

const createErrorWarning = (element, text, type) => {
    newElement = document.createElement(type);
    newElement.classList.add("errorText");
    newElement.innerHTML = text;
    element.parentNode.insertBefore(newElement, element.nextSibling);
}

const isFillCorrect = (formItem) => {
    if(!formItem.classList.contains("error")){
        return true;
    }
    return false;
}

const validateQuizInfo = (formItem) => {
    switch(formItem.classList[0]){
        case "quizTitle":
            if(formItem.value.length < 20){
                if(!formItem.classList.contains("error")){
                    formItem.classList.add("error");
                    createErrorWarning(formItem, "O título do quiz deve ter no mínimo 20 caracteres.", "span");
                }
            } else if(formItem.value.length > 65){
                if(!formItem.classList.contains("error")){
                    formItem.classList.add("error");
                    createErrorWarning(formItem, "O título do quiz deve ter no máximo 65 caracteres.", "span");
                }
            } else{
                if(formItem.classList.contains("error")){
                    formItem.classList.remove("error");
                    formItem.nextSibling.remove("span");
                }

                quiz.title = formItem.value;
            } break;
        case "quizImage":
            if(!isValidURL(formItem.value)){
                if(!formItem.classList.contains("error")){
                    formItem.classList.add("error");
                    createErrorWarning(formItem, "O valor informado não é uma URL válida.", "span");
                }
            } else{
                if(formItem.classList.contains("error")){
                    formItem.classList.remove("error");
                    formItem.nextSibling.remove("span");
                }

                quiz.image = formItem.value;
            } break;
        case "quizNumQuestions":
            if(formItem.value < 3){
                if(!formItem.classList.contains("error")){
                    formItem.classList.add("error");
                    createErrorWarning(formItem, "O quiz deve ter no mínimo 3 perguntas.", "span");
                }
            } else{
                if(formItem.classList.contains("error")){
                    formItem.classList.remove("error");
                    formItem.nextSibling.remove("span");
                }

                numQuestions = formItem.value;
            } break;

        case "quizNumLevels":
            if(formItem.value < 2){
                if(!formItem.classList.contains("error")){
                    formItem.classList.add("error");
                    createErrorWarning(formItem, "O quiz deve ter no mínimo 2 níveis.", "span");
                }
            } else{
                if(formItem.classList.contains("error")){
                    formItem.classList.remove("error");
                    formItem.nextSibling.remove("span");
                }

                numLevels = formItem.value;
            } break;
    } 
}

const validateQuestionHeader = (question, formItem) => {
    switch(formItem.classList[0]){
        case "questionText":
            if(formItem.value.length < 20){
                if(!formItem.classList.contains("error")){
                    formItem.classList.add("error");
                    createErrorWarning(formItem, "O texto da pergunta deve ter no mínimo 20 caracteres.", "span");
                }
            }else{
                if(formItem.classList.contains("error")){
                    formItem.classList.remove("error");
                    formItem.nextSibling.remove("span");
                }

                question.title = formItem.value;
            } break;
        case "questionBackgroundColor":
            if(!isValidHex(formItem.value)){
                if(!formItem.classList.contains("error")){
                    formItem.classList.add("error");
                    createErrorWarning(formItem, "O valor informado não é um HEX válido.", "span");
                }
            } else{
                if(formItem.classList.contains("error")){
                    formItem.classList.remove("error");
                    formItem.nextSibling.remove("span");
                }

                question.color = formItem.value;
            } break;
    }
}

const validateCorrectAnswer = (answer, formItem) => {
    switch(formItem.classList[0]){
        case "correctAnswerText":
            if(formItem.value.length === 0){
                if(!formItem.classList.contains("error")){
                    formItem.classList.add("error");
                    createErrorWarning(formItem, "O texto da resposta não pode estar vazio.", "span");
                }
            }else{
                if(formItem.classList.contains("error")){
                    formItem.classList.remove("error");
                    formItem.nextSibling.remove("span");
                }

                answer.text = formItem.value;
            } break;
        case "correctAnswerImage":
            if(!isValidURL(formItem.value)){
                if(!formItem.classList.contains("error")){
                    formItem.classList.add("error");
                    createErrorWarning(formItem, "O valor informado não é uma URL válida.", "span");
                }
            } else{
                if(formItem.classList.contains("error")){
                    formItem.classList.remove("error");
                    formItem.nextSibling.remove("span");
                }

                answer.image = formItem.value;
            } break;
    }

    answer.isCorrectAnswer = true;
}

const validateIncorrectAnswer = (answer, formItem, index) => {
    switch(formItem.classList[0]){
        case "incorrectAnswer":
            if(formItem.value.length === 0){
                if(!formItem.classList.contains("error")){
                    formItem.classList.add("error");
                    createErrorWarning(formItem, "O texto da resposta não pode estar vazio.", "span");
                }
            }else{
                if(formItem.classList.contains("error")){
                    formItem.classList.remove("error");
                    formItem.nextSibling.remove("span");
                }

                answer.text = formItem.value;
            } break;
        case "incorrectURL":
            if(!isValidURL(formItem.value)){
                if(!formItem.classList.contains("error")){
                    formItem.classList.add("error");
                    createErrorWarning(formItem, "O valor informado não é uma URL válida.", "span");
                }
            } else{
                if(formItem.classList.contains("error")){
                    formItem.classList.remove("error");
                    formItem.nextSibling.remove("span");
                }

                answer.image = formItem.value;
            } break;
    }

    answer.isCorrectAnswer = false;
}

const validateQuizQuestions = (form) => {
    const question = createQuestion();
    const formItem = form.querySelectorAll(".quizQuestionsForm");
    for(let i = 0; i < formItem.length; i++){
        let className = formItem[i].classList[1];
        switch(className){
            case "questionHeader":
                Array.from(formItem[i].elements).forEach(validateQuestionHeader.bind(null, question));
                break;
            case "correctAnswer":
                const correctAnswer = createCorrectAnswer();
                Array.from(formItem[i].elements).forEach(validateCorrectAnswer.bind(null, correctAnswer));
                if(Array.from(formItem[i].elements).every(isFillCorrect)){
                    question.answers.push(correctAnswer)
                }
                break;
            case "incorrectAnswer":
                const incorrectAnswer = [createIncorrectAnswer1(), createIncorrectAnswer2(), createIncorrectAnswer3()];
                for(let j = 0; j < incorrectAnswer.length; j++){
                    Array.from(formItem[i].elements).forEach(validateIncorrectAnswer.bind(null, incorrectAnswer[j]));
                    if(Array.from(formItem[i].elements).every(isFillCorrect)){
                        question.answers.push(incorrectAnswer[j])
                    }
                }
                break;
        }
    }
    quiz.questions.push(question);
}

const validateQuizLevels = (level, formItem) => {
    switch(formItem.classList[0]){
        case "levelTitle":
            if(formItem.value.length < 10){
                if(!formItem.classList.contains("error")){
                    formItem.classList.add("error");
                    createErrorWarning(formItem, "O texto do nível deve ter no mínimo 10 caracteres.", "span");
                }
            }else{
                if(formItem.classList.contains("error")){
                    formItem.classList.remove("error");
                    formItem.nextSibling.remove("span");
                }

                level.title = formItem.value;

            } break;
       case "levelPercentage":
            if(formItem.value > 100){
                if(!formItem.classList.contains("error")){
                    formItem.classList.add("error");
                    createErrorWarning(formItem, "A porcentagem de acerto mínima não deve ultrapassar o valor de 100%.", "span");
                }
            }else if(formItem.value < 0){
                if(!formItem.classList.contains("error")){
                    formItem.classList.add("error");
                    createErrorWarning(formItem, "A porcentagem de acerto mínima não deve ser inferior a 100%.", "span");
                }
            }else if(formItem.value === ""){
                if(!formItem.classList.contains("error")){
                    formItem.classList.add("error");
                    createErrorWarning(formItem, "A porcentagem de acerto mínima não deve estar vazia", "span");
                }
            }else{
                if(formItem.classList.contains("error")){
                    formItem.classList.remove("error");
                    formItem.nextSibling.remove("span");
                }

                level.minValue = formItem.value;

            } break;
        case "levelImage":
            if(!isValidURL(formItem.value)){
                if(!formItem.classList.contains("error")){
                    formItem.classList.add("error");
                    createErrorWarning(formItem, "O valor informado não é uma URL válida.", "span");
                }
            } else{
                if(formItem.classList.contains("error")){
                    formItem.classList.remove("error");
                    formItem.nextSibling.remove("span");
                }

                level.image = formItem.value;

            } break;
        case "levelDescription":
            if(formItem.value.length < 30){
                if(!formItem.classList.contains("error")){
                    formItem.classList.add("error");
                    createErrorWarning(formItem, "A descrição do nível deve ter no mínimo 30 caracteres.", "span");
                }
            }else{
                if(formItem.classList.contains("error")){
                    formItem.classList.remove("error");
                    formItem.nextSibling.remove("span");
                }

                level.text = formItem.value;

            } break;
    }
}

function validateQuizLevel(form){
    const level = createLevel();
    Array.from(form).forEach(validateQuizLevels.bind(null, level));
    if(Array.from(form).every(isFillCorrect)){
        quiz.levels.push(level);
    }
    
}

function validateInput(element) {
    let form = element.closest("section").querySelector("form");
    let className =  form.classList.item(0)
    switch (className) {
        case "quizInfoForm":
            Array.from(form.elements).forEach(validateQuizInfo);
            if(Array.from(form.elements).every(isFillCorrect)){
                loadInterface(element, className);
                clearInput(form);
            } break;
        case "quizQuestionsForm":
            form = element.closest("section").querySelectorAll(".quizQuestion");
            form.forEach(validateQuizQuestions);
            if(Array.from(form).every(isFillCorrect)){
                loadInterface(element, className);
                clearInput(form);
            } break;
        case "quizLevelsForm":
            form = element.closest("section").querySelectorAll(".quizLevelsForm");
            form2 = element.closest("section").querySelectorAll("input");
            form.forEach(validateQuizLevel);
            if(Array.from(form2).every(isFillCorrect)){
                loadInterface(element, className);
                clearInput(form);
                postQuizz();
            } break;
    }
}
function createLevel(){
    const level = {
        title: "",
        image: "",
        text: "",
        minValue: 0
    }

    return level;
}
function createQuestion(){
    const question = {
        title: "",
        color: "",
        answers: []
    }

    return question;
}

function createCorrectAnswer(){
    const answer = {
        text: "",
        image: "",
        isCorrectAnswer: true
    }

    return answer;

}


function createIncorrectAnswer1(){
    const answer = {
        text: "",
        image: "",
        isCorrectAnswer: false
    }

    return answer;

}

function createIncorrectAnswer2(){
    const answer = {
        text: "",
        image: "",
        isCorrectAnswer: false
    }

    return answer;

}

function createIncorrectAnswer3(){
    const answer = {
        text: "",
        image: "",
        isCorrectAnswer: false
    }

    return answer;

}

function clearInput(form){
    for(let i = 0; i < form.length; i++){
        form[i].value = "";
    }
}

function fillElements(element, type) {
    if (type === "quizInfoForm") {
        for (let i = 0; i < numQuestions; i++) {
            element.innerHTML += questionsStructure(i);
        }
        element.innerHTML += `<button class="quizzInfoButton" onclick="validateInput(this)">Prosseguir para criar níveis</button>`
    } else if (type === "quizQuestionsForm") {
        for (let i = 0; i < numLevels; i++) {
            element.innerHTML += levelStructrue(i);
        }
        element.innerHTML += `<button class="quizzInfoButton" onclick="validateInput(this)">Finalizar Quizz</button>`
    }
}

const levelStructrue = function (i) {
    const levels =
        `<div class="quizzQuestionContainer">
        <div class="quizQuestionsFormUnfolded">
            <h1 class="quizLevelsFormTitle">Nível ${i + 1}</h1>
            <div class="hide">
                <form class="quizLevelsForm">
                    <input class="levelTitle" type="text" placeholder="   Título do nível" />
                    <input class="levelPercentage" type="number" min="0" step="1" placeholder="   % de acerto mínima" />
                    <input class="levelImage" type="url" placeholder="   URL da imagem do nível" />
                    <input class="levelDescription" type="text" placeholder="   Descrição do nível" />
                </form>
            </div>
            <ion-icon onclick="editQuestion(this)" name="create-outline"></ion-icon>
        </div>
    </div>`

    return levels;
}

const questionsStructure = function (i) {
    const questions =
        `<div class="quizzQuestionContainer">
        <div class="quizQuestionsFormUnfolded">
            <h1 class="quizQuestionsFormTitle">Pergunta ${i + 1}</h1>
            <div class="quizQuestion hide">
                <form class="quizQuestionsForm questionHeader">
                    <input class = "questionText" type="text" placeholder="   Texto da pergunta" />
                    <input class = "questionBackgroundColor" type="text" placeholder="   Cor de fundo da pergunta" />
                </form>
                <h1 class="quizQuestionsFormTitle">Resposta correta</h1>
                <form class="quizQuestionsForm correctAnswer">
                    <input class = "correctAnswerText" type="text" placeholder="   Resposta correta" />
                    <input class = "correctAnswerImage" type="url" placeholder="   URL da imagem" />
                </form>
                <h1 class="quizQuestionsFormTitle">Respostas incorretas</h1>
                <form class="quizQuestionsForm incorrectAnswer">
                    <div class="quizQuestionsFormIncorrect">
                        <input class="incorrectAnswer" type="text" placeholder="   Resposta incorreta 1" />
                        <input class="incorrectURL" type="url" placeholder="   URL da imagem 1" />
                    </div>
                    <div class="quizQuestionsFormIncorrect">
                        <input class="incorrectAnswer" "type="text" placeholder="   Resposta incorreta 2" />
                        <input class="incorrectURL" type="url" placeholder="   URL da imagem 2" />
                    </div>
                    <div class="quizQuestionsFormIncorrect">
                        <input class="incorrectAnswer" type="text" placeholder="   Resposta incorreta 3" />
                        <input class="incorrectURL" type="url" placeholder="   URL da imagem 3" />
                    </div>
                </form>
            </div>
            <ion-icon onclick="editQuestion(this)" name="create-outline"></ion-icon>
        </div>
    </div>`

    return questions;

}

function editQuestion(element) {
    const questionsFoms = element.previousElementSibling;
    const questionContainers = element.closest(".quizzQuestions").querySelectorAll(".quizzQuestionContainer");

    for (let i = 0; i < questionContainers.length; i++) {
        if (questionContainers[i].childNodes[1].childNodes[3].classList.contains("hide") === false) {
            questionContainers[i].childNodes[1].classList.add("quizQuestionsFormUnfolded");
            questionContainers[i].childNodes[1].childNodes[3].classList.add("hide");
            questionContainers[i].childNodes[1].childNodes[5].classList.remove("hide");
        }
    }

    questionsFoms.classList.remove("hide");
    questionsFoms.parentNode.classList.remove("quizQuestionsFormUnfolded");
    element.classList.add("hide");
}

function isValidURL(str) {
    try {
        new URL(str);
    }
    catch (error) {
        return false;
    }
    return true;
}

function isValidHex(input, i){
    if(!/^#((0x){0,1}|#{0,1})([0-9A-F]{8}|[0-9A-F]{6})$/.test(input)){
        return false;
    }
    return true;
}

function postQuizz() {
    let promisse = axios.post(`${URL_API}`, quiz)
        .then(success)
        .catch();
}

function success(response) {

    myIds = response.data.id;

    if (JSON.parse(localStorage.getItem("array")) !== null) {
        arrayIds = JSON.parse(localStorage.getItem("array"));
        arrayIds.push(myIds);
    } else {
        arrayIds.push(myIds);
    }

    let arrayIdSerialized = JSON.stringify(arrayIds);

    localStorage.setItem("array", arrayIdSerialized);
}

function getMyQuizzes() {

    if(arrayIdDeserialized !== null) {
        for(let i = 0; i < arrayIdDeserialized.length; i++) {
            let promise = axios.get(`${URL_API}/${arrayIdDeserialized[i]}`);
            promise.then(listMyQuizzes);
        }
    }
}

function listMyQuizzes(response) {
    let listMyQuizz = document.querySelector(".myQuizzesList");

    thisArray.push(response.data)

    if(thisArray.length === arrayIdDeserialized.length) {
    for (let k = 0; k < thisArray.length; k++) {
                        listMyQuizz.innerHTML += `
                            <li class="quizzContent quizzImageGradient" onclick="myQuizzSelected(this, ${thisArray[k].id});">
                                <span class="quizzTitle">${thisArray[k].title}</span>
                                <img class="quizzImage" src="${thisArray[k].image}">
                                <div class="deleteOrEdit">
                                    <div class="edit">
                                    <img src="./files/Group 51.svg">
                                    </div>
                                    <div class="delete" onclick="deleteQuizz(this, ${k});">
                                    <img src="./files/Group.svg" id="delete${k}">
                                    </div>
                                </div>
                            </li>`
                    }
    }
        }

getMyQuizzes()

function CreatedQuizzes() {
    let createMyQuizz = document.querySelector(".myQuizz");

        createMyQuizz.classList.add("hide");
}

function nonCreatedQuizzes() {
    let teste = document.querySelector(".createOtherQuizz");

        teste.style.display = "none";
}