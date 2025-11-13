import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Clock, CheckCircle, AlertCircle, Search, Filter } from 'lucide-react';
import { useToast } from '../../components/Toast';
import { getHelpSessions, createMessage, closeHelpSession, markMessageViewed } from '../../api/client';

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-sm border p-6 ${className}`} style={{ borderColor: 'var(--border)' }}>
    {children}
  </div>
);

// initial empty state; real data fetched from API
const initialSessions = [];

export default function HelpSessions() {
  const { add } = useToast();
  const [sessions, setSessions] = useState(initialSessions);
  const [selectedSession, setSelectedSession] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'closed'
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getHelpSessions();
        if (!mounted) return;
        setSessions(data);
      } catch (err) {
        console.error(err);
        add('Failed to load help sessions');
      }
    })();
    return () => { mounted = false; };
  }, [add]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedSession) return;

    const newMessage = {
      // server will assign id and timestamps; include session id
      sessionId: selectedSession.id,
      content: messageInput,
      sentByAdmin: true
    };

    // send to backend
    createMessage(newMessage).then((created) => {
      // backend returns created message with id and sentDate
      setSessions(prev => prev.map(session =>
        session.id === selectedSession.id
          ? { ...session, messages: [...session.messages, created] }
          : session
      ));

      setSelectedSession(prev => ({
        ...prev,
        messages: [...prev.messages, created]
      }));

      setMessageInput('');
      add('Message sent!');
    }).catch(err => {
      console.error(err);
      add('Failed to send message');
    });
  };

  const handleCloseSession = (sessionId) => {
    // call backend to close session
    closeHelpSession(sessionId).then((updated) => {
      setSessions(prev => prev.map(session =>
        session.id === sessionId
          ? { ...session, status: 'closed', endSession: updated.endSession }
          : session
      ));
      if (selectedSession?.id === sessionId) {
        setSelectedSession(prev => ({ ...prev, status: 'closed', endSession: updated.endSession }));
      }
      add('Session closed');
    }).catch(err => {
      console.error(err);
      add('Failed to close session');
    });
  };

  const markAsRead = (sessionId) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    // Mark messages locally and call API for each message that needs marking
    const toMark = session.messages.filter(m => !m.sentByAdmin && !m.viewedByAdmin);
    toMark.forEach(m => {
      markMessageViewed(m.id, true).then(() => {
        setSessions(prev => prev.map(s =>
          s.id === sessionId
            ? { ...s, messages: s.messages.map(msg => msg.id === m.id ? { ...msg, viewedByAdmin: true } : msg) }
            : s
        ));
      }).catch(err => {
        console.error('Failed to mark message viewed', err);
      });
    });
  };

  const filteredSessions = sessions.filter(session => {
    const matchesFilter = filter === 'all' || session.status === filter;
    const matchesSearch = session.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: sessions.length,
    active: sessions.filter(s => s.status === 'active').length,
    closed: sessions.filter(s => s.status === 'closed').length,
    unread: sessions.filter(s => s.messages.some(m => !m.sentByAdmin && !m.viewedByAdmin)).length
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <MessageCircle className="w-8 h-8" style={{ color: 'var(--accent)' }} />
            Help Sessions
          </h1>
          <p className="text-gray-600 mt-1">Manage user support conversations</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setFilter('all')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Sessions</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--surface)' }}>
                <MessageCircle className="w-6 h-6" style={{ color: 'var(--accent)' }} />
              </div>
            </div>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setFilter('active')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Active</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.active}</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-100">
                <AlertCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setFilter('closed')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Closed</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.closed}</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-100">
                <CheckCircle className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Unread Messages</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.unread}</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--surface)' }}>
                <span className="text-xl" style={{ color: 'var(--accent)' }}>📬</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sessions List */}
          <Card className="lg:col-span-4 h-[calc(100vh-400px)] flex flex-col">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-[var(--accent)] outline-none text-sm"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>
                <button
                  className="p-2 border rounded-lg hover:bg-[var(--surface)] transition-colors"
                  style={{ borderColor: 'var(--border)' }}
                  title="Filter"
                >
                  <Filter className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2">
                {['all', 'active', 'closed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filter === status
                        ? 'bg-[var(--accent)] text-white'
                        : 'bg-white border text-gray-600 hover:bg-[var(--surface)]'
                    }`}
                    style={filter !== status ? { borderColor: 'var(--border)' } : {}}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-2">
              {filteredSessions.map((session) => {
                const hasUnread = session.messages.some(m => !m.sentByAdmin && !m.viewedByAdmin);
                const lastMessage = session.messages[session.messages.length - 1];
                const isActive = selectedSession?.id === session.id;

                return (
                  <div
                    key={session.id}
                    onClick={() => {
                      setSelectedSession(session);
                      markAsRead(session.id);
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-sm ${
                      isActive ? 'bg-[var(--surface)]' : 'bg-white'
                    }`}
                    style={{ borderColor: isActive ? 'var(--accent)' : 'var(--border)' }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                          style={{ backgroundColor: 'var(--accent)' }}
                        >
                          {session.userName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm text-gray-900">{session.userName}</h4>
                            {hasUnread && (
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }}></span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{session.userEmail}</p>
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          session.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {session.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 truncate mb-1">
                      {lastMessage.content}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(lastMessage.sentDate)}
                    </p>
                  </div>
                );
              })}

              {filteredSessions.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No sessions found
                </div>
              )}
            </div>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-8 h-[calc(100vh-400px)] flex flex-col">
            {selectedSession ? (
              <>
                {/* Chat Header */}
                <div className="pb-4 border-b mb-4 flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      {selectedSession.userName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{selectedSession.userName}</h3>
                      <p className="text-sm text-gray-500">{selectedSession.userEmail}</p>
                    </div>
                  </div>
                  {selectedSession.status === 'active' && (
                    <button
                      onClick={() => handleCloseSession(selectedSession.id)}
                      className="px-4 py-2 border text-sm font-medium rounded-lg hover:bg-[var(--surface)] transition-colors"
                      style={{ borderColor: 'var(--border)', color: 'var(--accent-dark)' }}
                    >
                      Close Session
                    </button>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto pr-2 mb-4 space-y-3">
                  {selectedSession.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sentByAdmin ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-2xl ${
                          message.sentByAdmin
                            ? 'bg-[var(--accent)] text-white rounded-br-sm'
                            : 'bg-[var(--surface)] text-gray-900 rounded-bl-sm'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p className={`text-xs mt-1 ${message.sentByAdmin ? 'text-white/70' : 'text-gray-500'}`}>
                          {formatTime(message.sentDate)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                {selectedSession.status === 'active' ? (
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-[var(--accent)] outline-none"
                      style={{ borderColor: 'var(--border)' }}
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-sm"
                    >
                      <Send className="w-5 h-5" />
                      Send
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-4 text-gray-500 text-sm border rounded-xl" style={{ borderColor: 'var(--border)' }}>
                    This session is closed
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">Select a session to view messages</p>
                  <p className="text-sm mt-1">Choose a help session from the list</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
