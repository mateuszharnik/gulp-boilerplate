import logIt from '../src/js/main';

describe('logIt', () => {
  it('Should return: It works', () => {
    expect(logIt()).toBe('It works');
  });
});
