const {expect} = require('chai')

const {relativeUrl} = require('../../src/url.js')

describe('relativeUrl()', function () {
  it('should support resolving from absolute URLs with the same origin', function () {
    expect(relativeUrl('https://iconduit.github.io/', 'https://iconduit.github.io/')).to.equal('.')
    expect(relativeUrl('https://iconduit.github.io', 'https://iconduit.github.io/')).to.equal('.')
    expect(relativeUrl('https://iconduit.github.io/', 'https://iconduit.github.io')).to.equal('.')
    expect(relativeUrl('https://iconduit.github.io/p/a/t/h', 'https://iconduit.github.io/p/a/t/h')).to.equal('h')
    expect(relativeUrl('https://iconduit.github.io/p/a/t/h', 'https://iconduit.github.io/p/a/t/x')).to.equal('x')
    expect(relativeUrl('https://iconduit.github.io/p/a/t/h/', 'https://iconduit.github.io/p/a/t/h/x')).to.equal('x')
    expect(relativeUrl('https://iconduit.github.io/p/a/t/h', 'https://iconduit.github.io/p/a/t/x/')).to.equal('x/')
    expect(relativeUrl('https://iconduit.github.io/p/a/t/h', 'https://iconduit.github.io/p/a/t/x/y')).to.equal('x/y')
    expect(relativeUrl('https://iconduit.github.io/p/a/t/h', 'https://iconduit.github.io/p/a/t/x?y#z')).to.equal('x?y#z')
    expect(relativeUrl('https://iconduit.github.io/p/a/t/h', 'https://iconduit.github.io/p/a/t/')).to.equal('.')
    expect(relativeUrl('https://iconduit.github.io/p/a/t/h', 'https://iconduit.github.io/p/a/')).to.equal('..')
    expect(relativeUrl('https://iconduit.github.io/p/a/t/h', 'https://iconduit.github.io/p/a/x')).to.equal('../x')
    expect(relativeUrl('https://iconduit.github.io/p/a/t/h', 'https://iconduit.github.io/')).to.equal('../../../')
    expect(relativeUrl('https://iconduit.github.io/p/a/t/h', 'https://iconduit.github.io/x')).to.equal('../../../x')
  })

  it('should support resolving from absolute URLs with a different origin', function () {
    expect(relativeUrl('https://example.org/', 'https://iconduit.github.io/p/a/t/h')).to.equal('https://iconduit.github.io/p/a/t/h')
  })

  it('should support resolving from absolute URLs to already relative URLs', function () {
    expect(relativeUrl('https://iconduit.github.io/p/a/t/h', 'x/y')).to.equal('x/y')
    expect(relativeUrl('https://iconduit.github.io/p/a/t/h', '/x/y')).to.equal('/x/y')
  })

  it('should support resolving from relative URLs with a leading slash', function () {
    expect(relativeUrl('/p/a/t/h', '/p/a/t/x')).to.equal('x')
    expect(relativeUrl('/p/a/t/h/', '/p/a/t/h/x')).to.equal('x')
    expect(relativeUrl('/p/a/t/h', '/p/a/t/x/')).to.equal('x/')
    expect(relativeUrl('/p/a/t/h', '/p/a/t/x/y')).to.equal('x/y')
    expect(relativeUrl('/p/a/t/h', '/p/a/t/x?y#z')).to.equal('x?y#z')
    expect(relativeUrl('/p/a/t/h', '/p/a/t/')).to.equal('.')
    expect(relativeUrl('/p/a/t/h', '/p/a/')).to.equal('..')
    expect(relativeUrl('/p/a/t/h', '/p/a/x')).to.equal('../x')
    expect(relativeUrl('/p/a/t/h', '/')).to.equal('../../../')
    expect(relativeUrl('/p/a/t/h', '/x')).to.equal('../../../x')
  })

  it('should support resolving from relative URLs with a leading slash to already relative URLs', function () {
    expect(relativeUrl('/p/a/t/h', 'x/y')).to.equal('x/y')
  })

  it('should support resolving from relative URLs without a leading slash', function () {
    expect(relativeUrl('p/a/t/h', 'p/a/t/x')).to.equal('x')
    expect(relativeUrl('p/a/t/h/', 'p/a/t/h/x')).to.equal('x')
    expect(relativeUrl('p/a/t/h', 'p/a/t/x/')).to.equal('x/')
    expect(relativeUrl('p/a/t/h', 'p/a/t/x/y')).to.equal('x/y')
    expect(relativeUrl('p/a/t/h', 'p/a/t/x?y#z')).to.equal('x?y#z')
    expect(relativeUrl('p/a/t/h', 'p/a/t/')).to.equal('.')
    expect(relativeUrl('p/a/t/h', 'p/a/')).to.equal('..')
    expect(relativeUrl('p/a/t/h', 'p/a/x')).to.equal('../x')
    expect(relativeUrl('p/a/t/h', '')).to.equal('../../..')
    expect(relativeUrl('p/a/t/h', 'x')).to.equal('../../../x')
  })
})
