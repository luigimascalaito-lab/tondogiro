# tondogiro · Mostra di Erasmo Pucci

Web app della mostra *tondogiro* (Pieve di San Giovanni Battista, San Giovanni Valdarno, 18–27 settembre 2026). È un sito statico: nessun database, nessun server da configurare. Basta caricare la cartella su un qualsiasi servizio di hosting.

## Contenuto della cartella

```
index.html              pagina principale (testi della mostra)
css/style.css           grafica
js/opere.js             ELENCO DELLE OPERE: titoli, colori, nuclei
js/app.js               funzionamento (cerchi, visore, zoom, lente)
img/opere/              immagini grandi per il visore
img/opere/mini/         miniature per i cerchi (stesso nome)
img/icone/              favicon e icone per l'installazione su telefono
img/anteprima-social.jpg   immagine che compare condividendo il link
fonts/                  caratteri Jost e Caveat Brush, ospitati in locale
manifest.webmanifest    permette di installare la app sulla schermata Home
sw.js                   funzionamento anche senza rete, dopo la prima visita
_headers, robots.txt    file di servizio
```

## Pubblicazione

La via più semplice è Netlify Drop: si apre app.netlify.com/drop, si trascina l'intera cartella `tondogiro` nella pagina e in pochi secondi si ottiene un indirizzo pubblico, che poi si può rinominare (per esempio `tondogiro.netlify.app`) o collegare a un dominio proprio. In alternativa funzionano allo stesso modo GitHub Pages, Cloudflare Pages o lo spazio web del Comune o dell'artista: si caricano i file mantenendo le cartelle così come sono.

Il sito va servito tramite `https`. Aprendo `index.html` con un doppio clic dal computer la pagina funziona, ma la modalità senza rete e l'installazione sul telefono si attivano solo online.

## Dopo aver ottenuto l'indirizzo definitivo

1. In `index.html` sostituire le due occorrenze di `INDIRIZZO-DEL-SITO` con l'indirizzo reale (per esempio `tondogiro.netlify.app`), così l'anteprima su WhatsApp e sui social mostra l'immagine della mostra.
2. Preparare un QR code che punti all'indirizzo, da stampare accanto ai pannelli in pieve.

## Aggiungere o modificare le opere

La mostra conta 18 opere; ne sono presenti 9. Per aggiungerne una:

1. salvare l'immagine grande (lato lungo circa 1600 px, jpg) in `img/opere/`;
2. salvare la miniatura (lato lungo circa 420 px, stesso nome) in `img/opere/mini/`;
3. aggiungere una riga in `js/opere.js` seguendo le istruzioni scritte in testa al file (nucleo 0 = girotondi, cerchio esterno; nucleo 1 = hula hoop, cerchio interno);
4. in `sw.js` aggiungere i due nuovi percorsi all'elenco `FILE` e aumentare `VERSIONE` (per esempio da `tondogiro-v1` a `tondogiro-v2`), altrimenti chi ha già visitato il sito continua a vedere la versione precedente.

I cerchi si ridistribuiscono da soli in base al numero di opere. Con nove o dieci opere per cerchio conviene ridurre la dimensione delle miniature: in `js/app.js`, nella funzione `disegna`, i valori `0.115` (cerchio esterno) e `0.095` (cerchio interno) indicano la larghezza di ogni opera in proporzione al cerchio.

I titoli attuali sono descrittivi e vanno sostituiti con quelli dell'artista, se esistono. Le immagini sono ricavate da fotografie scattate in mostra; con le scansioni o i file originali la lente e lo zoom renderanno molto meglio.

## Privacy

Il sito non usa cookie, non raccoglie dati e non contatta server esterni: anche i caratteri tipografici sono ospitati nella cartella `fonts/`. Per questo non serve alcun banner per i cookie.

## Crediti

Opere e testi: Erasmo Pucci. Caratteri: Jost (Indestructible Type) e Caveat Brush (Impallari Type), entrambi con licenza SIL Open Font License.
