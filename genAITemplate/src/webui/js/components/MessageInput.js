/**
 * MessageInput – Text input area with send button.
 * Future web component: <contoso-message-input>
 */
export class MessageInput {
  /**
   * @param {HTMLElement} container
   */
  constructor(container) {
    this._container = container;
    this._onSend = null;
    this._disabled = false;
    this.render();
  }

  /** @param {Function} cb - (messageText: string) => void */
  set onSend(cb) { this._onSend = cb; }

  /** Disable/enable the input (e.g. while waiting for a response) */
  setDisabled(disabled) {
    this._disabled = disabled;
    this._textarea.disabled = disabled;
    this._sendBtn.disabled = disabled;
    this._container.classList.toggle('message-input--disabled', disabled);
  }

  /** Focus the textarea */
  focus() {
    this._textarea.focus();
  }

  /** Clear the textarea */
  clear() {
    this._textarea.value = '';
    this._autoResize();
  }

  render() {
    this._container.innerHTML = '';
    this._container.className = 'message-input';

    const form = document.createElement('form');
    form.className = 'message-input__form';
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this._handleSend();
    });

    this._textarea = document.createElement('textarea');
    this._textarea.className = 'message-input__textarea';
    this._textarea.placeholder = 'Type a message…';
    this._textarea.rows = 1;
    this._textarea.setAttribute('aria-label', 'Chat message');
    this._textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this._handleSend();
      }
    });
    this._textarea.addEventListener('input', () => this._autoResize());

    this._sendBtn = document.createElement('button');
    this._sendBtn.type = 'submit';
    this._sendBtn.className = 'message-input__send-btn';
    this._sendBtn.setAttribute('aria-label', 'Send message');
    this._sendBtn.setAttribute('title', 'Send message');
    this._sendBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M2.72 2.05a.75.75 0 01.82.13l14 12a.75.75 0 010 1.14l-14 12a.75.75 0 01-1.22-.68l1.8-8.14H9a.75.75 0 000-1.5H4.12L2.32 9.36a.75.75 0 01.4-1.31z"/></svg>`;

    form.append(this._textarea, this._sendBtn);
    this._container.appendChild(form);
  }

  _handleSend() {
    if (this._disabled) return;
    const text = this._textarea.value.trim();
    if (!text) return;
    this._onSend?.(text);
    this.clear();
  }

  _autoResize() {
    this._textarea.style.height = 'auto';
    const maxHeight = 150;
    this._textarea.style.height = Math.min(this._textarea.scrollHeight, maxHeight) + 'px';
  }
}
