const fruitImages = [
    'images/apple.jpg',
    'images/carrot.jpg',
    'images/watermelon.jpg',
    'images/coconut.jpg',
    'images/lemon.jpg',
    'images/cherry.jpg',
    'images/orange.jpg',
    'images/banana.jpg'
];

const shapes = ['◼', '◯', '▲', '◆', '★', '♠', '♣', '♥'];

document.getElementById('start-game').addEventListener('click', () => {
    const gridSize = parseInt(document.getElementById('grid-size').value);
    const contentType = document.getElementById('content-type').value;
    const timeLimit = parseInt(document.getElementById('time-limit').value);
    const gameBoard = document.getElementById('game-board');
    const timerDisplay = document.getElementById('timer');
    const scoreDisplay = document.getElementById('score');
    let flippedCards = [];
    let matchedPairs = 0;
    let score = 0;
    let timeRemaining = timeLimit;
    let shuffleInterval;

    // Configure the grid
    gameBoard.style.display = 'grid';
    gameBoard.setAttribute('data-grid-size', gridSize);
    gameBoard.innerHTML = '';

    // Generate card content
    const generateCardContent = () => {
        const items = [];
        const numPairs = gridSize * gridSize / 2;

        for (let i = 0; i < numPairs; i++) {
            if (contentType === 'numbers') {
                items.push(i, i);
            } else if (contentType === 'shapes') {
                items.push(shapes[i % shapes.length], shapes[i % shapes.length]);
            } else {
                items.push(fruitImages[i % fruitImages.length], fruitImages[i % fruitImages.length]);
            }
        }

        return items.sort(() => Math.random() - 0.5);
    };

    const shuffleCards = () => {
        const cards = Array.from(gameBoard.children);
        cards.sort(() => Math.random() - 0.5);
        gameBoard.innerHTML = '';
        cards.forEach(card => gameBoard.appendChild(card));
    };

    const createCards = (content) => {
        content.forEach((item) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.value = item;

            if (contentType === 'fruits') {
                const cardFront = document.createElement('img');
                cardFront.src = item;
                cardFront.classList.add('card-front');
                cardFront.style.display = 'none';

                const cardBack = document.createElement('div');
                cardBack.classList.add('card-back');
                cardBack.textContent = '?';

                card.appendChild(cardFront);
                card.appendChild(cardBack);
            } else {
                const cardFront = document.createElement('div');
                cardFront.textContent = item;
                cardFront.classList.add('card-front');
                cardFront.style.display = 'none';

                const cardBack = document.createElement('div');
                cardBack.classList.add('card-back');
                cardBack.textContent = '?';

                card.appendChild(cardFront);
                card.appendChild(cardBack);
            }

            card.addEventListener('click', () => handleCardFlip(card));
            gameBoard.appendChild(card);
        });
    };

    const handleCardFlip = (card) => {
        if (!card.classList.contains('flipped') && flippedCards.length < 2) {
            card.classList.add('flipped');

            const cardFront = card.querySelector('.card-front');
            const cardBack = card.querySelector('.card-back');
            if (cardFront && cardBack) {
                cardFront.style.display = 'block';
                cardBack.style.display = 'none';
            }

            flippedCards.push(card);

            if (flippedCards.length === 2) {
                checkForMatch();
            }
        }
    };

    const checkForMatch = () => {
        const [firstCard, secondCard] = flippedCards;

        if (firstCard.dataset.value !== secondCard.dataset.value) {
            setTimeout(() => {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');

                const firstFront = firstCard.querySelector('.card-front');
                const firstBack = firstCard.querySelector('.card-back');
                const secondFront = secondCard.querySelector('.card-front');
                const secondBack = secondCard.querySelector('.card-back');

                if (firstFront && firstBack) {
                    firstFront.style.display = 'none';
                    firstBack.style.display = 'block';
                }
                if (secondFront && secondBack) {
                    secondFront.style.display = 'none';
                    secondBack.style.display = 'block';
                }

                flippedCards = [];
            }, 1000);
        } else {
            flippedCards = [];
            matchedPairs++;
            score += 10;
            scoreDisplay.textContent = score;

            if (matchedPairs === gridSize * gridSize / 2) {
                clearInterval(shuffleInterval);
                setTimeout(() => alert('Congrats! You matched all pairs! Final Score: ' + score), 500);
            }
        }
    };

    const updateTimer = () => {
        const timerInterval = setInterval(() => {
            if (timeRemaining === 0) {
                clearInterval(timerInterval);
                clearInterval(shuffleInterval);
                alert('Game Over! Final Score: ' + score);
            } else {
                timeRemaining--;
                timerDisplay.textContent = `${timeRemaining}s`;

                if (timeRemaining % 10 === 0) {
                    shuffleCards();
                }
            }
        }, 1000);
    };

    const cardContent = generateCardContent();
    createCards(cardContent);

    shuffleInterval = setInterval(shuffleCards, 10000); // Shuffle every 10 seconds
    updateTimer();

    document.getElementById('restart-game').addEventListener('click', () => {
        clearInterval(shuffleInterval);
        window.location.reload();
    });

    document.getElementById('back-button').addEventListener('click', () => {
        clearInterval(shuffleInterval);
        window.location.href = 'index.html';
    });
});
