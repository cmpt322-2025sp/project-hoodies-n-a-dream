// router.js
// SPA router for Nitro Racing game
// Listens for /game path and injects gameAnimation view, styles, and scripts

import gameAnimation from './gameAnimation.js';

const GAME_PATH = '/game';
const gameStyles = [
    'general.css',
    'countDown.css',
    'answerStreak.css'
];
const gameScripts = [
    'Questions.js',
    'Gamefunctions.js'
];

/**
 * Remove existing route-specific styles and load new ones
 * @param {string[]} urls - Array of CSS file paths
 */
function loadStylesheets(urls) {
    document.querySelectorAll('[data-route-css]').forEach(el => el.remove());
    urls.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.setAttribute('data-route-css', '');
        document.head.appendChild(link);
    });
}

/**
 * Load JS files sequentially to preserve execution order
 * @param {string[]} srcList - Array of script file paths
 * @returns {Promise}
 */
function loadScriptsSequentially(srcList) {
    return srcList.reduce((prev, src) => {
        return prev.then(() => new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = src;
            s.async = false;
            s.onload = () => resolve();
            s.onerror = () => reject(new Error(`Failed to load ${src}`));
            document.body.appendChild(s);
        }));
    }, Promise.resolve());
}

/**
 * Main render function; injects view based on path
 */
function render() {
    const app = document.getElementById('app');
    if (!app) {
        console.error('Missing <div id="app"> in index.html');
        return;
    }

    if (window.location.pathname === GAME_PATH) {
        loadStylesheets(gameStyles);
        app.innerHTML = gameAnimation();
        loadScriptsSequentially(gameScripts)
            .then(() => console.log('🎮 Game scripts loaded'))
            .catch(err => console.error(err));
    } else {
        app.innerHTML = '<h1>Page not found</h1>';
    }
}

// Handle browser back/forward navigation
window.addEventListener('popstate', render);

// Initial render
render();

// Utility: navigate programmatically (optional)
export function navigate(path) {
    history.pushState(null, '', path);
    render();
}
