import React, { createContext, useContext } from "react";
import pb from "../lib/pocketbase";

// ✅ UserContext 생성
const UserContext = createContext(null);

// ✅ `useUser()` 훅을 만들어 쉽게 사용하도록 설정
export const useUser = () => useContext(UserContext);

// ✅ UserProvider를 생성하여 `user`를 전역으로 관리
export const UserProvider = ({ children }) => {
    const user = pb.authStore.model; // ✅ PocketBase에서 현재 로그인된 사용자 가져오기

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
};
