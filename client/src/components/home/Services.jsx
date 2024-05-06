import { FaAmbulance } from "react-icons/fa";
import ServicesCard from "../../layouts/ServicesCard";
import { MdHealthAndSafety } from "react-icons/md";
import { FaRegClock } from "react-icons/fa";

const Services = () => {
  const icon1 = (
    <FaAmbulance size={35} className=" text-backgroundColor" />
  );
  const icon2 = (
    <MdHealthAndSafety size={35} className=" text-backgroundColor" />
  );
  const icon3 = <FaRegClock size={35} className=" text-backgroundColor" />;

  return (
    <div className=" min-h-screen flex flex-col justify-center lg:px-32 px-5 pt-24 lg:pt-16">
      <div className=" flex flex-col items-center lg:flex-row justify-between">
        <div>
          <h1 className=" text-4xl font-semibold text-center lg:text-start font-rubik">
            Dịch vụ
          </h1>
          <p className=" mt-2 text-center lg:text-start">
            Mang lại các dịch vụ tốt nhất cho bệnh nhân
          </p>
        </div>
      </div>
      <div className=" flex flex-col lg:flex-row gap-5 pt-14">
        <ServicesCard icon={icon1} title="Cấp cứu" />
        <ServicesCard icon={icon2} title="Trình độ" />
        <ServicesCard icon={icon3} title="Thời gian" />
      </div>
    </div>
  );
};

export default Services;
