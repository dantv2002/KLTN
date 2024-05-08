import { PropTypes } from 'prop-types';

const BlogCard = ({ img, headlines }) => {

  let content;
  if (headlines === "Cấp giấy phép hoạt động") {
    content = (
      <p className=" text-center text-sm">
        Điều kiện cấp giấy phép hoạt động với phòng khám đa khoa theo Nghị định 96/2023/NĐ-CP
      </p>
    );
  } else if (headlines === "Xu hướng mức sinh thấp") {
    content = (
      <p className=" text-center text-sm">
        Học tập kinh nghiệm quốc tế ứng phó với xu hướng mức sinh thấp
      </p>
    );
  } else if (headlines === "Mục tiêu về nhân lực y tế") {
    content = (
      <p className=" text-center text-sm">
        Mục tiêu về nhân lực y tế đến 2050, có 35 bác sĩ khám chữa bệnh cho 10.000 dân
      </p>
    );
  } else if (headlines === "Quy định về sử dụng thuốc") {
    content = (
      <p className=" text-center text-sm">
        Theo Điều 63 Luật Khám bệnh, chữa bệnh 2023 quy định sử dụng thuốc
      </p>
    );
  } else if (headlines === "Người mắc bệnh truyền nhiễm nhóm A") {
    content = (
      <p className=" text-center text-sm">
        Bác sĩ không được từ chối khám chữa bệnh cho người mắc bệnh truyền nhiễm nhóm A
      </p>
    );
  } else if (headlines === "Điều trị nội trú ban ngày") {
    content = (
      <p className=" text-center text-sm">
        Đề xuất khắc phục bất cập trong điều trị nội trú ban ngày tại cơ sở khám chữa bệnh y học cổ truyền
      </p>
    );
  }

  return (
    <div className=" w-full lg:w-1/4 p-2 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] space-y-2 rounded-lg cursor-pointer hover:scale-105 transition duration-300 ease-in-out">
      <img
        className=" h-64 md:h-96 lg:h-40 w-full rounded-lg"
        src={img}
        alt="img"
      />
      <h2 className=" text-lg text-center font-semibold">{headlines}</h2>
      {content}
    </div>
  );
};

BlogCard.propTypes = {
  img: PropTypes.func.isRequired,
  headlines: PropTypes.func.isRequired,
}

export default BlogCard;
