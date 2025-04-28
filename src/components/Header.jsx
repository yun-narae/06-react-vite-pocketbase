import { Link } from "react-router-dom";
import pb from "../lib/pocketbase";
import { useEffect } from "react";
import { Button } from "../components/Button";
import { useUser } from "../context/UserContext"; // ✅ Context에서 `user` 가져오기

const Header = ({ isLoggedIn, isDarkMode, setDarkMode, isLoading, setIsLoading }) => { 
    const user = useUser(); // ✅ 부모(`UserProvider`)에서 `user` 받아오기
    
    const toggleDarkMode = () => {
        setDarkMode(!isDarkMode); // 다크모드 상태 반전
    };

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }, []);

    return (
        <nav className="z-10 fixed w-full p-4 bg-gray-200 dark:bg-gray-800">
            <ul className="flex gap-4 items-center text-black dark:text-white">
                <li>
                    <Link 
                        to="/"
                        className="hover:underline"
                        style={{ pointerEvents: isLoading ? 'none' : 'auto' }} // 로딩 중에는 클릭 방지
                    >
                        Home
                    </Link>
                </li>
                <li>
                    <Link
                        to="/fileList" 
                        className="hover:underline"
                        style={{ pointerEvents: isLoading ? 'none' : 'auto' }} // 로딩 중에는 클릭 방지
                    >
                        FileList
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/favorites" 
                        className="hover:underline"
                        style={{ pointerEvents: isLoading ? 'none' : 'auto' }} // 로딩 중에는 클릭 방지
                    >
                        FavoriteFiles
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/post" 
                        className="hover:underline"
                        style={{ pointerEvents: isLoading ? 'none' : 'auto' }} // 로딩 중에는 클릭 방지
                    >
                        Post
                    </Link>
                </li>
                
                {!isLoggedIn && (
                    <>
                        <li>
                            <Link
                                to="/login"
                                className="hover:underline"
                                style={{ pointerEvents: isLoading ? 'none' : 'auto' }} // 로딩 중에는 클릭 방지
                            >
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/register"
                                className="hover:underline"
                                style={{ pointerEvents: isLoading ? 'none' : 'auto' }} // 로딩 중에는 클릭 방지
                            >
                                Register
                            </Link>
                        </li>
                    </>
                )}

                {isLoggedIn && user && (
                    <>
                        <Link to={`/mypage/${user.id}`} className="hover:underline">
                            마이페이지
                        </Link>

                        <li>
                            <p className="whitespace-nowrap text-gray-500">{user.name}님</p>
                        </li>
                    </>
                )}

                <li className="flex gap-2">
                    <Button
                        type= 'darkMode'
                        onClick={toggleDarkMode}
                        isLoading={isLoading} 
                        isDarkMode= {isDarkMode}
                        label=''
                    />

                    <Button
                        type= 'social'
                        isLoading={isLoading} 
                        isDarkMode= {isDarkMode}
                        label = 'social'
                        showIcon={true}
                        icon= 'google'
                    />
                </li>
            </ul>
        </nav>
    );
}

export default Header;
