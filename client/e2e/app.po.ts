import {browser, by, element} from 'protractor';
import {promise} from "selenium-webdriver";

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  highlightElement(byObject) {
    function setStyle(element, style) {
      const previous = element.getAttribute('style');
      element.setAttribute('style', style);
      setTimeout(() => {
        element.setAttribute('style', previous);
      }, 200);
      return 'highlighted';
    }
  }

  click(idOfButton: string): promise.Promise<void> {
    this.highlightElement(by.id(idOfButton));
    return element(by.id(idOfButton)).click();
  }

  typeEmail(email: string) {
    browser.sendKeys(email);
  }
}
