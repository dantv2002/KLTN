import { useState, useEffect } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    CopyOutlined,
    LogoutOutlined,
    DownOutlined,
    BulbOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, Avatar, Dropdown, message } from 'antd';
const { Header, Sider, Content } = Layout;
import { Outlet, useNavigate } from 'react-router-dom';
import { logoutApi } from '../../Api';
import axios from 'axios';
import ChangePassword from '../../models/ChangePassword';
import Cookies from "js-cookie"
import replacePlusWithSpace from '../../hook/ReplacePlusWithSpace';
import { useLocation } from 'react-router-dom';

const DashboardDoctor = () => {

    const location = useLocation();
    const [selectedMenuKey, setSelectedMenuKey] = useState("0");
    const [collapsed, setCollapsed] = useState(false);
    const [headerTitle, setheaderTitle] = useState("Quản lý hồ sơ bệnh nhân");
    const [showFormChangePassword, setShowFormChangePassword] = useState(false);
    const fullname = Cookies.get("FullName");
    const name =  fullname ? replacePlusWithSpace(fullname) : ""
    const navigate = useNavigate();
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const handleLogout = async () => {
        try{
            const response = await axios.get(logoutApi, {
              withCredentials: true
            });
            if (response.status === 200){
              sessionStorage.setItem("successMessage", response.data.Message)
              navigate("/")
            }
        }catch(error){
            message.error(error.response.data.Message)
        }
    }
    const openFormChangePassword = () => {
        setShowFormChangePassword(true)
    }
    const closeFormChangePassword = () => {
        setShowFormChangePassword(false)
    }

    const items = [
        {
            label: (
                <span onClick={openFormChangePassword} className="text-green-500 cursor-pointer">
                    <UserOutlined className="w-6 h-6 mr-4" /> Đổi mật khẩu
                </span>
            ),
            key: '2',
        },
        {
            label: (
                <span onClick={handleLogout} className="text-red-500 cursor-pointer">
                    <LogoutOutlined className="w-6 h-6 mr-4" /> Đăng xuất
                </span>
            ),
            key: '3',
        },
    ];

    useEffect(() => {
        switch (location.pathname) {
            case '/doctor/medical':
                setheaderTitle('Quản lý bệnh án');
                setSelectedMenuKey('0');
                break;
            case '/doctor/diagnosis':
                setheaderTitle('Chẩn đoán');
                setSelectedMenuKey('1');
                break;
            default:
                break;
        }
    }, [location.pathname]);

    const handleMenuSelect = (item) => {
        switch (item.key) {
            case '0':
                navigate('/doctor/medical')
                setheaderTitle('Quản lý hồ sơ bệnh án')
                break;
            case '1':
                navigate('/doctor/diagnosis')
                setheaderTitle('Chẩn đoán')
                break;
            default:
            break;
        }
    }
    return (
        <Layout id='dashboard' className="min-h-screen">
            <Sider
                trigger={null} 
                collapsible 
                collapsed={collapsed}>
            <div className="demo-logo-vertical" />
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[selectedMenuKey]}
                onSelect={handleMenuSelect}
                items={[
                    {
                        key: '0',
                        icon: <CopyOutlined className="w-6 h-6"/>,
                        label: 'Hồ sơ bệnh án',
                    },
                    {
                        key: '1',
                        icon: <BulbOutlined className="w-6 h-6"/>,
                        label: 'Chẩn đoán',
                    },
                ]}
            />
            </Sider>
            <Layout>
            <Header
                style={{
                    padding: 0,
                    background: colorBgContainer,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}
                >
                <div className="flex items-center ml-4">
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined className=" w-6 h-6"/> : <MenuFoldOutlined className="w-6 h-6"/>}
                        onClick={() => setCollapsed(!collapsed)}
                        className="text-xl"
                    />
                    <div className="text-lg ml-4">
                        <h2>{headerTitle}</h2>
                    </div>
                </div>

                <Dropdown
                    overlay={
                        <Menu onClick={handleMenuSelect}>
                            {items.map((menuItem) => (
                                <Menu.Item key={menuItem.key}>
                                    {menuItem.label}
                                </Menu.Item>
                            ))}
                        </Menu>
                    }
                    trigger={['click']}
                >
                    <div className="flex items-center mr-4 cursor-pointer">
                    <Avatar size="large" icon={<UserOutlined />} />
                    <span className="ml-2">Bác sĩ: {name}</span>
                    <DownOutlined className="w-6 h-6 ml-4" />    
                    </div>
                </Dropdown>
            </Header>
            <Content
                style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
                background: colorBgContainer,
                }}
            >
                <Outlet/>
            </Content>
            </Layout>
            {showFormChangePassword && <ChangePassword closeFormChangePassword={closeFormChangePassword}/>}
        </Layout>
    );
}

export default DashboardDoctor;
