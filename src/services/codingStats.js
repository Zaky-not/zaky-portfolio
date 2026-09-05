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

function aggregateStats(summaries = []) {
  const languages = {}
  const editors = {}
  const operatingSystems = {}

  let bestDay = null
  let totalCodingDays = 0

  for (const day of summaries) {
    const seconds = Number(day?.grand_total?.total_seconds) || 0

    if (seconds > 0) {
      totalCodingDays += 1

      if (!bestDay || seconds > bestDay.total_seconds) {
        bestDay = {
          total_seconds: seconds,
          text: day.grand_total.text || '—',
          date: day.range?.date || '',
        }
      }
    }

    for (const item of day.languages || []) {
      if (!item.name) continue
      languages[item.name] =
        (languages[item.name] || 0) + (Number(item.total_seconds) || 0)
    }

    for (const item of day.editors || []) {
      if (!item.name) continue
      editors[item.name] =
        (editors[item.name] || 0) + (Number(item.total_seconds) || 0)
    }

    for (const item of day.operating_systems || []) {
      if (!item.name) continue
      operatingSystems[item.name] =
        (operatingSystems[item.name] || 0) +
        (Number(item.total_seconds) || 0)
    }
  }

  function makeItems(source) {
    const total = Object.values(source).reduce(
      (sum, seconds) => sum + seconds,
      0,
    )

    return Object.entries(source)
      .map(([name, seconds]) => ({
        name,
        percent: total > 0 ? (seconds / total) * 100 : 0,
        text: formatDuration(seconds),
      }))
      .sort((a, b) => b.percent - a.percent)
  }

  return {
    languages: makeItems(languages),
    editors: makeItems(editors),
    operatingSystems: makeItems(operatingSystems),
    bestDay,
    codingDays: totalCodingDays,
  }
}

function formatDuration(seconds) {
  if (!seconds) return '0 secs'

  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours > 0) {
    return `${hours} hr${hours !== 1 ? 's' : ''} ${
      remainingMinutes
    } min${remainingMinutes !== 1 ? 's' : ''}`
  }

  return `${minutes} min${minutes !== 1 ? 's' : ''}`
}

export async function getCodingStats() {
  const response = await fetch('/api/wakatime', {
    headers: {
      Accept: 'application/json',
    },
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(
      payload.error || `WakaTime request failed (${response.status})`,
    )
  }

  const data = payload.data

  if (!data) {
    throw new Error('WakaTime returned no statistics.')
  }

  const aggregated = aggregateStats(data.summaries)

  return {
    isPlaceholder: false,

    totalTime: data.text || '0 secs',

    totalSeconds: Number(data.total_seconds) || 0,

    languages: aggregated.languages,

    editors: aggregated.editors,

    operatingSystems: aggregated.operatingSystems,

    bestDay: aggregated.bestDay
      ? {
          date: formatSince(aggregated.bestDay.date),
          text: aggregated.bestDay.text,
        }
      : {
          date: '—',
          text: '—',
        },

    codingSince: formatSince(data.range?.start),

    codingDays: aggregated.codingDays,

    isUpToDate: data.is_up_to_date !== false,

    percentCalculated: Number(data.percent_calculated) || 100,

    username: data.username || '',
  }
}
