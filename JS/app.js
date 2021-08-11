const URL_API = "https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes"

function getQuizzes() {

    let promise = axios.get(`${URL_API}`);

    promise.then(listOtherQuizzes);

}

function listOtherQuizzes(response) {

    let listQuizzes = document.querySelector(".otherQuizzes");

    for(let i = 0; i < response.data.length; i++) {
        listQuizzes.innerHTML += `<li><span>${response.data[i].title}</span><img src="${response.data[i].image}"></li>`
    }
}

getQuizzes();

function postQuizz {

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
    
}

