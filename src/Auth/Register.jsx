import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import pb from "../lib/pocketbase";
import { useForm } from "react-hook-form";

function Register() {
    const {
        register,
        formState: { errors },
        handleSubmit,
        watch,
    } = useForm();
    const [isLoading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(""); // API 에러 메시지 상태 추가
    const navigate = useNavigate();

    const isLoggedIn = pb.authStore.isValid;
    useEffect(() => {
        if (isLoggedIn) navigate("/");
    }, [isLoggedIn, navigate]);

    // 회원가입 함수
    async function signup(data) {
        setLoading(true);
        setApiError(""); // API 에러 메시지 초기화
        try {
            const record = await pb.collection("users").create({
                email: data.email,
                password: data.password,
                passwordConfirm: data.passwordConfirm,
                name: data.name,
            });
            if (record) navigate("/registration-success"); // 성공 시 완료 페이지로 이동
        } catch (error) {
            console.error("회원가입 오류:", error);
            setApiError(error.message || "An error occurred during registration.");
        } finally {
            setLoading(false);
        }
    }

    // 입력한 비밀번호와 비밀번호 확인 필드 값 비교
    const password = watch("password");

    return (
        <div className="flex flex-col items-center justify-center mx-auto w-full">
            <h1 className="text-2xl mb-4">Register</h1>
            {!isLoggedIn && (
                <form
                    className="flex flex-col justify-center w-full items-center space-y-4"
                    onSubmit={handleSubmit(signup)}
                >
                    {/* 이름 입력 필드 */}
                    <input
                        className="border rounded-md p-1"
                        type="text"
                        placeholder="Enter your name"
                        {...register("name", {
                            required: "Name is required",
                        })}
                    />
                    <p className="text-red-500">{errors.name?.message}</p>

                    {/* 이메일 입력 필드 */}
                    <input
                        className="border rounded-md p-1"
                        type="email"
                        placeholder="Enter your email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, //유효하지 않은 이메일: test@ example.com (공백 포함), user@domain (도메인 확장자 없음), @example.com (사용자명 없음)
                                message: "Invalid email format",
                            },
                        })}
                    />
                    <p className="text-red-500">{errors.email?.message}</p>

                    {/* 비밀번호 입력 필드 */}
                    <input
                        className="border rounded-md p-1"
                        type="password"
                        placeholder="Enter your password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: { value: 5, message: "Password must be at least 5 characters" },
                        })}
                    />
                    <p className="text-red-500">{errors.password?.message}</p>

                    {/* 비밀번호 확인 입력 필드 */}
                    <input
                        className="border rounded-md p-1"
                        type="password"
                        placeholder="Confirm your password"
                        {...register("passwordConfirm", {
                            required: "Password confirmation is required",
                            validate: (value) => value === password || "Passwords do not match",
                        })}
                    />
                    <p className="text-red-500">{errors.passwordConfirm?.message}</p>

                    {/* API 에러 메시지 출력 */}
                    {apiError && <p className="text-red-500">{apiError}</p>}

                    {/* 회원가입 버튼 */}
                    <button
                        className="border rounded-md bg-gray-400 py-1 px-4"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? "Loading..." : "Sign Up"}
                    </button>
                </form>
            )}
        </div>
    );
}

export default Register;
