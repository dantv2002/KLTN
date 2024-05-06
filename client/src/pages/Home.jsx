import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from "../components/home/Navbar";
import Banner from "../components/home/Banner";
import About from "../components/home/About";
import Services from "../components/home/Services";
import Doctors from "../components/home/Doctors";
import Blogs from "../components/home/Blogs";
import Footer from "../components/home/Footer";
import MiniChat from '../models/chat/Minichat';
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { CircularProgress } from "@mui/material";
import { message } from 'antd';

const Home = () => {
    const [showMiniChat, setShowMiniChat] = useState(false);
    const [loading, setLoading] = useState(true)

    const toggleMiniChat = () => {
        setShowMiniChat(!showMiniChat);
    };

    const location = useLocation();

    useEffect(() => {
      setLoading(true)
  
      setTimeout(() =>{
        setLoading(false);
        const Message = sessionStorage.getItem("successMessage");
        if (Message){
            message.success(Message);
            sessionStorage.removeItem("successMessage")
        }
      },1000)
    },[location.pathname])

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
            <MiniChat showMiniChat={showMiniChat} setShowMiniChat={setShowMiniChat} />
            {!showMiniChat ? (
                <button
                    className="fixed bottom-5 right-5 bg-cyan-400 text-white p-4 rounded-full transition-transform duration-300 transform hover:scale-110"
                    onClick={toggleMiniChat}
                >
                    <IoChatbubbleEllipsesOutline className="text-xl"/>
                </button>
            ) : (
                <div/>
            )}
        </div>
    );
};

export default Home;
