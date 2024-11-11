import React, { useRef } from 'react';
import feather from 'feather-icons';
import '../Styling/TextInput.css';

const TextInput = ({ onSubmit }) => {
  const textareaRef = useRef(null);

  const handleSubmit = () => {
    const userInput = textareaRef.current.value;
    onSubmit(userInput);
  };

  React.useEffect(() => {
    feather.replace({ class: 'feather-icon' });
  }, []);

  return (
    <div className="InputTextWrapper">
      <textarea
        ref={textareaRef}
        className="TextInput"
        placeholder="Paste or type text here . . ."
      ></textarea>
      <button onClick={handleSubmit} className="SubmitButton">
        <i
          data-feather="arrow-up-circle"
          className="feather-icon"
          style={{ color: '#000' }}
        ></i>
      </button>
    </div>
  );
};

export default TextInput;
