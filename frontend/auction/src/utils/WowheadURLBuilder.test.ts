import { Namespace } from 'src/components/models';
import {
  getWowheadItemURL,
  getWowheadImageURL,
} from 'src/utils/WowheadURLBuilder';

import { describe, expect, it } from 'vitest';

describe('item url builder', () => {
  it('should return URL with era domain', () => {
    const namespace = Namespace.Era;
    const itemId = 1234;

    const result = getWowheadItemURL(itemId, namespace);

    const expectedURL = 'https://www.wowhead.com/item=1234?domain=classic';
    expect(result).toEqual(expectedURL);
  });
  it('should return URL with progression domain', () => {
    const namespace = Namespace.Progression;
    const itemId = 1234;

    const result = getWowheadItemURL(itemId, namespace);

    const expectedURL = 'https://www.wowhead.com/item=1234?domain=wrath';
    expect(result).toEqual(expectedURL);
  });
  it('should return URL with retail domain', () => {
    const namespace = Namespace.Retail;
    const itemId = 1234;

    const result = getWowheadItemURL(itemId, namespace);

    const expectedURL = 'https://www.wowhead.com/item=1234';
    expect(result).toEqual(expectedURL);
  });
});

describe('image url builder', () => {
  const defaultURL =
    'https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg';
  it('should return URL', () => {
    const icon = 'inv_belt_29.jpg';
    const result = getWowheadImageURL(icon);

    const expectedURL =
      'https://wow.zamimg.com/images/wow/icons/medium/inv_belt_29.jpg';
    expect(result).toEqual(expectedURL);
  });
  it('should return URL to questionmark if undined', () => {
    const icon = undefined;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result = getWowheadImageURL(icon);

    const expectedURL = defaultURL;

    expect(result).toEqual(expectedURL);
  });
  it('should return URL to questionmark if invalid', () => {
    const icon = '';
    const result = getWowheadImageURL(icon);

    const expectedURL = defaultURL;

    expect(result).toEqual(expectedURL);
  });
});
