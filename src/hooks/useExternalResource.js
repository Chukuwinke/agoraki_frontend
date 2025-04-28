// src/hooks/useExternalResource.js
import { useEffect } from 'react';

/**
 * Dynamically load an external <script> or <link> into the document,
 * and remove it on cleanup.
 *
 * @param {string} tag        - 'script' or 'link'
 * @param {Object} attributes - attributes to set on the element
 * @param {Node}   target     - where to append ('head' or 'body')
 */
export default function useExternalResource(tag, attributes, target = 'head') {
  useEffect(() => {
    const el = document.createElement(tag);                  // :contentReference[oaicite:3]{index=3}
    Object.entries(attributes).forEach(([key, value]) => {
      el.setAttribute(key, value);                           // :contentReference[oaicite:4]{index=4}
    });
    const parent = document[target];
    parent.appendChild(el);                                  // :contentReference[oaicite:5]{index=5}

    return () => {
      parent.removeChild(el);
    };
  }, [tag, attributes, target]);
}
