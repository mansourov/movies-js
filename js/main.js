let formElement = document.getElementById('form')
let inputFind = document.getElementById('inputFind')
let inputGenres = document.getElementById('inputGenres')

const allMoviesBtn = document.getElementById('allMoviesBtn')



let count = 0
allMoviesBtn.addEventListener('click', () => {
  if(count % 2 === 0)renderMovies(moviesList)
  else moviesDiv.innerHTML = null;
  count++
})



const moviesDiv = document.getElementById('moviesList')
let filmTemplate = document.getElementById('film-item-template').content


function renderMovies(movie){
  moviesDiv.innerHTML = null
  movie.forEach(element => {
      let filmItemClone = document.importNode(filmTemplate, true)

      let filmImg = filmItemClone.querySelector('.img')
      filmImg.setAttribute('src', element.imageUrl)

      let filmTitle = filmItemClone.querySelector('.filmTitle')
      filmTitle.textContent = element.title

      let filmYear = filmItemClone.querySelector('.filmYear')
      filmYear.textContent = element.year

      
      let filmGenres = filmItemClone.querySelector('.filmGenres')
      filmGenres.textContent = element.genres

      let filmActors = filmItemClone.querySelector('.filmActors')
      filmActors.textContent = element.actors
      
      let filmBookMark = filmItemClone.querySelector('.filmmarkbtn')
      filmBookMark.dataset.filmId = element.id


      moviesDiv.appendChild(filmItemClone)
  });
}
renderMovies(moviesList)

const BOOK_PER_PAGE = 5
var currentPage = 1
const paginationEl = document.querySelector('.pagination')
const pageItemTemp = document.querySelector('#page-item-template').content


paginationEl.addEventListener('click', event => {
    let target = event.target
    currentPage = target.dataset.pageId
    renderPageBook()
})


function renderPagination(arr){
    paginationEl.textContent = null
    let countOfPage = Math.ceil(arr.length/BOOK_PER_PAGE)

    let clonePageItem = document.importNode(pageItemTemp, true)        
    let paginationLink = clonePageItem.querySelector('.page-link')

    paginationLink.textContent = "PREV"
    paginationLink.dataset.pageId = currentPage-1
    if(currentPage == 1) {
        paginationLink.classList.add('disabled')
    }else {
        paginationLink.classList.remove('disabled')
    }
    paginationEl.appendChild(clonePageItem)

    for(let i=1; i<=countOfPage; i++){
        let clonePageItem = document.importNode(pageItemTemp, true)
        let paginationItem = clonePageItem.querySelector('.page-item')
        if(currentPage == i){
            paginationItem.classList.toggle('active')
        }
        let paginationLink = clonePageItem.querySelector('.page-link')
        paginationLink.textContent = i
        paginationLink.dataset.pageId = i
        paginationEl.appendChild(clonePageItem)
    }

    let clonePageItemNext = document.importNode(pageItemTemp, true)        
    let paginationLinkNext = clonePageItemNext.querySelector('.page-link')
    paginationLinkNext.textContent = "NEXT"
    paginationLinkNext.dataset.pageId = Number(currentPage)+1
    paginationEl.appendChild(clonePageItemNext)
}


function renderPageBook(){
    renderPagination(moviesDiv)
    renderMovies(moviesList.slice((currentPage-1)*BOOK_PER_PAGE, currentPage*BOOK_PER_PAGE))
}
renderPageBook()
renderPagination(moviesDiv)


//filter
formElement.addEventListener('submit', (evt)=> {
  evt.preventDefault()
  const titlefind = inputFind.value
  const genreFind = inputGenres.value
    let foundedMovies = moviesList.filter(movie => movie.title.includes(titlefind) || movie.genres.includes(genreFind))
    renderMovies(foundedMovies)
})


//select
let selectMovies = document.getElementById('selectMovies')
selectMovies.addEventListener('change', (evt) => {
    let genreMovies = moviesList.filter(movie => movie.genres.includes(evt.target.value))
    renderMovies(genreMovies)
})

//sorted old or new
let selectNewOrOld  = document.getElementById('selectNewOrOld')
selectNewOrOld.addEventListener('change', (evt) => {
  console.log(evt.target.value)
    const sortedMovies = moviesList.sort((first, second) => {
      if( evt.target.value == 'Old'){
        return first.year - second.year
      }else 
      return second.year - first.year
    })
    
    renderMovies(sortedMovies)
})


//filmmark
function getFilmMark(){
  const filmMark = localStorage.getItem('filmmark')
  return filmMark ? JSON.parse(filmMark) : []
}

//get by id
function getFilmsById(filmMark){
  const films = filmMark.map((element) => {
    return moviesList.find(movie => movie.id == element)
  })
  return films
}

function addFilmMark(id){
  const filmMark = getFilmMark()
  if(!filmMark.includes(id)){
    filmMark.push(id)
  }
  setFilmMark(filmMark)
}

function setFilmMark(data){
  localStorage.setItem('filmmark', JSON.stringify(data))
}

function deleteFilmMark(id) {
  const filmMark = getFilmMark()
  const newBookmarks = filmMark.filter(element => element != id)
  setFilmMark(newBookmarks)
}

moviesDiv.addEventListener('click', (event) => {
  let clickEl = event.target
  if(clickEl.matches('.filmmarkbtn')){
      const filmId = clickEl.dataset.filmId
      addFilmMark(filmId)
      renderFilmMark()
  }
})

//render filmMark
let filmMarkTemplate = document.getElementById('film-mark').content
let filmMarkEl = document.querySelector('.filmMark')

function renderFilmMark(){
  const filmMark = getFilmMark()
  const films = getFilmsById(filmMark)

  filmMarkEl.innerHTML = null
  let filmMarkFragment = document.createDocumentFragment()

  films.forEach(element => {
    let filmMarkClone = document.importNode(filmMarkTemplate, true)

    filmMarkClone.querySelector('.filmMarkName').textContent = element.title
    filmMarkClone.querySelector('.filmMarkYear').textContent = element.year
    filmMarkClone.querySelector('.filmMark__btn').dataset.filmId = element.id 

    filmMarkFragment.appendChild(filmMarkClone)
    filmMarkEl.append(filmMarkFragment)
  });
}

renderFilmMark()

filmMarkEl.addEventListener('click', event => {
  if(event.target.matches('.filmMark__btn')){
      deleteFilmMark(event.target.dataset.filmId)
      renderFilmMark()
  }
})

