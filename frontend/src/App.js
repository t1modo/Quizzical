import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import Logo from './Components/Logo';
import Notecard from './Components/Notecard';
import TextInput from './Components/TextInput';
import Grade from './Components/Grade';
import { formatFeedback } from './utils/utils';

function App() {
  const [parsedData, setParsedData] = useState([]);
  const [isNotecardVisible, setIsNotecardVisible] = useState(false);
  const [currentNotecardIndex, setCurrentNotecardIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [feedback, setFeedback] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showGrades, setShowGrades] = useState(false);

  const handleSubmit = async (userInput) => {
    if (!userInput.trim()) {
      alert('Please enter some text.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/parse-questions', { notes: userInput });
      const parsedData = response.data.questionAnswerPairs;
      setParsedData(parsedData);
      setIsNotecardVisible(true);
      setIsSubmitted(true);
      console.log("Parsed data received:", parsedData);
    } catch (error) {
      console.error('Error submitting question:', error);
      alert(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleNextNotecard = () => {
    if (currentNotecardIndex < parsedData.length - 1) {
      setCurrentNotecardIndex(currentNotecardIndex + 1);
    }
  };

  const handlePrevNotecard = () => {
    if (currentNotecardIndex > 0) {
      setCurrentNotecardIndex(currentNotecardIndex - 1);
    }
  };

  const handleAnswerChange = (index, value) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [index]: value,
    }));
  };

  const handleSubmitAllAnswers = async () => {
    const confirmSubmit = window.confirm('Submit all answers? This will check and grade all answers.');
    if (!confirmSubmit) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      console.log("Submitting answers for grading:", userAnswers);
      const response = await axios.post('http://localhost:3000/check-answers', { answers: userAnswers });
      console.log('Server response:', response);

      if (response.status === 200) {
        const formattedFeedback = formatFeedback(response.data.feedback);
        console.log('Formatted feedback data:', formattedFeedback);
        setFeedback(formattedFeedback);
        setShowGrades(true);
      } else {
        setErrorMessage(response.data.error || 'An error occurred while grading.');
      }
    } catch (error) {
      console.error('Error submitting answers:', error);
      setErrorMessage('An error occurred while grading your answers.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`AppContainer ${isSubmitted ? 'submitted' : ''}`}>
      <Logo isSubmitted={isSubmitted} />
      {!isSubmitted && <TextInput onSubmit={handleSubmit} />}
      
      {isSubmitted && !showGrades && isNotecardVisible && (
        <Notecard
          notecardData={parsedData}
          currentIndex={currentNotecardIndex}
          onNext={handleNextNotecard}
          onPrev={handlePrevNotecard}
          userAnswers={userAnswers}
          onAnswerChange={handleAnswerChange}
          onSubmitAllAnswers={handleSubmitAllAnswers}
          isLoading={isLoading}
          feedback={feedback}
          errorMessage={errorMessage}
        />
      )}
      
      {showGrades && <Grade feedback={feedback} parsedData={parsedData} />}
    </div>
  );
}

export default App;
