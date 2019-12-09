'use strict'

// Работа с формой
;(function() {
  window.popup = openBookingForm;

  // Ищем элементы, с которыми будем взаимодействовать (кнопка и popup)
  var orderPopup = {
    toggleButton: document.getElementById('order-button-toggle'),
    popupForm: document.getElementById('order-form-popup')
  }
    
  function openBookingForm() {
    if (orderPopup.popupForm) {
      orderPopup.toggleButton.addEventListener('click', toggleOrderForm(orderPopup.popupForm, 'order__form_hidden'), false);
    }
  }
  
  function toggleOrderForm(popup, className) {
    return function() {
      popup.classList.toggle(className);
    }
  }
  
}());

// Работа с 
;(function() {
  window.doubleRange = doubleRange;

  function doubleRange() {
    range.handleMin.addEventListener('mousedown', onMouseDownHandlerMin, false);
    range.handleMax.addEventListener('mousedown', onMouseDownHandlerMax, false);
  
  }

  var config = {
    minRange: 0,
    maxRange: 5000,
    defaultMin: 0,
    defaultMax: 3000
  }

  var range = {
    container: document.querySelector('.filter__price-range'),
    selected: document.querySelector('.filter__price-select'),
    handleMin: document.querySelector('.filter__price-handler_min'),
    handleMax: document.querySelector('.filter__price-handler_max')
  }

  var state = {
    valueMin: config.defaultMin,
    valueMax: config.defaultMax
  }

  var props = {

  }

  // События Левого ползунка
  
  function onMouseDownHandlerMin(event) {
    var shiftX = event.pageX - getCoords(range.selected).left;
    console.log(shiftX);
  
    document.addEventListener('mousemove', onMouseMoveHandlerMin)
  }

  function onMouseMoveHandlerMin(){
    console.log('Left move!');
    
    document.addEventListener('mouseup', onMouseUpHandlerMin);
  }

  function onMouseUpHandlerMin() {
    document.removeEventListener('mousemove', onMouseMoveHandlerMin);
  }

  // События правого ползунка

  function onMouseDownHandlerMax() {
    var shiftX = event.pageX - getCoords(range.selected).left;
    console.log(shiftX);
    
    document.addEventListener('mousemove', onMouseMoveHandlerMax)
  }

  function onMouseMoveHandlerMax() {
    console.log('Right move!');
    
    document.addEventListener('mouseup', onMouseUpHandlerMax);
  }

  function onMouseUpHandlerMax() {
    document.removeEventListener('mousemove', onMouseMoveHandlerMax);
  }


  // Вспомогательные функции

  function getCoords(element) {
    var coords = element.getBoundingClientRect();
    return {
      left: coords.left,
      right: coords.right
    };
  }

}());

// Подключаем скрипт работы с всплывающей формой
popup();
// Подключаем скрипт работы с двойным ползунком выбора цен
doubleRange();