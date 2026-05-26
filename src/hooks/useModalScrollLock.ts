import { useLayoutEffect } from 'react';

export function useModalScrollLock(isOpen: boolean) {
  useLayoutEffect(() => {
    if (!isOpen) return;

    const body = document.body;
    const html = document.documentElement;
    const appContent = document.querySelector<HTMLElement>('.app-shell__content');

    const previousBodyOverflow = body.style.overflow;
    const previousHtmlOverflow = html.style.overflow;
    const previousAppOverflow = appContent?.style.overflowY ?? '';

    body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';

    if (appContent) {
      appContent.style.overflowY = 'hidden';
    }

    return () => {
      body.style.overflow = previousBodyOverflow;
      html.style.overflow = previousHtmlOverflow;

      if (appContent) {
        appContent.style.overflowY = previousAppOverflow;
      }
    };
  }, [isOpen]);
}
