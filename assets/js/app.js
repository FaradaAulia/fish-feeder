let chart = null;

// ====================
// SENSOR TERBARU
// ====================

async function loadSensor()
{
  try
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

    document.getElementById('avg-suhu')
      .innerText =
      (data.suhu ?? '--') + ' °C';

    document.getElementById('avg-hum')
      .innerText =
      (data.kelembapan ?? '--') + ' %';

    let status =
      '🟢 Ekosistem Stabil';

    if (data.suhu > 32)
    {
      status =
        '🔴 Suhu Tinggi';
    }
    else if (data.suhu > 30)
    {
      status =
        '🟡 Perlu Perhatian';
    }

    document.getElementById('status')
      .innerText =
      status;

    // Hitung Kualitas Pakan berdasarkan Kelembapan (DHT11)
    let kualitasPakan = 'Normal';
    let warnaKualitas = '#f8fafc'; // Putih (default)

    if (data.kelembapan < 50) {
      kualitasPakan = 'Sangat Baik (Kering)';
      warnaKualitas = '#4ade80'; // Hijau
    } else if (data.kelembapan >= 50 && data.kelembapan <= 70) {
      kualitasPakan = 'Normal (Aman)';
      warnaKualitas = '#facc15'; // Kuning
    } else if (data.kelembapan > 70) {
      kualitasPakan = 'Rawan Jamur (Lembap)';
      warnaKualitas = '#f87171'; // Merah
    }

    const kualitasEl = document.getElementById('kualitas-pakan');
    if (kualitasEl) {
      kualitasEl.innerText = kualitasPakan;
      kualitasEl.style.color = warnaKualitas;
    }
  }
  catch(error)
  {
    console.log(error);
  }
}

// ====================
// GRAFIK SENSOR
// ====================

async function loadChart()
{
  try
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
              borderColor: '#0ea5e9',
              backgroundColor:
                'rgba(14,165,233,.15)',
              fill: true,
              borderWidth: 3,
              tension: .4
            },

            {
              label: 'Kelembapan',
              data: kelembapan,
              borderColor: '#22c55e',
              backgroundColor:
                'rgba(34,197,94,.15)',
              fill: true,
              borderWidth: 3,
              tension: .4
            }
          ]
        },

        options:
        {
          responsive: true,
          maintainAspectRatio: false,

          plugins:
          {
            legend:
            {
              labels:
              {
                color: '#ffffff'
              }
            }
          },

          scales:
          {
            x:
            {
              ticks:
              {
                color: '#94a3b8'
              }
            },

            y:
            {
              ticks:
              {
                color: '#94a3b8'
              }
            }
          }
        }
      });
  }
  catch(error)
  {
    console.log(error);
  }
}

// ====================
// RIWAYAT PAKAN
// ====================

async function loadFeedHistory()
{
  try
  {
    const response =
      await fetch('/api/feed-history');

    const data =
      await response.json();

    const ul =
      document.getElementById(
        'feed-history'
      );

    ul.innerHTML = '';

    document.getElementById(
      'total-feed'
    ).innerText =
      data.length;

    data.forEach(item =>
    {
      const li =
        document.createElement(
          'li'
        );

      li.innerText =
        '🐟 ' +
        new Date(
          item.created_at
        ).toLocaleString('id-ID');

      ul.appendChild(li);
    });
  }
  catch(error)
  {
    console.log(error);
  }
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

  try
  {
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
  }
  catch(error)
  {
    console.log(error);

    btn.innerText =
      '❌ Error';
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
    `
    🟢 Device Online
    <br>
    <small>
      Realtime Monitoring
    </small>
    `;
}

// ====================
// EVENT
// ====================

document
  .getElementById(
    'feedBtn'
  )
  .addEventListener(
    'click',
    feedFish
  );

const autoFeedToggle = document.getElementById('autoFeedToggle');
if (autoFeedToggle) {
  autoFeedToggle.addEventListener('change', async (e) => {
    const isAuto = e.target.checked;
    console.log('Mode Otomatis:', isAuto ? 'Aktif' : 'Non-aktif');
    
    // Opsional: Kirim state ini ke backend / supabase agar Arduino tahu mode-nya
    try {
      await fetch('/api/set-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoMode: isAuto })
      });
    } catch (err) {
      console.error('Gagal mengubah mode:', err);
    }
  });
}

// ====================
// INIT
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