import { useState, useEffect } from "react";
import { w3cwebsocket as Socket } from "websocket";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import EmojiConvertor from "emoji-js";
import { FaRegSmile } from "react-icons/fa";

const client = new Socket("ws://127.0.0.1:8000");

const emojiConvertor = new EmojiConvertor();
emojiConvertor.init_env();

const Chat = ({ userName }) => {
  const [myMessage, setMyMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onSend = () => {
    const parsedMessage = emojiConvertor.replace_colons(myMessage);
    client.send(
      JSON.stringify({
        type: "message",
        message: parsedMessage,
        userName,
      })
    );
    setMyMessage("");
  };

  const addEmoji = (emoji) => {
    setMyMessage(myMessage + emoji.native);
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };
    client.onmessage = (message) => {
      const data = JSON.parse(message.data);
      setMessages((messages) => [
        ...messages,
        {
          message: data.message,
          userName: data.userName,
        },
      ]);
    };
  }, []);

  return (
    <>
      <div className="title">Socket Chat: {userName}</div>
      <div className="chat-container">
        <aside className="reminder">
          <h2 className="reminder__title">Steps to complete setup:</h2>
          <ul className="reset">
            <li>1️⃣ Enter message and send it</li>
            <li>
              2️⃣ Go to the second browser's tab or window and enter the chatroom
              with another random username if you haven't done it yet.
            </li>
            <li>3️⃣ As second user reply with another message</li>
          </ul>
          <h3>Implement emoji feature according to the task ✅</h3>
        </aside>
        <section className="chat">
          <div className="messages">
            {messages.map((message, key) => (
              <div
                key={key}
                className={`message ${
                  userName === message.userName
                    ? "message--outgoing"
                    : "message--incoming"
                }`}
              >
                <div className="avatar">
                  {message.userName[0].toUpperCase()}
                </div>
                <div>
                  <h4>{message.userName + ":"}</h4>
                  <p>{emojiConvertor.replace_colons(message.message)}</p>
                </div>
              </div>
            ))}
          </div>
          <section className="send">
            <input
              type="text"
              className="input send__input"
              value={myMessage}
              onChange={(e) => setMyMessage(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && onSend()}
              placeholder="Message"
            ></input>
            <button
              className="emoji-button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <FaRegSmile size={20} />
            </button>

            <button className="button send__button" onClick={onSend}>
              Send
            </button>
          </section>
        </section>
        {showEmojiPicker && (
          <div className="picker-wrapper">
            <Picker className="picker" data={data} onEmojiSelect={addEmoji} />
          </div>
        )}
      </div>
    </>
  );
};

export default Chat;
