import { useState } from "react";
import { useAppContext } from "../../store/AppContext.jsx";

const TeamChat = () => {
  const { chats, addMessage, createChat, addMemberToChat, talentPool, microTeam } = useAppContext();
  const [selectedChatId, setSelectedChatId] = useState(chats[0]?.id || null);
  const [text, setText] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatName, setNewChatName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [showAddMember, setShowAddMember] = useState(false);

  const selectedChat = chats.find((c) => c.id === selectedChatId);
  const currentUser = localStorage.getItem("qazaq-email") || "You";

  const send = () => {
    if (!text.trim() || !selectedChatId) return;
    addMessage({
      chatId: selectedChatId,
      sender: currentUser,
      text: text.trim(),
    });
    setText("");
  };

  const handleCreateChat = () => {
    if (!newChatName.trim()) return;
    const members = selectedMembers.length > 0 
      ? selectedMembers 
      : [...microTeam, { id: "ai", name: "🤖 AI Assistant" }];
    const chatId = createChat(newChatName, members);
    setSelectedChatId(chatId);
    setNewChatName("");
    setSelectedMembers([]);
    setShowNewChat(false);
  };

  const handleAddMemberToChat = (member) => {
    if (selectedChat) {
      addMemberToChat(selectedChat.id, member);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[75vh]">
      {/* Боковая панель чатов */}
      <div className="cute-card p-4 overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-brand-bean">Чаты</h3>
          <button
            onClick={() => setShowNewChat(!showNewChat)}
            className="cute-btn px-2 py-1 text-xs"
          >
            +
          </button>
        </div>

        {/* Форма создания чата */}
        {showNewChat && (
          <div className="mb-4 p-3 bg-[#f3e8da] rounded-lg border-2 border-brand-bean">
            <input
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
              placeholder="Имя чата"
              className="w-full border-2 border-brand-bean rounded px-2 py-1 text-xs mb-2"
            />
            <button
              onClick={handleCreateChat}
              className="cute-btn w-full py-2 text-xs"
            >
              Создать
            </button>
          </div>
        )}

        {/* Список чатов */}
        <div className="space-y-2 flex-1">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChatId(chat.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition ${
                selectedChatId === chat.id
                  ? "bg-brand-mint text-brand-bean"
                  : "bg-[#f3e8da] text-brand-bean hover:bg-brand-rose/30"
              }`}
            >
              <div className="truncate">{chat.name}</div>
              <div className="text-xs text-brand-bean/60">
                {chat.messages.length} сообщений
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Главное окно чата */}
      {selectedChat ? (
        <div className="col-span-1 md:col-span-3 cute-card flex flex-col overflow-hidden">
          {/* Заголовок */}
          <div className="border-b-2 border-brand-bean bg-[#f3e8da] p-4 flex justify-between items-center">
            <div>
              <h2 className="font-bold text-brand-bean">{selectedChat.name}</h2>
              <p className="text-xs text-brand-bean/60">
                {selectedChat.members.length} участников
              </p>
            </div>
            <button
              onClick={() => setShowAddMember(!showAddMember)}
              className="cute-btn px-3 py-2 text-xs"
            >
              + Участник
            </button>
          </div>

          {/* Добавление участников */}
          {showAddMember && (
            <div className="border-b-2 border-brand-bean bg-[#f3e8da] p-3 max-h-32 overflow-y-auto">
              <p className="text-xs font-bold mb-2">Выбери участника:</p>
              <div className="grid grid-cols-2 gap-2">
                {talentPool.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      handleAddMemberToChat(user);
                      setShowAddMember(false);
                    }}
                    className="text-xs bg-brand-mint border-2 border-brand-bean rounded px-2 py-1 hover:shadow-md"
                  >
                    {user.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Сообщения */}
          <div className="custom-scrollbar flex-1 overflow-y-auto p-4 space-y-3">
            {selectedChat.messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-brand-bean/50 text-sm">
                Нет сообщений. Начните разговор!
              </div>
            ) : (
              selectedChat.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === currentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl border-2 border-brand-bean p-3 text-sm ${
                      msg.sender === currentUser
                        ? "bg-brand-mint text-brand-bean"
                        : "bg-[#f3e8da] text-brand-bean"
                    }`}
                  >
                    <p className="text-xs font-semibold mb-1">{msg.sender}</p>
                    <p>{msg.text}</p>
                    <p className="text-xs mt-1 opacity-70">{msg.timestamp}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Ввод сообщения */}
          <div className="border-t-2 border-brand-bean bg-[#f3e8da] p-4">
            <div className="flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                className="flex-1 rounded-xl border-2 border-brand-bean bg-brand-cream px-4 py-2 text-sm text-brand-bean outline-none"
                placeholder="Напишите сообщение..."
              />
              <button onClick={send} className="cute-btn px-4 py-2 text-xs">
                Отправить
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="col-span-1 md:col-span-3 cute-card flex items-center justify-center">
          <p className="text-brand-bean/50">Выберите чат или создайте новый</p>
        </div>
      )}
    </div>
  );
};

export default TeamChat;
