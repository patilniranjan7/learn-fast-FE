import { useEffect, useRef } from 'react';
import { readPassageSelection } from '../utils/passageSelection.js';

export function usePassageSelection(containerRef, onSelect, onDismiss) {
  const callbacks = useRef({ onSelect, onDismiss });

  useEffect(() => {
    callbacks.current = { onSelect, onDismiss };
  }, [onSelect, onDismiss]);

  useEffect(() => {
    let isDragging = false;
    let frame = null;
    let previous = null;

    function read() {
      const passage = readPassageSelection(containerRef.current, document.getSelection());
      if (!passage) {
        previous = null;
        return;
      }
      const key = `${passage.messageId}:${passage.start}:${passage.end}`;
      if (key !== previous) {
        previous = key;
        callbacks.current.onSelect(passage);
      }
    }

    function pointerDown(event) {
      isDragging = Boolean(containerRef.current?.contains(event.target));
      previous = null;
    }

    function pointerUp() {
      isDragging = false;
      read();
    }

    function selectionChange() {
      if (isDragging) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(read);
    }

    function dismiss(event) {
      if (!event.target?.closest?.('[data-passage-actions]')) callbacks.current.onDismiss();
    }

    document.addEventListener('pointerdown', pointerDown);
    document.addEventListener('pointerup', pointerUp);
    document.addEventListener('pointercancel', pointerUp);
    document.addEventListener('touchend', pointerUp);
    document.addEventListener('keyup', read);
    document.addEventListener('selectionchange', selectionChange);
    document.addEventListener('scroll', dismiss, true);
    window.addEventListener('resize', dismiss);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('pointerdown', pointerDown);
      document.removeEventListener('pointerup', pointerUp);
      document.removeEventListener('pointercancel', pointerUp);
      document.removeEventListener('touchend', pointerUp);
      document.removeEventListener('keyup', read);
      document.removeEventListener('selectionchange', selectionChange);
      document.removeEventListener('scroll', dismiss, true);
      window.removeEventListener('resize', dismiss);
    };
  }, [containerRef]);
}
