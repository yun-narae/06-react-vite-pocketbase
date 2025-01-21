import { Link } from "react-router-dom";
import pb from "../lib/pocketbase";
import { useEffect } from "react";

function Header({ isLoggedIn, isdarkMode, setDarkMode, isLoading, setIsLoading }) {
    const user = pb.authStore.model;

    const toggleDarkMode = () => {
        setDarkMode(!isdarkMode); // 다크모드 상태 반전
    };

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }, []);

    return (
        <nav className="fixed w-full p-4 bg-gray-200 dark:bg-gray-800">
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
                    <li>
                        <p className="whitespace-nowrap">{user.name}님</p>
                    </li>
                )}
                <li>
                    <button
                        onClick={toggleDarkMode}
                        disabled={isLoading} // 로딩 중 버튼 비활성화
                        className="px-4 py-2 bg-gray-300 border border-stone-400 dark:bg-gray-700 dark:border-gray-900 text-white rounded"
                    >
                        {isdarkMode ? "Light" : "Dark"}
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default Header;
