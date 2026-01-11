// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  timerDuration: 30 * 60, // 30 minutes in seconds (1800)
  apiBaseUrl: '/api' // Using proxy in development
};
