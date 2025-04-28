// src/hooks/useBrevoScripts.js
export function loadScript(scriptId, src) {
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = src;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    } else {
      // Force reload if script already exists
      document.getElementById(scriptId).src = src;
    }
  }
  
  export function unloadScript(scriptId) {
    const script = document.getElementById(scriptId);
    if (script) script.remove();
  }
  