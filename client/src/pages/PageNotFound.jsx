import { useNavigate } from 'react-router-dom';
import gif from "../assets/404.gif"

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-700 p-4 sm:flex-row">
      <div className="mb-4 sm:mb-0 sm:mr-4">
        <img
          src={gif}
          alt="Not Found"
          className="w-full max-w-xs"
        />
      </div>
      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-bold mb-6 font-rubik text-yellow-600">Lỗi 404!!!</h1>
        <h2 className="text-2xl font-bold mb-6 font-rubik text-black">Trang không tồn tại</h2>
        <p className="text-lg mb-4 font-poppins text-white">
            Xin lỗi, trang bạn truy cập không tồn tại.
        </p>
        <p className="text-lg mb-4 font-poppins text-white">
            Hãy bấm nút Quay lại để trở về trang chủ
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-yellow-600 transition duration-300 font-rubik"
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
