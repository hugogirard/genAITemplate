/**
 * ChatWindow – Orchestrates MessageList + MessageInput for the active chat.
 * Future web component: <contoso-chat-window>
 */
import { ChatHeader } from './ChatHeader.js';
import { MessageList } from './MessageList.js';
import { MessageInput } from './MessageInput.js';

export class ChatWindow {
  /**
   * @param {HTMLElement} container
   */
  constructor(container) {
    this._container = container;
    this._onSendMessage = null;
    this._onRenameChat = null;
    this.render();
  }

  /** @param {Function} cb - (chatId, text) => void */
  set onSendMessage(cb) { this._onSendMessage = cb; }

  /** @param {Function} cb - (chatId, newTitle) => void */
  set onRenameChat(cb) {
    this._onRenameChat = cb;
    if (this._chatHeader) this._chatHeader.onRename = cb;
  }

  /**
   * Load a full conversation into the window.
   * @param {Object} chat - { id, title, messages }
   */
  loadChat(chat) {
    this._currentChatId = chat.id;
    this._chatHeader.update(chat.id, chat.title);
    this._messageList.setMessages(chat.messages);
    this._messageInput.setDisabled(false);
    this._messageInput.focus();
    this._container.classList.remove('chat-window--empty');
  }

  /** Show the empty state */
  showEmpty() {
    this._currentChatId = null;
    this._chatHeader.clear();
    this._messageList.clear();
    this._messageInput.setDisabled(true);
    this._container.classList.add('chat-window--empty');
  }

  /** Append a single message to the current view */
  appendMessage(message) {
    this._messageList.appendMessage(message);
  }

  /** Update the chat title in the header */
  updateTitle(title) {
    this._chatHeader.update(this._currentChatId, title);
  }

  /** Show the typing indicator */
  showTyping() { this._messageList.showTyping(); }

  /** Hide the typing indicator */
  hideTyping() { this._messageList.hideTyping(); }

  /** Disable input while processing */
  setInputDisabled(disabled) { this._messageInput.setDisabled(disabled); }

  render() {
    this._container.innerHTML = '';
    this._container.className = 'chat-window chat-window--empty';

    // Header
    const headerEl = document.createElement('div');
    headerEl.id = 'chat-header';
    this._chatHeader = new ChatHeader(headerEl);

    // Messages
    const messagesEl = document.createElement('div');
    messagesEl.id = 'message-list';
    this._messageList = new MessageList(messagesEl);

    // Input
    const inputEl = document.createElement('div');
    inputEl.id = 'message-input';
    this._messageInput = new MessageInput(inputEl);
    this._messageInput.onSend = (text) => {
      if (this._currentChatId) {
        this._onSendMessage?.(this._currentChatId, text);
      }
    };

    // Disclaimer
    const disclaimer = document.createElement('div');
    disclaimer.className = 'chat-window__disclaimer';
    disclaimer.textContent = 'Contoso AI can make mistakes. Verify important information.';

    this._container.append(headerEl, messagesEl, inputEl, disclaimer);
  }
}
