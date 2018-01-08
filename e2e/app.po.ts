import { browser, element, by } from 'protractor';

export class MdProAngularCliPage {


  navigateTo() {
    return browser.get('/pages/login');
  }

  getParagraphText() {
    return element(by.css('h4')).getText();
  }

  loginPage() {
    browser.get('/pages/login');
    element(by.id('email')).sendKeys('coelhog@google.com');
    element(by.id('password')).sendKeys('n7sheppard');
    element(by.id('btn-letsgo')).click();
    const EC = browser.ExpectedConditions;
    return browser.wait(EC.urlContains('dashboard'), 5000);
  }

  LogInHours() {
    element(by.id('logInNow')).click();
    return element(by.id('thankYou')).getText();
  }
}
