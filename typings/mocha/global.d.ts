declare global {
  namespace Mocha {
    interface Context {
      faker: typeof import('@faker-js/faker')['faker']
      inspect: typeof inspect
      pf: typeof pf
      sandbox: typeof sandbox
    }

    interface RunnerOptions {
      reporterOptions?: any
    }
  }
}

export {}
