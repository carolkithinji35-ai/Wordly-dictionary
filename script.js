let form = document
  .querySelector("form")
  .addEventListener("submit", fetchMeanings);

function getData(data) {
  let wordDisplay = document.querySelector("#word");
  wordDisplay.innerHTML = `${data[0].word}`;
  wordDisplay.style.textTransform = "capitalize";
  //pronounciation
  let pronountiation = document.querySelector("#pronountiation");
  pronountiation.innerHTML = `"${data[0].phonetic}"`;
  //audio
  let audioElement = document.querySelector("audio");
  let phoneticAudio = data[0].phonetics.find((p) => p.audio);
  if (phoneticAudio) {
    audioElement.src = phoneticAudio.audio;
  } else {
    audioElement.src = "";
    audioElement.style.display = "none";
  }
  //noun definitions
  const noun = data[0].meanings.find(
    (meaning) => meaning.partOfSpeech === "noun",
  );

  if (noun) {
    document.querySelector("#noun-partOfSpeech").textContent =
      noun.partOfSpeech;
    document.querySelector("#noun-meaning").textContent =
      noun.definitions[0].definition;

    document.querySelector("#noun-example").textContent =
      noun.definitions[0].example || "No example available";
  } else {
    document.querySelector("#noun-container").style.display = "none";
  }

  //verb def
  const verb = data[0].meanings.find(
    (meaning) => meaning.partOfSpeech === "verb",
  );

  if (verb) {
    document.querySelector("#verb-partOfSpeech").textContent =
      verb.partOfSpeech;
    document.querySelector("#verb-meaning").textContent =
      verb.definitions[0].definition;

    document.querySelector("#verb-example").textContent =
      verb.definitions[0].example || "No example available";
  }
}

function fetchMeanings(event) {
  event.preventDefault();

  let word = document.querySelector("#search-input").value;
  let errorDisplay = document.querySelector("#error-display");
  errorDisplay.hidden = true;
  

  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then((res) => {
      if (!res.ok) throw new Error("Word not found");
      return res.json();
    })
    .then((data) => {
      getData(data);
    })
    .catch((error) => {
      errorDisplay.hidden = false;
      errorDisplay.innerHTML = `${error}`;
    });
}

const toggle = document.querySelector(".dark-mode");
toggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
})
