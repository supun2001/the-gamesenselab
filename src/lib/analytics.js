export const measurementId = 'G-F9PJTVXGL2'
export const consentKey = 'gsl-analytics-consent-v1'
const allowedPaths = new Set(['/', '/signup', '/login', '/dashboard', '/privacy', '/terms'])

// Inject the browser so consent and payload boundaries can be tested without Google requests.
export function createAnalytics(browser) {
  let consent = null
  let started = false
  let currentPage = null
  let lastPath = null
  try {
    const saved = browser.localStorage.getItem(consentKey)
    if (saved === 'accepted' || saved === 'rejected') consent = saved
  } catch {
    /* Storage may be unavailable; keep the choice for this visit. */
  }
  const enabled = () =>
    ['thegamesenselab.com', 'www.thegamesenselab.com'].includes(browser.location.hostname)
  const command = (...args) => browser.gtag(...args)

  function start() {
    if (started || consent !== 'accepted' || !enabled()) return
    browser[`ga-disable-${measurementId}`] = false
    browser.dataLayer = browser.dataLayer || []
    browser.gtag = function () {
      browser.dataLayer.push(arguments)
    }
    command('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    })
    command('js', new Date())
    command('config', measurementId, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: currentPage?.page_location || 'https://thegamesenselab.com/',
      page_referrer: '',
    })
    const script = browser.document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    browser.document.head.appendChild(script)
    started = true
  }

  function sendPage() {
    if (consent !== 'accepted' || !currentPage || !enabled()) return
    start()
    if (lastPath === currentPage.page_path) return
    command('set', currentPage)
    command('event', 'page_view', { ...currentPage, send_to: measurementId })
    lastPath = currentPage.page_path
  }

  function clearCookies() {
    for (const cookie of browser.document.cookie.split(';')) {
      const name = cookie.split('=')[0].trim()
      if (name !== '_ga' && !name.startsWith('_ga_')) continue
      for (const domain of ['', browser.location.hostname, '.thegamesenselab.com']) {
        browser.document.cookie = `${name}=; Max-Age=0; path=/;${domain ? ` domain=${domain};` : ''}`
      }
    }
  }

  return {
    get consent() {
      return consent
    },
    choose(value) {
      if (!['accepted', 'rejected'].includes(value)) return
      consent = value
      try {
        browser.localStorage.setItem(consentKey, value)
      } catch {
        /* Session-only choice. */
      }
      if (value === 'accepted') sendPage()
      else {
        browser[`ga-disable-${measurementId}`] = true
        clearCookies()
        // Unload Google's listeners and queued work after withdrawal.
        if (started) browser.location.reload()
      }
    },
    page(path, title) {
      if (!allowedPaths.has(path)) return
      currentPage = {
        page_path: path,
        page_title: title,
        // Never forward URL query strings, anchors, auth tokens or external referrers.
        page_location: `https://thegamesenselab.com/${path === '/' ? '' : `#${path}`}`,
        page_referrer: '',
      }
      sendPage()
    },
    waitlistJoined() {
      if (consent !== 'accepted' || !enabled() || !currentPage) return
      start()
      command('event', 'generate_lead', {
        ...currentPage,
        send_to: measurementId,
        method: 'waitlist',
      })
    },
  }
}
