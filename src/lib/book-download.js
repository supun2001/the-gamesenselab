export async function downloadBook(url, browser = window) {
  if (!url) throw new Error('The book PDF is not available yet. Your waitlist place is saved.')
  const response = await browser.fetch(url)
  if (!response.ok) throw new Error('The book couldn’t download. Please try again.')
  const blob = await response.blob()
  // A missing file on a static host may return the HTML app with a successful status.
  if (!(await blob.slice(0, 5).text()).startsWith('%PDF-'))
    throw new Error('The book file is unavailable. Please try again later.')
  const objectUrl = browser.URL.createObjectURL(blob)
  const link = browser.document.createElement('a')
  link.href = objectUrl
  link.download = 'Read-the-Player.pdf'
  browser.document.body.appendChild(link)
  link.click()
  link.remove()
  browser.setTimeout(() => browser.URL.revokeObjectURL(objectUrl), 60000)
}
