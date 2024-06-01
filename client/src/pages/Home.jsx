import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from "../components/home/Navbar";
import Banner from "../components/home/Banner";
import About from "../components/home/About";
import Services from "../components/home/Services";
import Doctors from "../components/home/Doctors";
import Blogs from "../components/home/Blogs";
import Footer from "../components/home/Footer";
import { BiSupport } from "react-icons/bi";
import { CircularProgress } from "@mui/material";
import { message } from 'antd';
import Consultation from '../models/consultation/Consultation';
import Cookies from "js-cookie"

const Home = () => {

    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const fullname = Cookies.get("FullName")

    const showModal = () => {
        setVisible(true);
    };

    const hideModal = () => {
        setVisible(false);
    };

    const location = useLocation();

    useEffect(() => {
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            const SuccessMessage = sessionStorage.getItem("successMessage");
            const ErrorMessage = sessionStorage.getItem("errorMessage");
            if (SuccessMessage) {
                message.success(SuccessMessage);
                sessionStorage.removeItem("successMessage");
            }
            if (ErrorMessage) {
                message.error(ErrorMessage);
                sessionStorage.removeItem("errorMessage");
            }
        }, 1000);
    }, [location.pathname]);

    return (
        loading ? 
            <div className="absolute inset-0 flex items-center justify-center bg-white z-50 bg-opacity-50">
                <CircularProgress />
            </div>  
        :
            <div>
                <Navbar />
                <main>
                    <div id="home">
                        <Banner />
                    </div>
                    <div id="about">
                        <About />
                    </div>
                    <div id="services">
                        <Services />
                    </div>
                    <div id="doctors">
                        <Doctors />
                    </div>
                    <div id="blog">
                        <Blogs />
                    </div>
                </main>
                <div id="contact">
                    <Footer />
                </div>
                {fullname && (
                    <>
                        {!visible && (
                            <button
                                className="fixed bottom-5 right-5 bg-cyan-400 text-white p-4 rounded-full transition-transform duration-300 transform hover:scale-110"
                                onClick={showModal}
                            >
                                <BiSupport className="text-xl"/>
                            </button>
                        )}
                        <Consultation visible={visible} hideModal={hideModal}/>
                    </>
                )}
            </div>
    );
};

export default Home;
