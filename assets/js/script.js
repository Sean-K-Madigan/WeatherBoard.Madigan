const cityName = document.getElementById('cityInput');
const units = 'imperial'
const key = '27dc34505c86a236b534528dd26289b3';
const apiGeoUrl = `https://api.openweathermap.org/geo/1.0/direct?`

const searchBtn = document.getElementById('searchBtn');
const cityBtnsEl = document.getElementById('cityButtons');
const weatherEl = document.getElementById('weatherInfo');

// Load past searches or initializes an empty array in local storage
const cityBtns = JSON.parse(localStorage.getItem('cityBtns')) || [];

// If there is already cities saved in local storage this function creates buttons for each item in the array and grants the button the ability to fetch the weather of the city on said button.
cityBtns.forEach(function(element) {
    const button = document.createElement('button');

    button.setAttribute('class', 'btn btn-info mx-4 my-2 border border-3 border-dark');

    button.textContent = element;

    button.addEventListener('click', function() {
        
        const cityValue = element;
        const apiUrl = `${apiGeoUrl}q=${cityValue}&limit=1&appid=${key}`

        fetch (apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error ('Network response not functional');
            }
            return response.json();
        })
        .then((data) => {
            const lat = data[0].lat;
            const lon =data[0].lon;
            const apiWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${key}`;

            fetch (apiWeatherUrl)

            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response not functional');
                }
                return response.json();
            })
            .then(data => {
                showWeather(data);
            });
    });

    });

    cityBtnsEl.appendChild(button);
});

// Event listener to the city search button
searchBtn.addEventListener('click', saveAppendGet);

// function that creates new buttons when a new search term is entered
function saveAppendGet(event) {
    event.preventDefault();

    const cityValue = cityName.value.trim();

    // Prevents an empty button from being created
    if (cityValue !== "") {
        
        // prevents duplicate buttons from being created
        if (!cityBtns.includes(cityValue)) {
            
            cityBtns.push(cityValue);
        
            localStorage.setItem('cityBtns', JSON.stringify(cityBtns));
        
            const button = document.createElement('button');
        
            button.setAttribute('class', 'btn btn-info mx-4 my-2 border border-3 border-dark');
        
            button.textContent = cityValue;
        
            button.addEventListener('click', function() {
                
                const apiUrl = `${apiGeoUrl}q=${cityValue}&limit=1&appid=${key}`

            fetch (apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error ('Network response not functional');
                }
                return response.json();
            })
            .then((data) => {
                const lat = data[0].lat;
                const lon =data[0].lon;
                const apiWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${key}`;

                fetch (apiWeatherUrl)

                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response not functional');
                    }
                    return response.json();
                })
                .then(data => {
                    showWeather(data);
                });
        });
            });

            cityBtnsEl.appendChild(button);

            getWeather(cityValue)

        } else {

            getWeather(cityValue);
        }
    }

}

// Api fetch function to convert city name to coordinates and aquire weather information at those coordinates
function getWeather() {

    const cityValue = cityName.value.trim();
    const apiUrl = `${apiGeoUrl}q=${cityValue}&limit=1&appid=${key}`

    // fetches longitude and latitude of a spceified city by name
    fetch (apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error ('Network response not functional');
        }
        // console.log(response);
        return response.json();
    })
    .then((data) => {
        const lat = data[0].lat;
        const lon =data[0].lon;
        const apiWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${key}`;

        // Takes the lon and lat aquired by the fetch above and gets weather information for that city
        fetch (apiWeatherUrl)

        .then(response => {
            if (!response.ok) {
                throw new Error('Network response not functional');
            }
            return response.json();
        })
        .then(data => {
            showWeather(data);
        });
    });
};

// Appends api fetch to the page populating current weather and the 5 day forecast 
function showWeather(data) {
    // console.log(data);
    const city = document.getElementById('city-name');
    const currentWeather = document.getElementById('city-info');
    const forecastCards = [
        document.getElementById('day1'),
        document.getElementById('day2'),
        document.getElementById('day3'),
        document.getElementById('day4'),
        document.getElementById('day5'),
    ];

    city.textContent = `${data.city.name} ${dayjs().format('MM/DD/YYYY')}`;

    // displays the current weather
    currentWeather.innerHTML = `
    <img src="https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png" alt="${data.list[0].weather[0].description}">
    <p>Temperature: ${data.list[0].main.temp} °F</p>
    <p>Wind Speed: ${data.list[0].wind.speed} mph</p>
    <p>Humidity: ${data.list[0].main.humidity} %</p>` 

    // displays the weather for the next 5 days
    for (let i = 0; i < forecastCards.length; i++) {
        forecastCards[i].innerHTML = `
        <h5> ${dayjs().add(1 + i, 'day').format('MM/DD/YYYY')} </h5>
        <img src="https://openweathermap.org/img/wn/${data.list[i+1].weather[0].icon}.png" alt="${data.list[i+1].weather[0].description}"> 
        <p>Temperature: ${data.list[i+1].main.temp} °F</p>
        <p>Wind Speed: ${data.list[i+1].wind.speed} mph</p>
        <p>Humidity: ${data.list[i+1].main.humidity} %</p>`;
    }
};