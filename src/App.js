import React, { useState } from "react";
import { Layout, Menu, Button, Avatar, Dropdown, Typography } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
  HomeOutlined,
  ReadOutlined,
  ProductOutlined,
  TrophyOutlined,
  ApartmentOutlined,
  AimOutlined,
  BulbOutlined,
  ContactsOutlined,
} from "@ant-design/icons";
import { Routes, Route, NavLink, Link, useLocation } from "react-router";
import Product from "./pages/Product";
import ProductDetail from "./pages/Product/components/ProductDetail";
import Post from "./pages/Post";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Certificate from "./pages/Certificate";
import Leader from "./pages/Leader";
import Mission from "./pages/Mission";
import Vision from "./pages/Vision";
import PostDetail from "./pages/Post/components/PostDetail";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
// Sider Menu Items
const mainMenu = [
  {
    key: "",
    icon: <HomeOutlined />,
    label: <NavLink to="/">Trang chủ</NavLink>,
  },
  {
    key: "product",
    icon: <ProductOutlined />,
    label: <NavLink to="/product">Dịch vụ</NavLink>,
  },
  {
    key: "post",
    icon: <ReadOutlined />,
    label: <NavLink to="/post">Bài viết</NavLink>,
  },
  {
    key: "certificate",
    icon: <TrophyOutlined />,
    label: <NavLink to="/certificate">Chứng chỉ</NavLink>,
  },
  {
    key: "leader",
    icon: <ApartmentOutlined />,
    label: <NavLink to="/leader">Người đứng đầu</NavLink>,
  },
  {
    key: "mission",
    icon: <AimOutlined />,
    label: <NavLink to="/mission">Nhiệm vụ</NavLink>,
  },
  {
    key: "vision",
    icon: <BulbOutlined />,
    label: <NavLink to="/vision">Tầm nhìn</NavLink>,
  },
];

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Tracks login state
  const [name, setName] = useState("Ha Pham"); // User's name
  const location = useLocation();
  const locationMenu = location.pathname.slice(1);
  const toggle = () => {
    setCollapsed(!collapsed);
  };

  // Handle login/logout (For demonstration purposes)
  const handleLogin = () => setIsLoggedIn(!isLoggedIn);

  const items = [
    {
      key: "1",
      label: <Link to="/profile">Profile</Link>,
      icon: <UserOutlined />,
    },
    {
      key: "2",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: handleLogin, // Simulates logout
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", position: "relative", minWidth: 320 }}>
      {/* Header */}
      <Header
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          background: "#fff",
          color: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          zIndex: "999",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggle}
            style={{ fontSize: "18px", color: "#000" }}
          />
          <h3 style={{ color: "#000", margin: 0, paddingLeft: 16 }}>
            Dashboard
          </h3>
        </div>
        {isLoggedIn ? (
          <Dropdown
            menu={{ items }}
            trigger={["click"]}
            placement="bottomRight"
            arrow
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                gap: "8px", // Adds spacing between Avatar and DownOutlined
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  style={{
                    backgroundColor: "#87d068",
                  }}
                  icon={<UserOutlined />}
                />
                <Text style={{ marginLeft: 8, color: "#000" }}>{name}</Text>
              </div>
              <DownOutlined style={{ fontSize: "12px", color: "#000" }} />
            </div>
          </Dropdown>
        ) : (
          <Button type="primary" onClick={handleLogin}>
            Login
          </Button>
        )}
      </Header>

      {/* overlay */}
      {isMobile && !collapsed && (
        <Layout
          onClick={toggle}
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            bottom: "0",
            width: "100vw",
            backgroundColor: "#000",
            opacity: 0.1,
            transition: "all .26s ease",
          }}
        />
      )}

      {/* Layout */}
      <Layout style={{ marginTop: 64 }}>
        {/* Sider */}
        <Sider
          collapsible
          collapsed={collapsed}
          width={250}
          trigger={null}
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            setIsMobile(broken);
          }}
          onCollapse={() => {
            toggle();
          }}
          style={{
            height: isMobile ? "100vh" : "calc(100vh - 64px)",
            position: "fixed",
            left: 0,
            top: isMobile ? 0 : 64,
            background: "#f0f2f5",
            boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
          }}
          className="sider"
        >
          <div
            className="logo-group"
            style={{
              display: isMobile ? "flex" : "none",
              alignItems: "center",
              justifyContent: "space-between",
              textAlign: "center",
              background: "#fff",
              padding: "0px 14px 0px 28px",
              borderTop: "1px solid #f2f2f2",
            }}
          >
            <Typography
              style={{ color: "#000", lineHeight: "64px", fontWeight: "bold" }}
            >
              Ha Pham Dashboard
            </Typography>
            <Button
              type="text"
              icon={<MenuFoldOutlined />}
              onClick={toggle}
              style={{ fontSize: "18px", color: "#000" }}
            />
          </div>
          <Menu
            theme="light"
            mode="inline"
            items={mainMenu}
            defaultOpenKeys={locationMenu.split("/")}
            selectedKeys={locationMenu.split("/")}
          />
        </Sider>
        {/* Main Content */}
        <Layout
          style={{
            marginLeft: isMobile ? 0 : collapsed ? 0 : 250,
            transition: "margin-left 0.2s ease",
          }}
        >
          <Content
            style={{
              margin: "16px",
              padding: 24,
              background: "#fff",
              height: "calc(100vh - 100px)",
            }}
          >
            <Routes>
              <Route path="" index element={<Home />} title="Home" />
              <Route path="/product">
                <Route index element={<Product />} />
                <Route path=":id" element={<ProductDetail mode="UPDATE" />} />
                <Route
                  path="create"
                  element={<ProductDetail mode="CREATE" />}
                />
              </Route>
              <Route path="/post">
                <Route index element={<Post />} />
                <Route path=":id" element={<PostDetail mode="UPDATE" />} />
                <Route
                  path="create"
                  element={<PostDetail mode="CREATE" />}
                />
              </Route>
              <Route path="certificate" element={<Certificate />} />
              <Route path="leader" element={<Leader />} />
              <Route path="mission" element={<Mission />} />
              <Route path="vision" element={<Vision />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
