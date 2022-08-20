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
  fetch(`http://ip-api.com/json/${ipAddress}`)
    .then(res => res.json())
    .then(data => {
      const {city, countryCode, isp, lat, lon, zip, timezone} = data;
      // update DOM
      locationEl.innerText = `${city}, ${countryCode}\n${zip}`;
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
    });
}


fetch("https://api.ipify.org?format=json")
  .then(res => res.json())
  .then(data => {
    generateData(data.ip);
  })
.catch(err => console.log(err));

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
// 192.212.174.101