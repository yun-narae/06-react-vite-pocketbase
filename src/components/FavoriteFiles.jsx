import React, { useEffect, useState } from "react";
import FileListSkeleton from "./FileListSkeleton";

const FavoriteFiles = ({ loggedInUserId }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [favoriteFiles, setFavoriteFiles] = useState([]);

    useEffect(() => {
        if (!loggedInUserId) return; // loggedInUserId가 없으면 실행하지 않음
    
        const storedFiles = localStorage.getItem("fileData"); // 파일 데이터 로드
        const storedFavorites = localStorage.getItem(`favorites_${loggedInUserId}`); // 찜 데이터 로드
    
        if (storedFiles && storedFavorites) {
            const parsedFiles = JSON.parse(storedFiles);
            const parsedFavorites = JSON.parse(storedFavorites);
    
            const filteredFiles = parsedFiles.filter((file) => parsedFavorites[file.id]);
            setFavoriteFiles(filteredFiles); // 찜한 파일만 설정
        }
        setIsLoading(false); // 로딩 상태 해제
    }, [loggedInUserId]);

    const handleRemoveFavorite = (id) => {
        const favoritesKey = `favorites_${loggedInUserId}`;
        const storedFavorites = JSON.parse(localStorage.getItem(favoritesKey)) || {};
        
        const updatedFavorites = { ...storedFavorites, [id]: false };
        localStorage.setItem(favoritesKey, JSON.stringify(updatedFavorites));

        setFavoriteFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
    };

    if (isLoading) {
        return <FileListSkeleton />; // Show skeleton UI while loading
    }

    if (!favoriteFiles.length) return <p>No favorite files.</p>;

    return (
        <>
            <h2 className="sr-only">제품 리스트</h2>
            <ul className="grid grid-cols-2 gap-2 md:gap-4 md:mb-6 md:grid-cols-4 lg:gap-6 lg:col-start-2 lg:row-end-6 lg:row-span-6 lg:mb-0">
                {favoriteFiles.map((file) => (
                    <li key={file.id} className="cursor-pointer overflow-hidden">
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
                            onClick={() => handleRemoveFavorite(file.id)}
                            className="text-sm text-red-500"
                        >
                            찜 취소
                        </button>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default FavoriteFiles;
