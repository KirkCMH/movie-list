const base_URL = `https://movie-list.alphacamp.io`
const index_URL = `${base_URL}/api/v1/movies/`
const poster_URL = `${base_URL}/posters/`

const movies = JSON.parse(localStorage.getItem('favoriteMovies'))

const dataPanel = document.querySelector('#data-panel')


// Render Movie list(title, image) function
function renderMovieList(data) {
  let rawHTML = ''
  data.forEach(element => {
    // title and image
    rawHTML += `
      <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src="${poster_URL + element.image}"
              class="card-img-top" alt="Movie Poster" />
            <div class="card-body">
              <h5 id="${element.id}" class="card-title">${element.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${element.id}">More</button>
              <button class="btn btn-danger btn-delete-favorite" data-id="${element.id}">X</button>
            </div>
          </div>
        </div>
      </div>    
    `
  })
  dataPanel.innerHTML = rawHTML
}


// 更改modal裡面的內容，先抓HTML(要塞進去的容器)
// 用axios來替換的值

function showMovieModal(id) {
  const movieModalTitle = document.querySelector('#movie-modal-title')
  const movieModalDate = document.querySelector('#movie-modal-date')
  const movieModalDescription = document.querySelector('#movie-modal-description')
  const movieModalImage = document.querySelector('#movie-modal-image')

  axios.get(index_URL + id)
    .then(response => {
      const data = response.data.results
      movieModalTitle.innerText = data.title
      movieModalDate.innerText = 'Release Date : ' + data.release_date
      movieModalDescription.innerText = data.description
      movieModalImage.innerHTML = `<img src="${poster_URL + data.image}" alt="movie-poster" class="img-fluid">`
    })

}

function deleteFavorite(id){
  if (!movies || !movies.length)return false
  const movieIndex = movies.findIndex((movie) => movie.id === id) 
  if (movieIndex === -1)return false
  movies.splice(movieIndex, 1)
  localStorage.setItem('favoriteMovies', JSON.stringify(movies)) 

  renderMovieList(movies)
}

// 用dataset針對每一個id 來完成對每一個資料都正確指向
dataPanel.addEventListener('click', function onPanelClick(event) {
  const target = event.target
  if (target.matches('.btn-show-movie')) {
    showMovieModal(Number(target.dataset.id))
  } else if (target.matches('.btn-delete-favorite')) {
    deleteFavorite(Number(target.dataset.id))
  }

})

renderMovieList(movies)