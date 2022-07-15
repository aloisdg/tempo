const next = document.querySelector(".next");
const start = document.querySelector(".start");
const addPlayer = document.querySelector("#addPlayer");
const newPlayerName = document.querySelector("#newPlayerName");
const newPlayerGame = document.querySelector("#newPlayerGame");
const newPlayerTurn = document.querySelector("#newPlayerTurn");

const updatePlayerGame = (gameElement, name) => {
  const current = parseTime(gameElement.textContent);
  if (current === 0) {
    clearInterval(_interval);
    // todo:
    console.log(`oh boy... ${name} is out.`);
  }

  gameElement.textContent = formatTime(current - 1);
};

const updatePlayerTurn = (gameElement, turnElement, name) => {
  const current = parseTime(turnElement.textContent);
  if (current === 1) {
    clearInterval(_interval);
    _interval = setInterval(updatePlayerGame, 1000, gameElement, name);
  }

  turnElement.textContent = formatTime(current - 1);
};

const displayPlayer = (name, game, turn) => {
  const tbody = document.querySelector("tbody");
  const template = document.querySelector("#playerRow");

  const clone = template.content.cloneNode(true);
  const td = clone.querySelectorAll("td");

  if (tbody.children.length === 0) {
    clone.firstElementChild.classList.add("currentPlayer");
    // td[0].textContent = "";
  }
  td[1].textContent = name;
  td[2].textContent = game;
  td[3].textContent = turn;
  td[3].dataset.start = turn;
  tbody.appendChild(clone);
  _playerCount++;
  next.disabled = _playerCount < 2;
  start.disabled = _playerCount < 2;
};

let _isStarted = false;
let _interval;
let _playerCount = 0;

addPlayer.onclick = () => {
  displayPlayer(
    newPlayerName.value,
    formatTime(parseInt(newPlayerGame.value)),
    formatTime(parseInt(newPlayerTurn.value))
  );
};

start.onclick = (e) => {
  e.target.firstElementChild.classList.toggle("hidden");
  e.target.lastElementChild.classList.toggle("hidden");
  const tds = document.querySelectorAll("tbody tr.currentPlayer td");
  if (_isStarted) {
    clearInterval(_interval);
    tds[0].firstElementChild.classList.add("hidden");
    tds[0].lastElementChild.classList.remove("hidden");
    _isStarted = false;
    return;
  }
  const [td, name, game, turn] = tds;
  td.firstElementChild.classList.remove("hidden");
  td.lastElementChild.classList.add("hidden");
  _interval = setInterval(updatePlayerTurn, 1000, game, turn, name.textContent);
  _isStarted = true;
};

next.onclick = () => {
  if (!_isStarted) {
    _isStarted = true;
    start.firstElementChild.classList.toggle("hidden");
    start.lastElementChild.classList.toggle("hidden");
  }
  clearInterval(_interval);
  const previousPlayer = document.querySelector("tbody tr.currentPlayer");
  previousPlayer.classList.remove("currentPlayer");
  previousPlayer.firstElementChild.firstElementChild.classList.add("hidden");
  previousPlayer.firstElementChild.lastElementChild.classList.add("hidden");
  const [_1, _2, previousGame, previousTurn] =
    previousPlayer.querySelectorAll("td");
  previousGame.textContent = formatTime(
    parseTime(previousGame.textContent) + parseTime(previousTurn.textContent)
  );
  previousTurn.textContent = previousTurn.dataset.start;
  const nextPlayer = previousPlayer.nextElementSibling
    ? previousPlayer.nextElementSibling
    : previousPlayer.parentElement.firstElementChild;
  nextPlayer.classList.add("currentPlayer");
  nextPlayer.firstElementChild.firstElementChild.classList.remove("hidden");
  const [_, name, game, turn] = nextPlayer.querySelectorAll("td");
  _interval = setInterval(updatePlayerTurn, 1000, game, turn, name.textContent);
};

// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", function () {
//     navigator.serviceWorker.register("/sw.js");
//   });
// }
