function setActive(selectedItem) {
    // Remove active class from all feature items
    document.querySelectorAll('.feature-item').forEach(item => {
        item.classList.remove('active');
        
        // Hide all descriptions on small screens
        if (window.innerWidth <= 768) {
            item.querySelector('p').style.display = 'none';
        }
    });

    // Add active class to the clicked item
    selectedItem.classList.add('active');

    // Show description only for active item on small screens
    if (window.innerWidth <= 768) {
        selectedItem.querySelector('p').style.display = 'block';
    }

    // Ensure smooth scrolling to the active item
    selectedItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Ensure only one description is visible on page load in mobile view
document.addEventListener("DOMContentLoaded", function () {
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.feature-item p').forEach((p, index) => {
            if (index === 0) {
                p.style.display = 'block'; // Show first item's description by default
            } else {
                p.style.display = 'none'; // Hide others
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const modeToggle = document.getElementById("modeToggle");
    const modeIcon = document.getElementById("modeIcon");
    const body = document.body;

    // Check local storage for theme preference
    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("dark-mode");
        modeIcon.classList.replace("fa-moon", "fa-sun"); // Change to Sun Icon
    }

    modeToggle.addEventListener("click", function () {
        if (body.classList.contains("dark-mode")) {
            body.classList.remove("dark-mode");
            localStorage.setItem("theme", "light");
            modeIcon.classList.replace("fa-sun", "fa-moon"); // Switch to Moon Icon (Light Mode)
        } else {
            body.classList.add("dark-mode");
            localStorage.setItem("theme", "dark");
            modeIcon.classList.replace("fa-moon", "fa-sun"); // Switch to Sun Icon (Dark Mode)
        }
    });
});


