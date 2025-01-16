import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { fetchUserAttributes } from "aws-amplify/auth";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

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
    <div className="flex flex-col w-full">
      {/* Header */}
      <header className="bg-white shadow p-4 w-full rounded-lg">
        <div className="flex justify-between items-center px-4">
          <h1 className="text-xl font-bold">Elevator Robot Chat</h1>
          <button
            onClick={signOut}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Chat Container */}
      <main className="flex-1 overflow-auto p-4 w-full max-w-4xl mx-auto">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800'
                  }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Input Form */}
      <div className="bg-white border-t p-4 rounded-lg">
        <form
          onSubmit={handleSubmit}
          className="flex gap-4"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
