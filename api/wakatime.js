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

  try {
    const response = await fetch(
      'https://api.wakatime.com/api/v1/users/current/stats/all_time',
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Basic ${auth}`,
        },
      },
    )

    const payload = await response.json().catch(() => ({}))

    if (!response.ok) {
      return res.status(response.status).json({
        error:
          payload?.error ||
          payload?.errors?.[0]?.message ||
          'WakaTime API request failed.',
      })
    }

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
    return res.status(200).json(payload)
  } catch (error) {
    console.error('WakaTime proxy error:', error)
    return res.status(502).json({
      error: 'Unable to reach WakaTime right now.',
    })
  }
}
