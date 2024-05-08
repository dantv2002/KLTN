const Banner = () => {
  return (
    <div className=" min-h-screen flex flex-col justify-center lg:px-32 px-5 bg-blue-700 text-white bg-[url('assets/img/banner.png')] bg-no-repeat bg-cover opacity-90">
      <div className=" w-full lg:w-4/5 space-y-5 mt-10">
        <h1 className="text-5xl font-bold leading-tight font-rubik">
          Bệnh viện X
        </h1>
        <h2 className="text-3xl font-bold leading-tight font-rubik">
          Cung cấp những dịch vụ tốt nhất cho bạn
        </h2>
        <p className=" w-[70%] font-rubik">
          Đội ngũ y bác sĩ có kỹ năng chuyên môn cao 
          cùng với đạo đức nghề nghiệp của mình chắc chắn 
          sức khỏe của bạn sẽ được nâng tầm. 
          Chần chờ gì mà không đến với chúng tôi?
        </p>
      </div>
    </div>
  );
};

export default Banner;
