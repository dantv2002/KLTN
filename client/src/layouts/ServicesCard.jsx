import { PropTypes } from 'prop-types';

const ServicesCard = ({ icon, title }) => {
  let content;
  if (title === "Cấp cứu") {
    content = (
      <p>
        Đội ngũ chuyên gia luôn sẵn sàng 24/7 để cung cấp các dịch vụ nhanh chóng và khẩn cấp trong các tình huống nguy cấp
      </p>
    );
  } else if (title === "Trình độ") {
    content = (
      <p>
        Đội ngũ bác sĩ và chuyên gia y tế có trình độ chuyên môn cao cùng với công nghệ hiện đại sẽ mang lại các giải pháp tốt nhất
      </p>
    );
  } else if (title === "Thời gian") {
    content = (
      <p>
        Thời gian khám chữa bệnh từ thứ 2 - thứ 6. Mỗi ngày sẽ chia làm 2 ca: ca sáng từ 6h-12h, ca chiều từ 13h-18h
      </p>
    );
  }

  return (
    <div className="group bg-cyan-400 flex flex-col items-center text-center gap-2 w-full lg:w-1/3 p-5 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-lg cursor-pointer lg:hover:-translate-y-6 transition duration-300 ease-in-out">
      <div className="bg-[#d5f2ec] p-3 rounded-full transition-colors duration-300 ease-in-out group-hover:bg-[#ade9dc]">
        {icon}
      </div>
      <h1 className="font-semibold text-lg">{title}</h1>
      {content}
    </div>
  );
};

ServicesCard.propTypes = {
  icon: PropTypes.func.isRequired,
  title: PropTypes.func.isRequired,
}


export default ServicesCard;
