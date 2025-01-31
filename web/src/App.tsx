import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { fetchUserAttributes } from "aws-amplify/auth";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Add these color utility functions
const generateGradient = (role: 'user' | 'assistant') => {
  return role === 'user' 
    ? 'bg-gradient-to-r from-indigo-400 to-purple-500'
    : 'bg-gradient-to-r from-slate-100 to-slate-200';
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userAttributes, setUserAttributes] = useState<Record<string, string | undefined> | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const { signOut } = useAuthenticator();

  console.log(userAttributes);
  useEffect(() => {
    async function getUserAttributes() {
      const attributes = await fetchUserAttributes();
      setUserAttributes(attributes);
      setIsLoading(false);
    }
    getUserAttributes();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: inputMessage }]);

    // Simulate assistant response (replace with actual API call later)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `This is a mock response to: "${inputMessage}"`
      }]);
    }, 1000);

    setInputMessage('');
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-sm border-b border-slate-200 fixed top-0 w-full z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <h1 className="text-2xl font-light text-slate-700">Brain in Cup</h1>
          <button
            onClick={signOut}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors duration-200"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="flex flex-col pt-20 pb-24 min-h-screen w-full">
        {/* Chat Container */}
        <main className="flex-1 overflow-auto space-y-6 max-w-6xl mx-auto w-full px-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${generateGradient(message.role)} 
                  ${message.role === 'user' ? 'text-white' : 'text-slate-700'}`}
              >
                <p className="leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
        </main>

        {/* Input Form */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-sm border-t border-slate-200">
          <div className="max-w-6xl mx-auto p-4">
            <form
              onSubmit={handleSubmit}
              className="flex gap-3"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-full px-6 py-3 bg-white border border-slate-200 
                  focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 
                  transition-all duration-200"
              />
              <button
                type="submit"
                className="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 
                  text-white shadow-sm hover:opacity-90 transition-all duration-200 
                  focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
