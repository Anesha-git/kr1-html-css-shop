/* =========================================================
   Bean&Leaf — минимальная JS-логика для КР №1
   Отвечает только за открытие/закрытие модального окна
   и показ сообщения об успешной отправке формы.
   ========================================================= */

(function () {
  'use strict';

  const dialog = document.getElementById('orderDialog');
  const form = document.getElementById('orderForm');
  const successMessage = document.getElementById('successMessage');

  /* ---------- ОТКРЫТИЕ МОДАЛКИ ---------- */
  document.querySelectorAll('[data-open-order]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (dialog) {
        dialog.showModal();
        document.body.style.overflow = 'hidden';
      }
    });
  });

  /* ---------- ЗАКРЫТИЕ МОДАЛКИ ---------- */
  document.querySelectorAll('[data-close-order]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (dialog) dialog.close();
      document.body.style.overflow = '';
    });
  });

  if (dialog) {
    dialog.addEventListener('close', function () {
      document.body.style.overflow = '';
    });

    /* Закрытие по клику на backdrop */
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) {
        dialog.close();
      }
    });
  }

  /* ---------- ОТПРАВКА ФОРМЫ ---------- */
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      /* Сбрасываем предыдущие подсветки ошибок */
      form.querySelectorAll('[aria-invalid="true"]').forEach(function (el) {
        el.removeAttribute('aria-invalid');
      });

      let valid = true;

      form.querySelectorAll('[required]').forEach(function (field) {
        const value = field.type === 'checkbox' ? field.checked : field.value.trim();

        if (!value) {
          valid = false;
          field.setAttribute('aria-invalid', 'true');
        }

        /* Дополнительная проверка e-mail */
        if (field.type === 'email' && value && !/^\S+@\S+\.\S+$/.test(field.value)) {
          valid = false;
          field.setAttribute('aria-invalid', 'true');
        }

        /* Дополнительная проверка телефона */
        if (field.type === 'tel' && value && !/^\+?[\d\s\-()]{10,}$/.test(field.value)) {
          valid = false;
          field.setAttribute('aria-invalid', 'true');
        }
      });

      if (!valid) {
        form.querySelector('[aria-invalid="true"]')?.focus();
        return;
      }

      /* Успешная отправка */
      form.reset();

      if (dialog && dialog.open) {
        dialog.close();
      }

      if (successMessage) {
        successMessage.hidden = false;
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(function () {
          successMessage.hidden = true;
        }, 5000);
      }
    });
  }
})();