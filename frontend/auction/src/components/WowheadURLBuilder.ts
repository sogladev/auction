import { Namespace } from 'src/components/models';

export function getWowheadURL(itemId: number, namespace: Namespace): string {
      let domain: string = ''; // wowhead retail
      if (namespace == Namespace.Progression) {
        domain = '?domain=wrath'; // wowhead wrath
      }
      else if (namespace == Namespace.Era) {
        domain = '?domain=classic'; // wowhead classic
      }
      const url = `https://www.wowhead.com/item=${itemId}${domain}`
      return url
}
