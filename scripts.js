//Activar los Tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

//Elementos a manipular
const newQuoteButton = document.getElementById('new-quote');
const quote = document.getElementById('quote');
const quoteAuthor = document.getElementById('quote-author');
const twitterShare = document.getElementById('twitter-share');

// Variable para controlar si ya está en proceso de animación
let isAnimating = false;

// Función para hacer la animación y luego actualizar la frase y el autor
async function updateQuote() {
  if (isAnimating) {
    return; // Evitar que se hagan múltiples animaciones al mismo tiempo
  }

  try {
    isAnimating = true;

    // Hacer la animación de desvanecimiento
    quote.classList.remove('animate__fadeInLeft');
    quoteAuthor.classList.remove('animate__fadeInRight');

    quote.classList.add('animate__fadeOutLeft');
    quoteAuthor.classList.add('animate__fadeOutRight');

    await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo

    // Obtener nueva frase y autor
    const response = await fetch('https://api.breakingbadquotes.xyz/v1/quotes');

    if (!response.ok) {
      throw new Error('Network error');
    }

    const data = await response.json();

    // Actualizar frase y autor
    quote.textContent = data[0].quote;
    quoteAuthor.textContent = `- ${data[0].author}`;

    // Compartir en Twitter
    twitterShare.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(quote.textContent)}%0D%0A${encodeURIComponent(quoteAuthor.textContent)}`;

    // Hacer la animación de aparición
    quote.classList.remove('animate__fadeOutLeft');
    quote.classList.add('animate__fadeInLeft');
    quoteAuthor.classList.remove('animate__fadeOutRight');
    quoteAuthor.classList.add('animate__fadeInRight');

    isAnimating = false;
  } catch (error) {
    console.error('Error:', error);
    isAnimating = false;
  }
}

//Funcion para boton New quote se haga click se buscara una nueva frase
newQuoteButton.addEventListener('click', updateQuote);

// Cargar la primera frase sin animación al cargar la página
async function loadInitialQuote() {
  try {
    const response = await fetch('https://api.breakingbadquotes.xyz/v1/quotes');

    if (!response.ok) {
      throw new Error('Network error');
    }

    const data = await response.json();
    quote.textContent = data[0].quote;
    quoteAuthor.textContent = `- ${data[0].author}`;

    // Compartir en Twitter
    twitterShare.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(quote.textContent)}%0D%0A${encodeURIComponent(quoteAuthor.textContent)}`;
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Cargar la primera frase al cargar la página
window.addEventListener('load', loadInitialQuote);
