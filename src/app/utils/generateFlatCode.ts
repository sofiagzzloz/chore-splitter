export function generateFlatCode() {
    const adjectives = ['sunny', 'cozy', 'breezy', 'quiet', 'modern']
    const nouns = ['house', 'flat', 'den', 'pad', 'nest']
    const number = Math.floor(Math.random() * 90 + 10) // 10–99
  
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
    const noun = nouns[Math.floor(Math.random() * nouns.length)]
  
    return `${adj}-${noun}-${number}`
  }