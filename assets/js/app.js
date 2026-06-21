let chart = null;

// ====================
// SENSOR TERBARU
// ====================

async function loadSensor()
{
  const response =
    await fetch('/api/latest');

  const data =
    await response.json();

  document.getElementById('suhu')
    .innerText =
    (data.suhu ?? '--') + ' °C';

  document.getElementById('kelembapan')
    .innerText =
    (data.kelembapan ?? '--') + ' %';

  // Status lingkungan

  let status =
    '🟢 Normal';

  if (data.suhu > 32)
  {
    status =
      '🔴 Suhu Terlalu Tinggi';
  }
  else if (data.suhu > 30)
  {
    status =
      '🟡 Perlu Perhatian';
  }

  document.getElementById('status')
    .innerText =
    status;
}

// ====================
// GRAFIK
// ====================

async function loadChart()
{
  const response =
    await fetch('/api/history');

  const data =
    await response.json();

  const labels =
    data.map((item, index) =>
      index + 1
    );

  const suhu =
    data.map(item =>
      item.suhu
    );

  const kelembapan =
    data.map(item =>
      item.kelembapan
    );

  const ctx =
    document
      .getElementById('sensorChart')
      .getContext('2d');

  if (chart)
  {
    chart.destroy();
  }

  chart =
    new Chart(ctx,
    {
      type: 'line',

      data:
      {
        labels,

        datasets:
        [
          {
            label: 'Suhu',
            data: suhu,
            borderColor: '#ef4444',
            tension: .4
          },

          {
            label: 'Kelembapan',
            data: kelembapan,
            borderColor: '#3b82f6',
            tension: .4
          }
        ]
      }
    });
}

// ====================
// FEED HISTORY
// ====================

async function loadFeedHistory()
{
  const response =
    await fetch(
      '/api/feed-history'
    );

  const data =
    await response.json();

  const ul =
    document.getElementById(
      'feed-history'
    );

  ul.innerHTML = '';

  data.forEach(item =>
  {
    const li =
      document.createElement(
        'li'
      );

    li.innerText =
      new Date(
        item.created_at
      ).toLocaleString();

    ul.appendChild(li);
  });
}

// ====================
// FEED IKAN
// ====================

async function feedFish()
{
  const btn =
    document.getElementById(
      'feedBtn'
    );

  btn.disabled = true;

  btn.innerText =
    '🐟 Memberi Pakan...';

  const response =
    await fetch(
      '/api/feed',
      {
        method: 'POST'
      }
    );

  const data =
    await response.json();

  if (data.success)
  {
    btn.innerText =
      '✅ Berhasil';

    loadFeedHistory();
  }
  else
  {
    btn.innerText =
      '❌ Gagal';
  }

  setTimeout(() =>
  {
    btn.disabled = false;

    btn.innerText =
      '🐟 Beri Pakan';
  }, 3000);
}

// ====================
// DEVICE STATUS
// ====================

function setOnline()
{
  document
    .getElementById(
      'device-status'
    )
    .innerHTML =
    '🟢 Device Online';
}

// ====================
// EVENT
// ====================

document
  .getElementById('feedBtn')
  .addEventListener(
    'click',
    feedFish
  );

// ====================
// LOAD
// ====================

async function init()
{
  await loadSensor();

  await loadChart();

  await loadFeedHistory();

  setOnline();
}

init();

setInterval(
  loadSensor,
  5000
);

setInterval(
  loadChart,
  10000
);

setInterval(
  loadFeedHistory,
  10000
);