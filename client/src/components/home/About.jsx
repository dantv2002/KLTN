import img from "../../assets/img/intro.png";

const About = () => {
  return (
    <div className=" min-h-screen flex flex-col lg:flex-row justify-between items-center lg:px-32 px-5 pt-24 lg:pt-16 gap-5">
      <div className=" w-full lg:w-3/4 space-y-4">
        <h1 className=" text-4xl font-semibold text-center lg:text-start font-rubik">Giới thiệu</h1>
        <p className=" text-justify lg:text-start">
          Bệnh viện X là một bệnh viện lớn tại Việt Nam được thành lập vào năm 1999.
        </p>
        <p className="text-justify lg:text-start">
          Bệnh viện X không chỉ là trung tâm y tế đa khoa hàng đầu chuyên sâu về các lĩnh vực 
          như tim mạch, ung thư, thần kinh, và ghép tạng mà còn là cơ sở đào tạo y khoa 
          và nghiên cứu khoa học có uy tín.
        </p>
        <p className="text-justify lg:text-start">
          Với đội ngũ y bác sĩ giỏi chuyên môn và trang thiết bị y tế tiên tiến, 
          bệnh viện không ngừng nâng cao chất lượng khám chữa bệnh, 
          phục vụ hàng triệu bệnh nhân mỗi năm, không chỉ từ Việt Nam mà còn từ các nước trong khu vực
        </p>
      </div>
      <div className=" rotate-180 min-h-[400px] bg-blue-700 lg:w-3/4">
        <div className=" min-h-[370px] bg-blue-600">
          <div className=" min-h-[340px] bg-cyan-400">
            <img className=" rotate-180 rounded-lg bottom-0" src={img} alt="img" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
