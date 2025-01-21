import React, { useEffect, useState } from "react";
import pb from "../lib/pocketbase";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function Login({ setIsLoggedIn, setLoggedInUserId }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isLoading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(""); // API 에러 메시지 상태 추가
    const navigate = useNavigate();

    const isLoggedInStatus = pb.authStore.isValid;

    useEffect(() => {
        if (isLoggedInStatus) navigate("/");
    }, [isLoggedInStatus, navigate]);

    async function login(data) {
        setLoading(true);
        setApiError(""); // 에러 초기화
        try {
            // PocketBase 로그인 요청
            const authData = await pb
                .collection("users")
                .authWithPassword(data.email, data.password);

            const userId = authData.record.id; // 로그인된 사용자 ID

            // 로그인 상태 업데이트
            setIsLoggedIn(true);
            setLoggedInUserId(userId); // 사용자 ID 상태 업데이트
            localStorage.setItem("isLoggedIn", "true"); // 로그인 상태 저장
            localStorage.setItem("loggedInUserId", userId); // 사용자 ID 저장

            // 로그인 후 홈으로 이동
            navigate("/");
        } catch (e) {
            // 로그인 실패 시 에러 메시지 설정
            setApiError("Invalid credentials or error occurred.");
        } finally {
            setLoading(false); // 로딩 상태 해제
        }
    }

    return (
        <div className="flex flex-col items-center justify-center mx-auto w-full">
            <h1 className="text-2xl mb-4">Login</h1>
            <p className="py-4">
                {isLoggedInStatus
                    ? `You are: ${pb.authStore.model.email}`
                    : "You are not logged in!"}
            </p>

            {!isLoggedInStatus && (
                <form
                    className="flex flex-col w-full justify-center items-center space-y-4"
                    onSubmit={handleSubmit(login)}
                >
                    <input
                        className="border rounded-md p-1"
                        type="email"
                        placeholder="Input your email"
                        {...register("email", { required: "Email is required" })}
                    />
                    <p className="text-red-500">{errors.email?.message}</p>

                    <input
                        className="border rounded-md p-1"
                        type="password"
                        placeholder="Input your password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: { value: 6, message: "Password must be at least 6 characters" }
                        })}
                    />
                    <p className="text-red-500">{errors.password?.message}</p>

                    {/* API 에러 메시지 출력 */}
                    {apiError && <p className="text-red-500">{apiError}</p>}

                    <button
                        className="border rounded-md bg-gray-400 py-1 px-4"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? "Loading..." : "Login"}
                    </button>
                </form>
            )}
        </div>
    );
}

export default Login;
