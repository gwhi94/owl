import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getTitleText() {
<<<<<<< HEAD
    return element(by.scss('app-root .content span')).getText() as Promise<string>;
=======
    return element(by.css('app-root .content span')).getText() as Promise<string>;
>>>>>>> initial commit
  }
}
