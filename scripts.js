let body = document.querySelector('body');
console.log(body);
let cardsContainer = document.querySelector('.cards-container');
let cityContainer = document.getElementById('city');
let header = document.getElementById('header');
let dateElement = document.querySelector('.date-m');
let dateElementH = document.querySelector('.date-h');
let day = document.querySelector('.day-h');
let dayM = document.querySelector('.day-m');
let datePicker = document.getElementById('datePicker');
let time = document.querySelector('.time');


const toggleBtn = document.querySelector('.nav-toggle');
const navSelection = document.querySelector('.nav-selection');
let closeBtn = document.querySelector('.close-btn ');


let today = new Date();
let formattedDate = today.toISOString().split('T')[0];
datePicker.value = formattedDate;

let cities = [
  { name: "Makkah", lat: 21.3891, lng: 39.8579, image: './images/mecca.jpg' },
  { name: "Taif", lat: 21.4373, lng: 40.5127, image: './images/taif.jpg' },
  { name: "Jeddah", lat: 21.4858, lng: 39.1925, image: './images/jeddah.jpg' },
  { name: "Riyadh", lat: 24.7136, lng: 46.6753, image: './images/Riyadh.jpg' },
  { name: "Dammam", lat: 26.4207, lng: 50.0888, image: './images/damm.jpg' },
  { name: "Medina", lat: 24.5247, lng: 39.5692, image: './images/Medina.jpg' },
  { name: "Abha", lat: 18.2465, lng: 42.5117, image: './images/Abha.jpg' },
  { name: "Tabuk", lat: 28.3838, lng: 36.5550, image: './images/Tabuk.jpg' },
  { name: "Hail", lat: 27.5114, lng: 41.7208, image: './images/Hail.jpg' },
  { name: "Al Khobar", lat: 26.2794, lng: 50.2084, image: './images/Khobar.jpg' },
  { name: "Najran", lat: 17.5653, lng: 44.2289, image: './images/Najran.jpg' },
  { name: "Al Baha", lat: 20.0129, lng: 41.4677, image: './images/Baha.jpg' }
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

function dateNow() {
  let now = new Date();
  let hours = now.getHours().toString().padStart(2, '0');
  let minutes = now.getMinutes().toString().padStart(2, '0');
  let seconds = now.getSeconds().toString().padStart(2, '0');
  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // convert 0 to 12
  let fullTime =`${hours}:${minutes}:${seconds} ${ampm}`;
  time.innerHTML = fullTime;
}

setInterval(dateNow, 1000); 
dateNow();


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
      console.log(data);

      dateElement.innerHTML = `<p>${data.date.gregorian.date}</p>`;
      dateElementH.innerHTML = `<p>${data.date.hijri.date}</p>`;
      day.innerHTML = `<p>${data.date.hijri.weekday.en}</p>`;
      dayM.innerHTML = `<p>${data.date.gregorian.weekday.en}</p>`

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

toggleBtn.addEventListener('click', () => {
  // navSelection.style.display = 
  //   navSelection.style.display === 'flex' ? 'none' : 'flex';
  navSelection.classList.remove('hidden');
  document.body.classList.add('modal-open');
  toggleBtn.classList.remove('pulse');
});

closeBtn.addEventListener('click', () => {
  navSelection.classList.add('hidden');
  document.body.classList.remove('modal-open');
  toggleBtn.classList.add('pulse');
})


// Initial Load
window.addEventListener('DOMContentLoaded', () => {
  selectedCity = "Makkah";
  selectedDate = formattedDate;
  cityContainer.value = selectedCity;
  datePicker.value = selectedDate;
  header.innerHTML = selectedCity;
  getPrayingTimes(selectedCity, selectedDate);
});
