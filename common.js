// --- 1. GOOGLE ANALYTICS 4 ---
const GA_ID = 'G-4Y11M1VLK7';
const gaScript = document.createElement('script');
gaScript.async = true;
gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
document.head.appendChild(gaScript);

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', GA_ID);

// --- 2. REDIRECT LINGUA INTELLIGENTE ---
(function() {
    // 1. Controlliamo se l'utente è sulla ROOT (es: fastqrfree.com/ o fastqrfree.com/index.html)
    // Se la posizione NON è la root, interrompiamo lo script (Evita il LOOP)
    const isRoot = window.location.pathname === '/' || window.location.pathname === '/index.html';
    if (!isRoot) return;

    // 2. Controlliamo se abbiamo già fatto il redirect in questa sessione
    if (sessionStorage.getItem('language_redirected')) return;

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
        // Reindirizza alla sottocartella specifica
        window.location.href = window.location.origin + supportedLanguages[langCode];
    }
})();
