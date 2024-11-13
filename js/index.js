// setup configuration ~ typically will be done in the backend
const APIKey = "c7ba9e843bd0de4c8a005185f0371dc5";
// console.log(APIKey);
const imgApi = "https://image.tmdb.org/t/p/w1280";
const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${APIKey}&query=`;

// get form element from html
const form = document.getElementById("search-form");
// get user search input
const query = document.getElementById("search-input");

// grab the html container where results will be published
const result = document.getElementById("result");

// logic
let page = 1;
let isSearching = false;

// get JSON data from url
// aka the movie information?
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Ruhh oh.. something went wrong. check your url...");
    }
    return await response.json();
  } catch (err) {
    return null;
  }
}

/* show the results based on the fetch operation */
async function fetchAndShowResult(url) {
  const data = await fetchData(url);
  if (data && data.results) {
    showResults(data.results); //we have to define this function
  }
}

//create the movie cards to display
//use any time we want a movie card
function createMovieCard(movie) {
  //destructure the movie object
  const { poster_path, original_title, release_date, overview } = movie;
  // I don't have to write movie.whatever, I can simply do whatever to access the value.
  // this property lasts within this function (don't have to call object name every time)
  // easier for large objects. don't do this> the only thing that changes is that you have to type more

  //if poster_path is not null, concat poster_path to imgApi (creates filepath url)
  //if poster_path is not present, give a default img
  const imagePath = poster_path ? imgApi + poster_path : "./img-01.jpeg";

  //reduce size of movie title if it is too big
  const truncatedTitle =
    original_title.length > 15
      ? original_title.slice(0, 15) + "..."
      : original_title.length;

  //check if release date info is present or not
  const formattedDate = release_date || "No release date available";

  //building the movie card html
  //remember, $ {} to access variables
  const cardTemplate = (
    <div class="column">
      <div class="card">
        <a class="card-media" href="./img-01.jpeg">
          <img src="${imagePath}" alt="${original_title}" width="100%" />
        </a>
        <div class="card-content">
          <div class="card-header">
            <div class="left-content">
              <h3 style="font-weight: 600">${truncatedTitle}</h3>
              <span style="color: #12efec">${formattedDate}</span>
            </div>
            <div class="right-content">
              <a href="${imagePath}" target="_blank" class="card-btn">
                {" "}
                See Cover{" "}
              </a>
            </div>
          </div>
          <div class="info">${overview || "No overview available..."}</div>
        </div>
      </div>
    </div>
  );
  return cardTemplate;
}

//clear any content for search purposes
function clearResults() {
  result.innerHTML = "";
}

// display results on the page
function showResults(item) {
  const newContent = item.map(createMovieCard).join("");
  result.innerHTML += newContent || "<p> No Results Found. Search again. </p>";
}

// Load more results
async function loadMoreResults() {
  if (isSearching) {
    return;
  }
  page++;
  const searchTerm = query.value;
  const url = searchTerm
    ? `${searchUrl}${searchTerm}&page=${page}`
    : `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${APIKey}&page=${page}`;
  await fetchAndShowResult(url);
}

// detect end of page and load more results
function detectEnd() {
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 20) {
    loadMoreResults();
  }
}

// Handle search operation
// input param - event parameter
async function handleSearch(e) {
  console.log("debug inside handleSearch function...");
  // prevent form from resetting when submit is clicked
  e.preventDefault();
  const searchTerm = query.value.trim();
  console.log(`input term by user is ${searchTerm}`);
  if (searchTerm) {
    isSearching = true;
    clearResults();
    const newUrl = `${searchUrl}${searchTerm}&page=${page}`;
    await fetchAndShowResult(newUrl);
    query.value = "";
  }
}

// create event listeners and associate them to the function logic to be executed when detected on the page
// note - while specifying/calling the function here, we do nt include the first brackets.
form.addEventListener("submit", handleSearch);
window.addEventListener("scroll", detectEnd);
window.addEventListener("resize", detectEnd);

// initialize the page
async function init() {
  clearResults();
  const url = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${APIKey}&page=${page}`;
  isSearching = false;
  await fetchAndShowResult(url);
}

init();
