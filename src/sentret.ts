const defaults: SentretOptions = {
  log: true,
  parseAsJson: false,
  classPrefix: 'se-',
  propertiesAttribute: 'properties',
}

export function Sentret(options: SentretOptions): SentretInstance {
  const callbacks: SentretClickCallback[] = []
  const listenerInstance = (event: MouseEvent) => globalClickListener(event)
  const opts = {...defaults, ...options}
  let listening = false

  return {
    on (eventType, callback: SentretClickCallback) {
      if (eventType === 'event') {
        if (!listening) initialize()
        callbacks.push(callback)
      }
      else throw (Error(`Invalid event. Sentret does not emit "${eventType}"`))
    },
    destroy () {
      document.removeEventListener('click', listenerInstance)
    }
  }

  function log (message: string, data?: object) {
    if (opts.log) {
      console.log(
        `%c[Sentret]:`,
        'color: #8c6b5e; font-weight: bold',
        `${message}`,
        data || ''
      )
    }
  }

  function initialize () {
    document.addEventListener('click', listenerInstance)
    listening = true

    log('Sentret is duty')
    log('Turn this logging off for production with {log: false}')
  }

  function globalClickListener (event: MouseEvent) {
    let currentElement = event.target as HTMLElement | null
    let eventName: string | undefined
    let eventData: any

    while (!eventName && currentElement) {
      if (currentElement.matches(`[class^=${opts.classPrefix}]`)) {
        const eventClass = Array.from(currentElement.classList)
          .find(className => className.startsWith(opts.classPrefix))
        if (eventClass) {
          eventName = eventClass.replace(opts.classPrefix, '')
          eventData = currentElement.dataset[opts.propertiesAttribute]
        }
      } else currentElement = currentElement.parentElement
    }

    if (eventName) {
      log('Click event captured')
      log(`• Event: ${eventName}`)
      if (eventData) log('• Properties:', JSON.parse(eventData))

      const name = eventName // Reassign due to Typescript null check
      callbacks.forEach(fn => {
        fn(name, eventData)
      })
    }
  }
}

type SentretClickCallback = (eventName: string, data?: any) => any

interface SentretInstance {
  on: (eventType: 'event', cb: SentretClickCallback) => void
  destroy: () => void
}

interface SentretOptions {
  log: boolean
  parseAsJson: boolean
  classPrefix: string
  propertiesAttribute: string
}
