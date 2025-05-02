import React, { useState, useEffect, lazy, Suspense } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import pb from "./lib/pocketbase";
import { UserProvider } from "./context/UserContext"; // ✅ UserContext 추가
const Register = lazy(() => import("./Auth/Register"));
const Login = lazy(() => import("./Auth/Login"));
const RegistrationSuccess = lazy(() => import("./Auth/RegistrationSuccess"));
const Header = lazy(() => import("./components/Header"));
const Layout = lazy(() => import("./pages/Layout"));
const Home = lazy(() => import("./pages/Home"));
const FileList = lazy(() => import("./pages/FileList"));
const FavoriteFiles = lazy(() => import("./pages/FavoriteFiles"));
const Post = lazy(() => import("./pages/Post"));
const PostDetail = lazy(() => import("./pages/PostDetail"));
const StepPostPage = lazy(() => import("./pages/StepPostPage"));
const MyPage = lazy(() => import("./pages/MyPage"));


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
        <UserProvider>
            {/* ✅ `user`를 전역에서 관리하도록 설정 */}
            <Router>
              <Suspense fallback={<div className="p-4 text-center">페이지 로딩 중...</div>}>
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
                      element={
                        <Home
                          isLoggedIn={isLoggedIn}
                          setIsLoggedIn={setIsLoggedIn}
                          setLoggedInUserId={setLoggedInUserId}
                          isDarkMode={isDarkMode}
                          onLogout={handleLogout}
                        />
                      }
                    />
                    <Route path="/login" element={
                      <Login 
                        isLoggedIn={isLoggedIn} 
                        setIsLoggedIn={setIsLoggedIn} 
                        setLoggedInUserId={setLoggedInUserId}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                      />} 
                    />
                    <Route path="/register" element={<Register isLoading={isLoading} setIsLoading={setIsLoading} />} />
                    <Route path="/registration-success" element={<RegistrationSuccess isLoading={isLoading} setIsLoading={setIsLoading} />} />
                    <Route path="/fileList" element={<FileList isLoggedIn={isLoggedIn} loggedInUserId={loggedInUserId} isLoading={isLoading} setIsLoading={setIsLoading} />} />
                    <Route path="/favorites" element={<FavoriteFiles isLoggedIn={isLoggedIn} loggedInUserId={loggedInUserId} isLoading={isLoading} setIsLoading={setIsLoading} />} />
                    <Route path="/post" element={<Post isLoggedIn={isLoggedIn} loggedInUserId={loggedInUserId} isLoading={isLoading} setIsLoading={setIsLoading} />} />
                    <Route path="/post/:id" element={<PostDetail />} />
                    <Route path="/post/create" element={<StepPostPage />} />
                    <Route path="/mypage/:userId" element={<MyPage />} />
                  </Route>
                </Routes>
              </Suspense>
            </Router>
          </UserProvider>
    );
}

export default App;
