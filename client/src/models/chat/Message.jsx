import { PropTypes } from 'prop-types';
import { IoPerson } from "react-icons/io5";

function Message({ text }) {
  return (
    <div className=" w-52 flex items-center justify-between">
        <div className="w-40 bg-gray-200 p-2 m-1 text-sm rounded-md font-rubik break-words">
            {text}
        </div>
        <div className="ml-2">
            <div className="rounded-full bg-cyan-400 p-2">
                <IoPerson className="text-xl text-white" />
            </div>
        </div>
    </div>
  );
}

Message.propTypes = {
  text: PropTypes.string.isRequired,
}

export default Message;
