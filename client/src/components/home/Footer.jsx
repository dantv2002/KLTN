import { Link } from "react-scroll";
import logo from "../../assets/img/logo1.png"
import { IoLocation } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";

const Footer = () => {
  return (
    <div className=" bg-black text-white mt-8 md:mt-0">
      <div className="flex flex-col md:flex-row justify-between p-8 md:px-32 px-5">
        <div className=" w-full md:w-1/4">
          <img className="w-[10vw] h-auto min-w-[120px] max-w-[200px]" src={logo} alt="logo" />
          <p className=" text-sm mt-7">
            Đội ngũ y bác sĩ có kỹ năng chuyên môn cao cùng với đạo đức nghề nghiệp của mình chắc chắn sức khỏe của bạn sẽ được nâng tầm. Chần chờ gì mà không đến với chúng tôi?
          </p>
        </div>
        <div>
          <h1 className=" font-medium text-xl pb-4 pt-5 md:pt-0">Thông tin</h1>
          <nav className=" flex flex-col gap-2">
            <Link
              to="about"
              spy={true}
              smooth={true}
              duration={500}
              className=" hover:text-hoverColor transition-all cursor-pointer"
            >
              Giới thiệu
            </Link>
            <Link
              to="services"
              spy={true}
              smooth={true}
              duration={500}
              className=" hover:text-hoverColor transition-all cursor-pointer"
            >
              Dịch vụ
            </Link>
            <Link
              to="doctors"
              spy={true}
              smooth={true}
              duration={500}
              className=" hover:text-hoverColor transition-all cursor-pointer"
            >
              Đội ngũ
            </Link>
            <Link
              to="blog"
              spy={true}
              smooth={true}
              duration={500}
              className=" hover:text-hoverColor transition-all cursor-pointer"
            >
              Bài viết
            </Link>
          </nav>
        </div>
        <div>
          <h1 className=" font-medium text-xl pb-4 pt-5 md:pt-0">Dịch vụ</h1>
          <nav className=" flex flex-col gap-2">
            <Link
              to="services"
              spy={true}
              smooth={true}
              duration={500}
              className=" hover:text-hoverColor transition-all cursor-pointer"
            >
              Cấp cứu
            </Link>
            <Link
              to="services"
              spy={true}
              smooth={true}
              duration={500}
              className=" hover:text-hoverColor transition-all cursor-pointer"
            >
              Trình độ
            </Link>
            <Link
              to="services"
              spy={true}
              smooth={true}
              duration={500}
              className=" hover:text-hoverColor transition-all cursor-pointer"
            >
              Thời gian
            </Link>
          </nav>
        </div>
        <div className=" w-full md:w-1/4">
          <h1 className=" font-medium text-xl pb-4 pt-5 md:pt-0">Liên hệ</h1>
          <nav className=" flex flex-col gap-2">
            <IoLocation className=" text-blue-700"/>
              01, Võ Văn Ngân, TP.Thủ Đức
            <FaPhoneAlt className=" text-blue-700"/>
              0333060776
            <IoMdMail className=" text-blue-700"/>
              20110121@student.hcmute.edu.vn
          </nav>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between p-3 md:px-32 px-5">
        <p className="py-4 md:w-3/4">
          Những thông tin trên web chỉ mang tính chất tham khảo
        </p>
        <div className="text-right md:w-1/4">
          <p>Thành viên:</p>
          <p>Nguyễn Thành Đạt</p>
          <p>Trần Văn Dân</p>
          <p>Huỳnh Thanh Tuấn</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
