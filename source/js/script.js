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

  // Объект виджета с ключевыми элементами
  var range = {
    container: document.querySelector('.filter__price-range'),
    selected: document.querySelector('.filter__price-select'),
    handleMin: document.querySelector('.filter__price-handler_min'),
    handleMax: document.querySelector('.filter__price-handler_max'),
    inputMin: document.querySelector('#filter-price-input-min'),
    inputMax: document.querySelector('#filter-price-input-max')
  }

  var check = {
    handlers: function() {
      return (range.container && range.handleMin && range.handleMax);
    },
    inputs: function() {
      return range.container && range.inputMin && range.inputMax
    }
  }

  function doubleRange() {
    if (check.handlers()) {
      // Создаем кастомизированный draggable
      range.handleMin.addEventListener('mousedown', onMouseDownHandlerMin, false);
      range.handleMax.addEventListener('mousedown', onMouseDownHandlerMax, false);
  
      // touch события
      range.handleMin.addEventListener('touchstart', onTouchStartHandlerMin, false);
      range.handleMax.addEventListener('touchstart', onTouchStartHandlerMax, false);
  
      // Отменяем стандартный draggable
      range.handleMin.addEventListener('dragstart', onDragStart, false);
      range.handleMax.addEventListener('dragstart', onDragStart, false);
    }

    if (check.inputs()) {
      // Вешаем обработчики событий для полей ввода
      range.inputMin.addEventListener('change', onInputChange, false);
      range.inputMax.addEventListener('change', onInputChange, false);
    }

  }

  // Настройки диапазона цен
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


  // Главные параметры состояния
  var state = {
    // Текущее значение минимальной цены
    valueMin: config.defaultMin,
    // Отступ в пикселях от левого края range.container до ЛЕВОГО края range.selected 
    // Если сократить количество конвертаций, погрешность будет менее вероятна
    distanceMin: function() {
      return convertNumtoPixs(this.valueMin)
    },
    // Текущее значение максимальной цены
    valueMax: config.defaultMax,
    // Отступ в пикселях от левого края range.container до ПРАВОГО края range.selected
    // Если сократить количество конвертаций, погрешность будет менее вероятна
    distanceMax: function() {
      return convertNumtoPixs(this.valueMax)
    }
  }

  // Вспомогательные свойства, которые не имеют отношение к состоянию, но к которым необходим доступ
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

  // Сразу после получения узлов, приводим положения ползунков и значения в полях в рабочее состояние
  // в соответствии с состоянием виджета
  if (check.handlers()) {
    setDefaults();
  }

  // Обработчик зажатия Левого ползунка
  function onMouseDownHandlerMin(event) {
    // Получаем смещение ползунка относительно координаты курсора
    props.shiftX = event.pageX - getCoords(range.selected).left;
    
    // Вешаем событие перетаскивания ползунка
    document.addEventListener('mousemove', onMouseMoveHandlerMin, false)
  }
  
  // Обработчик перемещения Левого ползунка
  function onMouseMoveHandlerMin() {    
    //Вычисляем положение ползунка относительно левого края
    var newLeft = event.pageX - getCoords(range.container).left - props.shiftX;

    // Определяем максимальное и минимальное значение, в котором может двигаться ползунок минимальной цены

    newLeft = correctHandlerPosition(newLeft, props.minRangePossibleValue(), props.maxMinPossibleValue())
    
    // Конвертируем положение ползунка в цену
    var value = convertPixsToNum(newLeft);
    
    // Применяем полученное значение
    setCoordinate(range.handleMin, newLeft);
    setInputValue(range.inputMin, Math.floor(value));

    // Изменяем состояние, полученное засчет смещения ползунка мышью
    state.valueMin = Math.floor(value);
    // Сохраняем последнее значение минимальной цены в атрибуте value поля ввода
    range.inputMin.defaultValue = state.valueMin;
    
    // Прекращаем все взаимодействия при "отжатии" кнопки мыши
    document.addEventListener('mouseup', onMouseUpHandlerMin, false);
  }
  
  // Обработчик события mouseup для Левого ползунка
  function onMouseUpHandlerMin() {
    // console.log(state);
    document.removeEventListener('mousemove', onMouseMoveHandlerMin);
    return false;
  }


  /////////////////////////////////////////////////////////////////

  // События правого ползунка

  // Обработчик зажатия правого ползунка 
  function onMouseDownHandlerMax() {
    // Получаем смещение ползунка относительно положения курсора мыши
    props.shiftX = event.pageX - getCoords(range.selected).right;

    // Вешаем обработчик при перемещении ползунка
    document.addEventListener('mousemove', onMouseMoveHandlerMax, false);
  }

  function onMouseMoveHandlerMax() {
    // Получаем положение правого ползунка относительно левого края виджета
    var newLeft = event.pageX - getCoords(range.container).left - props.shiftX;

    // Определяем максимальное и минимальное значение, в котором может двигаться ползунок минимальной цены
    newLeft = correctHandlerPosition(newLeft, props.minMaxPossibleValue(), props.maxRangePossibleValue())
    
    // Конвертируем положение ползунка в цену
    var value = convertPixsToNum(newLeft);
    
    // Применяем полученное значение
    setCoordinate(range.handleMax, newLeft);
    setInputValue(range.inputMax, Math.floor(value));

    // Изменяем состояние виджета
    state.valueMax = Math.floor(value);
    // Сохраняем последнее значение максимальной цены в атрибуте value поля ввода
    range.inputMax.defaultValue = state.valueMax;
    
    // Прекращаем все взаимодействия при отжатии кнопки мыши на правом ползунке
    document.addEventListener('mouseup', onMouseUpHandlerMax, false);
  }
  
  function onMouseUpHandlerMax() {
    // console.log(state);
    document.removeEventListener('mousemove', onMouseMoveHandlerMax, false);
    return false;
  }


  function onDragStart() {
    event.preventDefault();
  }

  // Обработчик изменения значения внутри поля цены
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

    // console.log(state);
  }

  function onTouchStartHandlerMin(event) {
    // Получаем смещение ползунка относительно координаты зажатия
    props.shiftX = event.touches[0].pageX - getCoords(range.selected).left;
    
    // Вешаем событие перетаскивания ползунка
    document.addEventListener('touchmove', onTouchMoveHandlerMin, false)
  }

  function onTouchMoveHandlerMin(event) {
    //Вычисляем положение ползунка относительно левого края виджета
    var newLeft = event.touches[0].pageX - getCoords(range.container).left - props.shiftX;
    
    // Определяем максимальное и минимальное значение, в котором может двигаться ползунок минимальной цены

    newLeft = correctHandlerPosition(newLeft, props.minRangePossibleValue(), props.maxMinPossibleValue())
    
    // Конвертируем положение ползунка в цену
    var value = convertPixsToNum(newLeft);
    
    // Применяем полученное значение
    setCoordinate(range.handleMin, newLeft);
    setInputValue(range.inputMin, Math.floor(value));

    // Изменяем состояние, полученное засчет смещения ползунка по горизонтали
    state.valueMin = Math.floor(value);
    // Сохраняем последнее значение минимальной цены в атрибуте value поля ввода
    range.inputMin.defaultValue = state.valueMin;
    
    // Прекращаем все взаимодействия при завершении touch нажатия
    document.addEventListener('touchend', onTouchEndHandlerMin, false);
  }

  function onTouchEndHandlerMin(event) {
    document.removeEventListener('touchmove', onTouchMoveHandlerMin);
    return false;
  }

  function onTouchStartHandlerMax(event) {
    // Получаем смещение ползунка относительно нажатия
    props.shiftX = event.touches[0].pageX - getCoords(range.selected).right;

    // Вешаем обработчик при перемещении ползунка
    document.addEventListener('touchmove', onTouchMoveHandlerMax, false);
  }

  function onTouchMoveHandlerMax(event) {
    // Получаем положение правого ползунка относительно левого края виджета
    var newLeft = event.touches[0].pageX - getCoords(range.container).left - props.shiftX;

    // Определяем максимальное и минимальное значение, в котором может двигаться ползунок минимальной цены
    newLeft = correctHandlerPosition(newLeft, props.minMaxPossibleValue(), props.maxRangePossibleValue())
    
    // Конвертируем положение ползунка в цену
    var value = convertPixsToNum(newLeft);
    
    // Применяем полученное значение
    setCoordinate(range.handleMax, newLeft);
    setInputValue(range.inputMax, Math.floor(value));

    // Изменяем состояние виджета
    state.valueMax = Math.floor(value);
    // Сохраняем последнее значение максимальной цены в атрибуте value поля ввода
    range.inputMax.defaultValue = state.valueMax;
    
    // Прекращаем все взаимодействия при завершении нажатия на правом ползунке
    document.addEventListener('touchend', onTouchEndHandlerMax, false);
  }

  function onTouchEndHandlerMax(event) {
    document.removeEventListener('touchmove', onTouchMoveHandlerMax);
    return false;
  }

  // Наверное это проверка корректности значения цены. Должно быть числом в определенном диапозоне значений
  function checkNewValue(type, value) {
    if (!isFinite(value)) {
      return false;
    }
    if (type === "min") {
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

  // Вспомогательные функции

  // Данная функция возвращает правую и левую координату переданного ей элемента
  function getCoords(element) {
    var coords = element.getBoundingClientRect();
    return {
      left: coords.left,
      right: coords.right
    };
  }

  // Получить расстояние из цены
  function convertNumtoPixs(value) {
    // Оступ слева = Значение цены * Ширина рабочей области виджета / Разбег цен
    return value * range.container.offsetWidth / props.numericalRange();
  }

  // Получить цену из расстояния
  function convertPixsToNum(value) {
    // Значение цены = Отступ слева * Разбег цен / ширина рабочей области виджета 
    var result = value * props.numericalRange() / range.container.offsetWidth;
    return result;
  }

  // Установить новое значение input
  function setInputValue(target, value) {
    // console.log(value);
    target.value = value;
  }

  // Установить новое положение ползунка
  function setCoordinate(target, value) {
    // Цель поставить css-правило left или right для левого или правого ползунка соответственно
    if (target.dataset.range === "handler-min") {
      range.selected.style.left = value + 'px';
    }
    if (target.dataset.range === "handler-max") {
      // Здесь нужно установить отступ не слева, а справа у элемента выделения
      range.selected.style.right = range.container.offsetWidth - value + 'px';
    }
  }

  // Установить значение по умолчанию (из конфига)
  function setDefaults() {
    setInputValue(range.inputMin, config.defaultMin);
    setInputValue(range.inputMax, config.defaultMax);

    setCoordinate(range.handleMin, convertNumtoPixs(config.defaultMin));
    setCoordinate(range.handleMax, convertNumtoPixs(config.defaultMax));
  }

  // Корректируем значение цены, чтобы оно не выходило за пределы нужного диапозона
  function correctHandlerPosition(value, left, right) {
    var min = convertNumtoPixs(left);
    var max = convertNumtoPixs(right);

    if (value < min) value = min;
    if (value > max) value = max;

    return value;
  }

}());

// Подключаем скрипт работы с всплывающей формой
popup();
// Подключаем скрипт работы с двойным ползунком выбора цен
doubleRange();