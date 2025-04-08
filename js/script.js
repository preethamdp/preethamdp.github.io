// ASCII Donut Animation Logic
// Based on the classic C implementation by Andy Sloane (https://www.a1k0n.net/2011/07/20/donut-math.html)

const donutOutput = document.getElementById('donut-output');
let animationInterval;

function startDonutAnimation() {
    if (!donutOutput) {
        console.error("Donut output element not found!");
        return;
    }

    let A = 0, B = 0; // Rotation angles

    // Precompute sines and cosines
    const renderFrame = () => {
        const b = []; // z-buffer
        const z = []; // frame buffer

        // Increased dimensions for fuller background coverage
        const width = 120; // ASCII art width
        const height = 45; // ASCII art height
        const bufferSize = height * width;

        // Initialize buffers
        for (let k = 0; k < bufferSize; k++) {
            b[k] = k % width == width - 1 ? "\n" : " ";
            z[k] = 0;
        }

        const cA = Math.cos(A), sA = Math.sin(A);
        const cB = Math.cos(B), sB = Math.sin(B);

        // Project donut points onto 2D screen
        for (let j = 0; j < 6.28; j += 0.07) { // j <=> theta
            const ct = Math.cos(j), st = Math.sin(j);
            for (let i = 0; i < 6.28; i += 0.02) { // i <=> phi
                const sp = Math.sin(i), cp = Math.cos(i);
                const h = ct + 2; // R1 + R2*cos(theta)
                const D = 1 / (sp * h * sA + st * cA + 5); // 1/z
                const t = sp * h * cA - st * sA; // x' calculation

                // Adjust projection scaling factors (30 and 15) if needed based on new width/height
                const x = Math.floor(width / 2 + (width * 0.4) * D * (cp * h * cB - t * sB)); // Scale projection horizontally
                const y = Math.floor(height / 2 + (height * 0.7) * D * (cp * h * sB + t * cB)); // Scale projection vertically
                const o = x + width * y; // array index
                const N = Math.floor(8 * ((st * sA - sp * ct * cA) * cB - sp * ct * sA - st * cA - cp * ct * sB)); // luminance index

                if (y < height && y >= 0 && x >= 0 && x < width && D > z[o]) {
                    z[o] = D;
                    b[o] = ".,-~:;=!*#$@"[N > 0 ? N : 0]; // Luminance characters
                }
            }
        }

        // Update angles for next frame
        A += 0.04;
        B += 0.02;

        // Update the <pre> element content
        donutOutput.textContent = b.join("");
    };

    // Start the animation loop
    if (animationInterval) clearInterval(animationInterval);
    animationInterval = setInterval(renderFrame, 50); // Update ~20 times per second
}


// --- Initialize Donut and Other Page Features ---
document.addEventListener('DOMContentLoaded', (event) => {

    // Start the ASCII Donut
    startDonutAnimation();

    // --- Smooth scrolling for navigation links ---
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Intersection Observer for fade-in elements ---
    const fadeElements = document.querySelectorAll('.fade-in'); // Target elements with the class
    const options = {
        root: null, // relative to document viewport
        rootMargin: '0px', // No margin
        threshold: 0.1 // trigger when 10% of the section is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing the element once it's visible
                // observer.unobserve(entry.target);
            }
            // Optional: Remove 'visible' class if element scrolls out of view
            // else {
            //     entry.target.classList.remove('visible');
            // }
        });
    }, options);

    fadeElements.forEach(element => {
        observer.observe(element);
    });
});

