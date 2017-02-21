import { DjugPage } from './app.po';

describe('djug App', () => {
  let page: DjugPage;

  beforeEach(() => {
    page = new DjugPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
