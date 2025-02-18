const animeAPI = 'https://api.jikan.moe/v4/anime'; // General Anime API
const topAnimeAPI = 'https://api.jikan.moe/v4/top/anime'; // Top Anime API
let currentAnime = 0;
let animeList = [];

async function fetchTopAnimeData() {
    try {
        const response = await fetch(topAnimeAPI);

        if (!response.ok) {
            throw new Error("Network Error! Cannot reach the site");  // Prints error if site can't be reached
        }

        const animeData = await response.json(); // Convert response to JSON
        animeList = animeData.data;

        if (animeList.length > 0) {
            updateSpotlight(0); // Update with the first anime
        }

    } catch (error) {
        console.log('Error:', error); //if there is an error, print out the error
    }
}

//Fill in the anime info about the spotlight part of the site
function updateSpotlight(index) {
    const anime = animeList[index];
    if (!anime) return;

    //limits the length of the sysnopsis to 250 characters. 
    const maxSynopsis = 250;
    let synopsis = anime.synopsis || "No description available";
    if (synopsis.length > maxSynopsis) {
        synopsis = synopsis.substring(0, maxSynopsis) + "...";
    }

    //limits the length to 20 characters
    const maxTitle = 20;
    let title = anime.title || "No Title available";
    if (title.length > maxTitle) {
        title = title.substring(0, maxTitle) + "...";
    }

    //fill in and replace the the spotlight template w/ the data from the topAPI
    document.querySelector('.title').textContent = title;
    document.querySelector('.description').textContent = synopsis;
    document.querySelector('.ranking').textContent = `#${anime.rank} Ranked`;

    document.querySelector('.spotlight').style.backgroundImage = `url(${anime.images?.jpg?.image_url })`;

    document.querySelector('.type p').textContent = `${anime.type}`;
    document.querySelector('.sub p').textContent = anime.episodes ? `Episodes: ${anime.episodes}` : "Episodes: Unknown";
    document.querySelector('.dubs p').textContent = anime.episodes ? `Episodes: ${anime.episodes}` : "Episodes: Unknown";
}

//to choose the next spotlight anime
document.querySelector(`.right_spot button:nth-child(1)`).addEventListener('click', () => {
    currentAnime = (currentAnime + 1) % animeList.length;
    updateSpotlight(currentAnime);
});

//to go back in the spotlight anime
document.querySelector(`.right_spot button:nth-child(2)`).addEventListener('click', () => {
    currentAnime = (currentAnime - 1 + animeList.length) % animeList.length;
    updateSpotlight(currentAnime);
});

//fetching the anime info from the main API
async function fetchAnimeData(page = 1) {
    try {
        const response = await fetch(`${animeAPI}?page=${page}`); //takes the anime page by page
        if (!response.ok) {
            throw new Error("Network Error! Cannot reach the site"); //prints out if site cannot be reached
        }

        const animeData = await response.json();
        animeList = animeList.concat(animeData.data);

        //if no anime can be found prints out error
        if (!animeData.data || animeData.data.length === 0) {
            console.log(`No more anime found on page ${page}`);
            return;
        }

        //to prevent the error of "to many request" have a set timeout to slow down the request
        if (animeData.pagination && animeData.pagination.has_next_page && page < 5) {
            await new Promise(resolve => setTimeout(resolve, 500));
            await fetchAnimeData(page + 1);
        } else {
            console.log("All anime data fetched"); //prints out a success message if all anime is fetched
            updateAiring(); //update the anime info for the airing anime
            updateDayAnime(); //update the anime info for the day anime

        }
    } catch (error) {
        console.log('Error:', error);
    }
}

// update the airing anime template w/ its respected data
function updateAiring() {

    //filter out which anime is summer, winter, spring, and fall 
    const summerAnimeList = animeList.filter(anime => anime.season && anime.season.toLowerCase() === "summer");
    const winterAnimeList = animeList.filter(anime => anime.season && anime.season.toLowerCase() === "winter");
    const springAnimeList = animeList.filter(anime => anime.season && anime.season.toLowerCase() === "spring");
    const fallAnimeList = animeList.filter(anime => anime.season && anime.season.toLowerCase() === "fall");

    // console.log(summerAnimeList);
    // console.log(winterAnimeList);
    // console.log(springAnimeList);
    // console.log(fallAnimeList);

    // if (!summerAnimeList.length === 0) {
    //     console.log("No summer anime found in the dataset.");
    //     return;
    // }

    //clone up to 5 and fill in for the summer animes
    const template = document.querySelector(".summer_anime_template");
    const container = document.querySelector(".summer_anime");

    summerAnimeList.slice(0, 5).forEach((anime, index) => {
        const animeClone = template.cloneNode(true);
        animeClone.classList.add(`top_${index + 1}`);
        animeClone.style.display = "flex";

        animeClone.querySelector(".summer_img").src = anime.images?.jpg?.image_url || "/assets/default.jpg";
            animeClone.querySelector(".summer_img").alt = anime.title;
            animeClone.querySelector(".summer_title").textContent = anime.title_english || anime.title;
            animeClone.querySelector(".sub p").textContent = anime.episodes || "?";
            animeClone.querySelector(".dubs p").textContent = anime.episodes || "?";
            animeClone.querySelector(".summer_type").textContent = anime.type || "Unknown";

            container.appendChild(animeClone);

    });

    //clone up to 5 and fill in for the winter animes
    const winterTemplate = document.querySelector(".winter_anime_template");
    const winterContainer = document.querySelector(".winter_anime");

    winterAnimeList.slice(0, 5).forEach((anime, index) => {
        const animeClone = winterTemplate.cloneNode(true);
        animeClone.classList.add(`top_${index + 1}`);
        animeClone.style.display = "flex";

        animeClone.querySelector(".summer_img").src = anime.images?.jpg?.image_url || "/assets/default.jpg";
            animeClone.querySelector(".summer_img").alt = anime.title;
            animeClone.querySelector(".summer_title").textContent = anime.title_english || anime.title;
            animeClone.querySelector(".sub p").textContent = anime.episodes || "?";
            animeClone.querySelector(".dubs p").textContent = anime.episodes || "?";
            animeClone.querySelector(".summer_type").textContent = anime.type || "Unknown";

           winterContainer.appendChild(animeClone);

    });

    
    //clone up to 5 and fill in for the spring animes
    const springTemplate = document.querySelector(".spring_anime_template");
    const springContainer = document.querySelector(".spring_anime");

    springAnimeList.slice(0, 5).forEach((anime, index) => {
        const animeClone = springTemplate.cloneNode(true);
        animeClone.classList.add(`top_${index + 1}`);
        animeClone.style.display = "flex";

        animeClone.querySelector(".summer_img").src = anime.images?.jpg?.image_url || "/assets/default.jpg";
            animeClone.querySelector(".summer_img").alt = anime.title;
            animeClone.querySelector(".summer_title").textContent = anime.title_english || anime.title;
            animeClone.querySelector(".sub p").textContent = anime.episodes || "?";
            animeClone.querySelector(".dubs p").textContent = anime.episodes || "?";
            animeClone.querySelector(".summer_type").textContent = anime.type || "Unknown";

           springContainer.appendChild(animeClone);

    });

    
    //clone up to 5 and fill in for the fall animes
    const fallTemplate = document.querySelector(".fall_anime_template");
    const fallContainer = document.querySelector(".fall_anime");

    fallAnimeList.slice(0, 5).forEach((anime, index) => {
        const animeClone = fallTemplate.cloneNode(true);
        animeClone.classList.add(`top_${index + 1}`);
        animeClone.style.display = "flex";

        animeClone.querySelector(".summer_img").src = anime.images?.jpg?.image_url || "/assets/default.jpg";
            animeClone.querySelector(".summer_img").alt = anime.title;
            animeClone.querySelector(".summer_title").textContent = anime.title_english || anime.title;
            animeClone.querySelector(".sub p").textContent = anime.episodes || "?";
            animeClone.querySelector(".dubs p").textContent = anime.episodes || "?";
            animeClone.querySelector(".summer_type").textContent = anime.type || "Unknown";

           fallContainer.appendChild(animeClone);

    });
}

//fill and update the anime for each respected day of the week
function updateDayAnime() {

    const mondayAnime = animeList.filter(anime => anime.broadcast?.day && anime.broadcast.day.toLowerCase() === "mondays");
    const tuesdayAnime = animeList.filter(anime =>  anime.broadcast?.day && anime.broadcast.day.toLowerCase() === "tuesdays");
    const wednesdayAnime = animeList.filter(anime =>  anime.broadcast?.day && anime.broadcast.day.toLowerCase() === "wednesdays");
    const thursdayAnime = animeList.filter(anime => anime.broadcast?.day && anime.broadcast.day.toLowerCase() === "thursdays");
    const fridayAnime = animeList.filter(anime =>  anime.broadcast?.day && anime.broadcast.day.toLowerCase() === "fridays");
    const saturdayAnime = animeList.filter(anime =>  anime.broadcast?.day && anime.broadcast.day.toLowerCase() === "saturdays");
    const sundayAnime = animeList.filter(anime =>  anime.broadcast?.day && anime.broadcast.day.toLowerCase() === "sundays");

    // console.log("Full Anime List:", animeList);

    // animeList.forEach(anime => {
    //     console.log(anime.title, anime.broadcast);
    // });
    
    // console.log(tuesdayAnime);

    // if(mondayAnime.length === 0) {
    //     console.log("No anime found");
    //     return
    // }

    //clone up to 6 anime per monday released anime
    const mondayTemplate = document.querySelector(".anime_day_template");
    const mondayContainer = document.querySelector(".monday");

    mondayAnime.slice(0, 6).forEach((anime, index) => {
        const animeClone = mondayTemplate.cloneNode(true);
        animeClone.classList.add(`top_${index + 1}`);
        animeClone.style.display = "flex";

        animeClone.querySelector(".day_image").src = anime.images?.jpg?.image_url || "/assets/demon_slayer.jpg";
        animeClone.querySelector(".day_image").alt = anime.title;
        animeClone.querySelector(".anime_day_title").textContent = anime.title_english || anime.title;
        animeClone.querySelector(".sub p").textContent = anime.episodes || "?";
        animeClone.querySelector(".dubs p").textContent = anime.episodes || "?";
        animeClone.querySelector(".day_time").textContent = anime.duration || "?";
        animeClone.querySelector(".day_type").textContent = anime.type || "?";

        mondayContainer.appendChild(animeClone);
    })

    //clone up to 6 anime per tuesday released anime
    const tuesdayTemplate = document.querySelector(".anime_day_template");
    const tuesdayContainer = document.querySelector(".tuesday");

    tuesdayAnime.slice(0, 6).forEach((anime, index) => {
        const animeClone = tuesdayTemplate.cloneNode(true);
        animeClone.classList.add(`top_${index + 1}`);
        animeClone.style.display = "flex";

        animeClone.querySelector(".day_image").src = anime.images?.jpg?.image_url || "/assets/demon_slayer.jpg";
        animeClone.querySelector(".day_image").alt = anime.title;
        animeClone.querySelector(".anime_day_title").textContent = anime.title_english || anime.title;
        animeClone.querySelector(".sub p").textContent = anime.episodes || "?";
        animeClone.querySelector(".dubs p").textContent = anime.episodes || "?";
        animeClone.querySelector(".day_time").textContent = anime.duration || "?";
        animeClone.querySelector(".day_type").textContent = anime.type || "?";

        tuesdayContainer.appendChild(animeClone);
    })

    //clone up to 6 anime per wednesday released anime    
    const wednesdayTemplate = document.querySelector(".anime_day_template");
    const wednesdayContainer = document.querySelector(".wednesday");

    wednesdayAnime.slice(0, 6).forEach((anime, index) => {
        const animeClone = wednesdayTemplate.cloneNode(true);
        animeClone.classList.add(`top_${index + 1}`);
        animeClone.style.display = "flex";

        animeClone.querySelector(".day_image").src = anime.images?.jpg?.image_url || "/assets/demon_slayer.jpg";
        animeClone.querySelector(".day_image").alt = anime.title;
        animeClone.querySelector(".anime_day_title").textContent = anime.title_english || anime.title;
        animeClone.querySelector(".sub p").textContent = anime.episodes || "?";
        animeClone.querySelector(".dubs p").textContent = anime.episodes || "?";
        animeClone.querySelector(".day_time").textContent = anime.duration || "?";
        animeClone.querySelector(".day_type").textContent = anime.type || "?";

        wednesdayContainer.appendChild(animeClone);
    })


    //clone up to 6 anime per thursday released anime
    const thursdaysTemplate = document.querySelector(".anime_day_template");
    const thursdaysContainer = document.querySelector(".thursday");

    thursdayAnime.slice(0, 6).forEach((anime, index) => {
        const animeClone = thursdaysTemplate.cloneNode(true);
        animeClone.classList.add(`top_${index + 1}`);
        animeClone.style.display = "flex";

        animeClone.querySelector(".day_image").src = anime.images?.jpg?.image_url || "/assets/demon_slayer.jpg";
        animeClone.querySelector(".day_image").alt = anime.title;
        animeClone.querySelector(".anime_day_title").textContent = anime.title_english || anime.title;
        animeClone.querySelector(".sub p").textContent = anime.episodes || "?";
        animeClone.querySelector(".dubs p").textContent = anime.episodes || "?";
        animeClone.querySelector(".day_time").textContent = anime.duration || "?";
        animeClone.querySelector(".day_type").textContent = anime.type || "?";

        thursdaysContainer.appendChild(animeClone);
    })

    //clone up to 6 anime per friday released anime
    const fridayTemplate = document.querySelector(".anime_day_template");
    const fridayContainer = document.querySelector(".friday");

    fridayAnime.slice(0, 6).forEach((anime, index) => {
        const animeClone = wednesdayTemplate.cloneNode(true);
        animeClone.classList.add(`top_${index + 1}`);
        animeClone.style.display = "flex";

        animeClone.querySelector(".day_image").src = anime.images?.jpg?.image_url || "/assets/demon_slayer.jpg";
        animeClone.querySelector(".day_image").alt = anime.title;
        animeClone.querySelector(".anime_day_title").textContent = anime.title_english || anime.title;
        animeClone.querySelector(".sub p").textContent = anime.episodes || "?";
        animeClone.querySelector(".dubs p").textContent = anime.episodes || "?";
        animeClone.querySelector(".day_time").textContent = anime.duration || "?";
        animeClone.querySelector(".day_type").textContent = anime.type || "?";

        fridayContainer.appendChild(animeClone);
    })

    //clone up to 6 anime per saturday released anime
    const saturdayContainer = document.querySelector(".saturday");

    saturdayAnime.slice(0, 6).forEach((anime, index) => {
        const animeClone = wednesdayTemplate.cloneNode(true);
        animeClone.classList.add(`top_${index + 1}`);
        animeClone.style.display = "flex";

        animeClone.querySelector(".day_image").src = anime.images?.jpg?.image_url || "/assets/demon_slayer.jpg";
        animeClone.querySelector(".day_image").alt = anime.title;
        animeClone.querySelector(".anime_day_title").textContent = anime.title_english || anime.title;
        animeClone.querySelector(".sub p").textContent = anime.episodes || "?";
        animeClone.querySelector(".dubs p").textContent = anime.episodes || "?";
        animeClone.querySelector(".day_time").textContent = anime.duration || "?";
        animeClone.querySelector(".day_type").textContent = anime.type || "?";

        saturdayContainer.appendChild(animeClone);
    })

    //clone up to 6 anime per sunday released anime
    const sundayContainer = document.querySelector(".sunday");

    sundayAnime.slice(0, 6).forEach((anime, index) => {
        const animeClone = wednesdayTemplate.cloneNode(true);
        animeClone.classList.add(`top_${index + 1}`);
        animeClone.style.display = "flex";

        animeClone.querySelector(".day_image").src = anime.images?.jpg?.image_url || "/assets/demon_slayer.jpg";
        animeClone.querySelector(".day_image").alt = anime.title;
        animeClone.querySelector(".anime_day_title").textContent = anime.title_english || anime.title;
        animeClone.querySelector(".sub p").textContent = anime.episodes || "?";
        animeClone.querySelector(".dubs p").textContent = anime.episodes || "?";
        animeClone.querySelector(".day_time").textContent = anime.duration || "?";
        animeClone.querySelector(".day_type").textContent = anime.type || "?";

        sundayContainer.appendChild(animeClone);
    })
    
}

//aysnc function in filling and fetching data for the search anime
async function findAnime(find) {

    //search anime limited only to 25 anime per search due to API's limitation
    const searchURL = `${animeAPI}?q=${encodeURIComponent(find)}&limit=25`;

    try {
        const response = await fetch(searchURL);
        if(!response.ok) {
            throw new Error("Network response not ok"); //prints out error if network is not responding
        }
        const data = await response.json();

        //make the default data inside the search bar as blank to prevent any error
        const findContainer = document.querySelector('.query');
        findContainer.innerHTML = '';

        //update the search result label w/ the search result
        const resultLable = document.querySelector('.search_result_label');
        resultLable.textContent =  `Search result for: "${find}"`;

        //create a anime card template for each anime found based on the search result
        data.data.forEach(anime=> {
            createAnimeCard(anime);
        })

        // console.log(data);
    }
    catch(error) {
        console.log(error);
    }
}

//creates and updates the anime template cards for the search result
function createAnimeCard(anime) {

    const template = document.querySelector('.anime_search_template');
    const card = template.cloneNode(true);

    card.style.display = 'block';

    const image = card.querySelector('.search_image');
    image.src = anime.images.jpg.image_url; 

    const title = card.querySelector('.anime_search_title');
    title.textContent = anime.title;

    const type = card.querySelector('.search_type');
    type.textContent = anime.type || 'N/A'; 

    const time = card.querySelector('.search_time');
    time.textContent = anime.duration || 'N/A'; 

    const subButton = card.querySelector('.sub');
    subButton.querySelector('p').textContent = anime.episodes;

    const dubsButton = card.querySelector('.dubs');
    dubsButton.querySelector('p').textContent = anime.episodes;

    document.querySelector('.query').appendChild(card);
}

//update the find anime w/ the anime that was requested
function updateSearchAnime() {

    const find = document.getElementById('searchInput').value.trim();

    if(find) {
        findAnime(find);
    }
    else {
        const resultLabel = document.querySelector('.search_result_label');
        resultLabel.textContent = '';
    }

}

//if press the search button the anime is searched 
document.getElementById('search_button').addEventListener('click', updateSearchAnime);

const searchInputs = document.getElementById("searchInput");

searchInputs.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        updateSearchAnime();
        checkSearch();
    }
});

//const to allowed the elements to appear and disapear when needed
const searchButton = document.getElementById('search_button');
const searchInput = document.getElementById('searchInput');
const searchResultsContainer = document.querySelector('.search'); 
const upperPart = document.querySelector('.upper_part'); 
const middlePart = document.querySelector('.middle_part'); 
const lowerPart = document.querySelector('.lower_part');

//if the search button is clicked, remove all contents expect for the search anime and the nav bar
searchButton.addEventListener('click', checkSearch);

function checkSearch() {
    const query = searchInput.value.trim();
    
    if (query) {

        upperPart.style.display = 'none';
        middlePart.style.display = 'none';
        lowerPart.style.display = 'none';
        
        searchResultsContainer.style.display = 'flex';
        
        // const queryElement = searchResultsContainer.querySelector('.query');
        // queryElement.textContent = `Search results for: "${query}"`;
    }   
}

//if the site logo is pressed return everything back to normal
document.querySelector('.site_logo').addEventListener('click', function() {

    document.querySelector('.search').style.display = 'none';

    document.querySelector('.upper_part').style.display = 'block';
    document.querySelector('.middle_part').style.display = 'flex';
    document.querySelector('.lower_part').style.display = 'block';

    document.getElementById('searchInput').value = '';
    document.querySelector('search_result_label').textContent = '';
})


fetchTopAnimeData(); // Fetch only the top anime for Spotlight
fetchAnimeData(); // Fetch general anime list for season and day anime
updateAiring(); // update and fill in all of the season anime
updateDayAnime(); //update and fill in all of the day anime
findAnime(); //process the searched anime
updateSearchAnime(); //update and fill in all of the result of the search anime