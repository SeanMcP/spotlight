(function main() {
  const cursorEl = document.getElementById("cursor");
  const gameEl = document.getElementById("game");
  const screenEl = document.getElementById("screen");
  const scoreEl = document.getElementById("score");
  const timeEl = document.getElementById("time");
  let index = -1;
  let gameScore = 0;

  function shuffle(array) {
    const copy = [...array]
    copy.sort(() => Math.random() - 0.5)
    return copy
  }

  const LEVELS = shuffle([
    {
      id: "blossoms",
      critters: ["🕊️", "🐛", "🦉", "🐿️"],
      image: "cherry-blossoms.jpg",
    },
    {
      id: "flowers",
      critters: ["🐝", "🐁", "🐞", "🐛"],
      image: "flowers.jpg",
    },
    {
      id: "ocean",
      critters: ["🐋", "🐬", "🐙", "🐟"],
      image: "ocean.jpg",
    },
    {
      id: "succulents",
      critters: ["🐌", "🐞", "🐜", "🐛"],
      image: "succulents.jpg",
    },
    {
      id: "sunflowers",
      critters: ["🐝", "🐜", "🐞", "🐛"],
      image: "sunflowers.jpg",
    },
    {
      id: "reel",
      critters: ["🐠", "🐡", "🐙", "🐟"],
      image: "coral-reef.jpg",
    },
  ]);

  document.addEventListener("mousemove", (event) => {
    cursorEl.setAttribute("cx", event.x);
    cursorEl.setAttribute("cy", event.y);
  });

  function round() {
    screenEl.style.opacity = 1
    let roundScore = 0;
    if (index < LEVELS.length - 1) {
      index++;
    } else {
      index = 0;
    }
    const level = LEVELS[index];

    function setTimer() {
      clearInterval(window.__roundInterval);
      window.__roundTime = 0;
      timeEl.textContent = "0 sec.";
      window.__roundInterval = setInterval(() => {
        window.__roundTime++;
        timeEl.textContent = window.__roundTime + " sec.";
      }, 1000);
    }

    setTimer();

    function incrementScore() {
      gameScore++;
      roundScore++;
      scoreEl.textContent = `Score: ${gameScore}`;
    }

    function handleCritterClick(event) {
      event.preventDefault();
      event.target.remove();
      incrementScore();

      if (roundScore === level.critters.length) {
        clearInterval(window.__roundInterval);
        playAudio("done");
        screenEl.style.opacity = 0
        setTimeout(() => {
          alert(`You found all the critters in ${window.__roundTime} seconds!`);
          round();
        }, 300);
      } else {
        playAudio("pop");
      }
    }

    document.body.style.backgroundImage = `url(assets/${level.image})`;

    shuffle(level.critters).forEach((critter, i) => {
      const el = document.createElement("button");
      el.classList.add("critter");
      el.textContent = critter;
      el.dataset.index = i 
      el.addEventListener("click", handleCritterClick);
      const [x, y] = getRandomPosition();
      el.style.left = x + "px";
      el.style.top = y + "px";
      gameEl.appendChild(el);
    });
  }

  const PADDING = 150;

  function getRandomPosition() {
    return [
      Math.min(
        Math.max(PADDING, Math.floor(Math.random() * window.innerWidth)),
        window.innerWidth - PADDING
      ),
      Math.min(
        Math.max(PADDING, Math.floor(Math.random() * window.innerHeight)),
        window.innerHeight - PADDING
      ),
    ];
  }

  function playAudio(sound) {
    new Audio(`./assets/${sound}.mp3`).play();
  }

  round();
})();
