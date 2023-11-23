var text = document.querySelector("#text");
var count = document.querySelector("#count");
var result = document.querySelector(".result");
var guessBu = document.querySelector("#guess");
var reBu = document.querySelector("#reBu");
var resultDisplay = document.querySelector("#result");

var minRange = 1;
var maxRange = 100;

var guessNumber = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
var sum = 0;

guessBu.onclick = function () {
    sum++;
    count.innerHTML = sum;
    var userGuess = parseInt(text.value);

        if (isNaN(userGuess) || userGuess < 1 || userGuess >100)  {
            result.innerHTML = "請輸入1-100的數字";
            result.style.color = "red";
            resultDisplay.innerHTML = "輸入錯誤！"; 
        }
        else if (userGuess > guessNumber) {
            result.innerHTML = "猜大了！";
            result.style.color = "red";
            maxRange = userGuess;
            resultDisplay.innerHTML = `${minRange}-${maxRange}`;
        } else if (userGuess < guessNumber) {
            result.innerHTML = "猜小了！";
            result.style.color = "red";
            minRange = userGuess;
            resultDisplay.innerHTML = `${minRange}-${maxRange}`;
        } else {
            result.className = "c2";
            result.innerHTML = "恭喜猜對了！";
            result.style.color = "green";
            resultDisplay.innerHTML = "恭喜猜對了！";
        }
    

}

reBu.onclick = function () {
    minRange = 1;
    maxRange = 100;
    guessNumber = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
    sum = 0;
    count.innerHTML = sum;
    result.innerHTML = "";
    resultDisplay.innerHTML = "";
    text.value = "";
}
