import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from "../components/home/Navbar";
import Banner from "../components/home/Banner";
import About from "../components/home/About";
import Services from "../components/home/Services";
import Doctors from "../components/home/Doctors";
import Blogs from "../components/home/Blogs";
import Footer from "../components/home/Footer";
import { CircularProgress } from "@mui/material";
import { message } from 'antd';

const Home = () => {

    const [loading, setLoading] = useState(true);

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
            </div>
    );
};

export default Home;
