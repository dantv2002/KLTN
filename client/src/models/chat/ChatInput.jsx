import { useState } from 'react';
import { PropTypes } from 'prop-types';
import { IoMdSend } from "react-icons/io";
import { Input } from 'antd';

function ChatInput({ onSendMessage }) {
  const [text, setText] = useState('');

  const handleSend = () => {
    onSendMessage(text);
    setText('');
  };

  return (
    <div className="flex p-2">
      <Input.TextArea
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoSize={{ maxRows: 1 }}
        className="w-48 border border-gray-300 flex-grow p-2 rounded-l rounded-r-none text-sm font-rubik"
        placeholder="Nhập gì đó..."
      />
      <button onClick={handleSend} className="bg-blue-700 text-cyan-400 p-2 rounded-r">
        <IoMdSend />
      </button>
    </div>
  );
}

ChatInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
}

export default ChatInput;
