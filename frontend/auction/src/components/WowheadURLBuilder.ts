import { Namespace } from 'src/components/models';

export function getWowheadItemURL(
  itemId: number,
  namespace: Namespace,
): string {
  let domain: string = ''; // wowhead retail
  if (namespace == Namespace.Progression) {
    domain = '?domain=wrath'; // wowhead wrath
  } else if (namespace == Namespace.Era) {
    domain = '?domain=classic'; // wowhead classic
  }
  const url = `https://www.wowhead.com/item=${itemId}${domain}`;
  return url;
}

export function getWowheadImageURL(icon: string): string {
  // "inv_belt_29.jpg"
  // `https://wow.zamimg.com/images/wow/icons/tiny/inv_belt_29.gif`;
  if (icon === undefined || typeof icon !== 'string' || icon.length === 0) {
    return 'https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg';
  }
  return `https://wow.zamimg.com/images/wow/icons/medium/${icon}`;
}
