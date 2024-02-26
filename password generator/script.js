const inputSlider = document.querySelector("[ data-lengthSlider]"); //we are fetching data using custom attribute
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
let copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercasecheck = document.querySelector("#uppercase");
const lowercasecheck = document.querySelector("#lowercase");
const numberscheck = document.querySelector("#numbers");
const symbolscheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generatebtn = document.querySelector(".generateBtn");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;

handleSlider();
// set strength circle to grey
setIndicator("#ccc");

function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRndInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  if (uppercasecheck.checked) hasUpper = true;
  if (lowercasecheck.checked) hasLower = true;
  if (numberscheck.checked) hasNum = true;
  if (symbolscheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  } catch (e) {
    copyMsg.innerText = "failed";
  }

  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function shufflePassword(array) {
  //Fisher yates method for password shuffling

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyContent();
  }
});

function handleCheckboxChange() {
  checkCount = 0;
  allCheckbox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }
  });

  //special condition
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}
allCheckbox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckboxChange);
});

generatebtn.addEventListener("click", () => {
  if (checkCount == 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  //* new password generation

  // console.log("Starting the journey");

  password = "";
  // if (uppercasecheck.checked) {
  //   password += getRandomupperrcase();
  // }
  // if (lowercasecheck.checked) {
  //   password += getRandomlowercase();
  // }
  // if (numberscheck.checked) {
  //   password += generaterandomNumber();
  // }
  // if (symbolscheck.checked) {
  //   password += generateSymbol();
  // }

  let funcArr = [];

  if (uppercasecheck.checked) {
    funcArr.push(generateUpperCase);
  }
  if (lowercasecheck.checked) {
    funcArr.push(generateLowerCase);
  }
  if (numberscheck.checked) {
    funcArr.push(generateRandomNumber);
  }
  if (symbolscheck.checked) {
    funcArr.push(generateSymbol);
  }

  //Compulsory addition

  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }
  // console.log("Compulsory Addition done");

  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let rndmIndex = getRndInteger(0, funcArr.length);

    password += funcArr[rndmIndex]();
  }
  // console.log("remaining Addition done");

  //shuffle the password
  password = shufflePassword(Array.from(password));

  // console.log("shuffling done");

  //show in UI;

  passwordDisplay.value = password;
  // console.log("showing to the ui");

  calcStrength();
});
