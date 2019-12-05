'use strict'

var orderPopup = {
  toggleButton: document.getElementById('order-button-toggle'),
  popupForm: document.getElementById('order-form-popup')
}

// console.log(orderPopup.popupForm.classList);

if (orderPopup.popupForm) {
  orderPopup.toggleButton.addEventListener('click', toggleOrderForm(orderPopup.popupForm, 'order__form_hidden'), false);
}

function toggleOrderForm(popup, className) {
  return function() {
    popup.classList.toggle(className);
  }
}

function check(foo) {
  return (foo) ? true : false;
}

// var modalCheckbox = document.querySelector("#toggle-booking-form-checkbox");

// Так как данная реализация кнопки открывается засчет состояния выбора/снятия
// checkbox'а, то вешать прикреплять данную функцию к кнопке нет необходимости,
// т.к. она и так работает на чистом CSS.

// Дополнительное требование п.4.1 говорит о том, что модальное окно должно
// открываться засчет JavaScript. Выполнять это лучше с использованием css классов,
// а вместо checkbox лучше использовать обычную кнопку. Но в таком случае при
// отключенном JavaScript пользователи не смогут воспользоваться данным модальным окном

// Как вариант п.4.1 можно реализовать в другой ветке git 
// function modalViewToggle_test() {
//   if (modalCheckbox) {
//     modalCheckbox.checked = !modalCheckbox.checked;
//   }
// }

// window.onload = function() {
//   modalViewToggle_test();
// }
