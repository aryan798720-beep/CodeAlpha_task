
const photos = [...document.querySelectorAll(".photo")];
const filterButtons = document.querySelectorAll(".filters button");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");

let visiblePhotos = photos;
let currentIndex = 0;

// Category filters
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;

        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        visiblePhotos = photos.filter(photo =>
            filter === "all" || photo.dataset.category === filter
        );

        photos.forEach(photo => {
            photo.hidden = !visiblePhotos.includes(photo);
        });
    });
});

// Open lightbox
photos.forEach(photo => {
    photo.addEventListener("click", () => {
        currentIndex = visiblePhotos.indexOf(photo);
        showImage();
        lightbox.classList.add("open");
    });
});

// Display selected image
function showImage() {
    lightboxImg.src =
        visiblePhotos[currentIndex].querySelector("img").src;

    lightboxImg.alt =
        visiblePhotos[currentIndex].querySelector("img").alt;
}

// Next image
document.getElementById("nextBtn").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % visiblePhotos.length;
    showImage();
});

// Previous image
document.getElementById("prevBtn").addEventListener("click", () => {
    currentIndex =
        (currentIndex - 1 + visiblePhotos.length) % visiblePhotos.length;
    showImage();
});

// Close lightbox
document.getElementById("closeBtn").addEventListener("click", () => {
    lightbox.classList.remove("open");
});

// Close when clicking outside image
lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
        lightbox.classList.remove("open");
    }
});

// Keyboard navigation
document.addEventListener("keydown", event => {
    if (!lightbox.classList.contains("open")) return;

    if (event.key === "Escape") {
        lightbox.classList.remove("open");
    }

    if (event.key === "ArrowRight") {
        currentIndex = (currentIndex + 1) % visiblePhotos.length;
        showImage();
    }

    if (event.key === "ArrowLeft") {
        currentIndex =
            (currentIndex - 1 + visiblePhotos.length) % visiblePhotos.length;
        showImage();
    }
});

