import { useState, useEffect } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    LogoutOutlined,
    DownOutlined,
    IdcardOutlined,
    CalendarOutlined,
    BarChartOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, Avatar, Dropdown, message } from 'antd';
const { Header, Sider, Content } = Layout;
import { Outlet, useNavigate } from 'react-router-dom';
import { logoutApi } from '../../Api';
import axios from 'axios';
import ChangePassword from '../../models/ChangePassword';
import Cookies from "js-cookie"
import replacePlusWithSpace from '../../content/ReplacePlusWithSpace';
import { useLocation } from 'react-router-dom';

const DashboardAdmin = () => {

    const location = useLocation();
    const [selectedMenuKey, setSelectedMenuKey] = useState("0");
    const [collapsed, setCollapsed] = useState(false);
    const [headerTitle, setheaderTitle] = useState("Quản lý tài khoản");
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
            key: '8',
        },
        {
            label: (
                <span onClick={handleLogout} className="text-red-500 cursor-pointer">
                    <LogoutOutlined className="w-6 h-6 mr-4" /> Đăng xuất
                </span>
            ),
            key: '9',
        },
    ];

    useEffect(() => {
        switch (location.pathname) {
            case '/admin/statistic':
                setheaderTitle('Thống kê');
                setSelectedMenuKey('0');
                break;
            case '/admin/account1':
                setheaderTitle('Quản lý tài khoản');
                setSelectedMenuKey('1');
                break;
            case '/admin/account2':
                setheaderTitle("Quản lý nhân viên chưa có tài khoản ")
                setSelectedMenuKey('2');
                break;
            case '/admin/doctor':
                setheaderTitle("Quản lý thông tin bác sĩ ")
                setSelectedMenuKey('3');
                break;
            case '/admin/nurse':
                setheaderTitle("Quản lý thông tin điều dưỡng")
                setSelectedMenuKey('4');
                break;
            case '/admin/receptionist':
                setheaderTitle('Quản lý thông tin nhân viên tiếp nhận');
                setSelectedMenuKey('5');
                break;
            case '/admin/medical':
                setheaderTitle('Quản lý bệnh án');
                setSelectedMenuKey('6');
                break;
            case '/admin/schedule':
                setheaderTitle('Quản lý lịch khám');
                setSelectedMenuKey('7');
                break;
            default:
                break;
        }
    }, [location.pathname]);

    const handleMenuSelect = (item) => {
        switch (item.key) {
            case '0':
                navigate('/admin/statistic')
                setheaderTitle('Quản lý tài khoản')
                break;
            case '1':
                navigate('/admin/account1')
                setheaderTitle('Quản lý tài khoản')
                break;
            case '2':
                navigate('/admin/account2')
                setheaderTitle('Quản lý nhân viên chưa có tài khoản')
                break;
            case '3':
                navigate('/admin/doctor')
                setheaderTitle('Quản lý thông tin bác sĩ')
                break;
            case '4':
                navigate('/admin/nurse')
                setheaderTitle('Quản lý thông tin điều dưỡng')
                break;
            case '5':
                navigate('/admin/receptionist')
                setheaderTitle('Quản lý thông tin nhân viên tiếp nhận')
                break;
            case '6':
                navigate('/admin/medical')
                setheaderTitle('Quản lý bệnh án')
                break;
            case '7':
                navigate('/admin/schedule')
                setheaderTitle('Quản lý lịch khám')
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
                    icon: <BarChartOutlined className="w-6 h-6"/>,
                    label: 'Thống kê',
                },
                {
                    key: '1',
                    icon: <UserOutlined className="w-6 h-6"/>,
                    label: 'Tài khoản',
                },
                {
                    key: '2',
                    icon: <UserOutlined className="w-6 h-6"/>,
                    label: 'Chưa có tài khoản',
                },
                {
                    key: '3',
                    icon: <UserOutlined className="w-6 h-6"/>,
                    label: 'Bác sĩ',
                },
                {
                    key: '4',
                    icon: <UserOutlined className="w-6 h-6"/>,
                    label: 'Điều dưỡng',
                },
                {
                    key: '5',
                    icon: <UserOutlined className="w-6 h-6"/>,
                    label: 'Tiếp nhận',
                },
                {
                    key: '6',
                    icon: <IdcardOutlined className="w-6 h-6"/>,
                    label: 'Bệnh án',
                },
                {   
                    key: '7',
                    icon: <CalendarOutlined className="w-6 h-6"/>,
                    label: 'Lịch khám',
                },
                ]}
            />
            </Sider>
            <Layout>
            {showFormChangePassword && <ChangePassword closeFormChangePassword={closeFormChangePassword}/>}
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
                    <span className="ml-2">Admin: {name}</span>
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
        </Layout>
    );
}

export default DashboardAdmin;
