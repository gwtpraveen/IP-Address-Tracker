import API_KEY from "./apiKey.js";
const ipAddressEl = document.getElementById("ip-address");
const locationEl = document.getElementById("location");
const timezoneEl = document.getElementById("timezone");
const ispEl = document.getElementById("isp");
const formEl = document.querySelector(".form");
let map = L.map('map');

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

function generateData(ipAddress) {
  ipAddressEl.innerText = ipAddress;
  // fetch the data from the ip api
  fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress=${ipAddress}`)
    .then(res => res.json())
    .then(data => {
      const {location : {city, lat, lng:lon, country, timezone, postalCode}, isp} = data;
      // update DOM
      locationEl.innerText = `${city}, ${country}\n${postalCode}`;
      timezoneEl.innerText = timezone;
      ispEl.innerText = isp;

      map.setView([lat, lon], 13);
      // change marker icon
      let myIcon = L.icon({
          iconUrl: '../images/icon-location.svg'
      });


      // mark the marker 
      let marker = L.marker([lat, lon], {icon: myIcon}).addTo(map);
    })
    .catch(function(error) {
      console.log(error)
      alert("Some thing went wrong! Please Try again later!")
    });
}


fetch("https://api.ipify.org?format=json")
  .then(res => res.json())
  .then(data => {
    generateData(data.ip);
  })
.catch(err => {
    console.log(err);
    alert("You appear to be using an ad blocker. Please disable them to use this site.")
});

formEl.addEventListener("submit", e => {
  e.preventDefault();
  const inputEl = e.target.firstElementChild;
  const userIpAddress = inputEl.value;
  const reg = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/
  if (reg.test(userIpAddress)) {
    generateData(userIpAddress)
  } else {
    alert("invalid IP Address")
  }
})
