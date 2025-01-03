import { Link } from "react-router-dom";
import pb from "../lib/pocketbase";

function Header({ isLoggedIn, isdarkMode, setDarkMode }) {
    const user = pb.authStore.model;
    const toggleDarkMode = () => {
        setDarkMode(!isdarkMode); // 다크모드 상태 반전
    };

    return (
        <nav className="fixed w-full p-4 bg-gray-200 dark:bg-gray-800">
            <ul className="flex gap-4 items-center text-black dark:text-white">
                <li>
                    <Link to="/06-react-vite-pocketbase/" className="hover:underline">
                        Home
                    </Link>
                </li>
                <li>
                    <Link to="/06-react-vite-pocketbase/fileList" className="hover:underline">
                        FileList
                    </Link>
                </li>
                {!isLoggedIn && (
                    <>
                        <li>
                            <Link to="/06-react-vite-pocketbase/login" className="hover:underline">
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link to="/06-react-vite-pocketbase/register" className="hover:underline">
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
