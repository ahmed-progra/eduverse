const TAG_WHITELIST = new Set([
  'p', 'br', 'b', 'i', 'u', 'strong', 'em', 'a', 'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'code', 'blockquote',
  'img', 'span', 'div', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
])

const ATTRIBUTE_WHITELIST = new Set([
  'href', 'src', 'alt', 'class', 'id', 'target', 'rel', 'style',
])

export function sanitizeHtml(input: string): string {
  return input.replace(/<[^>]*>/g, (tag) => {
    const match = tag.match(/^<\/?(\w+)/)
    if (!match) return ''
    const tagName = match[1].toLowerCase()
    if (!TAG_WHITELIST.has(tagName)) return ''

    if (tag.startsWith('</')) return tag

    const attrRegex = /(\w+)\s*=\s*"([^"]*)"/g
    let attrMatch
    const safeAttrs: string[] = []

    while ((attrMatch = attrRegex.exec(tag)) !== null) {
      const attrName = attrMatch[1].toLowerCase()
      if (ATTRIBUTE_WHITELIST.has(attrName)) {
        if (attrName === 'href' || attrName === 'src') {
          const val = attrMatch[2].toLowerCase().replace(/\s/g, '')
          if (/^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i.test(val) || val.startsWith('data:')) continue
        }
        safeAttrs.push(`${attrName}="${attrMatch[2]}"`)
      }
    }

    return `<${tagName}${safeAttrs.length ? ' ' + safeAttrs.join(' ') : ''}>`
  })
}
