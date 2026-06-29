// --- 1. GOOGLE ANALYTICS 4 ---
const GA_ID = 'G-V89RPQK476';
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
        'fr': '/fr/',
        'ru': '/ru/'
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

function downloadQR(format = 'png') {
    const canvas = document.getElementById('qr-canvas');
    const urlInput = document.getElementById('qr-input').value;
    
    if (!urlInput) {
        const msgs = { 'it': 'Inserisci un URL!', 'en': 'Enter a URL!', 'de': 'URL eingeben!', 'es': '¡Ingresa un URL!', 'fr': 'Entrez une URL!', 'ru': 'Введите URL!' };
        const lang = document.documentElement.lang || 'en';
        alert(msgs[lang] || msgs['en']);
        return;
    }
    
    const dynamicName = getFileNameFromUrl(urlInput);
    const link = document.createElement('a');

    if (format === 'svg') {
        // --- GENERAZIONE VETTORIALE (SVG) DIRETTAMENTE DA QRIOUS ---
        const symbol = qr.toDataURL().split(',')[1]; // Forza QRious a elaborare internamente
        const matrix = qr._qr.modules; // Accede alla matrice logica dei moduli (quadrati)
        const count = matrix.length;
        
        let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${count} ${count}" width="1000" height="1000" shape-rendering="crispEdges">\n`;
        svgContent += `  <rect width="${count}" height="${count}" fill="#ffffff"/>\n`;
        svgContent += `  <path fill="#000000" d="`;
        
        // Costruiamo il tracciato vettoriale unendo i quadratini neri
        for (let r = 0; r < count; r++) {
            for (let c = 0; c < count; c++) {
                if (matrix[r][c]) {
                    svgContent += `M${c} ${r}h1v1h-1z `;
                }
            }
        }
        
        svgContent += `"/>\n</svg>`;
        
        // Creiamo il file per il download dell'SVG
        const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
        link.href = URL.createObjectURL(blob);
        link.download = dynamicName + '.svg';
    } else {
        // --- GENERAZIONE STANDARD RASTER (PNG) ---
        link.href = canvas.toDataURL('image/png');
        link.download = dynamicName + '.png';
    }
    
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
// Funzione per aggiornare il testo dello slider e rigenerare il QR
function updateResolution(val) {
    document.getElementById('res-value').innerText = val;
    document.getElementById('res-value-alt').innerText = val;
    
    if (qr) {
        qr.size = val; // Aggiorna la dimensione dell'oggetto QRious
    }
}

// Modifica la tua funzione generateQR esistente se necessario
function generateQR() {
    const val = document.getElementById('qr-input').value;
    const size = document.getElementById('res-slider').value; // Legge lo slider
    
    if (val.trim() !== "" && qr) {
        qr.set({
            value: val,
            size: parseInt(size)
        });
    }
}
