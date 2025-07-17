let body = document.querySelector('body');
console.log(body);
let cardsContainer = document.querySelector('.cards-container');
let cityContainer = document.getElementById('city');
let header = document.getElementById('header');
let dateElement = document.querySelector('.date-m');
let dateElementH = document.querySelector('.date-h');
let day = document.querySelector('.day');
let datePicker = document.getElementById('datePicker');

let today = new Date();
let formattedDate = today.toISOString().split('T')[0];
datePicker.value = formattedDate;

let cities = [
  { name: "Makkah", lat: 21.3891, lng: 39.8579, image: './images/makkah.jpg' },
  { name: "Taif", lat: 21.4373, lng: 40.5127, image: './images/taif.jpg' },
  { name: "Jeddah", lat: 21.4858, lng: 39.1925, image: './images/jeddah.jpg'},
  { name: "Riyadh", lat: 24.7136, lng: 46.6753, image: './images/Riyadh.jpg' },
  { name: "Dammam", lat: 26.4207, lng: 50.0888, image: './images/Dammam.jpg' },
  { name: "Medina", lat: 24.5247, lng: 39.5692, image: './images/Medina.jpg' }
];

// Populate dropdown
cities.forEach(city => {
  cityContainer.innerHTML += `<option value="${city.name}">${city.name}</option>`;
  // body.style.background = `url(${city.image})`;
});

let selectedCity = "Makkah";
let selectedDate = formattedDate;

// Event: City change
cityContainer.addEventListener('change', () => {
  selectedCity = cityContainer.value;
  selectedDate = datePicker.value;
  header.innerHTML = selectedCity;
  getPrayingTimes(selectedCity, selectedDate);

  const city = cities.find(c => c.name === selectedCity);
  if (city) {
    body.style.background = `url(${city.image})`;
    body.style.backgroundSize = 'cover';        
    body.style.backgroundPosition = 'center';   
    body.style.backgroundRepeat = 'no-repeat';  
  }
});

// Event: Date change
datePicker.addEventListener('change', () => {
  selectedDate = datePicker.value;
  selectedCity = cityContainer.value;
  header.innerHTML = selectedCity;
  getPrayingTimes(selectedCity, selectedDate);
});

// ✅ Get prayer times by city name and date
function getPrayingTimes(cityName, date) {
  const city = cities.find(c => c.name === cityName);
  if (!city) {
    console.error("City not found!");
    return;
  }

  const timestamp = Math.floor(new Date(date).getTime() / 1000); // Unix timestamp

  const url = `https://api.aladhan.com/v1/timings/${timestamp}`;
  const params = {
    latitude: city.lat,
    longitude: city.lng,
    method: 4
  };

  axios.get(url, { params })
    .then(response => {
      const data = response.data.data;

      dateElement.innerHTML = `<p>${data.date.gregorian.date}</p>`;
      dateElementH.innerHTML = `<p>${data.date.hijri.date}</p>`;
      day.innerHTML = `<p>${data.date.hijri.weekday.en}</p>`;

      cardsContainer.innerHTML = '';
      for (const [name, time] of Object.entries(data.timings)) {
        cardsContainer.innerHTML += `
          <div class="card flex" id="${name}">
            <div class="card-header">
              <h1>${name}</h1>
            </div>
            <div class="card-body center">
              <h1>${time}</h1>
            </div>
          </div>
        `;
      }
    })
    .catch(err => console.error("API error:", err));
}

// Initial Load
window.addEventListener('DOMContentLoaded', () => {
  selectedCity = "Makkah";
  selectedDate = formattedDate;
  cityContainer.value = selectedCity;
  datePicker.value = selectedDate;
  header.innerHTML = selectedCity;
  getPrayingTimes(selectedCity, selectedDate);
});
