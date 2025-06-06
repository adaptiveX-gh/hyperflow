declare global {
  type FormAccountUpdateResult = {
    errorMessage?: string
    errorFields?: string[]
    fullName?: string
    companyName?: string
    website?: string
    email?: string
  }
  /* eslint-disable no-var */
  var __flow_running: boolean | undefined
}

export {}
