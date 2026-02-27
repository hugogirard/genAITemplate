/**
 * ChatHeader – Displays the current chat title and actions.
 * Future web component: <contoso-chat-header>
 */
export class ChatHeader {
  /**
   * @param {HTMLElement} container
   */
  constructor(container) {
    this._container = container;
    this._title = '';
    this._chatId = null;
    this._onRename = null;
    this.render();
  }

  /** @param {Function} cb - (chatId, newTitle) => void */
  set onRename(cb) { this._onRename = cb; }

  /**
   * @param {string} chatId
   * @param {string} title
   */
  update(chatId, title) {
    this._chatId = chatId;
    this._title = title;
    if (this._titleEl) this._titleEl.textContent = title;
  }

  clear() {
    this._chatId = null;
    this._title = '';
    if (this._titleEl) this._titleEl.textContent = '';
  }

  render() {
    this._container.innerHTML = '';
    this._container.className = 'chat-header';

    this._titleEl = document.createElement('h2');
    this._titleEl.className = 'chat-header__title';
    this._titleEl.textContent = this._title;

    // Rename button
    const renameBtn = document.createElement('button');
    renameBtn.className = 'chat-header__rename-btn';
    renameBtn.setAttribute('aria-label', 'Rename chat');
    renameBtn.setAttribute('title', 'Rename chat');
    renameBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M15.22 2.16a2.5 2.5 0 013.54 0l.08.08a2.5 2.5 0 010 3.54L7.89 16.73a2.5 2.5 0 01-1.2.65l-3.34.84a.75.75 0 01-.91-.91l.84-3.34a2.5 2.5 0 01.65-1.2L15.22 2.16zm2.47 1.06a1 1 0 00-1.41 0L5.33 14.17a1 1 0 00-.26.48l-.55 2.18 2.18-.55a1 1 0 00.48-.26L18.13 4.97a1 1 0 000-1.41l-.08-.08-.36.35.36-.35z"/></svg>`;
    renameBtn.addEventListener('click', () => {
      if (!this._chatId) return;
      const newTitle = prompt('Rename chat:', this._title);
      if (newTitle && newTitle.trim()) {
        this._onRename?.(this._chatId, newTitle.trim());
      }
    });

    this._container.append(this._titleEl, renameBtn);
  }
}
