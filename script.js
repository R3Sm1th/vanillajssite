'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector('.nav')

const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal))

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// console.log(document.head);
// const sections = document.querySelectorAll('.section')
// // console.log(sections);

// Cookie Warning
const message = document.createElement('div')
message.classList.add('cookie-message')
message.innerHTML = 'We use cookies for improved functionality and performance <button class="btn btn--close-cookie">Got it!</button>'

const header = document.querySelector('.header')
header.append(message)

document.querySelector('.btn--close-cookie').addEventListener('click', function(){
  message.remove()
})

message.style.backgroundColor = '#37383D'
message.style.width = '120%'

// Night Mode?

document.documentElement.style.setProperty('--color-primary', 'orangered')

// Scrolling
const btnScrollTo = document.querySelector('.btn--scroll-to')
const section1 = document.querySelector('#section--1')

btnScrollTo.addEventListener('click', function(event){
  const s1coords = section1.getBoundingClientRect()
  // console.log(s1coords);
  // console.log(event.target.getBoundingClientRect());
  // console.log('Current Scrool', window.pageXOffset, window.pageYOffset)
  // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + pageYOffset)
  // window.scrollTo({
  //           left: s1coords.left + window.pageXOffset,
  //           top: s1coords.top + window.pageYOffset,
  //           behaviour: 'smooth'
  // })
  section1.scrollIntoView({behavior: 'smooth'})
})

// Smooth Nav Bar
// document.querySelectorAll('.nav__link').forEach(function(el){
//   el.addEventListener('click', function(e){
//     e.preventDefault()
//     const id = this.getAttribute('href')
//     console.log(id);
//     document.querySelector(id).scrollIntoView({behavior: 'smooth'})
//   })
// })

// add to common parent element using event delegation
document.querySelector('.nav__links').addEventListener('click', function(e){
   e.preventDefault();
   if(e.target.classList.contains('nav__link')){
      const id = e.target.getAttribute('href')
      console.log(id);
      document.querySelector(id).scrollIntoView({behavior: 'smooth'})
   }
  });


// Tabs
const tabs = document.querySelectorAll('.operations__tab')
const tabsContainer = document.querySelector('.operations__tab-container')
const tabsContent = document.querySelectorAll('.operations__content')

tabsContainer.addEventListener('click', function(e){
  const clicked = e.target.closest('.operations__tab')
  console.log(clicked)
  if(!clicked) return
  tabs.forEach(t => t.classList.remove('operations__tab--active'))
  clicked.classList.add('operations__tab--active')
  console.log(clicked.dataset.tab);
  tabsContent.forEach(c => c.classList.remove('operations__content--active'))
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active')
})

const navHover = function(e, op) {
  if(e.target.classList.contains('nav__link')){
    const link = e.target
    const siblings = link.closest('.nav').querySelectorAll('.nav__link')
    const logo = link.closest('.nav').querySelector('img')
    siblings.forEach(el => {
      if(el !== link){
        el.style.opacity = op
      }
    })
   logo.style.opacity = op
  }
}

// The Focus on Links
// const nav = document.querySelector('.nav')
nav.addEventListener('mouseover', function(e){
  navHover(e, 0.5)
})
nav.addEventListener('mouseout', function(e){
  navHover(e, 1)
})

// Nav Bar
// const initialCoords = section1.getBoundingClientRect()
// window.addEventListener('scroll', function(e){
//   console.log(window.scrollY);
//   if (window.scrollY > initialCoords.top){
//     nav.classList.add('sticky')}
//   else {nav.classList.remove('sticky')}
// })

// const obsCallback = function(entries, observer){
//   entries.forEach(entry => console.log(entry))
// }
// const obsOptions = {
//   root: null,
//   threshold: [0, 0.1]
// }
// const observer = new IntersectionObserver(obsCallback, obsOptions)
// observer.observe(section1)


const header1 = document.querySelector('.header')
const navBarHeight = nav.getBoundingClientRect().height
const stickyNav = function (entries){
  const [entry] = entries
  // console.log(entry)
  if (!entry.isIntersecting) nav.classList.add('sticky')
  else nav.classList.remove('sticky')
}
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navBarHeight}px`
})
headerObserver.observe(header1)

// Intersection Sliding Content
const allSections = document.querySelectorAll('section')

const revealSection = function(entries, observer){
  const [entry] = entries;
  // console.log(entry);
  if(!entry.isIntersecting) return
  entry.target.classList.remove('section--hidden')
  observer.unobserve(entry.target)
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15
})

allSections.forEach(function(section){
  sectionObserver.observe(section)
  section.classList.add('section--hidden')
})

// Optimising imag loading
const imgTargets = document.querySelectorAll('img[data-src]')
// console.log(imgTargets);

const loadImg = function(entries, observer){
  const [entry] = entries
  // console.log(entry);
  if(!entry.isIntersecting) return
  entry.target.src = entry.target.dataset.src
  entry.target.addEventListener('load', function(){
    entry.target.classList.remove('lazy-img')
  })
  observer.unobserve(entry.target)
}

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px'
})

imgTargets.forEach(img => imgObserver.observe(img))


// Making a corosel from scratch
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
