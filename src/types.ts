interface SentretInstance {
  on: (eventType: 'event', cb: SentretClickCallback) => void
  destroy: () => void
}

type SentretClickCallback = (eventName: string, data?: any) => any

interface SentretOptions {
  log: boolean
  parseAsJson: boolean
  classPrefix: string
  propertiesAttribute: string
}
