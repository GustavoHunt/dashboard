import { browser, element, by } from 'protractor';
import { MdProAngularCliPage } from './app.po';

describe('Core App', () => {
  let page: MdProAngularCliPage;

  beforeEach(() => {
    page = new MdProAngularCliPage();
    
  });

  beforeAll(() => {
    browser.get('/pages/login');
    element(by.id('email')).sendKeys('coelhog@google.com');
    element(by.id('password')).sendKeys('n7sheppard');
    element(by.id('btn-letsgo')).click();
    browser.sleep(3000);
  });

  /* it('should check if angular is up and running', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Login');
  });

  it('should login', () => {
    expect(page.loginPage()).toBe(true);
  }); */

  it('should log in the start of the day', () => {
    console.log('start');

    var EC = browser.ExpectedConditions;
    var elm = element(by.css('.main-content'));
   
    browser.wait(EC.presenceOf(elm), 1000);


    const subject = elm.isDisplayed();
    console.log(subject);
    element(by.id('logInNow')).click();
    const result = true;




    
    expect(element(by.id('thankYou')).getText()).toEqual('Thank You!');
  });
});
