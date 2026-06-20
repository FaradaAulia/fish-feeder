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

async function feedFish() {

  const response =
    await fetch(
      '/api/feed',
      {
        method: 'POST'
      }
    )

  const data =
    await response.json()

  if (data.success) {

    alert(
      'Perintah memberi pakan dikirim'
    )

  } else {

    alert(
      'Gagal mengirim perintah'
    )

  }
}

document
  .getElementById('feedBtn')
  .addEventListener(
    'click',
    feedFish
  )

loadSensor()

setInterval(
  loadSensor,
  5000
)