export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.WAKATIME_API_KEY

  if (!apiKey) {
    return res.status(500).json({
      error: 'WAKATIME_API_KEY is not configured on the server.',
    })
  }

  const auth = Buffer.from(`${apiKey}:`).toString('base64')

  const headers = {
    Accept: 'application/json',
    Authorization: `Basic ${auth}`,
  }

  try {
    const totalResponse = await fetch(
      'https://api.wakatime.com/api/v1/users/current/all_time_since_today',
      { headers },
    )

    const totalPayload = await totalResponse.json().catch(() => ({}))

    if (!totalResponse.ok) {
      return res.status(totalResponse.status).json({
        error:
          totalPayload?.error ||
          totalPayload?.errors?.[0]?.message ||
          'WakaTime request failed.',
      })
    }

    const total = totalPayload.data || {}

    const start = total.range?.start_date
    const end = total.range?.end_date

    let summaries = []

    if (start && end) {
      const summariesResponse = await fetch(
        `https://api.wakatime.com/api/v1/users/current/summaries?start=${start}&end=${end}`,
        { headers },
      )

      const summariesPayload = await summariesResponse
        .json()
        .catch(() => ({}))

      if (summariesResponse.ok) {
        summaries = summariesPayload.data || []
      }
    }

    return res.status(200).json({
      data: {
        ...total,
        summaries,
      },
    })
  } catch (error) {
    console.error('WakaTime proxy error:', error)

    return res.status(502).json({
      error: 'Unable to reach WakaTime right now.',
    })
  }
}
