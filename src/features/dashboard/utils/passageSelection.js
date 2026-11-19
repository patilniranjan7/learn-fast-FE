function assistantMessage(node) {
  const element = node?.nodeType === 1 ? node : node?.parentElement;
  return element?.closest('[data-assistant-message]') || null;
}

/** Read UTF-16 offsets from one assistant reply, including nested saved marks. */
export function readPassageSelection(container, selection) {
  if (!container || !selection || selection.rangeCount !== 1 || selection.isCollapsed) return null;
  const range = selection.getRangeAt(0);
  const message = assistantMessage(range.startContainer);
  if (!message || !container.contains(message) || assistantMessage(range.endContainer) !== message)
    return null;
  const text = range.toString();
  if (!text.trim()) return null;

  try {
    const prefix = message.ownerDocument.createRange();
    prefix.selectNodeContents(message);
    prefix.setEnd(range.startContainer, range.startOffset);
    const start = prefix.toString().length;
    if (message.textContent.slice(start, start + text.length) !== text) return null;
    const bounds =
      range.getClientRects?.()[0] ||
      range.getBoundingClientRect?.() ||
      message.getBoundingClientRect();
    return {
      messageId: message.dataset.messageId,
      start,
      end: start + text.length,
      text,
      rect: {
        top: bounds.top,
        bottom: bounds.bottom,
        left: bounds.left,
        right: bounds.right,
        width: bounds.width,
        height: bounds.height,
      },
    };
  } catch {
    // A selection can become detached while a route or message is changing.
    return null;
  }
}
