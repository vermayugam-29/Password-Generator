const slider = document.getElementById("length_slider")
const display_slide_value = document.getElementById("sliderValue")

display_slide_value.textContent = slider.value

//Collecting all the values--------------------------------------------------------
const result = document.getElementById("res")

const copyBtn = document.getElementById('copyBtn')
const copyTextDisplay = document.getElementById('copyTextDisplay')

const upper = document.getElementById("uppercase")
const lower = document.getElementById("lowercase")
const digit = document.getElementById("digits")
const specialChar = document.getElementById("specialChars")

const strength_Btn = document.querySelector('#strength_Btn')

const allCheckBox = document.querySelectorAll('input[type=checkbox]')

const generateBtn = document.getElementById('generateBtn')

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/'

let passLen = 12
let password = ""

let checkBoxCnt = 1



function handleSlider() {
    slider.value = passLen
    display_slide_value.innerHTML = slider.value
}

function setStrengthColor(color) {
    strength_Btn.style.backgroundColor = color
}

let getRandomInt = (min , max) => {
    return Math.floor(Math.random() * (max - min)) + min
}

function getRandomNumber() {
    return getRandomInt(0,9)
}

function generateLowerCase(){
    return String.fromCharCode(getRandomInt(97,122)) //ascii value of 'a' to 'z'
}

function generateUpperCase(){
    return String.fromCharCode(getRandomInt(65,90)) //ascii value of 'A' to 'Z'
}

function generateSymbol() {
    const randomNum = getRandomInt(0 , symbols.length)
    return symbols.charAt(randomNum)
}

function calculateStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (upper.checked) hasUpper = true;
    if (lower.checked) hasLower = true;
    if (digit.checked) hasNum = true;
    if (specialChar.checked) hasSym = true;
    
    if (hasUpper && hasLower && (hasNum || hasSym) && passLen >= 8) {
        setStrengthColor("#0f0");
    } else if (
        (hasLower || hasUpper) && (hasNum || hasSym) && passLen >= 6) {
            setStrengthColor("#ff0");
        } else {
        setStrengthColor("#f00");
    }
}


async function copyPassword () {
    if (result.value) {
        try {
            await navigator.clipboard.writeText(result.value)
            copyTextDisplay.textContent = 'Copied successfully'
        } catch (error) {
            copyTextDisplay.textContent = 'Failed to copy'
        }
    } else {
        copyTextDisplay.textContent = 'No password generated yet'
    }

    setTimeout(() => {
        copyTextDisplay.innerHTML = ''
    } , 2000)
    
}


//Handling checkbox count-------------------------------------
function handleCheckBoxCnt() {
    checkBoxCnt = 0
    allCheckBox.forEach( (checkBox) => {
        if(checkBox.checked){
            checkBoxCnt++
        }
    })
}

allCheckBox.forEach( (checkBox) => {
    checkBox.addEventListener('change' ,handleCheckBoxCnt)
})

// Displaying the slider value------------------------------------------------------
slider.addEventListener('input' , (e) => {
    passLen = e.target.value
    handleSlider()
})


copyBtn.addEventListener('click' , () => {
    if(result.value != null){ //means it is not null
        copyPassword()
    } 
})


generateBtn.addEventListener('click' , () => {
    if(checkBoxCnt <= 0){
        alert('Please select at least one checkbox')
        return;
    }

    password = "" //reinitialise passwors whenever new event comes


    let arr = []

    if(upper.checked){
        arr.push(generateUpperCase)
    }
    if(lower.checked){
        arr.push(generateLowerCase)
    }
    if(digit.checked){
        arr.push(getRandomNumber)
    }
    if(specialChar.checked){
        arr.push(generateSymbol)
    }

    //compulsary addition
    for(let i = 0; i < arr.length; i++){
        password += arr[i]()
    }

    //remaining addition
    for(let i = 0; i < passLen - arr.length; i++){
        let randomIdx = getRandomInt(0 , arr.length)
        password += arr[randomIdx]()
    }

    //shuffle the passwors
    password = shufflePass(Array.from(password));


    //calculate strength
    calculateStrength()

    //displaying password
    result.value = password
})

let shufflePass = (array) => {
    //Fisher Yates Algo
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));

        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = ""

    array.forEach((el) => (str += el))

    return str;
}