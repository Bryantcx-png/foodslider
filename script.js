'use strict';

// Modern JavaScript with better variable declarations
const tinderContainer = document.querySelector('.tinder');
const allCardsContainer = document.querySelector('.tinder--cards');
const listViewContainer = document.querySelector('.tinder--list-view');
const nope = document.getElementById('nope');
const love = document.getElementById('love');
let likedCards = [];
let currentCards = [];
let remainingCards = [];
let round = 1;

// --- RESTAURANT LOCATIONS ---
const initialCardsData = [
  // Sunway Geo Restaurants
  { imgSrc: 'images/christine.png', title: 'Christine\'s Bakery', description: 'Famous for their bagels and croissants (crozzas).', area: 'Sunway Geo' },
  { imgSrc: 'images/donkas.png', title: 'Donkas Lab', description: 'Specializes in Korean pork cutlets (donkas).', area: 'Sunway Geo' },
  { imgSrc: 'images/flowergirl.png', title: 'Flower Girl Coffee', description: 'A cafe known for its whimsical interior and affordable food.', area: 'Sunway Geo' },
  { imgSrc: 'images/giraffe.png', title: 'Giraffe Coffee', description: 'Another cafe option in Sunway GEO.', area: 'Sunway Geo' },
  { imgSrc: 'images/keanseng.png', title: 'Kean Seng Kopitiam', description: 'A local favorite serving classic Malaysian kopitiam dishes.', area: 'Sunway Geo' },
  { imgSrc: 'images/modhchan.png', title: 'Mohd Chan', description: 'A restaurant offering Asian and Malaysian food.', area: 'Sunway Geo' },
  { imgSrc: 'images/soju.jpg', title: 'Soju Restaurant & Bar', description: 'A Korean restaurant and bar that also has a live band.', area: 'Sunway Geo' },
  { imgSrc: 'images/verythai.png', title: 'VeryThai Mookata & Street Food', description: 'A place for Thai Mookata and street food.', area: 'Sunway Geo' },
  { imgSrc: 'images/burgerking.png', title: 'Burger King', description: 'A well-known fast-food chain.', area: 'Sunway Geo' },
  { imgSrc: 'images/fatcat.png', title: 'Fat Cat Cafe', description: 'A cafe that offers fusion ramen and rice bowls.', area: 'Sunway Geo' },
  { imgSrc: 'images/hdbistro.png', title: 'HD Bistro', description: 'A food court with various stalls and cuisines.', area: 'Sunway Geo' },
  { imgSrc: 'images/hotnroll.png', title: 'Hot & Roll', description: 'A place known for its hot wraps and rolls.', area: 'Sunway Geo' },
  { imgSrc: 'images/mrtasty.png', title: 'Mr. Tasty', description: 'Specializes in chicken dishes, particularly chicken rice.', area: 'Sunway Geo' },
  { imgSrc: 'images/sensenmalatang.png', title: 'Sen Sen Malatang', description: 'A place for spicy and numbing Malatang.', area: 'Sunway Geo' },
  
  // Sunway College Restaurants
  { imgSrc: 'images/dplace.png', title: 'D\'place', description: 'A popular spot for local food.', area: 'Sunway College' },
  { imgSrc: 'images/subway.png', title: 'Subway', description: 'Freshly made sandwiches and salads.', area: 'Sunway College' },
  { imgSrc: 'images/kookybowl.png', title: 'Kooky Bowl', description: 'Serving healthy and delicious bowls.', area: 'Sunway College' },
  { imgSrc: 'images/taijie.png', title: 'Tai Jie', description: 'Known for flavorful chinese dishes.', area: 'Sunway College' },
  { imgSrc: 'images/rockcafe.png', title: 'Rock Cafe', description: 'A large food court with a variety of options.', area: 'Sunway College' },
  { imgSrc: 'images/128cafe.png', title: '128 Cafe', description: 'A cozy cafe for coffee and light bites.', area: 'Sunway College' },
  { imgSrc: 'images/shaaz.png', title: 'Shaaz', description: 'Authentic Indian and Malaysian food.', area: 'Sunway College' },
  { imgSrc: 'images/spicytemptation.png', title: 'Spicy Temptation', description: 'Serving a variety of spicy dishes.', area: 'Sunway College' },
  { imgSrc: 'images/beyondcoffee.png', title: 'Beyond Coffee', description: 'A modern cafe with great coffee.', area: 'Sunway College' },
  { imgSrc: 'images/garlicchickenrice.png', title: 'Garlic Chicken Rice', description: 'Famous for its fragrant garlic chicken rice.', area: 'Sunway College' }
];

const createCardElement = (data) => {
  const card = document.createElement('div');
  card.classList.add('tinder--card');
  card.innerHTML = `
    <img src="${data.imgSrc}" alt="${data.title}" onerror="this.src='images/placeholder.png';">
    <h3>${data.title}</h3>
    <p>${data.description}</p>
  `;
  return card;
};

const initCards = (cardsToUse) => {
  allCardsContainer.innerHTML = '';
  
  if (cardsToUse.length === 0) {
    allCardsContainer.innerHTML = '<p class="no-cards-message">No restaurants found in this area!</p>';
    tinderContainer.classList.remove('loaded');
    remainingCards = [];
    return;
  }

  currentCards = cardsToUse;
  remainingCards = [...cardsToUse]; // Create a copy for tracking

  currentCards.forEach((cardData, index) => {
    const newCard = createCardElement(cardData);
    allCardsContainer.appendChild(newCard);
    newCard.style.zIndex = currentCards.length - index;
    newCard.style.transform = `scale(${(20 - index) / 20}) translateY(-${30 * index}px)`;
    newCard.style.opacity = (10 - index) / 10;
  });

  tinderContainer.classList.add('loaded');
  setupHammerJS(allCardsContainer.querySelectorAll('.tinder--card'));
};

const setupHammerJS = (cards) => {
  cards.forEach((el) => {
    const hammertime = new Hammer(el);
    hammertime.on('pan', (event) => {
      el.classList.add('moving');
      if (event.deltaX === 0) return;
      if (event.center.x === 0 && event.center.y === 0) return;
      tinderContainer.classList.toggle('tinder_love', event.deltaX > 0);
      tinderContainer.classList.toggle('tinder_nope', event.deltaX < 0);
      const xMulti = event.deltaX * 0.03;
      const yMulti = event.deltaY / 80;
      const rotate = xMulti * yMulti;
      event.target.style.transform = `translate(${event.deltaX}px, ${event.deltaY}px) rotate(${rotate}deg)`;
    });

    hammertime.on('panend', (event) => {
      el.classList.remove('moving');
      tinderContainer.classList.remove('tinder_love');
      tinderContainer.classList.remove('tinder_nope');
      const moveOutWidth = document.body.clientWidth;
      const keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;
      
      if (!keep) {
        if (event.deltaX > 0) {
          likedCards.push(currentCards[Array.from(allCardsContainer.children).indexOf(el)]);
        }
        
        // Animate card off-screen
        const endX = Math.sign(event.deltaX) * (moveOutWidth * 1.5);
        const rotateDeg = event.deltaX / 15;
        el.style.transition = 'transform 0.4s ease-out';
        el.style.transform = `translate(${endX}px, ${event.deltaY * 1.5}px) rotate(${rotateDeg}deg)`;
        
        el.classList.add('removed');
        repositionCards();
        startNextRound();
      } else {
        // Animate card back to original position
        el.style.transition = 'transform 0.4s ease-out';
        el.style.transform = '';
      }
    });
  });
};

const repositionCards = () => {
  const cards = allCardsContainer.querySelectorAll('.tinder--card:not(.removed)');
  
  // Update remainingCards array to match current state
  remainingCards = [];
  cards.forEach((card) => {
    const cardIndex = Array.from(allCardsContainer.children).indexOf(card);
    if (cardIndex >= 0 && cardIndex < currentCards.length) {
      remainingCards.push(currentCards[cardIndex]);
    }
  });
  
  cards.forEach((card, index) => {
    card.style.zIndex = cards.length - index;
    card.style.transform = `scale(${(20 - index) / 20}) translateY(-${30 * index}px)`;
    card.style.opacity = (10 - index) / 10;
  });
};

// Modern notification system
const showNotification = (message, type = 'info') => {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => notification.remove());

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-message">${message}</span>
      <button class="notification-close" aria-label="Close notification">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;

  // Add notification styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--surface-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: var(--space-md);
    box-shadow: var(--shadow-xl);
    z-index: 1000;
    max-width: 400px;
    transform: translateX(100%);
    transition: transform var(--transition-normal);
  `;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);

  // Auto remove after 5 seconds
  const autoRemove = setTimeout(() => {
    removeNotification(notification);
  }, 5000);

  // Close button functionality
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    clearTimeout(autoRemove);
    removeNotification(notification);
  });
};

const removeNotification = (notification) => {
  notification.style.transform = 'translateX(100%)';
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 300);
};

const startNextRound = () => {
  const remainingCards = allCardsContainer.querySelectorAll('.tinder--card:not(.removed)');
  if (remainingCards.length === 0) {
    if (likedCards.length > 1) {
      showNotification(`Round ${round} finished! Starting next round with ${likedCards.length} liked cards.`, 'info');
      round++;
      initCards(likedCards);
      likedCards = [];
    } else if (likedCards.length === 1) {
      showNotification(`🎉 Congratulations! The winner is: ${likedCards[0].title}`, 'success');
    } else {
      showNotification("No restaurants liked. Game over!", 'warning');
    }
  }
};

const createButtonListener = (love) => {
  return (event) => {
    const cards = allCardsContainer.querySelectorAll('.tinder--card:not(.removed)');
    if (!cards.length) return false;
    const card = cards[0];
    card.classList.add('removed');
    if (love) {
      likedCards.push(currentCards[Array.from(allCardsContainer.children).indexOf(card)]);
      card.style.transform = `translate(${document.body.clientWidth * 1.5}px, -100px) rotate(-30deg)`;
    } else {
      card.style.transform = `translate(-${document.body.clientWidth * 1.5}px, -100px) rotate(30deg)`;
    }
    repositionCards();
    startNextRound();
    event.preventDefault();
  };
};

// --- List View Logic ---
const populateListView = (cardsToDisplay) => {
  listViewContainer.innerHTML = '';
  if (cardsToDisplay.length === 0) {
    listViewContainer.innerHTML = '<p class="no-cards-message">No restaurants found in this area!</p>';
    return;
  }
  cardsToDisplay.forEach(cardData => {
    const listItem = document.createElement('div');
    listItem.classList.add('tinder--list-item');
    listItem.innerHTML = `
      <img src="${cardData.imgSrc}" alt="${cardData.title}" onerror="this.src='images/placeholder.png';">
      <div class="tinder--list-item-info">
        <h3>${cardData.title}</h3>
        <p>${cardData.description}</p>
      </div>
    `;
    listViewContainer.appendChild(listItem);
  });
};

const listViewBtn = document.getElementById('list-view-btn');
const tinderButtons = document.querySelector('.tinder--buttons');

listViewBtn.addEventListener('click', () => {
  const isListViewActive = listViewContainer.style.display === 'block';
  if (isListViewActive) {
    // Switch to Card View
    listViewContainer.style.display = 'none';
    allCardsContainer.style.display = 'flex';
    tinderButtons.classList.remove('hidden');
    listViewBtn.innerHTML = '<i class="fas fa-th-list"></i>';
    listViewBtn.setAttribute('aria-label', 'Switch to list view');
  } else {
    // Switch to List View
    listViewContainer.style.display = 'block';
    allCardsContainer.style.display = 'none';
    tinderButtons.classList.add('hidden');
    listViewBtn.innerHTML = '<i class="fas fa-th"></i>';
    listViewBtn.setAttribute('aria-label', 'Switch to card view');
    
    // Show only the remaining cards (not removed ones)
    populateListView(remainingCards);
  }
});


// --- Filtering Logic ---
const filterButtons = document.querySelectorAll('.tinder--filter-buttons button');

const setActiveButton = (clickedButton) => {
  filterButtons.forEach(button => {
    button.classList.remove('active');
    button.setAttribute('aria-selected', 'false');
  });
  clickedButton.classList.add('active');
  clickedButton.setAttribute('aria-selected', 'true');
};

const filterByArea = (area, preserveGameState = false) => {
  if (!preserveGameState) {
    likedCards = [];
    round = 1;
  }
  const cardsToDisplay = (area === 'All') ? initialCardsData : initialCardsData.filter(card => card.area === area);
  
  // Update both card and list views
  initCards(cardsToDisplay);
  populateListView(cardsToDisplay);
};

// Event listeners for filter buttons
document.getElementById('filter-all').addEventListener('click', function() {
  setActiveButton(this);
  filterByArea('All');
});

document.getElementById('filter-geo').addEventListener('click', function() {
  setActiveButton(this);
  filterByArea('Sunway Geo');
});

document.getElementById('filter-college').addEventListener('click', function() {
  setActiveButton(this);
  filterByArea('Sunway College');
});

// --- Initialize App ---
document.addEventListener('DOMContentLoaded', () => {
  initCards(initialCardsData);
  populateListView(initialCardsData);
  
  const nopeListener = createButtonListener(false);
  const loveListener = createButtonListener(true);
  
  nope.addEventListener('click', nopeListener);
  love.addEventListener('click', loveListener);
  
  // Add keyboard support
  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'Escape') {
      nopeListener(event);
    } else if (event.key === 'ArrowRight' || event.key === 'Enter') {
      loveListener(event);
    }
  });
});