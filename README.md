# Quizzical

## Overview
Quizzical is a web application designed to help students study by offering a personalized quizzing experience. Users can paste in their own questions and answers, which the system absorbs and then shuffles for randomized quizzes. Each question is presented back to the user without the answer attached, prompting them to type the correct answer from memory. With the help of the OpenAI API, Quizzical analyzes the user’s typed responses, compares them to the pre-stored answers, and provides feedback based on accuracy.

## Features
- **Personalized Quiz Creation**: Users can input their own study questions and answers, creating a quiz experience that directly reflects their study needs.
- **Randomized Question Order**: Each quiz session shuffles the questions, promoting better recall and reducing the likelihood of memorizing answer order.
- **Advanced Answer Comparison**: By leveraging the OpenAI API, Quizzical performs semantic analysis to evaluate user answers, providing accurate feedback even if answers are phrased differently from the expected response.
- **Real-Time Grading**: Instant feedback on accuracy helps users gauge their understanding and track progress over time.
- **Interactive Interface**: Built with React, Quizzical provides a responsive and easy-to-use quiz interface that makes studying engaging and effective.
- **NLP-Powered Evaluation**: Using OpenAI’s natural language processing capabilities, Quizzical evaluates free-response answers for meaningful grading that goes beyond basic keyword matching.

## Technologies Used
- **React**: The primary JavaScript library used for building an interactive and responsive quiz-taking interface.
- **CSS**: Styles the user interface, enhancing the quiz experience with a clean and educational design.
- **OpenAI API**: Powers the backend grading system by comparing user-typed answers with stored answers based on semantic similarity, ensuring accurate and useful feedback.
