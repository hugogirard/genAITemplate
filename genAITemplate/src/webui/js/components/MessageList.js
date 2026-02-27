/**
 * MessageList – Renders the messages within a conversation.
 * Future web component: <contoso-message-list>
 */
export class MessageList {
  /**
   * @param {HTMLElement} container
   */
  constructor(container) {
    this._container = container;
    this.render();
  }

  render() {
    this._container.innerHTML = '';
    this._container.className = 'message-list';

    this._messagesEl = document.createElement('div');
    this._messagesEl.className = 'message-list__messages';

    this._container.appendChild(this._messagesEl);
    this._showWelcome();
  }

  /**
   * Replaces all messages.
   * @param {Array} messages
   */
  setMessages(messages) {
    this._messagesEl.innerHTML = '';
    if (messages.length === 0) {
      this._showWelcome();
      return;
    }
    messages.forEach((msg) => this._appendMessageElement(msg));
    this._scrollToBottom();
  }

  /**
   * Appends a single message and scrolls.
   * @param {Object} message
   */
  appendMessage(message) {
    // Remove welcome screen if present
    const welcome = this._messagesEl.querySelector('.message-list__welcome');
    if (welcome) welcome.remove();

    this._appendMessageElement(message);
    this._scrollToBottom();
  }

  /** Show typing indicator */
  showTyping() {
    this.hideTyping();
    const indicator = document.createElement('div');
    indicator.className = 'message-list__typing';
    indicator.innerHTML = `
      <div class="message-bubble message-bubble--assistant">
        <div class="typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    this._messagesEl.appendChild(indicator);
    this._scrollToBottom();
  }

  /** Remove typing indicator */
  hideTyping() {
    const existing = this._messagesEl.querySelector('.message-list__typing');
    if (existing) existing.remove();
  }

  /** Scroll to the bottom of the container */
  clear() {
    this._messagesEl.innerHTML = '';
    this._showWelcome();
  }

  // ─── Private ────────────────────────────────────────────

  _showWelcome() {
    const welcome = document.createElement('div');
    welcome.className = 'message-list__welcome';
    welcome.innerHTML = `
      <svg width="48" height="48" viewBox="0 0 28 28" fill="none">
        <rect width="28" height="28" rx="6" fill="#0078D4"/>
        <rect x="7" y="10" width="14" height="11" rx="3" fill="white"/>
        <circle cx="11" cy="15" r="1.5" fill="#0078D4"/>
        <circle cx="17" cy="15" r="1.5" fill="#0078D4"/>
        <rect x="12" y="18" width="4" height="1.2" rx="0.6" fill="#0078D4"/>
        <rect x="12.5" y="6" width="3" height="4" rx="1.5" fill="white"/>
        <circle cx="14" cy="5.5" r="1.5" fill="white"/>
      </svg>
      <h2>How can I help you today?</h2>
      <p>Ask me anything — I'm Contoso's AI assistant.</p>
    `;
    this._messagesEl.appendChild(welcome);
  }

  _appendMessageElement(message) {
    const wrapper = document.createElement('div');
    wrapper.className = `message-list__item message-list__item--${message.role}`;

    const avatar = document.createElement('div');
    avatar.className = `message-avatar message-avatar--${message.role}`;
    if (message.role === 'assistant') {
      avatar.innerHTML = `<svg width="20" height="20" viewBox="0 0 28 28" fill="none"><rect width="28" height="28" rx="6" fill="#0078D4"/><rect x="7" y="10" width="14" height="11" rx="3" fill="white"/><circle cx="11" cy="15" r="1.5" fill="#0078D4"/><circle cx="17" cy="15" r="1.5" fill="#0078D4"/><rect x="12" y="18" width="4" height="1.2" rx="0.6" fill="#0078D4"/><rect x="12.5" y="6" width="3" height="4" rx="1.5" fill="white"/><circle cx="14" cy="5.5" r="1.5" fill="white"/></svg>`;
    } else {
      avatar.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a4 4 0 100 8 4 4 0 000-8zm-5 9a3 3 0 00-3 3v.5c0 1.97 2.73 4.5 8 4.5s8-2.53 8-4.5V14a3 3 0 00-3-3H5z"/></svg>`;
    }

    const bubble = document.createElement('div');
    bubble.className = `message-bubble message-bubble--${message.role}`;
    bubble.innerHTML = this._formatContent(message.content);

    const time = document.createElement('div');
    time.className = 'message-time';
    time.textContent = this._formatTime(message.createdAt);

    wrapper.append(avatar, bubble, time);
    this._messagesEl.appendChild(wrapper);
  }

  _formatContent(text) {
    // Basic markdown-ish: bold, newlines, lists
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  _formatTime(isoString) {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  _scrollToBottom() {
    requestAnimationFrame(() => {
      this._container.scrollTop = this._container.scrollHeight;
    });
  }
}
