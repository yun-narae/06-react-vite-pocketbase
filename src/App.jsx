import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import pb from "./lib/pocketbase";
import Register from "./Auth/Register";
import Login from "./Auth/Login";
import RegistrationSuccess from "./Auth/RegistrationSuccess";
import Header from "./components/Header";
import Layout from "./pages/Layout"; // Layout 컴포넌트 추가
import Home from "./pages/Home"; // Home 컴포넌트 추가
import FileList from "./pages/FileList";
import FavoriteFiles from "./pages/FavoriteFiles";

function App() {
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리

    const [isDarkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem("isDarkMode");
        return savedMode === "true";
    });
    
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const storedLoginStatus = localStorage.getItem("isLoggedIn");
        return storedLoginStatus === "true";
    });

    // 로그인 사용자 저장
    const [loggedInUserId, setLoggedInUserId] = useState(() => {
        return localStorage.getItem("loggedInUserId") || null;
    });

    // 다크모드 상태가 변경될 때마다 HTML의 <html> 태그에 dark 클래스를 추가하거나 제거
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("isDarkMode", isDarkMode);
    }, [isDarkMode]);

    useEffect(() => {
        localStorage.setItem("isLoggedIn", isLoggedIn);
    }, [isLoggedIn]);

    useEffect(() => {
        localStorage.setItem("loggedInUserId", loggedInUserId);
    }, [loggedInUserId]);


    const handleLogout = () => {
        // PocketBase 인증 상태 초기화
        pb.authStore.clear(); 
    
        // 유지하려는 데이터를 저장 (찜 목록)
        const favoritesKey = `favorites_${loggedInUserId}`;
        const savedFavorites = localStorage.getItem(favoritesKey);
    
        // localStorage에서 특정 항목들만 초기화
        localStorage.removeItem('loggedInUserId');
        localStorage.removeItem('isDarkMode');
        localStorage.removeItem('pocketbase_auth');
    
        // 로그인 상태 초기화
        setIsLoggedIn(false);
        setLoggedInUserId(null);
    
        // 찜 목록 데이터가 있다면, 다시 로그인할 때 저장할 수 있도록 설정
        if (savedFavorites) {
            // 로그인할 때 해당 키로 찜 목록을 다시 저장
            localStorage.setItem(favoritesKey, savedFavorites); // key와 value를 정확히 지정
        }
    };

    return (
        <Router basename={process.env.VITE_PUBLIC_URL}>
            <Header 
                isLoggedIn={isLoggedIn} 
                isDarkMode={isDarkMode} 
                setDarkMode={setDarkMode}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
            />
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route
                        index
                        element={<Home 
                            isLoggedIn={isLoggedIn} 
                            setIsLoggedIn={setIsLoggedIn} 
                            setLoggedInUserId={setLoggedInUserId} 
                            isDarkMode={isDarkMode}
                            onLogout={handleLogout} // 로그아웃 함수 전달
                        />}
                    />
                    <Route path="/login" element={<Login 
                            isLoggedIn={isLoggedIn} 
                            setIsLoggedIn={setIsLoggedIn} 
                            setLoggedInUserId={setLoggedInUserId}
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                        />} />
                    <Route path="/register" element={<Register isLoading={isLoading} setIsLoading={setIsLoading}/>} />
                    <Route path="/registration-success" element={<RegistrationSuccess isLoading={isLoading} setIsLoading={setIsLoading}/>} />
                    <Route 
                        path="/fileList" 
                        element={<FileList isLoggedIn={isLoggedIn}  loggedInUserId={loggedInUserId} isLoading={isLoading} setIsLoading={setIsLoading}/>} 
                    />
                    <Route 
                        path="/favorites" 
                        element={<FavoriteFiles isLoggedIn={isLoggedIn}  loggedInUserId={loggedInUserId} isLoading={isLoading} setIsLoading={setIsLoading}/>} 
                    />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
