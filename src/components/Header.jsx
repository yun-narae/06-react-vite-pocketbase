import { Link } from "react-router-dom";
import pb from "../lib/pocketbase";

function Header({ isLoggedIn, isdarkMode, setDarkMode }) {
    const user = pb.authStore.model;
    const toggleDarkMode = () => {
        setDarkMode(!isdarkMode); // 다크모드 상태 반전
    };

    return (
        <nav className="fixed w-full p-4 bg-blue-500 dark:bg-gray-800">
            <ul className="flex gap-4 items-center text-white">
                <li>
                    <Link to="/" className="hover:underline">
                        Home
                    </Link>
                </li>
                <li>
                    <Link to="/fileList" className="hover:underline">
                        FileList
                    </Link>
                </li>
                {!isLoggedIn && (
                    <>
                        <li>
                            <Link to="/login" className="hover:underline">
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link to="/register" className="hover:underline">
                                Register
                            </Link>
                        </li>
                    </>
                )}
                {isLoggedIn && user && (
                    <li>
                        <p>{user.name}님 안녕하세요</p>
                    </li>
                )}
                <li>
                    <button
                        onClick={toggleDarkMode}
                        className="mt-4 px-4 py-2 bg-blue-500 dark:bg-blue-700 text-white rounded"
                    >
                        {isdarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default Header;
