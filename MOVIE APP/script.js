const apiKey = "67ed4f3d";

let currentMovie = null;

/* SEARCH MOVIES */
async function searchMovie(){
  let query = document.getElementById("searchInput").value.trim();
  if(!query) return;

  const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`);
  const data = await res.json();

  if(data.Response === "False"){
    document.getElementById("movieContainer").innerHTML =
      `<h2 style="text-align:center;">No movies found</h2>`;
    return;
  }

  displayMovies(data.Search);
}

/* LIVE SEARCH SUGGESTIONS */
async function liveSearch(){
  let text = document.getElementById("searchInput").value.trim();
  let box = document.getElementById("suggestBox");
  if(text.length === 0){
    box.classList.add("hidden");

    document.getElementById("movieContainer").innerHTML = "";
    return;}
  if(text.length < 2){
    box.classList.add("hidden");
    return;
  }

  const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${text}`);
  const data = await res.json();

  if(data.Response === "False"){
    box.classList.add("hidden");
    return;
  }

  box.innerHTML = "";
  data.Search.slice(0,6).forEach(m => {
    let d = document.createElement("div");
    d.innerText = m.Title;

    d.onclick = () => {
      document.getElementById("searchInput").value = m.Title;
      box.classList.add("hidden");
      searchMovie();
    };

    box.appendChild(d);
  });

  box.classList.remove("hidden");
}

/* DISPLAY MOVIE CARDS */
function displayMovies(movies){
  const container = document.getElementById("movieContainer");
  container.innerHTML = "";

  movies.forEach(movie => {
    const card = document.createElement("div");
    card.className = "movie-card";

    card.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300"}">
      <div class="movie-info">
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
      </div>
    `;

    card.onclick = () => loadDetails(movie.imdbID);

    container.appendChild(card);
  });
}

/* LOAD DETAILS POPUP */
async function loadDetails(id){
  const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${id}&plot=full`);
  const movie = await res.json();

  currentMovie = movie;

  document.getElementById("detailsPoster").src =
    movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/400";

  document.getElementById("detailsTitle").innerText = movie.Title;
  document.getElementById("detailsPlot").innerText = movie.Plot;
  document.getElementById("detailsRating").innerText = "⭐ " + movie.imdbRating;

  document.getElementById("movieDetails").classList.remove("hidden");

  /* ADD TO FAVORITES */
  document.getElementById("favBtn").onclick = addFavorite;

  /* WATCH TRAILER */
  document.getElementById("trailerBtn").onclick = () => {
    window.open(
      `https://www.youtube.com/results?search_query=${movie.Title} trailer`,
      "_blank"
    );
  };
}

/* CLOSE DETAILS */
function closeDetails(){
  document.getElementById("movieDetails").classList.add("hidden");
}

/* FAVORITES */
function addFavorite(){
  if(!currentMovie) return;

  let favs = JSON.parse(localStorage.getItem("favorites") || "[]");

  if(favs.find(f => f.imdbID === currentMovie.imdbID)) return;

  favs.push(currentMovie);
  localStorage.setItem("favorites", JSON.stringify(favs));

  renderFavorites();
}

function renderFavorites(){
  let favs = JSON.parse(localStorage.getItem("favorites") || "[]");
  let container = document.getElementById("favContainer");
  container.innerHTML = "";

  favs.forEach(movie => {
    const card = document.createElement("div");
    card.className = "movie-card";

    card.innerHTML = `
      <img src="${movie.Poster}">
      <div class="movie-info">
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
      </div>
    `;

    card.onclick = () => loadDetails(movie.imdbID);

    container.appendChild(card);
  });
}

/* LOAD FAVORITES ON START */
renderFavorites();
