/*
  ELENCO DELLE OPERE
  -------------------------------------------------------------
  Per aggiungere un'opera:
  1. metti l'immagine grande (lato lungo circa 1600 px) in img/opere/
  2. metti la miniatura (lato lungo circa 420 px, stesso nome) in img/opere/mini/
  3. aggiungi una riga qui sotto.

  file   nome del file jpg
  n      nucleo: 0 = girotondi (cerchio esterno), 1 = hula hoop (cerchio interno)
  t      titolo mostrato nel visore
  c      colore di fondo del visore (di solito il colore della carta)
  scuro  true se il fondo è scuro e i testi devono diventare bianchi
  -------------------------------------------------------------
  I titoli qui sotto sono descrittivi: sostituirli con quelli dell'artista.
*/
const OPERE = [
  {file:'girotondo-ocra.jpg',         n:0, t:'Girotondo su fondo ocra',       c:'#E0A43C'},
  {file:'girotondo-giallo.jpg',       n:0, t:'Girotondo su fondo giallo',     c:'#E4D515'},
  {file:'girotondo-carminio.jpg',     n:0, t:'Girotondo su fondo carminio',   c:'#B3304A', scuro:true},
  {file:'girotondo-verde.jpg',        n:0, t:'Girotondo su fondo verde',      c:'#4DAE5B'},
  {file:'girotondo-ombre-lunghe.jpg', n:0, t:'Girotondo di ombre lunghe',     c:'#E9E7E1'},
  {file:'uomo-in-giacca.jpg',         n:1, t:"L'uomo in giacca",              c:'#ECECEA'},
  {file:'uomo-in-camicia.jpg',        n:1, t:"L'uomo in camicia",             c:'#2F9A45', scuro:true},
  {file:'cortile-dei-cerchi.jpg',     n:1, t:'Il cortile dei cerchi',         c:'#EFEDE8'},
  {file:'quattro-cerchi-grigio.jpg',  n:1, t:'Quattro cerchi su fondo grigio',c:'#7F8A99', scuro:true},
];
