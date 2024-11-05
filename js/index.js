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
    const cardTemplate = 
    <div class="column"
}
