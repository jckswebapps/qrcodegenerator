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
// --- LOGICA GENERATORE QR ---
let qr;
document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('qr-canvas');
    if (canvas) {
        qr = new QRious({
            element: canvas,
            size: 1000,
            level: 'H',
            value: 'https://fastqrfree.com'
        });
    }
});

function generateQR() {
    const val = document.getElementById('qr-input').value;
    if (val.trim() !== "" && qr) {
        qr.value = val;
    }
}

function getFileNameFromUrl(url) {
    if (!url) return "qrcode-jcks";
    try {
        let cleanUrl = url.replace(/^(https?:\/\/)/, '').replace(/\/$/, '');
        let parts = cleanUrl.split('/');
        let fileName = parts[parts.length - 1];
        if (!fileName || fileName.includes('.')) {
            fileName = parts[0].replace('www.', '');
        }
        return fileName.replace(/[^a-z0-9.-]/gi, '_').toLowerCase();
    } catch (e) { return "qrcode-jcks"; }
}

function downloadQR() {
    const canvas = document.getElementById('qr-canvas');
    const urlInput = document.getElementById('qr-input').value;
    
    if (!urlInput) {
        // Messaggi di errore tradotti
        const msgs = { 'it': 'Inserisci un URL!', 'en': 'Enter a URL!', 'de': 'URL eingeben!', 'es': '¡Ingresa un URL!', 'fr': 'Entrez une URL!' };
        const lang = document.documentElement.lang || 'en';
        alert(msgs[lang] || msgs['en']);
        return;
    }
    
    const dynamicName = getFileNameFromUrl(urlInput);
    const link = document.createElement('a');
    link.download = dynamicName + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// --- LOGICA COOKIE ---
function acceptCookies() {
    document.getElementById('cookie-banner').style.display = 'none';
    localStorage.setItem('cookies_accepted', 'true');
}

document.addEventListener("DOMContentLoaded", function() {
    if (localStorage.getItem('cookies_accepted')) {
        const banner = document.getElementById('cookie-banner');
        if (banner) banner.style.display = 'none';
    }
});
