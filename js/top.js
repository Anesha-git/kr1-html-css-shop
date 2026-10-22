// Фиксированная кнопка «Наверх».
const backToTopButton = document.getElementById('back-to-top');

// Показываем кнопку после прокрутки страницы на 300px.
window.addEventListener('scroll', () => {
  backToTopButton.classList.toggle('back-to-top--visible', window.scrollY > 300);
});

// По клику плавно возвращаемся в начало страницы.
backToTopButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
