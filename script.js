// creating the background , container, select, row , heading
var divBackground = createMyElement(
  "div",
  "album py-3 page-holder bg-cover",
  ""
);

var divRow = createMyElement("div", "row", "row");
var h3 = createMyElement("h3", "", "chapter_heading");
var h2 = createMyElement("h2", "", "");
h2.innerHTML = "திருக்குறள் / THIRUKKURAL";
var divContainer = createMyElement("div", "container", "");
var selectChapter = createMyElement(
  "select",
  "custom-select custom-select-sm mb-3",
  "chapter"
);
selectChapter.setAttribute("name", "");
var defOption = createMyElement("option", "", "");
defOption.setAttribute("selected", "");
defOption.setAttribute("disabled", "");
defOption.value = "";
defOption.innerHTML = "Select any chapter";
selectChapter.append(defOption);
var divLanguage = createMyElement(
  "div",
  "custom-control custom-switch mb-3",
  ""
);
var inpCheckbox = createMyElement("INPUT", "custom-control-input", "lang");
inpCheckbox.setAttribute("type", "checkbox");
var labelLanguage = createMyElement("label", "custom-control-label");
labelLanguage.innerHTML = "Tamil / English";
labelLanguage.setAttribute("for", "lang");

divLanguage.append(inpCheckbox, labelLanguage);
divContainer.append(h2, selectChapter, divLanguage, h3, divRow);
divBackground.append(divContainer);
document.body.append(divBackground);

// getting all the chapter list
async function chapter() {
  try {
    for (i = 1; i <= 1330; i = i + 10) {
      const chp = await fetch(
        "https://api-thirukkural.vercel.app/api?num=" + i
      ).then((res) => res.json());
      //console.log(result);

      let opt = document.createElement("option");
      opt.value = chp.chap_tam;
      opt.dataset.num = i;
      opt.innerHTML =
        i + "-" + (i + 9) + " -> " + chp.chap_tam + " / " + chp.chap_eng;
      document.getElementById("chapter").append(opt);
    }
  } catch (e) {
    console.log(e);
  }
}
chapter();

// getting the selected values

document.getElementById("chapter").addEventListener("change", () => {
  let chap = document.getElementById("chapter").value;
  let num = document
    .getElementById("chapter")
    .selectedOptions[0].getAttribute("data-num");
  document.getElementById("chapter_heading").innerHTML = chap;
  document.getElementById("row").innerHTML = "";

  // calling the function for getting the kural results

  kural(chap, num);
});

document.getElementById("lang").addEventListener("change", checkLang);

// checking the language which is checked

function checkLang() {
  let lang = document.getElementById("lang").checked ? "english" : "tamil";
  if (lang == "english") {
    document.querySelectorAll(".tamilCard").forEach((card) => {
      card.style.display = "none";
    });
    document.querySelectorAll(".englishCard").forEach((card) => {
      card.style.display = "";
    });
  } else {
    document.querySelectorAll(".englishCard").forEach((card) => {
      card.style.display = "none";
    });
    document.querySelectorAll(".tamilCard").forEach((card) => {
      card.style.display = "";
    });
  }
}

// fetching the kural datas related to the user input

async function kural(chap, num) {
  try {
    document.getElementById("row").innerHTML = "";
    for (j = num; j <= num + 9; j++) {
      const result = await fetch(
        "https://api-thirukkural.vercel.app/api?num=" + j
      ).then((resp) => resp.json());
      //console.log(result);
      if (chap == result.chap_tam) {
        // creating the tamil and english cards by calling function
        tamilCards(
          result.number,
          result.chapgrp_tam,
          result.line1,
          result.line2,
          result.tam_exp
        );
        englishCards(
          result.number,
          result.chapgrp_eng,
          result.eng,
          result.eng_exp
        );
        checkLang();
      }
    }
  } catch (e) {
    console.log(e);
  }
}

// function for creating tamil and english cards

function tamilCards(number, chapgrp_tam, line1, line2, tam_exp) {
  let col = createMyElement("div", "col-lg-4 col-md-6 tamilCard");
  let card = createMyElement("div", "card mb-4 border-success shadow");
  let cardhead = createMyElement("div", "card-header text-success");
  let cardbody = createMyElement("div", "card-body");
  let cardtext = createMyElement("p", "card-text");
  let text = createMyElement("small", "text-muted");

  cardhead.innerHTML = number + " " + chapgrp_tam;
  cardtext.innerHTML = line1 + " " + line2;
  text.innerHTML = tam_exp;

  cardbody.append(cardtext, text);
  card.append(cardhead, cardbody);
  col.append(card);
  document.getElementById("row").append(col);
}
function englishCards(number, chapgrp_eng, eng, eng_exp) {
  let col = createMyElement("div", "col-lg-4 col-md-6 englishCard");
  let card = createMyElement("div", "card mb-4 border-success shadow");
  let cardhead = createMyElement("div", "card-header text-success");
  let cardbody = createMyElement("div", "card-body");
  let cardtext = createMyElement("p", "card-text");
  let text = createMyElement("small", "text-muted");

  cardhead.innerHTML = number + " " + chapgrp_eng;
  cardtext.innerHTML = eng;
  text.innerHTML = eng_exp;

  cardbody.append(cardtext, text);
  card.append(cardhead, cardbody);
  col.append(card);
  document.getElementById("row").append(col);
}

// function for creacting the html element

function createMyElement(eleName, eleClass = "", eleId = "") {
  let ele = document.createElement(eleName);
  ele.setAttribute("class", eleClass);
  ele.id = eleId;
  return ele;
}
