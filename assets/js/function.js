document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('.animate-on-scroll');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  elements.forEach(el => observer.observe(el));
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
        e.preventDefault();
        const targetId = this.getAttribute("href").substring(1);
        const target = document.getElementById(targetId);

        if (target) {
            const offset = window.innerWidth>1025?80:10; // hauteur offset
            const topPos = target.getBoundingClientRect().top + window.scrollY - offset;

            window.scrollTo({
                top: topPos,
                behavior: "smooth"
            });
        }
    });
});



// Function signature change: pass elements, not the whole document
function initFormHandler(formElement, responseElement) {
    if (!formElement) return;

    formElement.addEventListener("submit", async function (e) {
        e.preventDefault();

        responseElement.style.opacity = "0"; // Start by hiding previous response
        let formData = new FormData(this);

        try {
            const response = await fetch("includes/contact.php", {
                method: "POST",
                body: formData
            });

            // Check for HTTP errors (e.g., 404, 500) before trying to parse JSON
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                responseElement.style.color = "green";
                responseElement.textContent = data.message;
                formElement.reset();
            } else {
                // Assuming 'data.error' exists if 'data.success' is false
                responseElement.style.color = "red";
                responseElement.textContent = data.error || "Form submission failed with no specific error message.";
            }
        } catch (err) {
            responseElement.style.color = "red";
            responseElement.textContent = "An error occurred. Please check the console.";
            // Log the full error object for better debugging
            console.error("Form submission error:", err);
        } finally {
            // Display the response and start the fade-out, regardless of success/error
            responseElement.style.opacity = "1";
            
            // Wait 3 seconds, then start a 1-second transition to fade out
            setTimeout(() => {
                responseElement.style.transition = "opacity 1s ease-out";
                responseElement.style.opacity = "0";
            }, 3000);
            
            // Clean up the transition property after it's done so it doesn't interfere
            // with the *next* time we set opacity to 1 instantly.
            setTimeout(() => {
                 responseElement.style.removeProperty('transition');
            }, 4000); // 3000ms delay + 1000ms transition
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // Helper function to find and pass elements
    const setupForm = (doc) => {
        const form = doc.getElementById("contactForm");
        const response = doc.getElementById("formResponse");
        
        // Only initialize if both are found
        if (form && response) {
            initFormHandler(form, response);
            
        }
    };
    
    // 1. Setup the form on the main document
    setupForm(document);

    // 2. Setup the form inside the iframe, if it exists
    const iframe = document.getElementById("trainingIframe");
    if (iframe) {
        iframe.addEventListener("load", () => {
            try {
                // Ensure contentWindow exists and contentDocument is accessible (Same-Origin Policy check)
                const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                if (iframeDoc) {
                    setupForm(iframeDoc);
                }
            } catch (e) {
                // Catch potential SecurityError if the iframe is cross-origin
                console.warn("Could not access iframe content due to potential cross-origin restriction:", e);
            }
        });
    }
});
// show loading (pass container)
function showLoading(container, msg) {
  container.innerHTML = `
    <div class="loading">
      <i class="fas fa-spinner fa-spin loading__spinner"></i>
      <p>Loading ${msg}</p>
    </div>
  `;
}

// show error (pass container)
function showError(container, msg, retryCallback = null) {
  container.innerHTML = `
    <div class="error-message">
      <i class="fas fa-exclamation-circle"></i>
      <p>${msg}</p>
      ${retryCallback ? '<button class="retry-btn">Réessayer</button>' : ""}
    </div>
  `;

  if (retryCallback) {
    const retryBtn = container.querySelector(".retry-btn");
    retryBtn.addEventListener("click", retryCallback);
  }
}