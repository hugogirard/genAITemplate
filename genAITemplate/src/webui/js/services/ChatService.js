/**
 * ChatService - Service layer for all chat-related API calls.
 * All methods return Promises and are currently mocked.
 * Replace mock implementations with real API calls when ready.
 */
export class ChatService {
  constructor(baseUrl = '/api') {
    this._baseUrl = baseUrl;
    this._chats = new Map();
    this._nextChatId = 1;
    this._nextMessageId = 1;

    // Seed some demo conversations
    this._seedData();
  }

  // ─── Chat CRUD ──────────────────────────────────────────

  /**
   * GET /api/chats
   * Returns all conversations (summary only).
   * @returns {Promise<Array<{id:string, title:string, createdAt:string, updatedAt:string}>>}
   */
  async getChats() {
    await this._simulateLatency();
    return Array.from(this._chats.values()).map((chat) => ({
      id: chat.id,
      title: chat.title,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    })).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  /**
   * POST /api/chats
   * Creates a new conversation.
   * @param {string} [title]
   * @returns {Promise<{id:string, title:string, messages:Array, createdAt:string, updatedAt:string}>}
   */
  async createChat(title = 'New Chat') {
    await this._simulateLatency();
    const now = new Date().toISOString();
    const chat = {
      id: `chat-${this._nextChatId++}`,
      title,
      messages: [],
      createdAt: now,
      updatedAt: now,
    };
    this._chats.set(chat.id, chat);
    return { ...chat };
  }

  /**
   * GET /api/chats/:id
   * Returns a full conversation with messages.
   * @param {string} chatId
   * @returns {Promise<Object>}
   */
  async getChat(chatId) {
    await this._simulateLatency();
    const chat = this._chats.get(chatId);
    if (!chat) throw new Error(`Chat ${chatId} not found`);
    return { ...chat, messages: [...chat.messages] };
  }

  /**
   * DELETE /api/chats/:id
   * Deletes a conversation.
   * @param {string} chatId
   * @returns {Promise<void>}
   */
  async deleteChat(chatId) {
    await this._simulateLatency();
    if (!this._chats.has(chatId)) throw new Error(`Chat ${chatId} not found`);
    this._chats.delete(chatId);
  }

  /**
   * PATCH /api/chats/:id
   * Renames a conversation.
   * @param {string} chatId
   * @param {string} title
   * @returns {Promise<Object>}
   */
  async renameChat(chatId, title) {
    await this._simulateLatency();
    const chat = this._chats.get(chatId);
    if (!chat) throw new Error(`Chat ${chatId} not found`);
    chat.title = title;
    chat.updatedAt = new Date().toISOString();
    return { ...chat };
  }

  // ─── Messages ───────────────────────────────────────────

  /**
   * POST /api/chats/:id/messages
   * Sends a user message and receives a bot response.
   * @param {string} chatId
   * @param {string} content - User message text
   * @returns {Promise<{userMessage: Object, botMessage: Object}>}
   */
  async sendMessage(chatId, content) {
    await this._simulateLatency();
    const chat = this._chats.get(chatId);
    if (!chat) throw new Error(`Chat ${chatId} not found`);

    const now = new Date().toISOString();

    const userMessage = {
      id: `msg-${this._nextMessageId++}`,
      chatId,
      role: 'user',
      content,
      createdAt: now,
    };
    chat.messages.push(userMessage);

    // Auto-title on first message
    if (chat.messages.length === 1) {
      chat.title = content.length > 40 ? content.substring(0, 40) + '…' : content;
    }

    // Simulate bot thinking
    await this._simulateLatency(600, 1200);

    const botMessage = {
      id: `msg-${this._nextMessageId++}`,
      chatId,
      role: 'assistant',
      content: this._generateMockReply(content),
      createdAt: new Date().toISOString(),
    };
    chat.messages.push(botMessage);
    chat.updatedAt = new Date().toISOString();

    return { userMessage, botMessage };
  }

  // ─── Helpers (private) ──────────────────────────────────

  _simulateLatency(min = 100, max = 300) {
    const ms = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  _generateMockReply(userInput) {
    const replies = [
      `That's an interesting point about "${userInput.substring(0, 30)}…". Let me think about that.`,
      `Thanks for asking! Here's what I know: Contoso's AI assistant is designed to help you with a wide range of tasks including answering questions, generating content, and providing recommendations.`,
      `Great question! Based on the Contoso knowledge base, I can tell you that our services cover enterprise solutions, cloud computing, and digital transformation strategies.`,
      `I'd be happy to help with that. Could you provide a bit more context so I can give you the most accurate answer?`,
      `Here's a summary:\n\n1. **First**, we analyze your requirements.\n2. **Then**, we match them against our solutions catalog.\n3. **Finally**, we provide a tailored recommendation.\n\nWould you like me to go deeper on any of these steps?`,
      `According to our latest data, Contoso has helped over 10,000 enterprises streamline their workflows. Let me know if you'd like specific case studies!`,
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }

  _seedData() {
    const ago = (minutes) => new Date(Date.now() - minutes * 60000).toISOString();

    const chat1 = {
      id: `chat-${this._nextChatId++}`,
      title: 'Project planning discussion',
      createdAt: ago(120),
      updatedAt: ago(30),
      messages: [
        { id: `msg-${this._nextMessageId++}`, chatId: 'chat-1', role: 'user', content: 'Can you help me plan our Q3 project milestones?', createdAt: ago(120) },
        { id: `msg-${this._nextMessageId++}`, chatId: 'chat-1', role: 'assistant', content: 'Of course! Let\'s start by identifying the key deliverables for Q3. Could you share the main objectives your team is focusing on?', createdAt: ago(119) },
        { id: `msg-${this._nextMessageId++}`, chatId: 'chat-1', role: 'user', content: 'We need to launch the new customer portal and migrate the legacy database.', createdAt: ago(115) },
        { id: `msg-${this._nextMessageId++}`, chatId: 'chat-1', role: 'assistant', content: 'Here\'s a suggested timeline:\n\n**Month 1:** Requirements gathering & design for the portal; begin database audit.\n**Month 2:** Portal development sprint; start data migration scripts.\n**Month 3:** QA, UAT, and go-live for both.\n\nShall I break these down further?', createdAt: ago(114) },
      ],
    };

    const chat2 = {
      id: `chat-${this._nextChatId++}`,
      title: 'Azure deployment questions',
      createdAt: ago(1440),
      updatedAt: ago(1400),
      messages: [
        { id: `msg-${this._nextMessageId++}`, chatId: 'chat-2', role: 'user', content: 'What\'s the best way to deploy a static web app on Azure?', createdAt: ago(1440) },
        { id: `msg-${this._nextMessageId++}`, chatId: 'chat-2', role: 'assistant', content: 'Azure Static Web Apps is the recommended service. It integrates directly with GitHub for CI/CD and supports custom domains, authentication, and serverless API backends out of the box.', createdAt: ago(1439) },
      ],
    };

    const chat3 = {
      id: `chat-${this._nextChatId++}`,
      title: 'Marketing copy review',
      createdAt: ago(4320),
      updatedAt: ago(4300),
      messages: [
        { id: `msg-${this._nextMessageId++}`, chatId: 'chat-3', role: 'user', content: 'Can you review this tagline: "Contoso — Empowering every team to achieve more"?', createdAt: ago(4320) },
        { id: `msg-${this._nextMessageId++}`, chatId: 'chat-3', role: 'assistant', content: 'That\'s a strong tagline! It\'s concise and action-oriented. Consider also testing: "Contoso — Unlock your team\'s potential" for a slightly more aspirational tone.', createdAt: ago(4319) },
      ],
    };

    this._chats.set(chat1.id, chat1);
    this._chats.set(chat2.id, chat2);
    this._chats.set(chat3.id, chat3);
  }
}
