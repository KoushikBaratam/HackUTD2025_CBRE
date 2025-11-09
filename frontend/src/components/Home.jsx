import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // TODO: Replace with actual API call
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'This is a placeholder response. Connect to your backend API to get real answers about your uploaded documents.',
        timestamp: new Date(),
        // Structured data will be added here when API is connected
        structuredData: null,
        confidence: null,
        evidence: null,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: 'Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cbre-gray-light">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-cbre-green rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">CC</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ClauseChain</h1>
                <p className="text-xs text-gray-500">Contract Intelligence Platform</p>
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/files')}
                className="text-sm text-gray-600 hover:text-cbre-green transition-colors"
              >
                Files
              </button>
              <button className="text-sm text-gray-600 hover:text-cbre-green transition-colors">
                Settings
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-lg h-[calc(100vh-12rem)] flex flex-col">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Ask about your documents</h2>
            <p className="text-sm text-gray-500 mt-1">
              Query your uploaded contracts and ESG documents
            </p>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Start a conversation
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Ask questions about your uploaded documents
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
                  <button
                    onClick={() => setInput('Which Dallas leases expire next quarter?')}
                    className="px-4 py-2 text-left text-sm border border-gray-200 rounded-lg hover:border-cbre-green hover:bg-green-50 transition-colors"
                  >
                    Which Dallas leases expire next quarter?
                  </button>
                  <button
                    onClick={() => setInput('Find capex obligations over $250k')}
                    className="px-4 py-2 text-left text-sm border border-gray-200 rounded-lg hover:border-cbre-green hover:bg-green-50 transition-colors"
                  >
                    Find capex obligations over $250k
                  </button>
                  <button
                    onClick={() => setInput('Extract Scope-2 targets from this ESG plan')}
                    className="px-4 py-2 text-left text-sm border border-gray-200 rounded-lg hover:border-cbre-green hover:bg-green-50 transition-colors"
                  >
                    Extract Scope-2 targets from this ESG plan
                  </button>
                  <button
                    onClick={() => setInput('What are the renewal windows for all leases?')}
                    className="px-4 py-2 text-left text-sm border border-gray-200 rounded-lg hover:border-cbre-green hover:bg-green-50 transition-colors"
                  >
                    What are the renewal windows for all leases?
                  </button>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-3xl rounded-lg px-4 py-3 ${
                        message.type === 'user'
                          ? 'bg-cbre-green text-white'
                          : message.type === 'error'
                          ? 'bg-red-50 text-red-800 border border-red-200'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      {message.confidence && (
                        <div className="mt-2 pt-2 border-t border-gray-300">
                          <span className="text-xs font-medium">
                            Confidence: {(message.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      )}
                      {message.structuredData && (
                        <details className="mt-2">
                          <summary className="text-xs font-medium cursor-pointer">
                            View Structured Data
                          </summary>
                          <pre className="mt-2 text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
                            {JSON.stringify(message.structuredData, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="px-6 py-4 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
              <div className="flex-1">
                <textarea
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    // Auto-resize textarea
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder="Ask a question about your documents..."
                  rows={1}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cbre-green focus:border-cbre-green resize-none overflow-y-auto"
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="px-6 py-2 bg-cbre-green text-white rounded-lg hover:bg-cbre-green-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cbre-green disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

