import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Auth/Register";
import Login from "./Auth/Login";
import RegistrationSuccess from "./Auth/RegistrationSuccess";
import Header from "./components/Header";
import Layout from "./components/Layout"; // Layout 컴포넌트 추가
import Home from "./components/Home"; // Home 컴포넌트 추가
import FileList from "./components/FileList";

function App() {
    // 다크모드 상태를 초기화할 때 localStorage에서 값 불러오기
    const [isdarkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem("isdarkMode");
        return savedMode === "true"; // 'true'로 저장된 값이면 true, 아니면 false
    });

    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const storedLoginStatus = localStorage.getItem("isLoggedIn");
        return storedLoginStatus === "true"; // 'true'로 저장된 값이면 true, 아니면 false
    });

    // 다크모드 상태가 변경될 때마다 HTML의 <html> 태그에 dark 클래스를 추가하거나 제거
    useEffect(() => {
        if (isdarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("isdarkMode", isdarkMode); // 변경된 다크모드 상태를 localStorage에 저장
    }, [isdarkMode]);

    // 로그인 상태가 변경될 때마다 localStorage에 상태 저장
    useEffect(() => {
        localStorage.setItem("isLoggedIn", isLoggedIn); // 변경된 로그인 상태를 localStorage에 저장
    }, [isLoggedIn]);

    return (
        <Router>
            <Header 
                isLoggedIn={isLoggedIn} 
                isdarkMode={isdarkMode} 
                setDarkMode={setDarkMode} 
            />
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route
                        index
                        element={<Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
                    />
                    <Route
                        path="/login"
                        element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
                    />
                    <Route path="/register" element={<Register />} />
                    <Route path="/registration-success" element={<RegistrationSuccess />} />
                    <Route path="/fileList" element={<FileList />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
