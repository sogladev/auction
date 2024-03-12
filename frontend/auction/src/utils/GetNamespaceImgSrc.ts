import { Namespace, NamespaceImageSrc } from 'src/components/models';

export function getNamespaceImageSrc(namespace: Namespace): NamespaceImageSrc {
  if (namespace === Namespace.Retail) {
    return NamespaceImageSrc.Retail;
  } else if (namespace === Namespace.Progression) {
    return NamespaceImageSrc.Progression;
  } else {
    return NamespaceImageSrc.Era;
  }
}
