import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('Loading...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch('/api/chat');
        const data = await response.json();
        setMessage(data.reply);
      } catch (error) {
        console.error('Error fetching message:', error);
        setMessage('Failed to load message.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {loading ? <p>Loading...</p> : <p>{message}</p>}
      </header>
    </div>
  );
}

export default App;
