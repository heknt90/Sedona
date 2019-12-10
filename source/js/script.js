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

    // Отменяем стандартный draggable
    range.handleMin.addEventListener('dragstart', onDragStart, false);
    range.handleMax.addEventListener('dragstart', onDragStart, false);

    //
    range.inputMin.addEventListener('change', onInputChange, false);
    range.inputMax.addEventListener('change', onInputChange, false);
  }

  var config = {
    // Минимальное ВОЗМОЖНОЕ значение цены
    minRange: 0,
    // Максимальное ВОЗМОЖНОЕ значение цены
    maxRange: 5000,
    // Значение минимальной цены до изменений
    defaultMin: 0,
    // Значение максимальной цены до изменений
    defaultMax: 3000
  }

  var range = {
    container: document.querySelector('.filter__price-range'),
    selected: document.querySelector('.filter__price-select'),
    handleMin: document.querySelector('.filter__price-handler_min'),
    handleMax: document.querySelector('.filter__price-handler_max'),
    inputMin: document.querySelector('#filter-price-input-min'),
    inputMax: document.querySelector('#filter-price-input-max')
  }

  var state = {
    // Текущее значение минимальной цены
    valueMin: config.defaultMin,
    // Отступ в пикселях от левого края range.container до ЛЕВОГО края range.selected
    distanceMin: function() {
      return convertNumtoPixs(this.valueMin)
    },
    // Текущее значение максимальной цены
    valueMax: config.defaultMax,
    // Отступ в пикселях от левого края range.container до ПРАВОГО края range.selected
    distanceMax: function() {
      return convertNumtoPixs(this.valueMax)
    }
  }

  var props = {
    // Смещение координаты курсора, на которой зажата мышка в данный момент, относительно фактической точки отсчета ползунка
    shiftX: 0,
    // Максимальный ЧИСЛОВОЙ диапозон значений цены
    numericalRange: function() {
      return config.maxRange - config.minRange;
    },
    // Минимальное значение для минимальной цены
    minRangePossibleValue: function() {
      return config.minRange;
    },
    // Максимальное значение для минимальной цены
    maxMinPossibleValue: function() {
      return state.valueMax;
    },
    // Минимальное значение для максимальной цены
    minMaxPossibleValue: function() {
      return state.valueMin;
    },
    // Максимальное значение для максимальной цены
    maxRangePossibleValue: function() {
      return config.maxRange;
    }
  }

  setDefaults();

  // События Левого ползунка
  
  function onMouseDownHandlerMin(event) {
    props.shiftX = event.pageX - getCoords(range.selected).left;
    
    // Вешаем событие перетаскивания ползунка
    document.addEventListener('mousemove', onMouseMoveHandlerMin, false)
  }
  
  function onMouseMoveHandlerMin() {    
    var newLeft = event.pageX - getCoords(range.container).left - props.shiftX;

    // Определяем максимальное и минимальное значение, в котором может двигаться ползунок минимальной цены
    var min = convertNumtoPixs(props.minRangePossibleValue());
    var max = convertNumtoPixs(props.maxMinPossibleValue());

    if (newLeft < min) newLeft = min;
    if (newLeft > max) newLeft = max;
    
    // Конвертируем положение ползунка в цену
    var value = convertPixsToNum(newLeft);
    
    // Применяем полученное значение
    setCoordinate(range.handleMin, newLeft);
    setInputValue(range.inputMin, value);

    state.valueMin = Math.floor(value);
    range.inputMin.defaultValue = state.valueMin;
    
    document.addEventListener('mouseup', onMouseUpHandlerMin, false);
  }
  
  function onMouseUpHandlerMin() {
    console.log(state);
    document.removeEventListener('mousemove', onMouseMoveHandlerMin);
    return false;
  }


  /////////////////////////////////////////////////////////////////

  // События правого ползунка

  function onMouseDownHandlerMax() {
    props.shiftX = event.pageX - getCoords(range.selected).right;

    document.addEventListener('mousemove', onMouseMoveHandlerMax, false);
  }

  function onMouseMoveHandlerMax() {
    var newLeft = event.pageX - getCoords(range.container).left - props.shiftX;

    // Определяем максимальное и минимальное значение, в котором может двигаться ползунок минимальной цены
    var min = convertNumtoPixs(props.minMaxPossibleValue());
    var max = convertNumtoPixs(props.maxRangePossibleValue());

    if (newLeft < min) newLeft = min;
    if (newLeft > max) newLeft = max;
    
    // Конвертируем положение ползунка в цену
    var value = convertPixsToNum(newLeft);
    
    // Применяем полученное значение
    setCoordinate(range.handleMax, newLeft);
    setInputValue(range.inputMax, value);

    state.valueMax = Math.floor(value);
    range.inputMax.defaultValue = state.valueMax;
    
    document.addEventListener('mouseup', onMouseUpHandlerMax, false);
  }
  
  function onMouseUpHandlerMax() {
    console.log(state);
    document.removeEventListener('mousemove', onMouseMoveHandlerMax, false);
    return false;
  }

  function onDragStart() {
    event.preventDefault();
  }

  function onInputChange(event) {
    var newValue = event.target.value;
    
    if (event.target.dataset.range === 'input-min') {
      if (!checkNewValue('min', newValue)) {
        event.target.value = event.target.defaultValue;
        return false;
      }
      event.target.defaultValue = newValue;
      setCoordinate(range.handleMin, convertNumtoPixs(newValue));
      state.valueMin = newValue;
    }
    if (event.target.dataset.range === "input-max") {   
      if (!checkNewValue('max', newValue)) {
        event.target.value = event.target.defaultValue;
        return false;
      }
      event.target.defaultValue = newValue;
      setCoordinate(range.handleMax, convertNumtoPixs(newValue));
      state.valueMax = newValue;
    }

    console.log(state);
  }

  function checkNewValue(type, value) {
    if (!isFinite(value)) {
      return false;
    }
    if(type === "min") {
      if (value < props.minRangePossibleValue() || value > props.maxMinPossibleValue()) {
        return false;
      }
      return true;
    }

    if (type === "max") {
      if (value < props.minMaxPossibleValue() || value > props.maxRangePossibleValue()) {
        return false;
      }
      return true;
    }
  }
  
  // function cancelEvent(event) {
  //   event.preventDefault();
  //   return false;
  // }

  // Вспомогательные функции

  function getCoords(element) {
    var coords = element.getBoundingClientRect();
    return {
      left: coords.left,
      right: coords.right
    };
  }

  // Получить расстояние из цены
  function convertNumtoPixs(value) {
    return value * range.container.offsetWidth / props.numericalRange();
  }

  // Получить цену из расстояния
  function convertPixsToNum(value) {
    var result = value * props.numericalRange() / range.container.offsetWidth;
    return result;
  }

  // Установить новое значение input
  function setInputValue(target, value) {
    // console.log(value);
    target.value = Math.floor(value);
  }

  // Установить новое положение ползунка
  function setCoordinate(target, value) {
    if (target.dataset.range === "handler-min") {
      range.selected.style.left = value + 'px';
    }
    if (target.dataset.range === "handler-max") {
      // Здесь нужно установить отступ не слева, а справа у элемента выделения
      range.selected.style.right = range.container.offsetWidth - value + 'px';
    }
  }

  function setDefaults() {
    setInputValue(range.inputMin, config.defaultMin);
    setInputValue(range.inputMax, config.defaultMax);

    setCoordinate(range.handleMin, convertNumtoPixs(config.defaultMin));
    setCoordinate(range.handleMax, convertNumtoPixs(config.defaultMax));
  }

}());

// Подключаем скрипт работы с всплывающей формой
popup();
// Подключаем скрипт работы с двойным ползунком выбора цен
doubleRange();