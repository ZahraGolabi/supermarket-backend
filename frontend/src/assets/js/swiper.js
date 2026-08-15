  document.addEventListener('DOMContentLoaded', function () {
            const swiper = new Swiper('.mySwiper', {
                loop: true,
                autoplay: {
                    delay: 4000,
                    disableOnInteraction: false,
                },
                effect: 'slide',
                speed: 800,
                pagination: false,
            });

            const totalSlides = swiper.slides.length - 2; 
            const dotsContainer = document.getElementById('customDots');
            dotsContainer.innerHTML = '';

            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.className = 'dot';
                if (i === 0) dot.classList.add('dot-active');
                dot.dataset.index = i;
                dot.addEventListener('click', function () {
                    swiper.slideTo(i + 1); 
                });
                dotsContainer.appendChild(dot);
            }

            swiper.on('slideChange', function () {
                const activeIndex = swiper.realIndex; 
                const dots = dotsContainer.querySelectorAll('.dot');
                dots.forEach((dot, idx) => {
                    dot.classList.toggle('dot-active', idx === activeIndex);
                });
            });

            swiper.on('init', function () {
                const activeIndex = swiper.realIndex;
                const dots = dotsContainer.querySelectorAll('.dot');
                dots.forEach((dot, idx) => {
                    dot.classList.toggle('dot-active', idx === activeIndex);
                });
            });
        });