let url = "https://api.aladhan.com/v1/timingsByCity";

let cardsContainer = document.querySelector('.cards-container');
let dateContent = document.querySelector('.date');
let cityContainer = document.getElementById('city');
let header = document.getElementById('header');
let dateElement = document.querySelector('.date');
let datePicker = document.getElementById('datePicker');

let today = new Date();
let formattedDate = today.toISOString().split('T')[0];

datePicker.value = formattedDate;

console.log(formattedDate); 


let cities = [
  { name: "Makkah" },
  { name: "Taif" },
  { name: "Jeddah" },
  { name: "Riyadh" },
  { name: "Dammam" },
  { name: "Medina" },
  { name: "Khobar" },
  { name: "Tabuk" },
  { name: "Abha" },
  { name: "Najran" },
  { name: "Al Hofuf" },
  { name: "Hail" },
  { name: "Jizan" },
  { name: "Buraidah" },
  { name: "Al Qatif" },
  { name: "Al Jubail" },
  { name: "Yanbu" },
  { name: "Al Kharj" },
  { name: "Sakaka" },
  { name: "Arar" },
  { name: "Al Bahah" },
  { name: "Al Mubarraz" },
  { name: "Dhahran" },
  { name: "Rabigh" },
  { name: "Unaizah" },
  { name: "Al Qurayyat" },
  { name: "Turabah" },
  { name: "Ras Tanura" },
  { name: "Wadi Al Dawasir" },
  { name: "Zulfi" }
];


for (let cityObj of cities) {
  const content = `
    <option value="${cityObj.name}">${cityObj.name}</option>
  `;
  // console.log(content);
  cityContainer.innerHTML += content;
  
  // console.log(city);
}

let selectedCity = "Makkah";
let selectedDate = formattedDate;


cityContainer.addEventListener('change', () => {
  selectedCity = cityContainer.value;
  selectedDate = datePicker.value;

  header.innerHTML = selectedCity;
  getPrayingTimesByCity(selectedCity, selectedDate);
});

datePicker.addEventListener('change', () => {
  selectedDate = datePicker.value;
  dateElement.innerHTML = selectedDate;
  getPrayingTimesByCity(selectedCity, selectedDate);
});

function getPrayingTimesByCity(cityName = "Makkah", date = formattedDate) {
  const urlWithDate = `https://api.aladhan.com/v1/timingsByCity/${date}`;
  const params = {
    city: cityName,
    country: "SA",
    method: 4
  };

  dateElement.innerHTML = `<p>${date}</p>`;

  axios.get(urlWithDate, { params: params })
    .then((response) => {
      const timings = response.data.data.timings;
      cardsContainer.innerHTML = "";

      for (let [name, time] of Object.entries(timings)) {
        cardsContainer.innerHTML += `
          <div class="card" id=${name}>
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
    .catch((error) => {
      console.error("Error:", error);
    });
}


// Load Makkah prayer timings on page load
window.addEventListener('DOMContentLoaded', () => {
  selectedCity = "Makkah";
  selectedDate = formattedDate;
  cityContainer.value = selectedCity;
  datePicker.value = selectedDate;
  header.innerHTML = selectedCity;
  getPrayingTimesByCity(selectedCity, selectedDate);
});



