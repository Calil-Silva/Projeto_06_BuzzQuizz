const URL_API = "https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes"
let quizz;
let noRepetitionArray = [];
let rights = 0;
let score = 0;
let counterOne = 0;
let quizzScoreCard;
let alertCounter = 0;
let numQuestions;
let numLevels;

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

function loadScore() {
    let promise = axios.get(`${URL_API}`);

    promise.then(quizzResult);
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

    chooseQuizz();
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
            <div class="nthQuestion">
                <div class="qTitle q${i}">
                    <h3>${response.data[quizz].questions[i].title}</h3>
                </div>
                <ul class="answers a${i}"></ul>
                <div class="nextQuestions n${i}"></div>
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
                <div class="container"><img src="${response.data[quizz].questions[i].answers[noRepetitionArray[j]].image}"></div>
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
    let answers = document.querySelectorAll(".answers");
    let z = 0;

    console.log(trueOrFalse)

    for(let z = 0; z < answersList.length; z++) {

        if(option.classList.contains("opacity")) {
            break;
        } else if(trueOrFalse === "true") {
            answersList[z].classList.add("opacity");
            answersList[z].onclick = null;
            option.classList.remove("opacity");
            textAnswer.style.color ="green";
        } else {
            answersList[z].classList.add("opacity");
            answersList[z].onclick = null;
            option.classList.remove("opacity");
            textAnswer.style.color ="red";
        }
    }

    if(trueOrFalse === "true") {
        rights++;

        score = Math.round((rights / answers.length) * 100);
        console.log(score);

    };

    counterOne++

    scrollNextQuestion(index);

    if(counterOne === answers.length) {
        loadScore();
    }

    console.log(counterOne);
    console.log(answers.length);

}

function scrollNextQuestion(index) {
    let answersList = document.querySelectorAll(`.answers.a${index} li`);
    const nextList = document.querySelector(`.nextQuestions.n${index}`);

    for(let z = 0; z < answersList.length; z++) {
        if(answersList[z].classList.contains("opacity")) {
            setTimeout(() => {nextList.scrollIntoView()}, 2000);
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

    for(let z = 0; z < response.data[quizz].levels.length; z++) {
        
        if(response.data[quizz].levels[z].minValue <= score) {
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

function restartQuizz() {
    let quizzScoreCard = document.querySelector(".result");
    let question = document.querySelector(".questions");
    let restartButton = document.querySelector(".restartQuizz");
    let homePageButton = document.querySelector(".homePage");

    rights = 0;
    counterOne = 0;

    
    quizzScoreCard.style.display = "none";
    quizzScoreCard.innerHTML = "";

    question.innerHTML = "";

    chooseQuizz();

    restartButton.style.display = "none";
    homePageButton.style.display = "none";

}

function backHomePage() {
    window.location.reload();
}

function loadInterface(element, type){
    const visibleStructure = element.closest("main");
    const invisibleStructure = visibleStructure.nextElementSibling;
    hideContent(visibleStructure);
    invisibleStructure.classList.remove("hide");
    fillElements(invisibleStructure.querySelector("section"), type);
}

function validateInput(element){
    let form = element.closest("section").querySelector("form");
    switch(form.classList.item(0)){
        case "quizInfoForm":
            if(form[0].value.length < 20 || form[0].value.length > 65 || !urlValidation(form[1].value) || form[2].value < 3 || form[3].value < 2){
                alert("Por favor, preencha os dados corretamente.");
                break;
            } else{
                quiz.title = form[0].value;
                quiz.image = form[1].value;
                numQuestions = form[2].value;
                numLevels = form[3].value;
                loadInterface(element, form.classList.item(0));
                clearInput(form);
                break;
            }
        case "quizQuestionsForm":
            let k = 0;
            let j = 0;
            let l = 0;
            form = element.closest("section").querySelectorAll(".quizQuestionsForm");
            for(let i = 0; i < form.length; i++){
                const questions = {
                    title: "",
                    color: "",
                    answers: []
                }
                const answers = {
                    text: "",
                    image: "",
                    isCorrectAnswer: ""
                }
                if(form[i].classList.contains("questionText")){
                    quiz.questions.push(questions);
                    alertCounter += validateQuestionText(form[i][0].value, k);
                    alertCounter += validateBackgroundColor(form[i][1].value, k);
                    k++;
                } else if(form[i].classList.contains("answerCorrect")){
                    quiz.questions[j].answers.push(answers);
                    alertCounter += validateCorrectAnswerText(form[i][0].value, j);
                    alertCounter += validateCorrectAnswerImage(form[i][1].value, j);
                    j++;
                } else if(form[i].classList.contains("incorrectAnswer")){          
                    alertCounter += validateIncorrectAnswer(form[i], l);
                    l++;
                }
            }
            if(alertCounter === 0){
                loadInterface(element, "quizQuestionsForm");
                alertCounter = 0;
            }else{
                console.log(alertCounter)
                alert("Por favor, preencha os dados corretamente.");
                alertCounter = 0;
            }
            break;
        case "quizLevelsForm":
            form = element.closest("section").querySelectorAll(".quizLevelsForm");
            alertCounter += form.forEach(validateLevel);
            loadInterface(element, "quizLevelsForm");
            postQuizz();
    }
    console.log(quiz)
}

function validateLevel(form){
    if(form[0].value < 10 || form[1].value < 0 || form[1].value > 100 || !urlValidation(form[2].value) || form[3].value < 30){
        return 1;
    }else{
        createLevel(form[0].value, form[2].value, form[3].value, form[1].value);
        return 0;
    }
    
}

function createLevel(title, image, text, minValue){
    const level = {
        title,
        image,
        text,
        minValue
    }

    quiz.levels.push(level);
}

function validateIncorrectAnswer(input, questionIndex){
    if(input[0].value === "" || input[1].value === "" && questionIndex === 0){
        return 1;
    }else{
        createAnswer(questionIndex, input[0].value, input[1].value, false);
        return 0;
    }
}

function createAnswer(questionIndex, text, image, answer){
    const answers = {
        text: text,
        image: image,
        isCorrectAnswer: answer
    }

    quiz.questions[questionIndex].answers.push(answers);

}

function clearInput(form){
    for(let i = 0; i < form.length; i++){
        form[i].value = "";
    }
}

function validateIncorrectAnswerText(input, i, m){
    if(input.length === 0){
        return 1;
    }else{
        quiz.questions[i].answers[m].text = input;
        quiz.questions[i].answers[m].isCorrectAnswer = false;
        return 0;                                                              
    }
}

function validateQuestionText(input, k){
    if(input.length < 20){
        return 1;
    }else{
        quiz.questions[k].title = input;
        return 0;                                              
    }
}

function validateCorrectAnswerText(input, i){
    if(input.length === 0){
        return 1;
    }else{
        quiz.questions[i].answers[0].text = input;
        quiz.questions[i].answers[0].isCorrectAnswer = true;
        return 0;                                                              
    }
}

function validateCorrectAnswerImage(input, i){
    if(!urlValidation(input)){
        return 1;
    }else{
        quiz.questions[i].answers[0].image = input;
        return 0;                                                      
    }
}

function validateInorrectAnswerImage(input, i, m){
    if(!urlValidation(input)){
        return 1;
    }else{
        quiz.questions[i].answers[m].image = input;
        return 0;                                                      
    }
}

function alertInputValidation(){
    if(alertCounter === 0){
        alert("Por favor, preencha os dados corretamente.");
    } else{
        return;
    }
}

function fillElements(element, type){
    if(type === "quizInfoForm"){
        for(let i = 0; i < numQuestions; i++){
            element.innerHTML += questionsStructure(i);
        }
        element.innerHTML += `<button class="quizzInfoButton" onclick="validateInput(this)">Prosseguir para criar níveis</button>`
    }else if(type === "quizQuestionsForm"){
        for(let i = 0; i < numLevels; i++){
            element.innerHTML += levelStructrue(i);
        }
        element.innerHTML += `<button class="quizzInfoButton" onclick="validateInput(this)">Finalizar Quizz</button>`
    }
}

const levelStructrue = function (i){
    const levels = 
    `<div class="quizzQuestionContainer">
        <div class="quizQuestionsFormUnfolded">
            <h1 class="quizLevelsFormTitle">Nível ${i+1}</h1>
            <div class="hide">
                <form class="quizLevelsForm">
                    <input type="text" placeholder="   Título do nível" />
                    <input type="text" placeholder="   % de acerto mínima" />
                    <input type="url" placeholder="   URL da imagem do nível" />
                    <input type="text" placeholder="   Descrição do nível" />
                </form>
            </div>
            <ion-icon onclick="editQuestion(this)" name="create-outline"></ion-icon>
        </div>
    </div>`

    return levels;
}

const questionsStructure = function (i){
    const questions = 
    `<div class="quizzQuestionContainer">
        <div class="quizQuestionsFormUnfolded">
            <h1 class="quizQuestionsFormTitle">Pergunta ${i+1}</h1>
            <div class="hide">
                <form class="quizQuestionsForm questionText">
                    <input type="text" placeholder="   Texto da pergunta" />
                    <input type="text" placeholder="   Cor de fundo da pergunta" />
                </form>
                <h1 class="quizQuestionsFormTitle">Resposta correta</h1>
                <form class="quizQuestionsForm answerCorrect">
                    <input type="text" placeholder="   Resposta correta" />
                    <input type="url" placeholder="   URL da imagem" />
                </form>
                <h1 class="quizQuestionsFormTitle">Respostas incorretas</h1>
                <form class="quizQuestionsForm incorrectAnswer">
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

function validateBackgroundColor(input, i){
    if(!/^#((0x){0,1}|#{0,1})([0-9A-F]{8}|[0-9A-F]{6})$/.test(input)){
        return 1;
    }else{
        quiz.questions[i].color = input;
        return 0;
    }
}

function postQuizz(){
    let promisse = axios.post(`${URL_API}`, quiz);
}

