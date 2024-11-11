import React from 'react';
import '../Styling/Grade.css';

const Grade = ({ feedback, parsedData }) => {
  return (
    <div className="GradeContainer">
      <h1>Quiz Results</h1>
      {parsedData.map((item, index) => (
        <div key={index} className="GradeItem">
          <h3>Question: {item.questions[0]}</h3>
          <p><strong>Correct Answer:</strong> {item.answer}</p>
          <p><strong>Your Score:</strong> {feedback[index]?.score || 'No score available'}</p>
          <p><strong>Feedback:</strong> {feedback[index]?.comment || 'No feedback available'}</p>
        </div>
      ))}
    </div>
  );
};

export default Grade;
