/**
 * Injects raw CSS into the DOM by creating (or updating) a <style> tag.
 *
 * @param css - The CSS string to inject
 * @param styleId - Optional ID for the <style> tag to prevent duplicates
 */
export function injectCss(css: string, viewId: string): void {
  let styleEl: HTMLStyleElement | null = null;
  const styleId = `style#${viewId}`;
  styleEl = document.getElementById(styleId) as HTMLStyleElement;

  // If no existing element, create a new <style> element
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = styleId;

    document.head.appendChild(styleEl);
  }

  // Set or update the CSS content
  styleEl.textContent = css;
}
