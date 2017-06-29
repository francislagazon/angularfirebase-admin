import { FirebaseCmsTestAppPage } from './app.po';

describe('firebase-cms-test-app App', () => {
  let page: FirebaseCmsTestAppPage;

  beforeEach(() => {
    page = new FirebaseCmsTestAppPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
