import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import pb from "../lib/pocketbase";

const Home = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  // 로그아웃 처리 함수
  function logout() {
    pb.authStore.clear(); // 로그아웃 처리
    setIsLoggedIn(false); // 로그인 상태 업데이트
    localStorage.removeItem("isLoggedIn"); // 로컬스토리지에서 로그인 상태 제거
  }

  // 로그인 상태에 따라 페이지 리디렉션
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/"); // 이미 로그인 상태이면 홈 페이지로 리디렉션
    }
  }, [isLoggedIn, navigate]);

  return (
    <>
      <h1 className="dark:text-white">Welcome to PocketBase Tutorial!</h1>
      {isLoggedIn && (
        <button
          className="border rounded-md bg-gray-400 py-1 px-4"
          onClick={logout}
        >
          Logout
        </button>
      )}
    </>
  );
};

export default Home;
