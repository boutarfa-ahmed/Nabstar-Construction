 document.addEventListener('DOMContentLoaded', function() {
            const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
            const menu = document.querySelector('.header-contact-nav-wrapper');
            const body = document.body;
            
            // Gestion du menu mobile
            mobileMenuToggle.addEventListener('click', function() {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !isExpanded);
                menu.classList.toggle('is-active');
                body.classList.toggle('menu-open');
                
                // Changement d'icône
                const icon = this.querySelector('i');
                if (menu.classList.contains('is-active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
            
            // Fermer le menu en cliquant à l'extérieur
            document.addEventListener('click', function(e) {
                if (menu.classList.contains('is-active') && 
                    !menu.contains(e.target) && 
                    !mobileMenuToggle.contains(e.target)) {
                    menu.classList.remove('is-active');
                    body.classList.remove('menu-open');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                    
                    // Remettre l'icône hamburger
                    const icon = mobileMenuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
            
            // Fermer le menu avec la touche Échap
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && menu.classList.contains('is-active')) {
                    menu.classList.remove('is-active');
                    body.classList.remove('menu-open');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                    
                    const icon = mobileMenuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });

            document.querySelectorAll(".main-nav-list li a").forEach(link => {
                link.addEventListener("click", function () {
                    if (menu.classList.contains("is-active")) {
                        menu.classList.remove("is-active");
                        body.classList.remove("menu-open");
                        mobileMenuToggle.setAttribute("aria-expanded", "false");
                    
                        const icon = mobileMenuToggle.querySelector("i");
                        icon.classList.remove("fa-times");
                        icon.classList.add("fa-bars");
                    }
                });
            });

            
            // Gestion du header lors du défilement
            let lastScrollY = window.scrollY;
            const header = document.querySelector('.main-header');
            
            window.addEventListener('scroll', function() {
                if (window.scrollY > 100) {
                    header.classList.add('scrolled');
                    
                    // Masquer la navbar au défilement vers le bas sur mobile
                    if (window.innerWidth < 1025) {
                        if (window.scrollY > lastScrollY) {
                            header.style.transform = 'translateY(-100%)';
                        } else {
                            header.style.transform = 'translateY(0)';
                        }
                    }
                } else {
                    header.classList.remove('scrolled');
                    header.style.transform = 'translateY(0)';
                }
                
                lastScrollY = window.scrollY;
            });
            
            // Simulation d'un chargement pour le bouton
            document.querySelectorAll(".formContact").forEach(ctaButton => {
            ctaButton.addEventListener('click', function(e) {
                if (e.target.tagName === 'BUTTON') {
                    try{
                        showIframeLoading();
                        this.classList.add('btn--loading');
                        
                        // Simuler une action asynchrone
                        setTimeout(() => {
                            this.classList.remove('btn--loading');
                            creatIframeContact();
                        }, 1000);
                    }catch(err){
                        console.error("Error loading contact form:", err);
                        showIframeError("Failed to load contact form.");
                    }
                }
            });
        });
                function creatIframeContact(){
                    const html=`
                    <!DOCTYPE html>
                    <html>
                        <head>
                            <meta charset="utf-8">
                            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
                            <link rel="stylesheet" href="assets/css/contact.css">
                            <link rel="stylesheet" href="assets/css/base.css">
                            <style>
                                .contact-content{
                                    margin:2.5rem 3rem;
                                }
                                .degradation{
                                  position: absolute;
                                  left: 0rem;
                                  width: 100%;
                                  height: 20px; /* hauteur des bandes */
                                  background-image: repeating-linear-gradient(
                                    45deg,
                                    rgba(255, 255, 255, 0.1) 0,
                                    rgba(255, 255, 255, 0.1) 2px,
                                    transparent 2px,
                                    transparent 6px
                                  );
                                  background-color: #00174f;
                                  z-index: 1;
                                }

                                @media (min-width: 674px) {
                                    .contact-content {
                                        grid-template-columns: 1fr 1fr;
                                    }
                                }

                                .btn {
                                    padding: 0.8rem 1.8rem;
                                    border: none;
                                    border-radius: 25px;
                                    font-weight: 600;
                                    cursor: pointer;
                                    transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
                                    white-space: nowrap;
                                    display: inline-flex;
                                    align-items: center;
                                    justify-content: center;
                                    position: relative;
                                    overflow: hidden;
                                }
                                                
                                .btn:focus-visible {
                                    outline: 2px solid var(--accent-color);
                                    outline-offset: 2px;
                                }
                                                
                                .btn::before {
                                    content: '';
                                    position: absolute;
                                    top: 0;
                                    left: -100%;
                                    width: 100%;
                                    height: 100%;
                                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                                    transition: left 0.7s ease;
                                }
                                                
                                .btn:hover::before {
                                    left: 100%;
                                }
                                                
                                .btn-accent {
                                    background-color: var(--accent-color);
                                    color: white;
                                }
                                                
                                .btn-accent:hover {
                                    background-color: var(--hover-accent-color);
                                    transform: translateY(-2px);
                                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                                }
                                
                                .rule {
                                  width: 100%;
                                  height: 12.5px;
                                  background: repeating-linear-gradient(
                                    to right,
                                    #636060 0px 1px,
                                    transparent 1px 20px
                                  );
                                  position:relative;
                                }
                                .rule::after {
                                  content: "";
                                  right: 8px;
                                  position: absolute;
                                  width: 100%;
                                  height: 7.5px;
                                  background: repeating-linear-gradient(
                                    to right,
                                    #636060 0px 1px,
                                    transparent 1px 20px
                                  );
                                }
                                .rule::before {
                                  content: "";
                                  position: absolute;
                                  left: 6px;
                                  width: 100%;
                                  height: 10px;
                                  background: repeating-linear-gradient(
                                    to right,
                                    #636060 0px 1px,
                                    transparent 1px 20px
                                  );
                                }

                            </style>
                        </head>
                        <body>
                            <div class="rule"></div>
                            <h1 style="color:var(--accent-color);text-align:center;font-size:3rem">Contact Us</h1>
                            <div id="contactContainer" class="contact-content animate-on-scroll">
                                <div class="contact__form animate-on-scroll">
                                    <form id="contactForm" action="includes/contact.php" method="POST">
                                        <fieldset class="form__fullName">
                                            <label>
                                                <span>First Name *</span>
                                                <input placeholder="Ex. John" type="text" name="firstName" required>
                                            </label>
                                            <label>
                                                <span>Last Name *</span>
                                                <input placeholder="Ex. Doe" type="text" name="lastName" required>
                                            </label>
                                        </fieldset>

                                        <fieldset class="form__contact">
                                            <label>
                                                <span>Email *</span>
                                                <input placeholder="example@email.com" type="email" name="email" required>
                                            </label>
                                            <label>
                                                <span>Phone Number *</span>
                                                <input placeholder="Enter Phone Number" type="tel" name="phoneNumber" required>
                                            </label>
                                        </fieldset>

                                        <div class="form__message">
                                            <label>
                                                <span>Your Message *</span>
                                                <textarea placeholder="Enter here.." name="message" rows="5" required></textarea>
                                            </label>
                                        </div>

                                        <button type="submit" class="btn btn-accent" id="submitForm">Send Message</button>
                                    </form>
                                    <div id="formResponse" style="margin-top:10px;color:green;"></div>
                                </div>

                                <div class="contact__info animate-on-scroll">
                                    <div class="degradation"></div>
                                    <address>
                                        <div class="location__info">
                                            <h3>Location</h3>
                                            <p><a class="contact-link" href="https://maps.google.com/?q=Watford,+United+Kingdom" target="_blank">Watford, United Kingdom</a></p>
                                        </div>

                                        <div class="contact__details">
                                            <h3>Contact</h3>
                                            <p><a class="contact-link" href="tel:+1 (555) 123-4567">Phone : +1 (555) 123-4567</a></p>
                                            <p><a class="contact-link" href="mailto:demo@example.com">Email : demo@example.com</a></p>
                                        </div>
                                    </address>

                                    <div class="open__time">
                                        <h3>Open Time</h3>
                                        <p>We are open 24/7</p>
                                    </div>

                                    <div class="connect__area__div">
                                        <h3>Stay Connected</h3>
                                        <div class="connect__area">
                                            <a class="icon__bg__accent" href="https://www.facebook.com/nabstarconstruction/photos?locale=en_GB&checkpoint_src=any" aria-label="Facebook Profile" target="_blank" rel="noopener noreferrer"> <i class="fab fa-facebook-f"></i> </a>
                                            <a class="icon__bg__accent" href="https://api.whatsapp.com/send/?phone=15551234567&text=Hello+Nabstar+Construction%2C+I+would+like+to+get+a+quote+please.&type=phone_number&app_absent=0" aria-label="WhatsApp Profile" target="_blank" rel="noopener noreferrer"> <i class="fab fa-whatsapp"></i> </a> 
                                            <a class="icon__bg__accent" href="mailto:demo@example.com" aria-label="Send an email"> <i class="fas fa-envelope"></i> </a> 
                                            <a class="icon__bg__accent" href="https://maps.google.com/?q=Watford,+United+Kingdom" aria-label="Find us on a map" target="_blank" rel="noopener noreferrer"> <i class="fas fa-map-marker-alt"></i> </a> 
                                        </div>
                                    </div>
                                    <div class="degradation"></div>
                                </div>
                            </div>
                            <div class="rule" style="rotate:180deg;"></div>
                            <script src="function.js"></script>
                        </body>
                        </html>
                    `

                    const iframe = document.getElementById('trainingIframe');
                    const overlay = document.getElementById('iframeOverlay');
                            
                    // Animation d'ouverture
                    overlay.style.display = 'flex';
                    setTimeout(() => {
                        overlay.classList.add('active');
                        iframe.srcdoc = html;
                    }, 50);
                }

                // Animation de chargement pour l'iframe
                function showIframeLoading() {
                    const overlay = document.getElementById('iframeOverlay');
                    const iframe = document.getElementById('trainingIframe');
                    
                    overlay.style.display = 'flex';
                    overlay.classList.add('loading');
                    iframe.srcdoc = `
                        <!DOCTYPE html>
                        <html>
                        <head><style>
                            body { display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                            .loading-spinner { width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #007bff; border-radius: 50%; animation: spin 1s linear infinite; }
                            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                        </style></head>
                        <body><div class="loading-spinner"></div></body>
                        </html>
                    `;
                }
            
                function showIframeError(message) {
                    const iframe = document.getElementById('trainingIframe');
                    iframe.srcdoc = `
                        <!DOCTYPE html>
                        <html>
                        <head><style>
                            body { display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; font-family: Arial; }
                            .error { text-align: center; color: #dc3545; }
                        </style></head>
                        <body>
                            <div class="error">
                                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                                <h3>Error</h3>
                                <p>${message}</p>
                            </div>
                        </body>
                        </html>
                    `;
                }
});
        