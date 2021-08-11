const URL_API = "https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes"

function getQuizzes() {

    let promise = axios.get(`${URL_API}`);

    promise.then(listOtherQuizzes);

}

function listOtherQuizzes(response) {

    let listQuizzes = document.querySelector(".otherQuizzes");

    for(let i = 0; i < response.data.length; i++) {
        listQuizzes.innerHTML += `<li class="quizzContent quizzImageGradient" ><span class="quizzTitle">${response.data[i].title}</span><img class="quizzImage" src="${response.data[i].image}"></li>`
    }
}

getQuizzes();
