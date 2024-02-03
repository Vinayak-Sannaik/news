const API_KEY = "c09c1e0a7cf54016b16e6e7fd4eb7bc7";

const userSearchEl = document.querySelector(".user-search");
const btnEl = document.querySelector(".btn");
const newsContainerEl = document.querySelector(".news-container");

// Take Input from user
btnEl.addEventListener("click", async () => {
  const query = userSearchEl.value.trim();
  if (query !== "") {
    try {
      const articles = await fetchQuery(query);
      displayBlocks(articles);
    } catch (error) {
      console.log("Error fetching news by query", error);
    }
  }
});
userSearchEl.addEventListener("keydown", async (event) => {
  if (event.key == "Enter") {
    const query = userSearchEl.value.trim();
    if (query !== "") {
      try {
        const articles = await fetchQuery(query);
        displayBlocks(articles);
      } catch (error) {
        console.log("Error fetching news by query", error);
      }
    }
  }
});

async function fetchQuery(query) {
  try {
    const apiURL = `https://newsapi.org/v2/everything?q=${query}&pageSize=12&apiKey=${API_KEY}`;
    const response = await fetch(apiURL);
    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.log("Error fetching query news", error);
    return [];
  }
}

// Fetch some random news to show for first time from API
// async function FetchRandomNews() {
//   try {
//     const apiURL = `https://newsapi.org/v2/top-headlines?country=us&pageSize=12&apiKey=${API_KEY}`;
//     const response = await fetch(apiURL);
//     const data = await response.json();
//     return data.articles;
//   } catch (error) {
//     console.log("Error fetching random news", error);
//     return [];
//   }
// }
async function FetchRandomNews() {
  try {
    const apiURL = `https://newsapi.org/v2/top-headlines?country=us&pageSize=12&apiKey=${API_KEY}`;
    const response = await fetch(apiURL);

    if (!response.ok) {
      throw new Error(`Failed to fetch random news: ${response.status}`);
    }

    const data = await response.json();

    if (!data.articles || !Array.isArray(data.articles)) {
      throw new Error("Unexpected response format from API");
    }

    return data.articles;
  } catch (error) {
    console.log("Error fetching random news", error);
    return []; // Return an empty array in case of error
  }
}

// Generate dynamic HTML content
function displayBlocks(articles) {
  //First clear all the previous HTML content
  newsContainerEl.innerHTML = "";
  articles.forEach((article) => {
    const blogCard = document.createElement("div");
    blogCard.classList.add("news-card");
    const imgEl = document.createElement("img");
    imgEl.src = article.urlToImage;
    imgEl.alt = article.title;

    const titleEl = document.createElement("h3");
    titleEl.classList.add("news-title");
    // titleEl.textContent = article.title;
    const truncatedTitle =
      article.title.length > 60
        ? article.title.slice(0, 60) + " ....."
        : article.title;
    titleEl.textContent = truncatedTitle;

    const descriptionEL = document.createElement("p");
    descriptionEL.classList.add("news-description");
    // descriptionEL.textContent = article.description;
    const truncatedDescription =
      article.description.length > 250
        ? article.description.slice(0, 250) + " ....."
        : article.description;
    descriptionEL.textContent = truncatedDescription;

    blogCard.appendChild(imgEl);
    blogCard.appendChild(titleEl);
    blogCard.appendChild(descriptionEL);

    //Redirect if any click on blogCard
    blogCard.addEventListener("click", () => {
      window.open(article.url, "_blank");
    });

    newsContainerEl.appendChild(blogCard);
  });
}

//Call fetch function
(async () => {
  try {
    const articles = await FetchRandomNews();
    displayBlocks(articles);
  } catch (error) {
    console.log("Error fetching random news", error);
  }
})();
