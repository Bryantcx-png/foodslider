'use strict';

var tinderContainer = document.querySelector('.tinder');
var allCardsContainer = document.querySelector('.tinder--cards');
var listViewContainer = document.querySelector('.tinder--list-view');
var nope = document.getElementById('nope');
var love = document.getElementById('love');
var likedCards = [];
var currentCards = [];
var round = 1;

// --- RESTAURANT LOCATIONS ---
var initialCardsData = [
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

function createCardElement(data) {
  const card = document.createElement('div');
  card.classList.add('tinder--card');
  card.innerHTML = `
    <img src="${data.imgSrc}" onerror="this.src='images/placeholder.png';">
    <h3>${data.title}</h3>
    <p>${data.description}</p>
  `;
  return card;
}

function initCards(cardsToUse) {
  allCardsContainer.innerHTML = '';
  
  if (cardsToUse.length === 0) {
    allCardsContainer.innerHTML = '<p class="no-cards-message">No restaurants found in this area!</p>';
    tinderContainer.classList.remove('loaded');
    return;
  }

  currentCards = cardsToUse;

  currentCards.forEach(function (cardData, index) {
    const newCard = createCardElement(cardData);
    allCardsContainer.appendChild(newCard);
    newCard.style.zIndex = currentCards.length - index;
    newCard.style.transform = 'scale(' + (20 - index) / 20 + ') translateY(-' + 30 * index + 'px)';
    newCard.style.opacity = (10 - index) / 10;
  });

  tinderContainer.classList.add('loaded');
  setupHammerJS(allCardsContainer.querySelectorAll('.tinder--card'));
}

function setupHammerJS(cards) {
  cards.forEach(function (el) {
    var hammertime = new Hammer(el);
    hammertime.on('pan', function (event) {
      el.classList.add('moving');
      if (event.deltaX === 0) return;
      if (event.center.x === 0 && event.center.y === 0) return;
      tinderContainer.classList.toggle('tinder_love', event.deltaX > 0);
      tinderContainer.classList.toggle('tinder_nope', event.deltaX < 0);
      var xMulti = event.deltaX * 0.03;
      var yMulti = event.deltaY / 80;
      var rotate = xMulti * yMulti;
      event.target.style.transform = 'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate(' + rotate + 'deg)';
    });

    hammertime.on('panend', function (event) {
      el.classList.remove('moving');
      tinderContainer.classList.remove('tinder_love');
      tinderContainer.classList.remove('tinder_nope');
      var moveOutWidth = document.body.clientWidth;
      var keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;
      
      if (!keep) {
        if (event.deltaX > 0) {
          likedCards.push(currentCards[Array.from(allCardsContainer.children).indexOf(el)]);
        }
        
        // Animate card off-screen
        var endX = Math.sign(event.deltaX) * (moveOutWidth * 1.5);
        var rotateDeg = event.deltaX / 15;
        el.style.transition = 'transform 0.4s ease-out';
        el.style.transform = 'translate(' + endX + 'px, ' + (event.deltaY * 1.5) + 'px) rotate(' + rotateDeg + 'deg)';
        
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
}

function repositionCards() {
  var cards = allCardsContainer.querySelectorAll('.tinder--card:not(.removed)');
  cards.forEach(function (card, index) {
    card.style.zIndex = cards.length - index;
    card.style.transform = 'scale(' + (20 - index) / 20 + ') translateY(-' + 30 * index + 'px)';
    card.style.opacity = (10 - index) / 10;
  });
}

function startNextRound() {
  var remainingCards = allCardsContainer.querySelectorAll('.tinder--card:not(.removed)');
  if (remainingCards.length === 0) {
    if (likedCards.length > 1) {
      alert(`Round ${round} finished! Starting next round with ${likedCards.length} liked cards.`);
      round++;
      initCards(likedCards);
      likedCards = [];
    } else if (likedCards.length === 1) {
      alert("Congratulations! The winner is: " + likedCards[0].title);
    } else {
      alert("No cards liked. Game over!");
    }
  }
}

function createButtonListener(love) {
  return function (event) {
    var cards = allCardsContainer.querySelectorAll('.tinder--card:not(.removed)');
    if (!cards.length) return false;
    var card = cards[0];
    card.classList.add('removed');
    if (love) {
      likedCards.push(currentCards[Array.from(allCardsContainer.children).indexOf(card)]);
      card.style.transform = 'translate(' + (document.body.clientWidth * 1.5) + 'px, -100px) rotate(-30deg)';
    } else {
      card.style.transform = 'translate(-' + (document.body.clientWidth * 1.5) + 'px, -100px) rotate(30deg)';
    }
    repositionCards();
    startNextRound();
    event.preventDefault();
  };
}

// --- List View Logic ---
function populateListView(cardsToDisplay) {
  listViewContainer.innerHTML = '';
  if (cardsToDisplay.length === 0) {
    listViewContainer.innerHTML = '<p class="no-cards-message">No restaurants found in this area!</p>';
    return;
  }
  cardsToDisplay.forEach(cardData => {
    const listItem = document.createElement('div');
    listItem.classList.add('tinder--list-item');
    listItem.innerHTML = `
      <img src="${cardData.imgSrc}" onerror="this.src='images/placeholder.png';">
      <div class="tinder--list-item-info">
        <h3>${cardData.title}</h3>
        <p>${cardData.description}</p>
      </div>
    `;
    listViewContainer.appendChild(listItem);
  });
}

const listViewBtn = document.getElementById('list-view-btn');
const tinderButtons = document.querySelector('.tinder--buttons');

listViewBtn.addEventListener('click', () => {
  const isListViewActive = listViewContainer.style.display === 'block';
  if (isListViewActive) {
    // Switch to Card View
    listViewContainer.style.display = 'none';
    allCardsContainer.style.display = 'flex';
    tinderButtons.classList.remove('hidden');
    listViewBtn.innerHTML = '<i class="fa fa-list-ul"></i>';
  } else {
    // Switch to List View
    listViewContainer.style.display = 'block';
    allCardsContainer.style.display = 'none';
    tinderButtons.classList.add('hidden');
    listViewBtn.innerHTML = '<i class="fa fa-clone"></i>';
    // Update the list with the current filter
    const activeFilter = document.querySelector('.tinder--filter-buttons button.active').id;
    let area;
    if (activeFilter === 'filter-geo') area = 'Sunway Geo';
    else if (activeFilter === 'filter-college') area = 'Sunway College';
    else area = 'All';
    filterByArea(area);
  }
});


// --- Filtering Logic ---
const filterButtons = document.querySelectorAll('.tinder--filter-buttons button');

function setActiveButton(clickedButton) {
  filterButtons.forEach(button => button.classList.remove('active'));
  clickedButton.classList.add('active');
}

function filterByArea(area) {
  likedCards = [];
  round = 1;
  let cardsToDisplay = (area === 'All') ? initialCardsData : initialCardsData.filter(card => card.area === area);
  
  // Update both card and list views
  initCards(cardsToDisplay);
  populateListView(cardsToDisplay);
}

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
initCards(initialCardsData);
populateListView(initialCardsData); // Also populate list view on start

var nopeListener = createButton-listener(false);
var loveListener = create-button-listener(true);

nope.addEventListener('click', nopeListener);
love.addEventListener('click', loveListener);