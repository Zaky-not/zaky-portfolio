// Live WakaTime integration.
//
// The secret WakaTime API key stays server-side in Vercel.
// The browser only calls our same-origin /api/wakatime endpoint.

function formatSince(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(date)
}

function cleanItems(items = []) {
  return items
    .filter((item) => item && item.name)
    .map((item) => ({
      name: item.name,
      percent: Number(item.percent) || 0,
      text: item.text || item.digital || '',
    }))
    .sort((a, b) => b.percent - a.percent)
}

export async function getCodingStats() {
  const response = await fetch('/api/wakatime', {
    headers: { Accept: 'application/json' },
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.error || `WakaTime request failed (${response.status})`)
  }

  const data = payload.data

  if (!data) {
    throw new Error('WakaTime returned no statistics.')
  }

  return {
    isPlaceholder: false,
    totalTime: data.human_readable_total || '0 secs',
    totalSeconds: Number(data.total_seconds) || 0,
    languages: cleanItems(data.languages),
    editors: cleanItems(data.editors),
    operatingSystems: cleanItems(data.operating_systems),
    bestDay: data.best_day
      ? {
          date: formatSince(data.best_day.date),
          text: data.best_day.text || '—',
        }
      : { date: '—', text: '—' },
    codingSince: formatSince(data.start),
    codingDays: Number(data.days_minus_holidays) || 0,
    isUpToDate: data.is_up_to_date !== false,
    percentCalculated: Number(data.percent_calculated) || 100,
    username: data.username || '',
  }
}
