import { useState } from 'react';
import ChatInput from './ChatInput';
import Message from './Message';
import { IoClose } from "react-icons/io5";
import { LiaHospitalAltSolid } from "react-icons/lia";
import logo from "../../assets/img/logo3.png";
import { PropTypes } from 'prop-types';

function MiniChat({ showMiniChat, setShowMiniChat }) {
  const [messages, setMessages] = useState([]);

  const sendMessage = (text) => {
    if (text) {
      setMessages([...messages, text]);
    }
  };

  return (
    <div className={`fixed bottom-5 right-5 bg-white border-gray-300 rounded-lg shadow-lg ${showMiniChat ? 'block' : 'hidden'}`}>
      <div className="flex items-center justify-between bg-blue-700 rounded-t-lg p-4">
        <div className="flex items-center">
          <img className="w-8 h-auto mr-2" src={logo} alt="logo" />
          <div>
            <h2 className ="font-semibold text-sm text-white font-rubik">Bệnh viện X</h2>
            <p className ="text-xs text-white">Chat với chúng tôi</p>
        </div>
        </div>
        <button onClick={() => setShowMiniChat(false)} className="text-white hover:text-gray-800 focus:outline-none">
          <IoClose />
        </button>
      </div>
      <div className="h-48 overflow-y-auto p-4">
        <div className=" w-52 flex items-center justify-between">
            <div className="rounded-full bg-blue-700 p-2">
                <LiaHospitalAltSolid className="text-xl text-white" />
            </div>
            <div className="w-40 bg-gray-200 p-2 m-1 text-sm rounded-md font-rubik break-words">
                Tôi có thể giúp gì cho bạn
            </div>
        </div>
        {messages.map((msg, index) => (
          <Message key={index} text={msg} />
        ))}
      </div>
      <ChatInput onSendMessage={sendMessage} />
    </div>
  );
}

MiniChat.propTypes = {
    showMiniChat: PropTypes.func.isRequired,
    setShowMiniChat: PropTypes.func.isRequired,
}

export default MiniChat;
