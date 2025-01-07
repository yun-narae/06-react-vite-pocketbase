import React, { useState, useEffect } from "react";
import pb from "../lib/pocketbase";
import getPbImageURL from "../lib/getPbImageURL";
import FileListSkeleton from "./FileListSkeleton";

const FileList = ({ loggedInUserId }) => {
    const [fileData, setFileData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [favorites, setFavorites] = useState(() => {
        const storedFavorites = localStorage.getItem(`favorites_${loggedInUserId}`);
        return storedFavorites ? JSON.parse(storedFavorites) : {};
    });

    const toggleFavorite = (id) => {
        // 테스트 완료 후 활성
        // if (!loggedInUserId) {
        //     alert("로그인이 필요합니다.");
        //     return;
        // }

        setFavorites((prev) => {
            const updatedFavorites = { ...prev, [id]: !prev[id] };
            localStorage.setItem(`favorites_${loggedInUserId}`, JSON.stringify(updatedFavorites)); // LocalStorage에 저장
            console.log(id)
            console.log(loggedInUserId)
            return updatedFavorites;
        });
    };

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const files = await pb.collection("files").getFullList(1, { autoCancel: false });
                const formattedFiles = files.map((file) => ({
                    id: file.id,
                    imageUrl: getPbImageURL(file, "photo"),
                    name: file.name || "No name",
                    price: file.price || 0,
                }));
                setFileData(formattedFiles);
            } catch (error) {
                console.error("Error fetching files:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFiles();
    }, []);

    if (isLoading) {
        return <FileListSkeleton />; // Show skeleton UI while loading
    }

    if (!fileData.length) {
        return <p>No files available.</p>;
    }

    return (
        <>
            <h2 className="sr-only">제품 리스트</h2>
            <ul className="grid grid-cols-2 gap-2 md:gap-4 md:mb-6 md:grid-cols-4 lg:gap-6 lg:col-start-2 lg:row-end-6 lg:row-span-6 lg:mb-0">
                {fileData.map((file, index) => (
                    <li key={index} className="cursor-pointer overflow-hidden">
                        <figure className="rounded-xl overflow-hidden mb-2 flex items-center h-[180px] md:h-[240px] lg:h-[320px]">
                            <img 
                                src={file.imageUrl} 
                                alt={file.name} 
                                loading="lazy"
                                decoding="async"
                                width="800px"
                                height="800px"
                                className="w-full"
                                />
                        </figure>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold dark:text-white">{file.name}</span>
                            <span className="text-sm font-bold text-zinc-600 dark:text-slate-400">{file.price}원</span>
                        </div>
                        <button
                            onClick={() => toggleFavorite(file.id)} // 찜 상태 변경
                            className={`text-sm ${favorites[file.id] ? "text-red-500" : "text-gray-500"}`}
                        >
                            {favorites[file.id] ? "찜 취소" : "찜하기"}
                        </button>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default FileList;
