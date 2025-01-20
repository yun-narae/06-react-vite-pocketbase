import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Auth/Register";
import Login from "./Auth/Login";
import RegistrationSuccess from "./Auth/RegistrationSuccess";
import Header from "./components/Header";
import Layout from "./components/Layout"; // Layout 컴포넌트 추가
import Home from "./components/Home"; // Home 컴포넌트 추가
import FileList from "./components/FileList";

function App() {
    const [isdarkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem("isdarkMode");
        return savedMode === "true";
    });

    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const storedLoginStatus = localStorage.getItem("isLoggedIn");
        return storedLoginStatus === "true";
    });

    useEffect(() => {
        if (isdarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("isdarkMode", isdarkMode);
    }, [isdarkMode]);

    useEffect(() => {
        localStorage.setItem("isLoggedIn", isLoggedIn);
    }, [isLoggedIn]);

    return (
        <Router basename={process.env.VITE_PUBLIC_URL}>
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
                    <Route path="/login" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/registration-success" element={<RegistrationSuccess />} />
                    <Route path="/fileList" element={<FileList />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
