import test from 'node:test'
import assert from 'node:assert/strict'
import { downloadBook } from '../src/lib/book-download.js'

function browserFor(response) {
  const calls = []
  const link = { click: () => calls.push('download'), remove: () => calls.push('remove') }
  return {
    calls,
    link,
    fetch: async () => response,
    URL: { createObjectURL: () => 'blob:book', revokeObjectURL: () => calls.push('revoke') },
    document: { createElement: () => link, body: { appendChild: () => calls.push('append') } },
    setTimeout: (callback) => callback(),
  }
}

test('downloads a PDF with a readable filename and releases the object URL', async () => {
  const browser = browserFor(new Response('%PDF-1.7\nbook'))
  await downloadBook('/books/read-the-player.pdf', browser)
  assert.equal(browser.link.download, 'Read-the-Player.pdf')
  assert.equal(browser.link.href, 'blob:book')
  assert.deepEqual(browser.calls, ['append', 'download', 'remove', 'revoke'])
})

test('missing configuration never starts a broken download', async () => {
  const browser = browserFor(new Response(''))
  await assert.rejects(downloadBook('', browser), /not available yet/)
  assert.deepEqual(browser.calls, [])
})

test('failed requests and HTML fallback pages do not download as PDFs', async () => {
  for (const response of [new Response('', { status: 404 }), new Response('<!doctype html>')]) {
    const browser = browserFor(response)
    await assert.rejects(downloadBook('/books/missing.pdf', browser))
    assert.deepEqual(browser.calls, [])
  }
})
