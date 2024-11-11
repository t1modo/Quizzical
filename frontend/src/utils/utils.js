// Generate mock notecard data
export const generateNotecardData = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    question: `Question #${index + 1}`,
    content: `Backend will generate a question here`,
  }));
};

// Format feedback to ensure consistent rendering in Grade component
export const formatFeedback = (feedback) => {
  return feedback.map((item) => {
    const scoreMatch = item.feedback.match(/\d+/);
    return {
      question: item.question,
      score: scoreMatch ? scoreMatch[0] : 'No score available',
      comment: item.feedback,
    };
  });
};

// Utility to check if feedback is complete
export const isFeedbackComplete = (feedback, totalQuestions) => {
  return feedback.length === totalQuestions && feedback.every((item) => item.comment);
};
