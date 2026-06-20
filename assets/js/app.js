async function loadSensor() {

  const response =
    await fetch('/api/latest')

  const data =
    await response.json()

  document.getElementById('suhu')
    .innerText =
    (data.suhu ?? '--') + ' °C'

  document.getElementById('kelembapan')
    .innerText =
    (data.kelembapan ?? '--') + ' %'
}

loadSensor()

setInterval(loadSensor, 5000)