const cityName = document.getElementById('cityInput');
const units = 'imperial'
const key = '27dc34505c86a236b534528dd26289b3';
const apiGeoUrl = `https://api.openweathermap.org/geo/1.0/direct?`

const searchBtn = document.getElementById('searchBtn');
const cityBtnsEl = document.getElementById('cityButtons');
const weatherEl = document.getElementById('weatherInfo');

// Load past searches
const cityBtns = JSON.parse(localStorage.getItem('cityBtns')) || [];

cityBtns.forEach(function(element) {
    const button = document.createElement('button');

    button.setAttribute('class', 'btn btn-info m-4');

    button.textContent = element;
    cityBtnsEl.appendChild(button);
});

// Event listener
searchBtn.addEventListener('click', saveAppendGet);

function saveAppendGet(event) {
    event.preventDefault();

    const cityValue = cityName.value.trim();

    cityBtns.push(cityValue);

    localStorage.setItem('cityBtns', JSON.stringify(cityBtns));

    const button = document.createElement('button');

    button.setAttribute('class', 'btn btn-info m-4');

    button.textContent = cityValue;
    cityBtnsEl.appendChild(button);

    getWeather(cityValue);
}

function getWeather() {

    const cityValue = cityName.value.trim();
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
        const apiWeatherUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${key}`;

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

function showWeather(data) {
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

    currentWeather.innerHTML = `
    <img src="http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png" alt="${data.list[0].weather[0].description}">
    <p>Temperature: ${data.list[0].main.temp} °F</p>
    <p>Wind Speed: ${data.list[0].wind.speed} mph</p>
    <p>Humidity: ${data.list[0].main.humidity} %</p>` 

    for (let i = 0; i < forecastCards.length; i++) {
        forecastCards[i].innerHTML = `
        <h5> ${dayjs().add(1 + i, 'day').format('MM/DD/YYYY')} </h5>
        <img src="http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png" alt="${data.list[0].weather[0].description}"> 
        <p>Temperature: ${data.list[0].main.temp} °F</p>
        <p>Wind Speed: ${data.list[0].wind.speed} mph</p>
        <p>Humidity: ${data.list[0].main.humidity} %</p>`;
    }
};


