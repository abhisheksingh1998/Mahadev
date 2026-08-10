// Initialize AOS Animations
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true,
  offset: 100
});

// Initialize Hero Swiper Slider
const swiper = new Swiper('.hero-swiper', {
  loop: true,
  effect: 'fade',
  fadeEffect: {
    crossFade: true
  },
  speed: 1000,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

// Mobile Navigation Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  const icon = hamburger.querySelector('i');
  if(navMenu.classList.contains('active')) {
    icon.classList.remove('fa-bars');
    icon.classList.add('fa-xmark');
  } else {
    icon.classList.remove('fa-xmark');
    icon.classList.add('fa-bars');
  }
});

// Close Nav when clicking link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    hamburger.querySelector('i').classList.remove('fa-xmark');
    hamburger.querySelector('i').classList.add('fa-bars');
  });
});

// Header Background Scroll Effect
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// FAQ Accordion Toggle
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const header = item.querySelector('.faq-header');
  header.addEventListener('click', () => {
    const isActive = item.classList.contains('active');
    
    // Close all faq items
    faqItems.forEach(faq => faq.classList.remove('active'));

    // If it was not active, open it
    if (!isActive) {
      item.classList.add('active');
    }
  });
});


// Pure Static HTML Pagination Logic
document.addEventListener('DOMContentLoaded', () => {
  // Ek page par max 9 blogs dikhane ke liye setting
  const cardsPerPage = 9; 
  
  const blogCards = Array.from(document.querySelectorAll('#staticBlogGrid .blog-item-card'));
  const totalCards = blogCards.length;
  const totalPages = Math.ceil(totalCards / cardsPerPage);

  const pageNumbersContainer = document.getElementById('pageNumbers');
  const prevPageBtn = document.getElementById('prevPageBtn');
  const nextPageBtn = document.getElementById('nextPageBtn');
  const paginationWrapper = document.getElementById('paginationWrapper');

  let currentPage = 1;

  // Page Wise Cards Display Function
  function displayPage(page) {
    currentPage = page;

    // Index 0 to 8 (Pehle 9 Blogs) Page 1 par dikhenge, 10wa aur uske aage Page 2 par
    const startIndex = (page - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;

    blogCards.forEach((card, index) => {
      if (index >= startIndex && index < endIndex) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });

    // Prev / Next Buttons Enable/Disable State
    prevPageBtn.disabled = (currentPage === 1);
    nextPageBtn.disabled = (currentPage === totalPages);

    // Number Buttons Render Karna (1, 2, etc.)
    pageNumbersContainer.innerHTML = '';
    
    if (totalPages > 1) {
      paginationWrapper.style.display = 'flex';
      for (let i = 1; i <= totalPages; i++) {
        const numBtn = document.createElement('button');
        numBtn.className = `num-btn ${i === currentPage ? 'active' : ''}`;
        numBtn.innerText = i;

        numBtn.addEventListener('click', () => {
          displayPage(i);
          scrollToBlogTop();
        });

        pageNumbersContainer.appendChild(numBtn);
      }
    } else {
      paginationWrapper.style.display = 'none';
    }
  }

  // Previous & Next Click Events
  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      displayPage(currentPage - 1);
      scrollToBlogTop();
    }
  });

  nextPageBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      displayPage(currentPage + 1);
      scrollToBlogTop();
    }
  });

  // Page Switch hone par top grid section tak smooth scroll
  function scrollToBlogTop() {
    const blogSection = document.querySelector('.blog-section');
    if (blogSection) {
      window.scrollTo({
        top: blogSection.offsetTop - 90,
        behavior: 'smooth'
      });
    }
  }

  // Load hone par Page 1 render karo
  displayPage(1);
});


document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Top Reading Progress Bar Calculation
  const progressBar = document.getElementById('progressBar');

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }
  });

  // 2. Smooth Scroll for Table of Contents Links
  const tocLinks = document.querySelectorAll('.toc-list a');

  tocLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });

});