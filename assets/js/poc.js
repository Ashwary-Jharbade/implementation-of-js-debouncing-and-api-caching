async function fetchInfo(url) {
  console.log("Called Again");
  let weatherInfo = await fetch(url)
    .then((data) => data.json())
    .then((myJson) => myJson);
  return weatherInfo;
}

const cache = {};
const cacheTime = 5000;
let cacheTimer = 0;
async function fetchWithCache(dataName, url, time) {
  const now = new Date().getTime();
  if (!cache[dataName] || cache[dataName].cacheTimer < now) {
    cache[dataName] = await fetchInfo(url);
    cache[dataName].cacheTimer = getCacheTimer(time);
  }
  return cache[dataName];
}

function getCacheTimer(time) {
  const now = new Date().getTime();
  if (cacheTimer < now + time) {
    cacheTimer = now + time;
  }
  return cacheTimer;
}

async function displayData(dataName, url) {
  const dataInfo = await fetchWithCache(dataName.toLowerCase(), url, cacheTime);
  if (!dataInfo || !dataInfo.id) {
    console.log(`There's an error with request.`);
    return;
  }
}

function init() {
  displayData("post", "https://jsonplaceholder.typicode.com/todos/1");
}

window.addEventListener("beforeunload", (event) => {
  init();
  console.log(cache);
  document.getElementById("post").innerHTML = "Hello";
});
