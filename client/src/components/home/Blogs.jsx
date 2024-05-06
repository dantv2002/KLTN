import BlogCard from "../../layouts/BlogCard";
import img1 from "../../assets/img/blog1.png";
import img2 from "../../assets/img/blog2.png";
import img3 from "../../assets/img/blog3.png";
import img4 from "../../assets/img/blog4.png";
import img5 from "../../assets/img/blog5.png";
import img6 from "../../assets/img/blog6.png";

const Blogs = () => {
  return (
    <div className=" min-h-screen flex flex-col justify-center lg:px-32 px-5 pt-24">
      <div className=" flex flex-col items-center lg:flex-row justify-between">
        <div>
          <h1 className=" text-4xl font-semibold text-center lg:text-start">
            Bài viết
          </h1>
          <p className=" mt-2 text-center lg:text-start">
            Một số bài viết hay trong ngành
          </p>
        </div>
      </div>
      <div className=" my-8">
        <div className=" flex flex-wrap justify-center gap-5">
          <BlogCard img={img1} headlines="Cấp giấy phép hoạt động" />
          <BlogCard img={img2} headlines="Xu hướng mức sinh thấp" />
          <BlogCard img={img3} headlines="Mục tiêu về nhân lực y tế" />
          <BlogCard img={img4} headlines="Quy định về sử dụng thuốc" />
          <BlogCard img={img5} headlines="Người mắc bệnh truyền nhiễm nhóm A" />
          <BlogCard img={img6} headlines="Điều trị nội trú ban ngày" />
        </div>
      </div>
    </div>
  );
};

export default Blogs;
