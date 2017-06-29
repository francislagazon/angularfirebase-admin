// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  hmr: false,
  firebase: {
    apiKey: "AIzaSyA_aColQaYlOqtTEMuGi6uIQ-NVmrn593M",
    authDomain: "forum-test-9f0a8.firebaseapp.com",
    databaseURL: "https://forum-test-9f0a8.firebaseio.com",
    projectId: "forum-test-9f0a8",
    storageBucket: "forum-test-9f0a8.appspot.com",
    messagingSenderId: "890816168342"
  }
};
