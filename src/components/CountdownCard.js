// src/components/CountdownCard.js
import React, { useState, useEffect } from 'react';
import '../styles/CountdownCard.css';

const CountdownCard = ({ id, name, date, image, onDelete }) => {
  const calculateTimeRemaining = () => {
    const now = new Date();
    const targetDate = new Date(date);

    targetDate.setUTCHours(0, 0, 0, 0);
    targetDate.setUTCFullYear(now.getUTCFullYear());

    if (now > targetDate) {
      targetDate.setUTCFullYear(now.getUTCFullYear() + 1);
    }

    const timeDiff = targetDate - now;

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes };
  };


  const calculateAge = () => {
    const birthdate = new Date(date);
    const now = new Date();

    let age = now.getUTCFullYear() - birthdate.getUTCFullYear();

    if (
      now.getUTCMonth() < birthdate.getUTCMonth() ||
      (now.getUTCMonth() === birthdate.getUTCMonth() && now.getUTCDate() < birthdate.getUTCDate())
    ) {
      age--;
    }

    return age;
  };

  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining);
  const [age, setAge] = useState(calculateAge);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [date]);

  useEffect(() => {
    setAge(calculateAge());
  }, [date]);

  const { days, hours, minutes } = timeRemaining;
  const now = new Date();
  const isToday =
    now.getUTCFullYear() === new Date(date).getUTCFullYear() &&
    now.getUTCMonth() === new Date(date).getUTCMonth() &&
    now.getUTCDate() === new Date(date).getUTCDate();

  const birthdayDate = new Date(date).getUTCDate();
  const birthdayMonth = new Date(date).toLocaleString('default', { month: 'long' });

  const getImageDataUrl = (image) => {
    if (image instanceof Blob) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target.result);
        };
        reader.readAsDataURL(image);
      });
    }
    if (typeof image === 'string' && image.startsWith('data:image/')) {
      return Promise.resolve(image);
    }
    return Promise.resolve(null);
  };

  const [imageDataUrl, setImageDataUrl] = useState(null);

  useEffect(() => {
    getImageDataUrl(image).then((dataUrl) => {
      setImageDataUrl(dataUrl);
    });
  }, [image]);

  return (
    <div className="countdown-card">
      <h2>
        {isToday
          ? `Happy Birthday, ${name}! 🎉`
          : days >= 0
          ? `Countdown for ${name}`
          : `Upcoming Birthday for ${name}`}
      </h2>
      {imageDataUrl && <img src={imageDataUrl} alt={name} className="countdown-image" />}
      <p>
        {isToday && `Today is ${birthdayDate} ${birthdayMonth}`}
        {days >= 0 && !isToday && (
          <>
            {birthdayDate} {birthdayMonth}
          </>
        )}
        {days >= 0 && !isToday ? (
          <>
            <br />
            {days} {days === 1 ? 'day' : 'days'}, {hours} {hours === 1 ? 'hour' : 'hours'}, {minutes}{' '}
            {minutes === 1 ? 'minute' : 'minutes'}
          </>
        ) : null}
        <br />
        Age: {age}
      </p>
      <button onClick={() => onDelete(id)}>Delete</button>
    </div>
  );
};

export default CountdownCard;