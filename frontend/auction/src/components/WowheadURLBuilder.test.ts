import { Namespace } from 'src/components/models';
import { getWowheadURL } from 'src/components/WowheadURLBuilder';

import { describe, expect, it } from 'vitest';

describe('url builder', () => {
  it('should return URL with era domain', () => {
    const namespace = Namespace.Era
    const itemId = 1234

    const result = getWowheadURL(itemId, namespace);

    const expectedURL = 'https://www.wowhead.com/item=1234?domain=classic';
    expect(result).toEqual(expectedURL);
  });
  it('should return URL with progression domain', () => {
    const namespace = Namespace.Progression
    const itemId = 1234

    const result = getWowheadURL(itemId, namespace);

    const expectedURL = 'https://www.wowhead.com/item=1234?domain=wrath';
    expect(result).toEqual(expectedURL);
  });
  it('should return URL with retail domain', () => {
    const namespace = Namespace.Retail
    const itemId = 1234

    const result = getWowheadURL(itemId, namespace);

    const expectedURL = 'https://www.wowhead.com/item=1234';
    expect(result).toEqual(expectedURL);
  });
});
