/**
 * App – Main application orchestrator.
 * Wires together all components and the ChatService.
 * Future web component: <contoso-app>
 */
import { ChatService } from './services/ChatService.js';
import { AppHeader } from './components/AppHeader.js';
import { Sidebar } from './components/Sidebar.js';
import { ChatWindow } from './components/ChatWindow.js';

export class App {
  constructor() {
    this._chatService = new ChatService();
    this._activeChatId = null;
    this._init();
  }

  async _init() {
    // ── Mount components ──────────────────────────────────
    this._appHeader = new AppHeader(document.getElementById('app-header'));
    this._sidebar = new Sidebar(document.getElementById('sidebar'));
    this._chatWindow = new ChatWindow(document.getElementById('chat-window'));

    // ── Wire events ──────────────────────────────────────
    this._appHeader.onNewChat = () => this.createNewChat();
    this._appHeader.onToggleSidebar = () => this._sidebar.toggle();

    this._sidebar.onNewChat = () => this.createNewChat();
    this._sidebar.onSelectChat = (id) => this.openChat(id);
    this._sidebar.onDeleteChat = (id) => this.deleteChat(id);

    this._chatWindow.onSendMessage = (chatId, text) => this.sendMessage(chatId, text);
    this._chatWindow.onRenameChat = (chatId, title) => this.renameChat(chatId, title);

    // ── Load existing chats ──────────────────────────────
    await this._refreshChatList();

    // Open the most recent chat if available
    const chats = await this._chatService.getChats();
    if (chats.length > 0) {
      await this.openChat(chats[0].id);
    }
  }

  // ─── Public actions ────────────────────────────────────

  async createNewChat() {
    try {
      const chat = await this._chatService.createChat();
      await this._refreshChatList(chat.id);
      this._chatWindow.loadChat(chat);
      this._activeChatId = chat.id;
    } catch (err) {
      console.error('Failed to create chat:', err);
    }
  }

  async openChat(chatId) {
    try {
      const chat = await this._chatService.getChat(chatId);
      this._activeChatId = chatId;
      this._sidebar.setActive(chatId);
      this._chatWindow.loadChat(chat);
    } catch (err) {
      console.error('Failed to open chat:', err);
    }
  }

  async deleteChat(chatId) {
    if (!confirm('Delete this conversation?')) return;
    try {
      await this._chatService.deleteChat(chatId);
      if (this._activeChatId === chatId) {
        this._activeChatId = null;
        this._chatWindow.showEmpty();
      }
      await this._refreshChatList(this._activeChatId);

      // Open next available chat if we just deleted the active one
      if (!this._activeChatId) {
        const chats = await this._chatService.getChats();
        if (chats.length > 0) {
          await this.openChat(chats[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to delete chat:', err);
    }
  }

  async renameChat(chatId, newTitle) {
    try {
      await this._chatService.renameChat(chatId, newTitle);
      this._chatWindow.updateTitle(newTitle);
      await this._refreshChatList(this._activeChatId);
    } catch (err) {
      console.error('Failed to rename chat:', err);
    }
  }

  async sendMessage(chatId, text) {
    try {
      // Immediately show user message
      const tempUserMsg = {
        id: `temp-${Date.now()}`,
        chatId,
        role: 'user',
        content: text,
        createdAt: new Date().toISOString(),
      };
      this._chatWindow.appendMessage(tempUserMsg);
      this._chatWindow.setInputDisabled(true);
      this._chatWindow.showTyping();

      const { botMessage } = await this._chatService.sendMessage(chatId, text);

      this._chatWindow.hideTyping();
      this._chatWindow.appendMessage(botMessage);
      this._chatWindow.setInputDisabled(false);

      // Refresh sidebar to get updated titles / order
      await this._refreshChatList(this._activeChatId);
    } catch (err) {
      console.error('Failed to send message:', err);
      this._chatWindow.hideTyping();
      this._chatWindow.setInputDisabled(false);
    }
  }

  // ─── Private helpers ───────────────────────────────────

  async _refreshChatList(activeChatId = null) {
    const chats = await this._chatService.getChats();
    this._sidebar.update(chats, activeChatId || this._activeChatId);
  }
}

// ── Bootstrap ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  window.__contosoApp = new App();
});
