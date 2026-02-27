/**
 * AppHeader – Top application bar with Contoso logo and title.
 * Future web component: <contoso-app-header>
 */
export class AppHeader {
  /**
   * @param {HTMLElement} container
   */
  constructor(container) {
    this._container = container;
    this._onNewChat = null;
    this._onToggleSidebar = null;
    this.render();
  }

  /** @param {Function} cb */
  set onNewChat(cb) { this._onNewChat = cb; }

  /** @param {Function} cb */
  set onToggleSidebar(cb) { this._onToggleSidebar = cb; }

  render() {
    this._container.innerHTML = '';
    this._container.className = 'app-header';

    // Sidebar toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'app-header__toggle';
    toggleBtn.setAttribute('aria-label', 'Toggle sidebar');
    toggleBtn.setAttribute('title', 'Toggle sidebar');
    toggleBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M2 4.5A.5.5 0 012.5 4h15a.5.5 0 010 1h-15A.5.5 0 012 4.5zm0 5A.5.5 0 012.5 9h15a.5.5 0 010 1h-15A.5.5 0 012 9.5zm.5 4.5a.5.5 0 000 1h15a.5.5 0 000-1h-15z"/></svg>`;
    toggleBtn.addEventListener('click', () => this._onToggleSidebar?.());

    // Logo + brand
    const brand = document.createElement('div');
    brand.className = 'app-header__brand';
    brand.innerHTML = `
      <svg class="app-header__logo" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="28" height="28" rx="6" fill="#0078D4"/>
        <rect x="7" y="10" width="14" height="11" rx="3" fill="white"/>
        <circle cx="11" cy="15" r="1.5" fill="#0078D4"/>
        <circle cx="17" cy="15" r="1.5" fill="#0078D4"/>
        <rect x="12" y="18" width="4" height="1.2" rx="0.6" fill="#0078D4"/>
        <rect x="12.5" y="6" width="3" height="4" rx="1.5" fill="white"/>
        <circle cx="14" cy="5.5" r="1.5" fill="white"/>
      </svg>
      <span class="app-header__title">Contoso Chat</span>
    `;

    // New chat button (header shortcut)
    const newChatBtn = document.createElement('button');
    newChatBtn.className = 'app-header__new-chat';
    newChatBtn.setAttribute('aria-label', 'New chat');
    newChatBtn.setAttribute('title', 'New chat');
    newChatBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2.5a.5.5 0 01.5.5v6.5H17a.5.5 0 010 1h-6.5V17a.5.5 0 01-1 0v-6.5H3a.5.5 0 010-1h6.5V3a.5.5 0 01.5-.5z"/></svg>`;
    newChatBtn.addEventListener('click', () => this._onNewChat?.());

    this._container.append(toggleBtn, brand, newChatBtn);
  }
}
