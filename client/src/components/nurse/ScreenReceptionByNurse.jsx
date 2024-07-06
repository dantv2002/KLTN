import { useState, useEffect } from 'react';
import logo from '../../assets/img/logo1.png';

const ScreenReceptionByNurse = () => {
  const [nextNumber, setNextNumber] = useState(0);

  useEffect(() => {
    const handleStorageChange = () => {
      const dataUpdated = localStorage.getItem("dataUpdated");
      if (dataUpdated === "true") {
        const updatedNextNumber = localStorage.getItem("nextNumber");
        setNextNumber(updatedNextNumber);
        localStorage.removeItem("dataUpdated");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("screenOpen", "true");
    const handleBeforeUnload = () => {
      localStorage.setItem("screenOpen", "false");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      localStorage.setItem("screenOpen", "false");
    };
  }, []);
  

  return (
    <div className="min-h-screen bg-blue-700 text-white p-6">
      <div className="mb-6">
        <img src={logo} alt="Logo" className="w-64 mx-auto mb-20" />
      </div>
      <div className="mb-20 text-center">
        <h2 className="text-4xl font-bold text-black font-poppins">Thông báo</h2>
      </div>
      <div>
        {nextNumber !== 0 ? (
          <p className="text-2xl font-rubik text-center">
            <p className="font-bold text-xl inline-block">Mời bệnh nhân vào khám bệnh tiếp theo có số thứ tự là</p>
            <br/>
            <p className="font-bold text-9xl text-amber-500 inline-block mt-6">{nextNumber}</p>
          </p>
        ) : (
          <p className="text-2xl font-rubik text-center">Bệnh nhân chờ trong giây lát để được gọi khám bệnh</p>
        )}
      </div>
    </div>
  );
};

export default ScreenReceptionByNurse;
