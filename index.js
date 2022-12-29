const searchBtn = document.getElementById("search-btn")
const searchText = document.getElementById("search-text")
const filmsContainer = document.getElementById("films-container")
const myWatchlist = document.getElementById("my-watchlist-container")


let filmHtml = ""
let filmsArray = []

if (JSON.parse(localStorage.getItem("films"))) {
    filmsArray = JSON.parse(localStorage.getItem("films"))
    filmsArray.map(item => {
        filmHtml += renderRemove(item)
        myWatchlist.innerHTML = filmHtml
    })
}


searchBtn.addEventListener("click", function () {
    fetch(`https://www.omdbapi.com/?apikey=4ddb92a8&s=${searchText.value}`)
        .then(res => res.json())
        .then(data => {
            if(data.Response === "False"){
                filmsContainer.innerHTML = `
                                            <div class="not-found">
                                            <h3>
                                             Unable to find what you’re looking for. 
                                             Please try another search.
                                            </h3>
                                            </div>
                                            `                                
            } else {
                data.Search.map(item => {
                    filmHtml = ""
                    fetch(`https://www.omdbapi.com/?apikey=4ddb92a8&i=${item.imdbID}`)
                        .then(res => res.json())
                        .then(data => {
                        filmHtml += renderAdd(data)
                        filmsContainer.innerHTML = filmHtml
                    })
                })
            }
    })
})

document.addEventListener("click", function (e) {
    const message = document.getElementById("message")
    if (e.target.dataset.title) {
        fetch(`https://www.omdbapi.com/?apikey=4ddb92a8&t=${e.target.dataset.title}`)
            .then(res => res.json())
            .then(data => {
                let count = 0
                filmsArray.map(item => {
                    if (e.target.dataset.title === item.Title) {
                        count++
                    }
                })
                
                if (count === 0) {
                    filmsArray.unshift(data)
                    message.textContent = "Added to list!"
                    message.classList.remove("hidden")
                    setTimeout(() => {
                    message.classList.add("hidden") 
                    }, 1000)
                } else {
                    message.classList.remove("hidden")
                    message.textContent = "Already in the list!"
                    setTimeout(() => {
                    message.classList.add("hidden") 
                    }, 1000)
                }
                localStorage.setItem("films", JSON.stringify(filmsArray))
                filmHtml = ""
                filmsArray.map(item => {
                    filmHtml += renderRemove(item)
                    myWatchlist.innerHTML = filmHtml
                })

            })
    }   
    
        if (e.target.dataset.remove) {
        filmsArray.map(item => {
            if(e.target.dataset.remove === item.Title){
                filmsArray.splice(filmsArray.indexOf(item), 1)
            }

            localStorage.setItem("films", JSON.stringify(filmsArray))
        })

        if(filmsArray.length === 0) {
            myWatchlist.innerHTML = `
                                    <div id="my-watchlist-container">
                                    <div>
                                    <h2 class="empty">
                                        Your watchlist is looking a little empty...
                                    </h2>
                                    <div class="search">
                                    <i class="fa-solid fa-circle-plus" id="add-button-icon"></i>
                                    <p>Let’s add some movies!</p>
                                    </div>
                                    </div>
                                    </div>`
        } else {
            filmHtml = ""
            filmsArray.map(item => {
            filmHtml += renderRemove(item)
            myWatchlist.innerHTML = filmHtml        
        })        
        }
        
        
    }
})

function renderRemove(item) {
    return `<div class="film">
                     <img src="${item.Poster}">
                     
                     <div class="second-column">
                     <div class="first-row">
                     <p class="title">${item.Title}</p>
                     <div class="star-and-rating">
                     <i class="fa fa-star"></i>
                     <p class="rating">${item.imdbRating}</p>
                     </div>
                     </div>
                     
                     <div class="second-row">
                     <p class="runtime">${item.Runtime}</p>
                     <p class="genre">${item.Genre}</p>                             
                     
                     <div class="remove-btn">
                     <i class="fa-solid fa-circle-minus" id="remove-button" data-remove="${item.Title}"></i>
                     <span class="button-text">Remove</span>
                     </div>
                     
                     </div>                  
                     
                     <p class="plot">${item.Plot}</p>
                     
                     </div>
                     </div>                        
                     `
                }
                
function renderAdd(item) {
    return `
    <div class="film">
    <img src="${item.Poster}">
    
    <div class="second-column">
    <div class="first-row">
    <p class="title">${item.Title}</p>
    <div class="star-and-rating">
    <i class="fa fa-star"></i>
    <p class="rating">${item.imdbRating}</p>
    </div>
    </div>
    
    <div class="second-row">
    <p class="runtime">${item.Runtime}</p>
    <p class="genre">${item.Genre}</p>                             
    
    <div class="add-btn">
    <i class="fa-solid fa-circle-plus" id="add-button" data-title="${item.Title}"></i>
    <span class="button-text">Watchlist</span>
    </div>
    <p class="message hidden" id="message"></p>
    </div>                  
    
    <p class="plot">${item.Plot}</p>
    
    </div>

    </div>                        
    `
}

