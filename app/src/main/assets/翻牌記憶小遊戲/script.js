// 計時器設定
let timerStarted = false; 
let timerInterval; 
let seconds = 0;

function startTimer() {
    timerInterval = setInterval(function() {
        seconds++;
        document.getElementById('timer').textContent = `遊玩時間: ${seconds} 秒`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

// 卡牌設定
let flippedCards = [];
let matchedCards = [];

function flipCard() {
    if (flippedCards.length < 2 && !flippedCards.includes(this) && !this.classList.contains('matched')) {
        if (!timerStarted) {
            startTimer();
            timerStarted = true;
        }
        flippedCards.push(this);
        this.firstChild.src = `${this.dataset.symbol}`;
        this.classList.add('selected');

        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 700);
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.symbol === card2.dataset.symbol) {
        matchedCards.push(card1, card2);
        card1.classList.add('matched');
        card2.classList.add('matched');

        if (matchedCards.length === cards.length) {
            stopTimer();
            alert(`遊戲結束！恭喜你！用時 ${seconds} 秒`);
            timerStarted = false;
        }
    } else {
        card1.firstChild.src = card2.firstChild.src = '';
        card1.classList.remove('selected');
        card2.classList.remove('selected');
    }
    flippedCards = [];
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex, tempValue;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        tempValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = tempValue;
    }
    return array;
}


// Main
const symbols = [
    'img/earth.png',
    'img/colck.png',
    'img/bank.png',
    'img/heart.png',
    'img/home.png',
    'img/rocket.png',
    'img/start.png',
    'img/coin.png'
];

let cards = symbols.concat(symbols);
cards = shuffle(cards);
const gameBoard = document.getElementById('gameBoard');

cards.forEach(symbol => {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.dataset.symbol = symbol;
    const imgElement = document.createElement('img');
    imgElement.src = '';
    card.appendChild(imgElement);
    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
});