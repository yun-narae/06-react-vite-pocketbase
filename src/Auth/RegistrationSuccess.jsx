import React from "react";
import { useNavigate } from "react-router-dom";

const RegistrationSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center mx-auto w-full mt-10">
      <h1 className="text-2xl mb-4">회원가입이 완료되었습니다!</h1>
      <button
        className="border rounded-md bg-blue-600 text-white py-2 px-3"
        onClick={() => navigate("/login")}
      >
        로그인 하러가기
      </button>
    </div>
  );
}

export default RegistrationSuccess;
