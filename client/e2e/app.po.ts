import { browser, element, by } from 'protractor';

export class DjugPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root md-toolbar')).getText();
  }
}
