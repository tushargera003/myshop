import React, { useState } from "react";
import axios from "axios";

const FAQChatbot = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");

  const askQuestion = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/faq/chatbot`,
        { question }
      );
      setResponse(res.data.answer);
    } catch (error) {
      setResponse("Sorry, I couldn't find an answer to that.");
    }
  };

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          onClick={askQuestion}
          className="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Ask
        </button>
      </div>
      {response && (
        <div className="bg-gray-100 p-3 rounded">
          <strong>Answer:</strong> {response}
        </div>
      )}
    </div>
  );
};

export default FAQChatbot;
