let currentPage = 0;
const pages = document.querySelectorAll('.page');
const totalPages = pages.length; // Sẽ tự động là 12 (1 bìa + 10 nội dung + 1 kết thúc)
let isPlaying = false;
let albumStarted = false;

// Element references
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentPageSpan = document.getElementById('currentPage');
const totalPagesSpan = document.getElementById('totalPages');

// Music variables
let audio; // Biến để chứa đối tượng Audio

// Đường dẫn đến tệp nhạc của bạn
const musicFilePath = 'audio/new_song.mp3'; // Đảm bảo đường dẫn này đúng

// --- Music Functions ---
function setupMusic() {
    audio = new Audio(musicFilePath);
    audio.loop = true; // Lặp lại bài hát
    audio.volume = 0.5; // Đặt âm lượng (0.0 đến 1.0)

    audio.addEventListener('ended', () => {
        console.log('Nhạc đã kết thúc.');
        isPlaying = false;
    });

    audio.addEventListener('error', (e) => {
        console.error('Lỗi khi phát nhạc:', e);
        // Có thể hiển thị thông báo lỗi cho người dùng nếu cần
    });
}

function startMusic() {
    if (audio) {
        audio.play().then(() => {
            isPlaying = true;
            console.log('Nhạc đang phát.');
        }).catch(error => {
            // Đây là lỗi khi trình duyệt chặn autoplay.
            console.error('Không thể phát nhạc tự động. Người dùng cần tương tác:', error);
            // Bạn có thể hiển thị một thông báo hoặc nút "Bật nhạc" ở đây
        });
    } else {
        console.error('Đối tượng Audio chưa được khởi tạo.');
    }
}

function stopMusic() {
    if (audio) {
        audio.pause();
        audio.currentTime = 0; // Đặt lại về đầu bài hát
        isPlaying = false;
        console.log('Nhạc đã dừng.');
    }
}

// --- Fullscreen Function ---
function requestFullscreen() {
    const element = document.documentElement; // Lấy thẻ <html> để đưa toàn bộ trang vào chế độ full màn hình

    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { /* Firefox */
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { /* IE/Edge */
        element.msRequestFullscreen();
    }
}

// --- Album Navigation Functions ---
function updatePageCounter() {
    currentPageSpan.textContent = currentPage + 1;
    totalPagesSpan.textContent = totalPages;
}

function updateNavButtons() {
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === totalPages - 1;

    const controls = document.querySelector('.navigation');
    const counter = document.querySelector('.page-counter');
    if (albumStarted) {
        controls.style.opacity = '1';
        controls.style.pointerEvents = 'auto';
        counter.style.opacity = '1';
    } else {
        controls.style.opacity = '0';
        controls.style.pointerEvents = 'none';
        counter.style.opacity = '0';
    }
}

function nextPage() {
    if (currentPage < totalPages - 1) {
        const currentPageElement = pages[currentPage];
        const nextPageElement = pages[currentPage + 1];

        // 1. Tạm thời tăng z-index của trang hiện tại để nó lật trên tất cả các trang khác.
        currentPageElement.classList.add('is-flipping-forward');
        
        // 2. Thêm class 'flipped' để bắt đầu animation lật.
        currentPageElement.classList.add('flipped');

        // 3. Sau khi animation lật hoàn tất, điều chỉnh z-index và xóa class tạm thời.
        setTimeout(() => {
            currentPageElement.classList.remove('is-flipping-forward');
            // Đặt z-index của trang đã lật xuống thấp nhất để nó nằm dưới cùng.
            currentPageElement.style.zIndex = 1; 
            // Đảm bảo trang tiếp theo (bây giờ là trang hiện tại) có z-index phù hợp để hiển thị.
            nextPageElement.style.zIndex = totalPages - currentPage;
        }, 800); // Khớp với thời gian transition trong CSS

        currentPage++;
        updatePageCounter();
        updateNavButtons();
        addSparkleEffect();
        addFloatingHeart();
    }
}

function prevPage() {
    if (currentPage > 0) {
        const currentPageElement = pages[currentPage]; // Trang hiện đang hiển thị
        const prevPageElement = pages[currentPage - 1]; // Trang sẽ hiển thị sau khi lật ngược

        // 1. Tạm thời tăng z-index của trang sẽ lật ngược lại (trang trước đó)
        // để nó hiển thị trên tất cả các trang khác trong quá trình unflipping.
        prevPageElement.classList.add('is-flipping-backward');

        // 2. Xóa class 'flipped' khỏi trang hiện tại để lật ngược nó.
        currentPageElement.classList.remove('flipped');

        // 3. Sau khi animation lật ngược hoàn tất, điều chỉnh z-index và xóa class tạm thời.
        setTimeout(() => {
            prevPageElement.classList.remove('is-flipping-backward');
            // Đặt lại z-index của trang vừa lật ngược (trang trước đó).
            // Nó trở thành trang hiện tại, nên cần z-index cao.
            prevPageElement.style.zIndex = totalPages - (currentPage - 1);
            // Đặt z-index của trang vừa bị lật ngược (trang ban đầu của currentPage) thấp hơn.
            currentPageElement.style.zIndex = totalPages - currentPage; 
        }, 800); // Khớp với thời gian transition trong CSS

        currentPage--;
        updatePageCounter();
        updateNavButtons();
        addSparkleEffect();
        addFloatingHeart();
    }
}

function resetAlbum() {
    pages.forEach((page, index) => {
        page.classList.remove('flipped');
        page.classList.remove('is-flipping-forward'); // Xóa class tạm thời
        page.classList.remove('is-flipping-backward'); // Xóa class tạm thời
        page.style.zIndex = totalPages - index; // Reset z-index to initial state
    });
    currentPage = 0;
    albumStarted = false;
    updatePageCounter();
    updateNavButtons();

    document.querySelector('.navigation').style.opacity = '0';
    document.querySelector('.navigation').style.pointerEvents = 'none';
    document.querySelector('.page-counter').style.opacity = '0';
    
    stopMusic(); // Dừng nhạc khi reset album

    startButton.style.display = 'block'; // HIỂN THỊ LẠI NÚT "Bắt đầu câu chuyện"
}

function startAlbumInteraction() {
    albumStarted = true;
    startButton.style.display = 'none';
    document.querySelector('.navigation').style.opacity = '1';
    document.querySelector('.navigation').style.pointerEvents = 'auto';
    document.querySelector('.page-counter').style.opacity = '1';
    
    startMusic();
    nextPage(); // Move to the first content page

    // GỌI HÀM YÊU CẦU FULL MÀN HÌNH TẠI ĐÂY
    requestFullscreen(); 
}

// --- Decorative Effects ---
function addSparkleEffect() {
    const container = document.querySelector('.album-container');
    for (let i = 0; i < 3; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDelay = Math.random() * 1.5 + 's';
        container.appendChild(sparkle);

        setTimeout(() => {
            sparkle.remove();
        }, 2000);
    }
}

function addFloatingHeart() {
    const container = document.querySelector('.floating-hearts');
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = ['💕', '💖', '💝', '💗', '💘'][Math.floor(Math.random() * 5)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (Math.random() * 4 + 6) + 's';
    heart.style.animationDelay = Math.random() * 2 + 's';
    container.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 8000);
}

function createStars() {
    const starsContainer = document.querySelector('.stars');
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 2 + 's';
        star.style.animationDuration = (Math.random() * 2 + 1) + 's';
        starsContainer.appendChild(star);
    }
}

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    // Initial z-index setup for all pages
    pages.forEach((page, index) => {
        page.style.zIndex = totalPages - index;
    });

    updatePageCounter();
    updateNavButtons(); // Hide buttons and counter initially
    createStars();

    setInterval(addFloatingHeart, 3000);

    startButton.addEventListener('click', startAlbumInteraction);
    resetButton.addEventListener('click', resetAlbum);
    prevBtn.addEventListener('click', prevPage);
    nextBtn.addEventListener('click', nextPage);

    pages.forEach((page, index) => {
        page.addEventListener('click', (e) => {
            if (albumStarted && index === currentPage && currentPage < totalPages - 1) {
                nextPage();
            }
        });
    });

    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold && albumStarted) {
            if (diff > 0) {
                nextPage();
            } else {
                prevPage();
            }
        }
    }

    document.addEventListener('keydown', (e) => {
        if (albumStarted) {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                nextPage();
            } else if (e.key === 'ArrowLeft') {
                prevPage();
            }
        }
    });

    document.querySelector('.navigation').style.opacity = '0';
    document.querySelector('.navigation').style.pointerEvents = 'none';
    document.querySelector('.page-counter').style.opacity = '0';
    
    setupMusic();

    // Tự động phát nhạc và yêu cầu full màn hình khi trang được tải VÀ người dùng tương tác lần đầu
    // (ví dụ: click vào bất cứ đâu trên body hoặc nhấn nút "Bắt đầu câu chuyện")
    document.body.addEventListener('click', () => {
        if (!isPlaying) { 
            startMusic();
        }
        // Gọi requestFullscreen() ở đây cũng được, nhưng gọi trong startAlbumInteraction()
        // sẽ đảm bảo nó liên kết trực tiếp với hành động "Bắt đầu album"
    }, { once: true });
});
