// src/App.js
import React, { useState, useEffect } from 'react';
import CountdownCard from './components/CountdownCard';
import './styles/App.css';

const App = () => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState(null);
  const [countdowns, setCountdowns] = useState([]);
  const [activeTab, setActiveTab] = useState('today');

  useEffect(() => {
    fetch('http://localhost:3000/countdowns')
      .then((response) => response.json())
      .then((data) => setCountdowns(data))
      .catch((error) => console.error('Error fetching countdowns:', error));
  }, []);

  const fetchCountdowns = () => {
    fetch('http://localhost:3000/countdowns')
      .then((response) => response.json())
      .then((data) => setCountdowns(data))
      .catch((error) => console.error('Error fetching countdowns:', error));
  };

  const addCountdown = () => {
    if (name && date && image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newCountdown = {
          id: Date.now(),
          name,
          date,
          image: reader.result,
        };
        saveCountdownsToServer(newCountdown);
        setCountdowns([newCountdown, ...countdowns]);
        setName('');
        setDate('');
        setImage(null);
        setActiveTab('countdowns');
      };
      reader.readAsDataURL(image);
    }
  };
  

  const saveCountdownsToServer = (countdown) => {
    fetch('http://localhost:3000/countdowns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(countdown),
    })
      .then((response) => response.json())
      .then((data) => console.log('Countdown saved to server:', data))
      .catch((error) => console.error('Error saving countdown to server:', error));
  };
  const deleteCountdown = (id) => {
    fetch(`http://localhost:3000/countdowns/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        const updatedCountdowns = countdowns.filter((countdown) => countdown.id !== id);
        setCountdowns(updatedCountdowns);
      })
      .catch((error) => console.error('Error deleting countdown:', error));
  };

  const getBirthdaysToday = () => {
    const today = new Date();
    return countdowns.filter((countdown) => {
      const countdownDate = new Date(countdown.date);
      return (
        today.getUTCFullYear() === countdownDate.getUTCFullYear() &&
        today.getUTCMonth() === countdownDate.getUTCMonth() &&
        today.getUTCDate() === countdownDate.getUTCDate()
      );
    });
  };

  const birthdaysToday = getBirthdaysToday();

  return (
    <div className="app">
      <h1>Birthday Countdown App</h1>

      <div className="navbar">
        <div
          className={`nav-item ${activeTab === 'today' ? 'active' : ''}`}
          onClick={() => setActiveTab('today')}
        >
          Birthdays Today
        </div>
        <div
          className={`nav-item ${activeTab === 'countdowns' ? 'active' : ''}`}
          onClick={() => setActiveTab('countdowns')}
        >
          Birthday Countdowns
        </div>
        <div
          className={`nav-item ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          Add Another Birthday
        </div>
      </div>

      {activeTab === 'add' && (
        <div className="input-card">
          <h2>Enter Details</h2>
          <div className="label-input">
            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="label-input">
            <label>Date:</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="label-input">
            <label>Image:</label>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div className="button-container">
            <button onClick={addCountdown}>Add Countdown</button>
          </div>
        </div>
      )}

      {activeTab === 'today' && birthdaysToday.length > 0 && (
        <div className="birthdays-today">
          <h2>Birthdays Today</h2>
          {birthdaysToday.map((countdown) => (
            <CountdownCard
              key={countdown.id}
              id={countdown.id}
              name={countdown.name}
              date={countdown.date}
              image={countdown.image}
              onDelete={deleteCountdown}
            />
          ))}
        </div>
      )}

      {activeTab === 'countdowns' && (
        <div className="countdown-cards">
          <h2>Birthdays Countdown</h2>
          {countdowns.map((countdown) => (
            <CountdownCard
              key={countdown.id}
              id={countdown.id}
              name={countdown.name}
              date={countdown.date}
              image={countdown.image}
              onDelete={deleteCountdown}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
