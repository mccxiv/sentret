interface SentretInstance {
  on: (eventType: 'event', cb: SentretClickCallback) => void
  destroy: () => void
}

type SentretClickCallback = (eventName: string, data?: any) => any

interface SentretOptions {
  log: boolean
  eventAttribute: string
  propertiesAttribute: string
}

interface SentretOptionsArg {
  log?: boolean
  eventAttribute?: string
  propertiesAttribute?: string
}

export function Sentret(options: SentretOptionsArg): SentretInstance {
  const callbacks: SentretClickCallback[] = []
  const listenerInstance = (event: MouseEvent) => globalClickListener(event)
  const opts = {...getDefaults(), ...options}
  let listening = false

  return {
    on (eventType, callback: SentretClickCallback) {
      if (eventType !== 'event') throw Error(`Invalid event. Sentret does not emit "${eventType}"`)
      if (typeof callback !== 'function') throw Error('Sentret expects a callback function as the second argument')
      if (!listening) initialize()
      callbacks.push(callback)
    },
    destroy () {
      document.removeEventListener('click', listenerInstance)
    }
  }

  function initialize () {
    document.addEventListener('click', listenerInstance)
    listening = true

    log('Sentret is on duty')
    log('Turn this logging off for production with {log: false}')
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

  function globalClickListener (event: MouseEvent) {
    let currentElement = event.target as HTMLElement | null
    let eventName: string | undefined
    let eventData: any

    while (!eventName && currentElement) {
      if (currentElement.dataset[opts.eventAttribute]) {
        eventName = currentElement.dataset[opts.eventAttribute]
        eventData = currentElement.dataset[opts.propertiesAttribute]
      } else currentElement = currentElement.parentElement
    }

    if (eventName) {
      log('Click event captured')
      log(`• Event: ${eventName}`)
      if (eventData) log('• Properties:', JSON.parse(eventData))

      const name = eventName // Reassign due to Typescript null check
      callbacks.forEach(fn => fn(name, eventData))
    }
  }
}

function getDefaults(): SentretOptions {
  return {
    log: true,
    eventAttribute: 'event',
    propertiesAttribute: 'properties'
  }
}
