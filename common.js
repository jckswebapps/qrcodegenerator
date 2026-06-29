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

// --- FUNZIONE 1: DOWNLOAD PNG (Usa la libreria QRious attuale) ---
function downloadPNG() {
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
    link.download = dynamicName + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// --- FUNZIONE 2: DOWNLOAD SVG VETTORIALE (Usa qrcode-generator) ---
function downloadSVG() {
    const urlInput = document.getElementById('qr-input').value;
    
    if (!urlInput) {
        const msgs = { 'it': 'Inserisci un URL!', 'en': 'Enter a URL!', 'de': 'URL eingeben!', 'es': '¡Ingresa un URL!', 'fr': 'Entrez une URL!', 'ru': 'Введите URL!' };
        const lang = document.documentElement.lang || 'en';
        alert(msgs[lang] || msgs['en']);
        return;
    }
    
    try {
        const dynamicName = getFileNameFromUrl(urlInput);
        
        // Inizializziamo il generatore di QR vettoriale (0 = calcolo automatico della dimensione della griglia)
        // Livello 'H' per la massima correzione dell'errore (come richiesto dagli standard del tuo sito)
        const typeNumber = 0; 
        const errorCorrectionLevel = 'H';
        const qrcode = qrcodeAlgo(typeNumber, errorCorrectionLevel);
        
        qrcode.addData(urlInput);
        qrcode.make();
        
        // Estraiamo la matrice logica pulita dei moduli
        const count = qrcode.getModuleCount();
        
        // Creiamo la struttura dell'SVG. L'attributo fill-rule="evenodd" e un unico tag <path> 
        // dicono ad Illustrator che si tratta di un singolo tracciato composto unito!
        let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${count} ${count}" width="1000" height="1000" shape-rendering="crispEdges">\n`;
        svgContent += `  <rect width="${count}" height="${count}" fill="#ffffff"/>\n`;
        svgContent += `  <path fill="#000000" fill-rule="evenodd" d="`;
        
        // Algoritmo di ottimizzazione geometrica delle righe per eliminare la griglia di quadratini
        for (let r = 0; r < count; r++) {
            let c = 0;
            while (c < count) {
                if (qrcode.isDark(r, c)) {
                    let start = c;
                    while (c < count && qrcode.isDark(r, c)) {
                        c++;
                    }
                    let width = c - start;
                    svgContent += `M${start} ${r}h${width}v1h-${width}z `;
                } else {
                    c++;
                }
            }
        }
        
        svgContent += `"/>\n</svg>`;
        
        // Download sicuro e istantaneo compatibile con tutti i browser
        const link = document.createElement('a');
        link.href = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent);
        link.download = dynamicName + '.svg';
        link.click();
        
    } catch (error) {
        console.error("Errore nella generazione dell'SVG:", error);
        alert("Errore durante la generazione dell'SVG. Utilizza il formato PNG.");
    }
}

// Nota tecnica di sicurezza: la libreria qrcode-generator espone la funzione globale come 'qrcode'
// Per evitare conflitti con la tua variabile globale 'let qr', la mappiamo internamente come 'qrcodeAlgo'
const qrcodeAlgo = window.qrcode;

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
