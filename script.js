let progress = 0;

function simulateLoading() {
    const text = document.getElementById("progress-text");
    const bar = document.getElementById("progress-bar");

    const interval = setInterval(() => {
        progress += Math.random() * 5; // adjust speed here

        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            finishLoading();
        }

        if (text) text.textContent = Math.floor(progress) + "%";
        if (bar) bar.style.width = progress + "%";
    }, 100);
}


// CHANGED
function finishLoading() {
  const loader = document.getElementById('loader');
  const content = document.getElementById('load');
  if (loader) loader.style.display = 'none';
  if (content) content.style.opacity = 1;

  // Wait 1 second before starting swipe
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.add('swipe-up');
    }


    // After animation, hide loader and show content
    setTimeout(() => {
      loader.style.display = 'none';
      content.classList.add('fade-in');  // triggers fade-in of content
    }, 1000); // match the CSS animation duration
  }, 1000); // extra 1-second delay at 100%
}

// END CHANGED


  window.onload = simulateLoading;

/* ==========================================
   MICRO-INERTIA (adds slight slide at end)
   ========================================== */

let lastScrollY = window.scrollY;
let velocity = 0;
let raf;

function inertiaLoop() {
    const currentY = window.scrollY;
    const delta = currentY - lastScrollY;

    velocity = delta; // capture last movement speed

    lastScrollY = currentY;

    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(inertiaLoop);
}
inertiaLoop();

let isScrolling;
window.addEventListener('scroll', () => {
    clearTimeout(isScrolling);

    // user is actively scrolling → do nothing yet
    isScrolling = setTimeout(() => {
        applyInertia();
    }, 80); // time before treating scroll as 'finished'
});

function applyInertia() {
    let momentum = velocity;

    function glide() {
        momentum *= 0.9; // friction

        if (Math.abs(momentum) < 0.3) return; // stop when very small

        window.scrollBy(0, momentum);
        requestAnimationFrame(glide);
    }

    requestAnimationFrame(glide);
}


// Create cursor dot
const cursorDot = document.createElement('div');
cursorDot.id = 'cursor-dot';
document.body.appendChild(cursorDot);

// Sizes
const smallSize = 12;
const largeSize = 44; // enlarged size

// Listen to mouse movement
document.addEventListener('mousemove', (e) => {
  const padding = 1; // optional, small tweak if needed
  cursorDot.style.left = e.clientX - padding + 'px';
  cursorDot.style.top = e.clientY - padding + 'px';
});


// ===== Enlargement on hover with delay =====
const clickableElements = document.querySelectorAll('a, button, .hamburger, .theme-toggle');

clickableElements.forEach(el => {
  let enlargeTimeout;

  el.addEventListener('mouseenter', () => {
    enlargeTimeout = setTimeout(() => {
      cursorDot.classList.add('enlarged');
      cursorDot.style.width = largeSize + 'px';
      cursorDot.style.height = largeSize + 'px';
    }, 150);
  });

  el.addEventListener('mouseleave', () => {
    clearTimeout(enlargeTimeout);
    cursorDot.classList.remove('enlarged');
    cursorDot.style.width = smallSize + 'px';
    cursorDot.style.height = smallSize + 'px';
  });
});








const hamburger = document.querySelector('.hamburger');
const overlayNav = document.querySelector('.overlay-nav');
const closeBtn = document.querySelector('.close-btn');
const logo = document.querySelector('.logo'); // Adjust selector to your actual logo element
hamburger.addEventListener('click', () => {
  overlayNav.classList.add('active');
});

closeBtn.addEventListener('click', () => {
  overlayNav.classList.remove('active');
});

let currentIndex = 0;

// Show image function
function showImage(index) {
  images.forEach(img => img.classList.remove('active'));
  images[index].classList.add('active');
}

window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
  
    if (window.scrollY > 0) {
      nav.classList.add('scrolled');
      hamburger.classList.add('scrolled');
      logo.src = 'images/logo.png';
      if (window.innerWidth < 769) {
        logo.src = 'images/logo.png';
      }
    } else {
      nav.classList.remove('scrolled');
      hamburger.classList.remove('scrolled');
      logo.src = 'images/logo2.png';
      if (window.innerWidth < 769) {
        logo.src = 'images/logo.png';
      }
    }
  });
  
  const mainContent = document.querySelector('.main-content');
  
  function closeOverlay() {
    overlayNav.classList.remove('active');
    mainContent.classList.remove('fade-in-main');
    void mainContent.offsetWidth;
    mainContent.classList.add('fade-in-main');
  }




// ===== Light / Dark Mode Toggle =====
const themeToggle = document.getElementById("theme-toggle");         // navbar
const overlayThemeToggle = document.querySelector(".overlay-toggle"); // overlay
const body = document.body;

// Load saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  body.classList.add("dark-mode");
  themeToggle.classList.add("active");
  if (overlayThemeToggle) overlayThemeToggle.classList.add("active");
}

function handleThemeToggle() {
  const isDark = body.classList.toggle("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");

  themeToggle.classList.toggle("active", isDark);
  if (overlayThemeToggle) overlayThemeToggle.classList.toggle("active", isDark);
}

// Attach listeners to both toggles
themeToggle.addEventListener("click", handleThemeToggle);
if (overlayThemeToggle) {
  overlayThemeToggle.addEventListener("click", handleThemeToggle);
}





// ===== MASTHEAD + PROJECT SCROLL ANIMATIONS =====
const masthead = document.querySelector('.masthead');
const projects = document.querySelectorAll('.project');

let currentScroll = 0;
const smoothFactor = 0.08; // smoothness of animation response

function updateScrollAnimations() {
  const viewportHeight = window.innerHeight;

  // Smoothly follow the actual scroll position
  currentScroll += (window.scrollY - currentScroll) * smoothFactor;

  // ---------- MASTHEAD ----------
  if (masthead) {
    const progress = Math.min(currentScroll / viewportHeight, 1);
    const scaleY = Math.max(0.05, 1 - progress * 2);
    const scaleX = Math.max(0.5, 1 - progress);
    const translateY = currentScroll * 1.2;
    const rotate = progress * 3;

    masthead.style.transform =
      `translateY(-${translateY}px) scaleY(${scaleY}) scaleX(${scaleX}) rotate(${rotate}deg)`;
  }

  // ---------- PROJECTS ----------
  const viewportCenter = viewportHeight / 2;

  projects.forEach(project => {
    const rect = project.getBoundingClientRect();
    const projectCenter = rect.top + rect.height / 2;

    // distance of project center from viewport center
    const distance = Math.abs(projectCenter - viewportCenter);

    // 0 = far away, 1 = perfectly centered
    const normalized = 1 - Math.min(distance / (viewportHeight * 0.6), 1);

    const scale = 0.85 + normalized * 0.15;         // 0.85 → 1
    const translateY = 80 * (1 - normalized);       // 80px down → 0px
    const rotate = 4 * (1 - normalized);            // 4deg tilt → 0deg
    const opacity = 0.1 + normalized * 0.9;         // fade in as it centers

    project.style.transform =
      `translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`;
    project.style.opacity = opacity;
  });

  requestAnimationFrame(updateScrollAnimations);
}

updateScrollAnimations();



// ===== PERFECT OPACITY-BASED ANCHORING =====
let isAnchoring = false;
let lastAnchored = null;
const anchorHold = 1; // pause at center

function checkProjectAnchor() {
    if (isAnchoring) {
        requestAnimationFrame(checkProjectAnchor);
        return;
    }

    const viewportHeight = window.innerHeight;
    const viewportCenter = window.scrollY + viewportHeight / 2;

    projects.forEach(project => {

        // Calculate opacity EXACTLY the same way as your animation function
        const rect = project.getBoundingClientRect();
        const projectCenter = rect.top + rect.height / 2;
        const distance = Math.abs(projectCenter - viewportHeight / 2);
        const normalized = 1 - Math.min(distance / (viewportHeight * 0.5), 1);
        const calculatedOpacity = Math.max(0, normalized);

        // Anchor the *moment* it is centered
        if (calculatedOpacity >= 0.999 && project !== lastAnchored) {

            isAnchoring = true;
            lastAnchored = project;

            const absoluteCenter =
                project.offsetTop + project.offsetHeight / 2 - viewportHeight / 2;

            // Smooth easing slide
            const startY = window.scrollY;
            const distanceToTravel = absoluteCenter - startY;
            const duration = 280; // smoother than before
            let startTime = null;

            function easeToCenter(timestamp) {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const t = Math.min(elapsed / duration, 1);
                const eased = t * (2 - t); // easeOutQuad

                window.scrollTo(0, startY + distanceToTravel * eased);

                if (t < 1) {
                    requestAnimationFrame(easeToCenter);
                } else {
                    // hold briefly
                    setTimeout(() => { isAnchoring = false; }, anchorHold);
                }
            }

            requestAnimationFrame(easeToCenter);
        }
    });

    requestAnimationFrame(checkProjectAnchor);
}

checkProjectAnchor();








const aboutMeSection = document.querySelector('.aboutMe');
const separatorLine = document.querySelector('.separator-line');

function animateSeparator() {
    // Only run if both elements exist
    if (!aboutMeSection || !separatorLine) return;

    const rect = aboutMeSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    if (rect.top < viewportHeight) {
        separatorLine.classList.add('visible');
    } else {
        separatorLine.classList.remove('visible');
    }

    requestAnimationFrame(animateSeparator);
}

animateSeparator();




// ===== ABOUT SECTION ANIMATION TRIGGER =====
const aboutSection = document.querySelector('.aboutMe');
const titleEl = document.querySelector('.aboutTitle');
const storyEl = document.querySelector('.aboutStory');
const skillsEl = document.querySelector('.aboutSkills');
const meEl = document.querySelector('.aboutMeText');

function triggerAboutAnimations() {
    // Only run if all elements exist
    if (!aboutSection || !titleEl || !storyEl || !skillsEl || !meEl) return;

    const rect = aboutSection.getBoundingClientRect();
    const triggerPoint = window.innerHeight * 0.75;

    if (rect.top < triggerPoint) {
        titleEl.classList.add('animate-title');
        storyEl.classList.add('animate-story');
        skillsEl.classList.add('animate-skills');
        meEl.classList.add('animate-me');
    }
}

window.addEventListener('scroll', triggerAboutAnimations);


// Animate all sepLines on page load
window.addEventListener("load", () => {
  const sepLines = document.querySelectorAll(".sepLine");
  sepLines.forEach(line => line.classList.add("visible"));
});


(function(){
  const cards = document.querySelectorAll('.svc-card');
  const options = { threshold: 0.15 };
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        // staggered animation
        cards.forEach((c, i) => {
          setTimeout(() => {
            c.style.transition = 'transform .6s cubic-bezier(.2,.9,.2,1), opacity .6s';
            c.style.transform = 'translateY(0)';
            c.style.opacity = '1';
          }, i * 120);
        });
        observer.disconnect();
      }
    });
  }, options);

  if(cards.length) io.observe(cards[0]);
})();


document.addEventListener("DOMContentLoaded", () => {
  const lines = document.querySelectorAll(".sepLine");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
          observer.unobserve(entry.target); // animate once only
        }
      });
    },
    {
      threshold: 0.1, // triggers as soon as 10% is visible
    }
  );

  lines.forEach((line) => observer.observe(line));
});


document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(
    ".animate-fadeDown, .animate-fadeLeft, .animate-fadeUp"
  );

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target); // animate once only
        }
      });
    },
    { threshold: 0.2 } // triggers when 20% visible
  );

  animatedElements.forEach(el => observer.observe(el));
});
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".svc-card");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add("in-view");
            }, index * 400); // stagger: 400ms between cards
          });
          obs.unobserve(entry.target); // trigger once
        }
      });
    },
    { threshold: 0.2 } // triggers when 20% visible
  );

  // Observe only the first card to trigger stagger for all
  if (cards.length > 0) observer.observe(cards[0]);
});


document.querySelectorAll(".gallery").forEach(card => {
  card.addEventListener("click", () => {
    const url = card.getAttribute("data-link");
    if (url) window.location.href = url;
  });
});


// Select all final cards
const finalCards = document.querySelectorAll(".final-card");

// Popup elements
const popupOverlay = document.getElementById("imagePopup");
const popupImage = document.getElementById("popupImage");
let popupBtn = document.querySelector(".popup-close");

if (popupOverlay && popupImage && popupBtn) {
  // Open popup when a card is clicked
  finalCards.forEach(card => {
    card.addEventListener("click", () => {
      const imgSrc = card.querySelector("img").src;
      popupImage.src = imgSrc;
      popupOverlay.style.display = "flex";
    });
  });

  // Close popup when clicking the close button
  popupBtn.addEventListener("click", () => {
    popupOverlay.style.display = "none";
  });

  // Close when clicking outside the image
  popupOverlay.addEventListener("click", (e) => {
    if (e.target === popupOverlay) {
      popupOverlay.style.display = "none";
    }
  });
}



document.addEventListener("DOMContentLoaded", () => {
    // Elements
    const popupOverlay = document.getElementById("imagePopup");
    const popupImgEl   = document.getElementById("imagePopupImg");
    const btnPrev      = document.getElementById("imagePopupPrev");
    const btnNext      = document.getElementById("imagePopupNext");
    const btnClose     = document.getElementById("imagePopupClose");

    // Collect thumbnails
    const galleryImages = Array.from(document.querySelectorAll(".popup-image"));

    if (!popupOverlay || !popupImgEl || galleryImages.length === 0) return;

    let popupCurrentIndex = 0;

    // --- Open popup ---
    function openPopupAt(index) {
        popupCurrentIndex = (index + galleryImages.length) % galleryImages.length;
        popupImgEl.src = galleryImages[popupCurrentIndex].src;

        popupOverlay.style.display = "flex";

        popupImgEl.classList.remove(
            "slide-in-left","slide-in-right",
            "slide-out-left","slide-out-right",
            "lightbox-close"
        );
        popupImgEl.classList.add("lightbox-open");
    }

    // --- Close popup ---
    function closePopup() {
        popupImgEl.classList.remove("lightbox-open");
        popupImgEl.classList.add("lightbox-close");

        popupImgEl.addEventListener("animationend", () => {
            popupOverlay.style.display = "none";
            popupImgEl.classList.remove("lightbox-close");
        }, { once: true });
    }

    // --- Navigation animation ---
    let isAnimating = false;

    function changeImage(direction) {
        if (!galleryImages.length || isAnimating) return;
        isAnimating = true;

        const outgoing = direction === 1 ? "slide-out-left"  : "slide-out-right";
        const incoming = direction === 1 ? "slide-in-right"  : "slide-in-left";

        // Remove any previous animation classes
        popupImgEl.classList.remove("slide-in-left","slide-in-right","slide-out-left","slide-out-right","lightbox-open");

        // Start outgoing animation
        popupImgEl.classList.add(outgoing);

        popupImgEl.addEventListener("animationend", function handleOutgoing() {
            popupImgEl.removeEventListener("animationend", handleOutgoing);

            // Update index and image
            popupCurrentIndex = (popupCurrentIndex + direction + galleryImages.length) % galleryImages.length;
            popupImgEl.src = galleryImages[popupCurrentIndex].src;

            // Start incoming animation
            popupImgEl.classList.remove(outgoing);
            popupImgEl.classList.add(incoming);

            popupImgEl.addEventListener("animationend", function handleIncoming() {
                popupImgEl.removeEventListener("animationend", handleIncoming);
                popupImgEl.classList.remove(incoming);
                isAnimating = false; // allow next/prev clicks
            }, { once: true });
        }, { once: true });
    }



    // --- Thumbnail click (OPEN popup) ---
    galleryImages.forEach((thumb, i) => {
        thumb.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();   // IMPORTANT FIX: blocks auto-close
            openPopupAt(i);
        });
    });

    // --- Prevent clicks on the image from closing popup ---
    popupImgEl.addEventListener("click", (e) => e.stopPropagation());

    // --- Buttons ---
    if (btnNext) btnNext.addEventListener("click", (e) => {
        e.stopPropagation();
        changeImage(1);
    });

    if (btnPrev) btnPrev.addEventListener("click", (e) => {
        e.stopPropagation();
        changeImage(-1);
    });

    if (btnClose) btnClose.addEventListener("click", closePopup);

    // --- Click outside image closes popup ---
    popupOverlay.addEventListener("click", (e) => {
        if (e.target === popupOverlay) closePopup();
    });

    // --- Keyboard controls only when visible ---
    document.addEventListener("keydown", (e) => {
        if (popupOverlay.style.display !== "flex") return;
        if (e.key === "Escape") closePopup();
        if (e.key === "ArrowRight") changeImage(1);
        if (e.key === "ArrowLeft") changeImage(-1);
    });
});



document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(".fade-left, .fade-right, .fade-up, .fade-down");

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target); // animate once
      }
    });
  }, { threshold: 0.2 }); // trigger when 20% visible

  animatedElements.forEach(el => observer.observe(el));
});



document.addEventListener("DOMContentLoaded", () => {
  const sepLines = document.querySelectorAll(".sepLiner"); // select all separators

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible"); // triggers CSS animation
          obs.unobserve(entry.target);           // animate once
        }
      });
    },
    { threshold: 0.1 } // triggers when 10% is visible
  );

  sepLines.forEach(line => observer.observe(line));
});


// Only for the project page
if (window.location.pathname.includes("project.html")) {
  const nav = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const logo = document.querySelector('.logo');

  if (nav && hamburger && logo) {
    nav.classList.add('scrolled');
    hamburger.classList.add('scrolled');
    logo.src = 'images/logo.png'; // or whichever logo you want
  }
}


// Trigger scroll animations for About page
document.addEventListener("DOMContentLoaded", () => {
  const faders = document.querySelectorAll(".fade-left, .fade-right, .fade-up");

  const appearOptions = {
    threshold: 0.3,
    rootMargin: "0px 0px -50px 0px"
  };

  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, appearOptions);

  faders.forEach(fader => appearOnScroll.observe(fader));
});
