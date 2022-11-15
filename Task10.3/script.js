const wsUri = "wss://echo-ws-service.herokuapp.com";
let websocket=new WebSocket(wsUri);
const btnSend=document.querySelector('.j-btn-send');
const btnGeoloc=document.querySelector('.geoloc');
const status = document.querySelector('#status');
const mapLink = document.querySelector('#map-link');

function writeToScreen(message){
    let pre=document.createElement("p");
    //pre.style.wordWrap="break-word";
    pre.innerHTML=message;
    messages.appendChild(pre);
};

// Функция, выводящая текст об ошибке
const error = () => {
  status.textContent = 'Невозможно получить ваше местоположение';
}
// Функция, срабатывающая при успешном получении геолокации
const success = (position) => {
  console.log('position', position);
  const latitude  = position.coords.latitude;
  const longitude = position.coords.longitude;

  status.textContent = `Широта: ${latitude} °, Долгота: ${longitude} °`;
  mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
  mapLink.textContent = 'Ссылка на карту';
}

btnSend.addEventListener('click',()=>{
    let message = document.getElementById('mess').value; 
    writeToScreen(message);
    websocket.send(message);
    websocket.onmessage = function(evt) {
        writeToScreen(
          '<span style="color: red;">ОТВЕТ СЕРВЕРА: ' + evt.data+'</span>'
        );
      };
});

btnGeoloc.addEventListener('click', () => {
  mapLink.href = '';
  mapLink.textContent = '';
  let gloc=navigator.geolocation.getCurrentPosition(success, error);
  if (!navigator.geolocation) {
    status.textContent = 'Geolocation не поддерживается вашим браузером';
  } else {
    status.textContent = 'Определение местоположения…';
    websocket.send(gloc);
    navigator.geolocation.getCurrentPosition(success, error);

  }
});
