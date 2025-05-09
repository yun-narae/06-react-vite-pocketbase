import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import pb from "../lib/pocketbase";
import { Button } from "../components/Button";

const Home = ({ isLoggedIn, isLoading, isDarkMode, onLogout  }) => {
  const navigate = useNavigate();

  // // 로그아웃 처리 함수
  // function logout() {
  //   pb.authStore.clear(); // 로그아웃 처리
  //   setIsLoggedIn(false); // 로그인 상태 업데이트
  //   localStorage.removeItem("isLoggedIn"); // 로컬스토리지에서 로그인 상태 제거
  // }

  // 로그인 상태에 따라 페이지 리디렉션
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/"); // 이미 로그인 상태이면 홈 페이지로 리디렉션
    }
  }, [isLoggedIn, navigate]);

  return (
    <>
        <h1 className="dark:text-white">Welcome to PocketBase Tutorial!</h1>
        <div className="flex flex-col">
            {isLoggedIn && (
                <button
                onClick={onLogout}
                className="w-20 border px-2 py-1 bg-red-500 text-white"
                >
                Logout
                </button>
                
                )}

            <Button
                type= 'login'
                isLoading={isLoading} 
                isDarkMode= {isDarkMode}
                label = 'Test'
                className='mt-3 w-20'
                disabled={true}  // 버튼을 활성화
            />
        </div>
    </>
  );
};

export default Home;
