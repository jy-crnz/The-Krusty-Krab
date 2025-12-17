// script.js

$(document).ready(function() {
    if ($('#contactForm').length > 0) {
        if (typeof emailjs !== 'undefined') {
            emailjs.init('qNGsQsBpghU7kLut7');
            console.log('✓ EmailJS initialized successfully');
        } else {
            console.error('✗ EmailJS library not loaded');
        }
    }

    $('.mobile-toggle').click(function() {
        $('.nav-links').toggleClass('active');
        $(this).toggleClass('active');
    });

    $(document).click(function(event) {
        if (!$(event.target).closest('.navbar').length) {
            $('.nav-links').removeClass('active');
            $('.mobile-toggle').removeClass('active');
        }
    });

    if ($('.custom-carousel').length) {
        $('.custom-carousel').each(function() {
            $(this).owlCarousel({
                autoWidth: true,
                loop: true,
                margin: 30,
                nav: true,
                dots: true,
                navText: ['‹', '›'],
                freeDrag: true,  
                responsive: {
                    0: {
                        items: 1,
                        freeDrag: true  
                    },
                    600: {
                        items: 2,
                        freeDrag: true  
                    },
                    1000: {
                        items: 3,
                        freeDrag: false  
                    }
                }
            });
        });

        $(document).on('click', '.custom-carousel .item', function() {
        const carousel = $(this).closest('.custom-carousel');
        carousel.find('.item').removeClass('active');
        $(this).addClass('active');
});

    }

    if ($('#carouselWrapper').length) {
        let currentIndex = 0;
        const items = $('.carousel-item');
        const totalItems = items.length;
        
        $('.carousel-item').click(function() {
            const clickedIndex = $(this).data('index');
            if (clickedIndex !== currentIndex) {
                setActiveItem(clickedIndex);
            }
        });

        $('#prevBtn').click(function() {
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            setActiveItem(currentIndex);
        });

        $('#nextBtn').click(function() {
            currentIndex = (currentIndex + 1) % totalItems;
            setActiveItem(currentIndex);
        });

        function setActiveItem(index) {
            currentIndex = index;
            
            items.removeClass('active');
            
            items.eq(index).addClass('active');
            
            const itemWidth = items.eq(index).hasClass('active') ? 500 : 320;
            const containerWidth = $('.carousel-container').width();
            const offset = (containerWidth / 2) - (itemWidth / 2);
            
            let totalWidth = 0;
            items.each(function(i) {
                if (i < index) {
                    const w = $(this).hasClass('active') ? 500 : 320;
                    totalWidth += w + 30; 
                }
            });
            
       
            const translateX = offset - totalWidth - 15;
            $('#carouselWrapper').css('transform', `translateX(${translateX}px)`);
        }

       
        let autoplayInterval = setInterval(function() {
            currentIndex = (currentIndex + 1) % totalItems;
            setActiveItem(currentIndex);
        }, 5000);

        
        $('.carousel-container').hover(
            function() {
                clearInterval(autoplayInterval);
            },
            function() {
                autoplayInterval = setInterval(function() {
                    currentIndex = (currentIndex + 1) % totalItems;
                    setActiveItem(currentIndex);
                }, 5000);
            }
        );

        $(window).resize(function() {
            setActiveItem(currentIndex);
        });
    }

    $('#contactForm').submit(function(e) {
        e.preventDefault();
        
        const formData = {
            user_name: $('#name').val(),
            user_email: $('#email').val(),
            user_phone: $('#phone').val(),
            user_subject: $('#subject').val(),
            user_message: $('#message').val()
        };

        $('#formResponse')
            .removeClass('error-message success-message')
            .addClass('loading-message')
            .css({
                'display': 'block',
                'background-color': '#ADD8E6',
                'color': '#00008B',
                'border': '2px solid #00008B'
            })
            .html(`<strong>⏳ Sending your message...</strong>`);

        emailjs.send(
            'the_krusty_krab',    
            'krusty_krab',        
            formData              
        ).then(function(response) {
            $('#formResponse')
                .removeClass('loading-message')
                .addClass('success-message')
                .css({
                    'display': 'block',
                    'background-color': '#90EE90',
                    'color': '#006400',
                    'border': '2px solid #006400'
                })
                .html(`
                    <strong>✓ Message Sent Successfully!</strong><br>
                    Thank you, ${formData.user_name}! A copy of your message has been sent to ${formData.user_email}.
                `);

            $('#contactForm')[0].reset();

            setTimeout(function() {
                $('#formResponse').fadeOut();
            }, 5000);

            console.log('Email sent successfully:', response);
        }, function(error) {
            $('#formResponse')
                .removeClass('loading-message')
                .addClass('error-message')
                .css({
                    'display': 'block',
                    'background-color': '#FFB6C6',
                    'color': '#8B0000',
                    'border': '2px solid #8B0000'
                })
                .html(`
                    <strong>✗ Error Sending Message</strong><br>
                    There was a problem sending your message. Please try again or contact us directly.
                `);

            console.error('EmailJS error:', error);
        });
    });
    
    $('a[href^="#"]').on('click', function(e) {
        const target = $(this.getAttribute('href'));
        if (target.length) {
            e.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 80
            }, 800);
        }
    });

    $(document).on('click', '.menu-list-link', function(e) {
        e.preventDefault();
        
        const target = $(this).data('target');
        const element = $('#' + target);
        
        console.log('Menu item clicked:', target);
        
        if (element.length) {
            console.log('Found element:', element);
            
            const carousel = element.closest('.custom-carousel');
            const owlCarousel = carousel.data('owl.carousel');
            
            if (!owlCarousel) {
                console.log('Owl Carousel not initialized');
                return;
            }
            
            const allItems = carousel.find('.owl-item:not(.cloned) .item');
            let targetIndex = -1;
            
            allItems.each(function(index) {
                if ($(this).attr('id') === target) {
                    targetIndex = index;
                    return false; 
                }
            });
            
            console.log('Target index:', targetIndex);
            
            if (targetIndex !== -1) {
                $('html, body').stop().animate({
                    scrollTop: element.closest('.menu-category').offset().top - 100
                }, 800, function() {
                    console.log('Scroll complete');
                    
                    setTimeout(function() {
                        carousel.find('.item').removeClass('active');
                        
                        const screenWidth = $(window).width();
                        
                        if (screenWidth >= 1000) {
                            const desktopIndex = targetIndex > 0 ? targetIndex - 1 : 0;
                            owlCarousel.to(desktopIndex, 400, true);
                        } else {
                            owlCarousel.to(targetIndex, 400, true);
                        }
                        
                        console.log('Navigated to index:', targetIndex);
                        
                        setTimeout(function() {
                            carousel.find('.item').removeClass('active');
                            
                            element.addClass('active');
                            
                            console.log('Card expanded with active class');
                            
                            setTimeout(function() {
                                owlCarousel.trigger('refresh.owl.carousel');
                            }, 50);
                        }, 450);
                    }, 100);
                });
            } else {
                console.log('Target index not found');
            }
        } else {
            console.log('Element not found for target:', target);
        }
    });

    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    function handleScrollAnimations() {
        $('.featured-card, .menu-item, .staff-card, .info-card').each(function() {
            if (isElementInViewport(this)) {
                $(this).addClass('fade-in-up');
            }
        });
    }

    $('<style>')
        .prop('type', 'text/css')
        .html(`
            .fade-in-up {
                animation: fadeInUp 0.6s ease forwards;
            }
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `)
        .appendTo('head');

    $(window).on('scroll', handleScrollAnimations);
    handleScrollAnimations(); 

    $('.btn, .submit-btn, .carousel-btn').hover(
        function() {
            $(this).css('transform', 'translateY(-3px) scale(1.05)');
        },
        function() {
            $(this).css('transform', 'translateY(0) scale(1)');
        }
    );

    $('.carousel-btn').click(function(e) {
        e.stopPropagation();
    });

        $('.nav-links a').click(function() {
            if ($(this).attr('href').indexOf('#') === -1) {
                $(this).append(' <span style="font-size: 0.8em;">⟳</span>');
            }
        });

        console.log('🦀 The Krusty Krab website loaded successfully!');
        console.log('📍 Total menu items:', $('.menu-item').length);
        console.log('🎨 Gallery items:', $('.carousel-item').length);
    });

    document.addEventListener('DOMContentLoaded', function() {
        
        const buttons = document.querySelectorAll('.btn, .submit-btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });

        const style = document.createElement('style');
        style.textContent = `
            .btn, .submit-btn {
                position: relative;
                overflow: hidden;
            }
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple-animation 0.6s ease-out;
                pointer-events: none;
            }
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePhone(phone) {
        const re = /^[\d\s\-\(\)]+$/;
        return re.test(phone) || phone === '';
    }

    $(document).ready(function() {
        $('#email').on('blur', function() {
            const email = $(this).val();
            if (email && !validateEmail(email)) {
                $(this).css('border-color', '#FF6F61');
            } else {
                $(this).css('border-color', '#f2f2f2');
            }
        });

        $('#phone').on('blur', function() {
            const phone = $(this).val();
            if (phone && !validatePhone(phone)) {
                $(this).css('border-color', '#FF6F61');
            } else {
                $(this).css('border-color', '#f2f2f2');
            }
        });
    });