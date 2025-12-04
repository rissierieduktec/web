document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
    }

    // Number Counter Animation
    const statNumbers = document.querySelectorAll('.stat-number');

    const animateValue = (obj, start, end, duration, prefix = '', suffix = '') => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // Easing function for smooth animation (easeOutQuad)
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            const value = Math.floor(easeProgress * (end - start) + start);

            // Format number with commas for thousands if needed (simple regex for standard locale)
            const formattedValue = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            obj.textContent = `${prefix}${formattedValue}${suffix}`;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                // Ensure final value is exact
                const finalFormatted = end.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                obj.textContent = `${prefix}${finalFormatted}${suffix}`;
            }
        };
        window.requestAnimationFrame(step);
    };

    const observerOptions = {
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const originalText = el.textContent.trim();

                // Regex to separate prefix, number (with commas), and suffix
                // Matches: Group 1 (Prefix), Group 2 (Number with commas), Group 3 (Suffix)
                const match = originalText.match(/^([^\d]*)([\d,]+)(.*)$/);

                if (match) {
                    const prefix = match[1];
                    const numberStr = match[2].replace(/,/g, '');
                    const suffix = match[3];
                    const targetValue = parseInt(numberStr, 10);

                    if (!isNaN(targetValue)) {
                        // Start animation
                        animateValue(el, 0, targetValue, 2000, prefix, suffix);
                        observer.unobserve(el); // Only animate once
                    }
                }
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
});
