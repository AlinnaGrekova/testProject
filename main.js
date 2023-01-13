
  //Обьект для обновления маркеров промахов и попаданий
  var view ={
    displayMessage: function(mes){//Вывод сообщения
      var messageArea = document.getElementById("messageArea");
      messageArea.innerHTML = mes;
      messageArea.style.fontSize='50px';
    },

    displayHit: function(location){//Вывод маркера попадание
      var cell = document.getElementById(location);
      cell.setAttribute("class", "hit");
    },

    displayMiss: function(location){//Вывод маркера промах
      var cell = document.getElementById(location);
      cell.setAttribute("class", "miss");
    }
  }


  //Обьект модели 
  var model={
  boardSize:7, //размер игрового поля
  numShips:3, //количество корабле в игре
  shipLength: 3, //длина корабля в клетках
  shipSunk: 0, //текущее количесвто потопленных кораблей
  // ships: //координаты 3-х короблей
  // [{locations: ["06", "16", "26"], hits: ["", "", ""] },
  // {locations: ["24", "34", "44"], hits: ["", "", ""] },
  // {locations: ["10", "11", "12"], hits: ["", "", ""] }],
  ships: [ { locations: [0, 0, 0], hits: ["", "", ""] },
 { locations: [0, 0, 0], hits: ["", "", ""] },
 { locations: [0, 0, 0], hits: ["", "", ""] } ],
  fire: function(guess) { //метод, который реализует выстрел в ячейку
  for(var i=0; i<this.numShips; i++)
  {
    var ship=this.ships[i];
    var index=ship.locations.indexOf(guess);
    if(index>=0){
      ship.hits[index]= "hit";
      view.displayHit(guess);
      view.displayMessage("Корабль ранен");
      if(this.isSunk(ship)){
        view.displayMessage("Вы потопили корабль");
        this.shipSunk++;
      }
      return true;
    }
  }
  view.displayMiss(guess);
  view.displayMessage("Мимо");
  return false;
  },
  isSunk: function(ship){// метод, который проверяет потоплен ли весь корабль
    for(var i=0; i<this.shipLength; i++){
      if(ship.hits[i]!== "hit"){
        return false;
      }
    }
    return true;
  },
  generateShipLocations: function(){
    var locations;
    for (var i=0; i<this.numShips; i++){
      do{
        locations=this.generateShip();
      }
      while(this.collision(locations));
      this.ships[i].locations=locations;
    }
  },
  generateShip: function() {
    var direction = Math.floor(Math.random() * 2);
    var row, col;
    if (direction === 1) {
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
    } else {
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
      col = Math.floor(Math.random() * this.boardSize);
    }
    var newShipLocations = [];
  for (var i = 0; i < this.shipLength; i++) {
  if (direction === 1) {
  newShipLocations.push(row + "" +(col + i));
  } else {
  newShipLocations.push((row+i)+"+col");
  }
  }
  return newShipLocations;
  },
  collision: function(locations) {
    for (var i = 0; i < this.numShips; i++) {
    var ship = model.ships[i];
    for (var j = 0; j < locations.length; j++) {
    if (ship.locations.indexOf(locations[j]) >= 0) {
    return true;
    }
    }
    }
    return false;
   }
  };

  //Объект контролер
  var controller={
    guesses: 0, //количество выстрелов
    processGuess: function(guess){//метод для обработки координат выстрела (из А2 в 02) так же проверка завершения игры
      var location=parseGuess(guess);
      if(location){
        this.guesses++;
        var hit = model.fire(location);
        if(hit && model.shipSunk===model.numShips){
          view.displayMessage("Вы потопили все корабли за "+ this.guesses+" выстрелов")
        }
      }
    }
  };

  function parseGuess(guess){ // Функия для проверки корректности введенного координата
    var alfabet = ["A", "B", "C", "D", "E", "F", "G"];
    if (guess===null || guess.length !==2 ){
      alert("Упсс, введите правильные координаты");
    }
    else{
      firstChar=guess.charAt(0);
      var row =alfabet.indexOf(firstChar);
      var column = guess.charAt(1);

      if(isNaN(row) || isNaN(column)){
        alert("Упсс, координата не соответствуют игровому полю");
      }
      else if(row<0 || column>=model.boardSize || column < 0 || column>=model.boardSize){
        alert("Упсс, это не по правилам");
      }
      else{
        return row+column;
      }
    }
    return null;
  }

  

  //функия для передачи значения с кнопки ОГОНЬ в объект контролер
  function handleFireButton() {
    var guessInput = document.getElementById("guessInput");
   var guess = guessInput.value.toUpperCase();
    controller.processGuess(guess);
    guessInput.value = "";
   }
   

  function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");
    e=e || window.event;
      if (e.keyCode === 13) {
      fireButton.click();
      return false;
      }
  }
  window.onload = init;
  //функция назначает обработчик события кнопке ОГОНЬ 
  function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress= handleKeyPress;
    model.generateShipLocations();
   }



