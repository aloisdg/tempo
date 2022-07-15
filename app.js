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
  if (current <= 1) {
    clearInterval(_interval);
    _interval = setInterval(updatePlayerGame, 1000, gameElement, name);
  }

  turnElement.textContent = formatTime(current - 1);
};

const displayPlayer = (name, game, turn) => {
  const tbody = document.querySelector(".tbody");
  const template = document.querySelector("#playerRow");

  const clone = template.content.cloneNode(true);
  const sections = clone.querySelectorAll("section");

  if (tbody.children.length === 0) {
    clone.firstElementChild.classList.add("currentPlayer");
    // sections[0].textContent = "";
  }
  sections[1].textContent = name;
  sections[2].textContent = game;
  sections[3].textContent = turn;
  sections[3].dataset.start = turn;
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
  const [current, name, game, turn] = document.querySelectorAll(".tbody .gameRow.currentPlayer section");
  if (_isStarted) {
    clearInterval(_interval);
    current.firstElementChild.classList.add("hidden");
    current.lastElementChild.classList.remove("hidden");
    _isStarted = false;
    return;
  }
  current.firstElementChild.classList.remove("hidden");
  current.lastElementChild.classList.add("hidden");
  // if (turn)
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
  const previousPlayer = document.querySelector(".tbody .gameRow.currentPlayer");
  previousPlayer.classList.remove("currentPlayer");
  previousPlayer.firstElementChild.firstElementChild.classList.add("hidden");
  previousPlayer.firstElementChild.lastElementChild.classList.add("hidden");
  const [_1, _2, previousGame, previousTurn] =
    previousPlayer.querySelectorAll("section");
  previousGame.textContent = formatTime(
    parseTime(previousGame.textContent) + parseTime(previousTurn.textContent)
  );
  previousTurn.textContent = previousTurn.dataset.start;
  const nextPlayer = previousPlayer.nextElementSibling
    ? previousPlayer.nextElementSibling
    : previousPlayer.parentElement.firstElementChild;
  nextPlayer.classList.add("currentPlayer");
  nextPlayer.firstElementChild.firstElementChild.classList.remove("hidden");
  const [_, name, game, turn] = nextPlayer.querySelectorAll("section");
  _interval = setInterval(updatePlayerTurn, 1000, game, turn, name.textContent);
};

// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", function () {
//     navigator.serviceWorker.register("/sw.js");
//   });
// }
