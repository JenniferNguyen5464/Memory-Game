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
    const totalCards = gridSize * gridSize;
    const gameBoard = document.getElementById('game-board');
    let flippedCards = [];
    let matchedPairs = 0;

    // Configure the grid size dynamically
    gameBoard.style.display = 'grid';
    gameBoard.setAttribute('data-grid-size', gridSize); // For CSS dynamic grid
    gameBoard.innerHTML = ''; // Clear previous grid

    // Generate card content based on content type
    const generateCardContent = () => {
        const items = [];
        const numPairs = totalCards / 2;

        for (let i = 0; i < numPairs; i++) {
            if (contentType === 'numbers') {
                items.push(i, i);
            } else if (contentType === 'shapes') {
                items.push(shapes[i % shapes.length], shapes[i % shapes.length]);
            } else {
                items.push(fruitImages[i % fruitImages.length], fruitImages[i % fruitImages.length]);
            }
        }

        return items.sort(() => Math.random() - 0.5); // Shuffle the cards
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

            // Add click functionality to each card
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

            if (matchedPairs === totalCards / 2) {
                setTimeout(() => alert('Congrats! You matched all pairs!'), 500);
            }
        }
    };

    const cardContent = generateCardContent();
    createCards(cardContent);

    // Restart button
    document.getElementById('restart-game').addEventListener('click', () => {
        window.location.reload();
    });

    // Back button
    document.getElementById('back-button').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});
