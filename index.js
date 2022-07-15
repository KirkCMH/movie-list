const base_URL = `https://movie-list.alphacamp.io`
const index_URL = `${base_URL}/api/v1/movies/`
const poster_URL = `${base_URL}/posters/`
const MOVIES_PER_PAGE = 12

const movies = []
let filteredMovieArr = []

const dataPanel = document.querySelector('#data-panel')

const paginator = document.querySelector('#paginator')

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
              <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${element.id
      }">More</button>
              <button class="btn btn-info btn-add-favorite" data-id="${element.id}">+</button>
            </div>
          </div>
        </div>
      </div>    
    `
  })
  dataPanel.innerHTML = rawHTML
}

// Render paginator
function  renderPaginator(amount){
  const numberOfPage = Math.ceil(amount / MOVIES_PER_PAGE)
  let paginatorHTML = ``
  for (let page = 1; page <= numberOfPage; page++) {
    paginatorHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = paginatorHTML
}

function getMoviesByPage(page){
  const data = filteredMovieArr.length > 0 ? filteredMovieArr : movies

  const pageStartIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(pageStartIndex, pageStartIndex + MOVIES_PER_PAGE) 
}

function getFilteredMoviesByPage(page) {
  const pageStartIndex = (page - 1) * MOVIES_PER_PAGE
  return filteredMovieArr.slice(pageStartIndex, pageStartIndex + MOVIES_PER_PAGE)
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

// search bar
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

searchForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  
  

  for (const movie of movies) {
    if (movie.title.toLowerCase().includes(keyword)) {
      filteredMovieArr.push(movie)
    }

    // filter
  }
  if (filteredMovieArr.length === 0) {
    return alert(`您輸入的關鍵字 : ${keyword} 沒有符合條件的電影`)
  }
  console.log("filteredMovieArr: ", filteredMovieArr)
  renderPaginator(filteredMovieArr.length)
  renderMovieList(getFilteredMoviesByPage(1))
})


////////////////////////////////////////////////////////////////////////
////// 先setItem再getItem的寫法//////

// const list = [] //設置初始空陣列(需要將初始設置設為全域=>很容易弄髒函式)
// function addToFavorite(id) {
//   // list 目的: 在localStorage裡建立清單；getItem()用法很酷
//   // 一步一步複雜來寫的話可以變成

//   const movie = movies.find((movie) => movie.id === id) //設置要收藏的電影

//   // 檢查電影有沒有重複輸入
//   if (list.some((movie) => movie.id === id)) {
//     return alert('已收藏在收藏清單中!')
//   }

//   list.push(movie) //將電影塞進陣列裡
//   localStorage.setItem('favoriteMovies', JSON.stringify(list)) //存進localStorage裡
//   localStorage.getItem('favoriteMovies') //從localStorage裡取出
// }
//////////////////////////////////////////////////////////////////////

// Add movie to Favorite
function addToFavorite(id){
//初始顯示為null(後面加的||可以讓其顯示[]) => 從localStorage裡取出 和 初始空陣列(回傳null(沒這玩意兒)則顯示空陣列)
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || [] //合併最開始即最後的步驟
  const movie = movies.find((movie) => movie.id === id) //收藏清單

  // 檢查電影有沒有重複輸入
  if (list.some((movie) => movie.id === id)){
    return alert('已收藏在收藏清單中!')
  }
  
  list.push(movie) // 將電影儲存進localStorage裡
  localStorage.setItem('favoriteMovies', JSON.stringify(list)) 
}



// 用dataset針對每一個id 來完成對每一個資料都正確指向
dataPanel.addEventListener('click', function onPanelClick(event) {
  const target = event.target
  if (target.matches('.btn-show-movie')) {
    showMovieModal(Number(target.dataset.id))
  } else if (target.matches('.btn-add-favorite')){
    addToFavorite(Number(target.dataset.id))
  }

})

// 用dataset確認按到的項目顯示出應對的內容
paginator.addEventListener('click', function onPaginatorClick(event) {
  if (event.target.tagName !== 'A') return
  const page = event.target.dataset.page
  renderMovieList(getMoviesByPage(page))
})

// get api data
axios.get(index_URL)
  .then(function (response) {
    // handle success
    // ...將陣列散開
    movies.push(...response.data.results)
    renderPaginator(movies.length) 
    renderMovieList(getMoviesByPage(1))
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
