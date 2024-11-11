import React, { useEffect } from 'react';
import feather from 'feather-icons';
import '../Styling/Notecard.css';

const Notecard = ({
  notecardData,
  currentIndex,
  onNext,
  onPrev,
  userAnswers,
  onAnswerChange,
  onSubmitAllAnswers,
  isLoading,
  feedback,
  errorMessage,
}) => {
  useEffect(() => {
    feather.replace({ class: 'feather-icon' });
  }, [currentIndex]);

  const handleAnswerChange = (event) => {
    onAnswerChange(currentIndex, event.target.value);
  };

  if (!notecardData || notecardData.length === 0 || !notecardData[currentIndex]) {
    return <div>Loading questions...</div>;
  }

  return (
    <div className="NotecardContainer">
      <div className="Notecard">
        <div className="GradeButtonContainer">
          {currentIndex === notecardData.length - 1 && (
            <button onClick={onSubmitAllAnswers} className="GradeButton">
              Submit
            </button>
          )}
        </div>

        <div className="QuestionContainer">
          <h2 className="QuestionText">{notecardData[currentIndex]?.questions?.[0]}</h2>
        </div>

        <button onClick={onPrev} disabled={currentIndex === 0} className="NavButton prev">
          <i data-feather="arrow-left" className="feather-icon"></i>
        </button>

        <textarea
          className="UserInput"
          placeholder="Enter your answer here..."
          value={userAnswers[currentIndex] || ''}
          onChange={handleAnswerChange}
        ></textarea>

        <button onClick={onNext} disabled={currentIndex === notecardData.length - 1} className="NavButton next">
          <i data-feather="arrow-right" className="feather-icon"></i>
        </button>
      </div>

      {isLoading && <div className="Loading">Grading your answers...</div>}
      
      {feedback && feedback[currentIndex] && (
        <div className="Feedback">
          <h3>Feedback for: {notecardData[currentIndex]?.questions?.[0]}</h3>
          <p>{feedback[currentIndex].comment}</p>
        </div>
      )}
      
      {errorMessage && (
        <div className="ErrorMessage">
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
};

export default Notecard;
