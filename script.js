document.querySelector("form").addEventListener("submit", fetchMeanings);

function getData(data) {
  let wordDisplay = document.querySelector("#word");
  wordDisplay.innerHTML = `${data[0].word}`;
  wordDisplay.style.textTransform = "capitalize";

  //pronunciation
  let pronunciation = document.querySelector("#pronunciation");
  pronunciation.innerHTML = `"${data[0].phonetic || ""}"  `;

  //audio
  let audioElement = document.querySelector("audio");
  let phoneticAudio = data[0].phonetics.find((p) => p.audio);
  audioElement.style.display = "block";
  if (phoneticAudio) {
    audioElement.src = phoneticAudio.audio;
  } else {
    audioElement.src = "";
    audioElement.style.display = "none";
  }

  // all parts of speech — every meaning, every definition
  let meaningsContainer = document.querySelector("#meanings-container");
  meaningsContainer.innerHTML = "";

  data[0].meanings.forEach((meaning) => {
    const section = document.createElement("div");
    section.classList.add("meaning-section");

    const partOfSpeechHeading = document.createElement("h3");
    partOfSpeechHeading.innerHTML = meaning.partOfSpeech;
    partOfSpeechHeading.style.textTransform = "Capitalize";
    partOfSpeechHeading.className = "part-of-speech";
    section.appendChild(partOfSpeechHeading);

    meaning.definitions.forEach((def, index) => {
      const definitionParagraph = document.createElement("p");
      definitionParagraph.textContent = `${index + 1}. ${def.definition}`;
      section.appendChild(definitionParagraph);

      if (def.example) {
        let exampleParagraph = document.createElement("p");
        exampleParagraph.classList.add("example");
        exampleParagraph.innerHTML =
          "<em  class='example-label'>Example:</em>" + "<br>" + def.example;

        section.appendChild(exampleParagraph);
      }
    });

    meaningsContainer.appendChild(section);
  });

  //synonyms
  let synonymsList = document.querySelector("#synonyms-list");
  synonymsList.innerHTML = "";
  synonymsList.style.textTransform = "capitalize";

  let synonyms = [];

  data[0].meanings.forEach((meaning) => {
    if (meaning.synonyms && meaning.synonyms.length > 0) {
      synonyms.push(...meaning.synonyms);
    }

    meaning.definitions.forEach((definition) => {
      if (definition.synonyms && definition.synonyms.length > 0) {
        synonyms.push(...definition.synonyms);
      }
    });
  });

  if (synonyms.length > 0) {
    synonymsList.textContent = synonyms.join(", ");
  } else {
    synonymsList.textContent = "No synonyms available";
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
      errorDisplay.textContent = `${error}. Try another search.`;
    });
}

const toggle = document.querySelector(".dark-mode");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  toggle.classList.remove("fa-moon");
  toggle.classList.add("fa-sun");
}

toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggle.classList.toggle("fa-moon");
  toggle.classList.toggle("fa-sun");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
});