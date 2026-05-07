// --- GOOGLE ANALYTICS 4 ---
const GA_ID = 'G-4Y11M1VLK7';
const gaScript = document.createElement('script');
gaScript.async = true;
gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
document.head.appendChild(gaScript);

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', GA_ID);

// --- REDIRECT LINGUA AUTOMATICO ---
(function() {
    // Evita il redirect se siamo già stati reindirizzati in questa sessione
    if (sessionStorage.getItem('language_redirected')) return;

    // Se l'utente è sulla root (fastqrfree.com/) controlliamo la sua lingua
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        const userLang = navigator.language || navigator.userLanguage;
        const langCode = userLang.substring(0, 2).toLowerCase();

        const supportedLanguages = {
            'it': '/it/',
            'de': '/de/',
            'es': '/es/',
            'fr': '/fr/'
        };

        if (supportedLanguages[langCode]) {
            sessionStorage.setItem('language_redirected', 'true');
            window.location.href = supportedLanguages[langCode];
        }
    }
})();
