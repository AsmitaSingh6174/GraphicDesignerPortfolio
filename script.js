// ========== REVEAL ANIMATIONS ==========
const revealElements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
  }
);

revealElements.forEach((element) => observer.observe(element));

// ========== SHOWCASE CAROUSEL ==========
const projectData = [
  {
    category: 'Cosmetics Poster Design',
    title: 'Glow Obsession Lipstick',
    description: 'A promotional cosmetic poster focusing on elegant product presentation, beauty branding, and luxury visual aesthetics.'
  },
  {
    category: 'Cosmetics Advertising',
    title: 'Lipstick Beauty Collection',
    description: 'A beauty product promotional design created to explore branding, color harmony, and product-focused advertising.'
  },
  {
    category: 'Fashion Poster Design',
    title: 'Honey Clothing Campaign',
    description: 'A fashion promotional poster highlighting modern apparel and clean visual storytelling.'
  },
  {
    category: 'Food Marketing Design',
    title: 'Honey Restaurant Promotion',
    description: 'A restaurant advertisement designed to attract customers through strong typography and engaging food visuals.'
  },
  {
    category: 'Food Advertisement',
    title: 'Biryani House Advertisement',
    description: 'A promotional food advertisement showcasing rich flavors, appetizing visuals, and social media marketing design.'
  },
  {
    category: 'Beverage Poster Design',
    title: 'ColdCoffee Poster',
    description: 'A moody, cool-toned poster concept highlighting refreshment, texture, and modern cafe branding.'
  },
  {
    category: 'Beverage Campaign',
    title: 'Blueberry  Milkshake  Poster',
    description: 'A playful, vivid poster design celebrating flavor, color contrast, and fresh dessert storytelling.'
  }
];

const galleryItems = document.querySelectorAll('.gallery-item');
const showcaseCategory = document.querySelector('.showcase-category');
const showcaseTitle = document.querySelector('.showcase-title');
const showcaseDescription = document.querySelector('.showcase-description');
const counterCurrent = document.querySelector('.counter-current');
const navPrev = document.querySelector('.nav-prev');
const navNext = document.querySelector('.nav-next');
const showcaseContainer = document.querySelector('.showcase-container');
const galleryVideos = document.querySelectorAll('.gallery-video');
const galleryPlayBtns = document.querySelectorAll('.gallery-play-btn');

let currentIndex = 0;
let autoplayInterval = null;

// Update content based on current index
function updateShowcase() {
  const data = projectData[currentIndex];
  
  // Update text content with fade animation
  showcaseCategory.style.opacity = '0';
  showcaseTitle.style.opacity = '0';
  showcaseDescription.style.opacity = '0';
  
  setTimeout(() => {
    showcaseCategory.textContent = data.category;
    showcaseTitle.textContent = data.title;
    showcaseDescription.textContent = data.description;
    
    showcaseCategory.style.opacity = '1';
    showcaseTitle.style.opacity = '1';
    showcaseDescription.style.opacity = '1';
  }, 100);

  // Update gallery items
  galleryItems.forEach((item, index) => {
    item.classList.remove('gallery-active', 'gallery-next');
    
    if (index === currentIndex) {
      item.classList.add('gallery-active');
    } else if (index === (currentIndex + 1) % galleryItems.length) {
      item.classList.add('gallery-next');
    }
  });

  // Update counter
  counterCurrent.textContent = String(currentIndex + 1).padStart(2, '0');

  // Pause all videos
  pauseAllVideos();
}

function goToSlide(index) {
  currentIndex = index % galleryItems.length;
  updateShowcase();
  resetAutoplay();
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % galleryItems.length;
  updateShowcase();
  resetAutoplay();
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
  updateShowcase();
  resetAutoplay();
}

// Navigation buttons
navPrev.addEventListener('click', prevSlide);
navNext.addEventListener('click', nextSlide);

// Text transitions
['showcase-category', 'showcase-title', 'showcase-description'].forEach(className => {
  const elem = document.querySelector('.' + className);
  if (elem) {
    elem.style.transition = 'opacity 0.5s ease';
  }
});

// ========== VIDEO CONTROLS ==========
function pauseAllVideos() {
  galleryVideos.forEach((video) => {
    video.pause();
    video.currentTime = 0;
  });
  galleryPlayBtns.forEach((btn) => {
    btn.classList.remove('playing');
    btn.style.display = '';
  });
}

galleryPlayBtns.forEach((btn, index) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const video = galleryVideos[index];
    
    if (!video) return;
    
    pauseAllVideos();
    video.play().catch(() => {});
    btn.classList.add('playing');
    btn.style.display = 'none';
  });
});

galleryVideos.forEach((video, index) => {
  video.addEventListener('play', () => {
    const btn = galleryPlayBtns[index];
    if (btn) {
      btn.classList.add('playing');
      btn.style.display = 'none';
    }
  });
  
  video.addEventListener('pause', () => {
    const btn = galleryPlayBtns[index];
    if (btn) {
      btn.classList.remove('playing');
      btn.style.display = '';
    }
  });
  
  video.addEventListener('ended', () => {
    const btn = galleryPlayBtns[index];
    if (btn) {
      btn.classList.remove('playing');
      btn.style.display = '';
    }
    video.currentTime = 0;
  });
});

// ========== AUTOPLAY ==========
function startAutoplay() {
  if (autoplayInterval) clearInterval(autoplayInterval);
  
  autoplayInterval = setInterval(() => {
    nextSlide();
  }, 5000);
}

function stopAutoplay() {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
    autoplayInterval = null;
  }
}

function resetAutoplay() {
  stopAutoplay();
  startAutoplay();
}

// Pause on hover
showcaseContainer.addEventListener('mouseenter', stopAutoplay);
showcaseContainer.addEventListener('mouseleave', startAutoplay);

// Start autoplay
startAutoplay();

// ========== KEYBOARD NAVIGATION ==========
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') prevSlide();
  if (e.key === 'ArrowRight') nextSlide();
});

// ========== SWIPE SUPPORT ==========
let touchStartX = 0;
let touchEndX = 0;

showcaseContainer.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].clientX;
}, false);

showcaseContainer.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].clientX;
  handleSwipe();
}, false);

function handleSwipe() {
  const diff = touchStartX - touchEndX;
  
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  }
}

// Initialize
updateShowcase();
