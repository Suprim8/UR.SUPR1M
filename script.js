// ===========================
// YouTube Subscriber Counter
// ===========================

// IMPORTANT: You need a YouTube API Key to fetch subscriber count
// Get your free API key from: https://console.cloud.google.com/
// Instructions:
// 1. Go to Google Cloud Console
// 2. Create a new project
// 3. Enable YouTube Data API v3
// 4. Create an API key credential
// 5. Replace 'YOUR_API_KEY' and 'YOUR_CHANNEL_ID' below

const YOUTUBE_API_KEY = 'AIzaSyCTqY6x83TaICsox7xrenLpD3CzH-uKaRw'; // Replace with your API key
const YOUTUBE_CHANNEL_ID = 'UCtE0yBF_TDGnc8XsSMm8EPA'; // For channel s_suprim (you may need to find the actual channel ID)

// Function to format numbers with K, M suffix
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Fetch YouTube subscriber count
async function fetchYouTubeSubscribers() {
    const subscriberCountEl = document.getElementById('subscriber-count');
    subscriberCountEl.textContent = 'Loading...';

    if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID || YOUTUBE_API_KEY === 'YOUR_API_KEY') {
        subscriberCountEl.textContent = '--';
        return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

    try {
        const statsUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}`;
        const statsResponse = await fetch(statsUrl, { signal: controller.signal });
        clearTimeout(timeoutId);
        const statsData = await statsResponse.json();

        if (!statsResponse.ok || !statsData.items || statsData.items.length === 0) {
            console.error('YouTube API failed:', statsResponse.status, statsData);
            subscriberCountEl.textContent = 'API error';
            return;
        }

        const subscribers = statsData.items[0].statistics.subscriberCount;
        const formattedCount = formatNumber(parseInt(subscribers, 10));
        subscriberCountEl.textContent = formattedCount;
        console.log('YouTube subscribers fetched:', formattedCount);
    } catch (error) {
        console.error('Error fetching YouTube subscribers:', error);
        subscriberCountEl.textContent = 'API error';
    }
}

// Only fetch if API key is configured
fetchYouTubeSubscribers();

// ===========================
// Smooth scroll for navigation links
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll animation to elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all service cards and sections
document.querySelectorAll('.service-card, .skill-item').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Mobile menu toggle (if needed in future)
console.log('Suprim\'s Personal Website Loaded Successfully!');