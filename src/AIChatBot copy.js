import { useState } from 'react';
import './App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator
} from '@chatscope/chat-ui-kit-react';

const API_KEY = "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";

// A message from the system, such as a welcome message
const systemMessage = {
  role: "system",
  content: "Welcome to the AI ChatBot! Feel free to ask me anything."
};

function AIChatBot() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm Powered by ChatGPT! Ask me anything!",
      sender: "ChatGPT",
      sentTime: "just now"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      sender: "user",
      direction: "outgoing"
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    const apiMessages = chatMessages.map((messageObject) => {
      const role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        systemMessage,
        ...apiMessages
      ]
    };

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "OpenAI-Organization": "org-KF7EcWtdVCcVZ40bBwgdM4qT"
        },
        body: JSON.stringify(apiRequestBody)
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data from the API.");
      }

      const data = await response.json();

      const chatGptResponse = data.choices[0].message.content;

      setMessages([
        ...chatMessages,
        {
          message: chatGptResponse,
          sender: "ChatGPT"
        }
      ]);
    } catch (error) {
      console.error("Error processing ChatGPT response:", error);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <div className="App">
      <div style={{ position: "relative", height: "800px", width: "700px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
            >
              {messages.map((message, i) => (
                <Message key={i} model={message} />
              ))}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default AIChatBot;
