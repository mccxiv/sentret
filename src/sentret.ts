const EVENT_CLASS_PREFIX = 'se-'
const EVENT_DATA_ATTRIBUTE = 'se-properties'

console.info('Sentret loaded')

export function Sentret(): SentretInstance {
  console.info('Sentret instance created')
  const callbacks: SentretClickCallback[] = []

  document.addEventListener('click', globalClickListener)

  function globalClickListener (event: MouseEvent) {
    let currentElement = event.target as HTMLElement | null
    let eventName: string | undefined
    let eventData: any

    while (!eventName && currentElement) {
      if (currentElement.matches(`[class^=${EVENT_CLASS_PREFIX}]`)) {
        const eventClass = Array.from(currentElement.classList)
          .find(className => className.startsWith(EVENT_CLASS_PREFIX))
        if (eventClass) {
          eventName = eventClass.replace(EVENT_CLASS_PREFIX, '')
          eventData = currentElement.dataset[EVENT_DATA_ATTRIBUTE]
        }
      } else currentElement = currentElement.parentElement
    }

    if (eventName) {
      console.group('Sentret Event')
      console.info(`Event name: ${eventName}`)
      if (eventData) {
        console.info(`Event data:`, eventData)
        console.log('type of data', typeof eventData)
      }
      console.groupEnd()

      const name = eventName // Reassign due to Typescript null check
      callbacks.forEach(fn => fn(name, eventData))
    }


  }

  return {
    onClick (callback: SentretClickCallback) {
      callbacks.push(callback)
    },
    destroy () {
      document.removeEventListener('click', globalClickListener)
    }
  }
}

type SentretClickCallback = (eventName: string, data?: any) => any

interface SentretInstance {
  onClick: (cb: SentretClickCallback) => void
  destroy: () => void
}
