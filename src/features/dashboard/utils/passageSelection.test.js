import { afterEach, describe, expect, it } from 'vitest';
import { readPassageSelection } from './passageSelection.js';

const rect = { top: 24, bottom: 44, left: 80, right: 240, width: 160, height: 20 };

function conversation(markup) {
  const container = document.createElement('div');
  container.innerHTML = markup;
  document.body.append(container);
  return container;
}

function select(startNode, startOffset, endNode, endOffset) {
  const range = document.createRange();
  range.setStart(startNode, startOffset);
  range.setEnd(endNode, endOffset);
  range.getBoundingClientRect = () => rect;
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  return selection;
}

afterEach(() => {
  window.getSelection().removeAllRanges();
  document.body.replaceChildren();
});

describe('assistant passage selection', () => {
  it('anchors the actual occurrence of repeated text rather than the first text match', () => {
    const container = conversation(
      '<p data-assistant-message data-message-id="reply-1">A bond forms. A bond forms.</p>',
    );
    const content = container.firstChild.firstChild;
    const selection = select(content, 16, content, 26);

    expect(readPassageSelection(container, selection)).toEqual({
      messageId: 'reply-1',
      start: 16,
      end: 26,
      text: 'bond forms',
      rect,
    });
  });

  it('counts exact offsets across text nodes and an existing saved mark', () => {
    const container = conversation(
      '<p data-assistant-message data-message-id="reply-2">Before <mark>ionic bond</mark>, electrons transfer. After</p>',
    );
    const message = container.firstChild;
    const selection = select(message.childNodes[1].firstChild, 0, message.childNodes[2], 20);
    const passage = readPassageSelection(container, selection);

    expect(passage).toEqual({
      messageId: 'reply-2',
      start: 7,
      end: 37,
      text: 'ionic bond, electrons transfer',
      rect,
    });
    expect(message.textContent.slice(passage.start, passage.end)).toBe(passage.text);
    expect(message.querySelector('mark').textContent).toBe('ionic bond');
  });

  it('preserves selected whitespace while rejecting a whitespace-only passage', () => {
    const container = conversation(
      '<p data-assistant-message data-message-id="reply-3">Start  energy  end</p>',
    );
    const content = container.firstChild.firstChild;

    expect(readPassageSelection(container, select(content, 5, content, 15))).toMatchObject({
      start: 5,
      end: 15,
      text: '  energy  ',
    });
    expect(readPassageSelection(container, select(content, 5, content, 7))).toBeNull();
  });

  it('rejects collapsed selections, empty selections, and missing selections', () => {
    const container = conversation(
      '<p data-assistant-message data-message-id="reply-4">Atoms share electrons.</p>',
    );
    const content = container.firstChild.firstChild;

    expect(readPassageSelection(container, select(content, 5, content, 5))).toBeNull();
    window.getSelection().removeAllRanges();
    expect(readPassageSelection(container, window.getSelection())).toBeNull();
    expect(readPassageSelection(container, null)).toBeNull();
  });

  it('rejects user text and selections spanning two replies', () => {
    const container = conversation(
      '<p>Why do atoms bond?</p><p data-assistant-message data-message-id="reply-5">They lower energy.</p><p data-assistant-message data-message-id="reply-6">Electrons may transfer.</p>',
    );
    const [user, firstReply, secondReply] = container.children;

    expect(
      readPassageSelection(container, select(user.firstChild, 0, user.firstChild, 3)),
    ).toBeNull();
    expect(
      readPassageSelection(container, select(firstReply.firstChild, 5, secondReply.firstChild, 9)),
    ).toBeNull();
    expect(
      readPassageSelection(container, select(user.firstChild, 4, firstReply.firstChild, 4)),
    ).toBeNull();
  });

  it('rejects otherwise valid assistant passages outside the active conversation', () => {
    const container = conversation('<p>Current conversation</p>');
    const outside = conversation(
      '<p data-assistant-message data-message-id="other-reply">Private context</p>',
    );
    const content = outside.firstChild.firstChild;

    expect(readPassageSelection(container, select(content, 0, content, 7))).toBeNull();
  });
});
