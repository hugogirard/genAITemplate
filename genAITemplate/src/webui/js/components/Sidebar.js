/**
 * Sidebar – Left panel showing chat history and "New Chat" button.
 * Future web component: <contoso-sidebar>
 */
export class Sidebar {
  /**
   * @param {HTMLElement} container
   */
  constructor(container) {
    this._container = container;
    this._chats = [];
    this._activeChatId = null;
    this._onSelectChat = null;
    this._onNewChat = null;
    this._onDeleteChat = null;
    this.render();
  }

  /** @param {Function} cb - (chatId: string) => void */
  set onSelectChat(cb) { this._onSelectChat = cb; }

  /** @param {Function} cb - () => void */
  set onNewChat(cb) { this._onNewChat = cb; }

  /** @param {Function} cb - (chatId: string) => void */
  set onDeleteChat(cb) { this._onDeleteChat = cb; }

  /**
   * Update the chat list.
   * @param {Array} chats
   * @param {string|null} activeChatId
   */
  update(chats, activeChatId = null) {
    this._chats = chats;
    this._activeChatId = activeChatId;
    this._renderList();
  }

  /** Set active chat highlight */
  setActive(chatId) {
    this._activeChatId = chatId;
    this._container.querySelectorAll('.sidebar__chat-item').forEach((el) => {
      el.classList.toggle('sidebar__chat-item--active', el.dataset.chatId === chatId);
    });
  }

  /** Toggle collapsed/expanded */
  toggle() {
    this._container.classList.toggle('sidebar--collapsed');
  }

  render() {
    this._container.innerHTML = '';
    this._container.className = 'sidebar';

    // New chat button
    const newChatBtn = document.createElement('button');
    newChatBtn.className = 'sidebar__new-chat-btn';
    newChatBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2.5a.5.5 0 01.5.5v6.5H17a.5.5 0 010 1h-6.5V17a.5.5 0 01-1 0v-6.5H3a.5.5 0 010-1h6.5V3a.5.5 0 01.5-.5z"/></svg>
      <span>New Chat</span>
    `;
    newChatBtn.addEventListener('click', () => this._onNewChat?.());

    // Chat list container
    this._listEl = document.createElement('nav');
    this._listEl.className = 'sidebar__chat-list';
    this._listEl.setAttribute('aria-label', 'Chat history');

    this._container.append(newChatBtn, this._listEl);
  }

  _renderList() {
    this._listEl.innerHTML = '';

    if (this._chats.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'sidebar__empty';
      empty.textContent = 'No conversations yet';
      this._listEl.appendChild(empty);
      return;
    }

    // Group chats: Today, Yesterday, Previous 7 Days, Older
    const groups = this._groupChats(this._chats);

    for (const [label, chats] of groups) {
      if (chats.length === 0) continue;
      const groupEl = document.createElement('div');
      groupEl.className = 'sidebar__group';

      const heading = document.createElement('div');
      heading.className = 'sidebar__group-label';
      heading.textContent = label;
      groupEl.appendChild(heading);

      for (const chat of chats) {
        const item = this._createChatItem(chat);
        groupEl.appendChild(item);
      }
      this._listEl.appendChild(groupEl);
    }
  }

  _createChatItem(chat) {
    const item = document.createElement('div');
    item.className = 'sidebar__chat-item';
    if (chat.id === this._activeChatId) {
      item.classList.add('sidebar__chat-item--active');
    }
    item.dataset.chatId = chat.id;
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');

    const titleSpan = document.createElement('span');
    titleSpan.className = 'sidebar__chat-title';
    titleSpan.textContent = chat.title;
    titleSpan.title = chat.title;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'sidebar__delete-btn';
    deleteBtn.setAttribute('aria-label', `Delete "${chat.title}"`);
    deleteBtn.setAttribute('title', 'Delete chat');
    deleteBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path d="M8.5 4h3a1.5 1.5 0 00-3 0zm-1 0a2.5 2.5 0 015 0h4a.5.5 0 010 1h-.6l-1.1 11.17A2.5 2.5 0 0112.32 18H7.68a2.5 2.5 0 01-2.48-2.23L4.1 5H3.5a.5.5 0 010-1h4zm-2.4 1l1.08 11.07a1.5 1.5 0 001.5 1.33h4.64a1.5 1.5 0 001.5-1.33L14.9 5H5.1zM8.5 7.5a.5.5 0 01.5.5v7a.5.5 0 01-1 0V8a.5.5 0 01.5-.5zm3 0a.5.5 0 01.5.5v7a.5.5 0 01-1 0V8a.5.5 0 01.5-.5z"/></svg>`;
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this._onDeleteChat?.(chat.id);
    });

    item.append(titleSpan, deleteBtn);

    item.addEventListener('click', () => this._onSelectChat?.(chat.id));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this._onSelectChat?.(chat.id);
      }
    });

    return item;
  }

  _groupChats(chats) {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday.getTime() - 86400000);
    const startOf7Days = new Date(startOfToday.getTime() - 7 * 86400000);

    const groups = new Map([
      ['Today', []],
      ['Yesterday', []],
      ['Previous 7 Days', []],
      ['Older', []],
    ]);

    for (const chat of chats) {
      const d = new Date(chat.updatedAt);
      if (d >= startOfToday) groups.get('Today').push(chat);
      else if (d >= startOfYesterday) groups.get('Yesterday').push(chat);
      else if (d >= startOf7Days) groups.get('Previous 7 Days').push(chat);
      else groups.get('Older').push(chat);
    }
    return groups;
  }
}
