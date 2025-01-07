import React, { useEffect, useState } from "react";
import FileListSkeleton from "./FileListSkeleton";
import pb from "../lib/pocketbase";
import getPbImageURL from "../lib/getPbImageURL";

const FavoriteFiles = ({ loggedInUserId }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [favoriteFiles, setFavoriteFiles] = useState([]);

    useEffect(() => {
        if (!loggedInUserId) return; // loggedInUserId가 없으면 실행하지 않음
    
        // 로컬 스토리지에서 찜 목록을 가져옴
        const storedFavorites = localStorage.getItem(`favorites_${loggedInUserId}`);

        if (storedFavorites) {
            const parsedFavorites = JSON.parse(storedFavorites);

            // 파일 데이터를 API에서 가져옴 (PocketBase)
            pb.collection("files")
                .getFullList(1, { autoCancel: false })
                .then((files) => {
                    const formattedFiles = files.map((file) => ({
                        id: file.id,
                        imageUrl: getPbImageURL(file, "photo"), // 정확한 이미지 URL을 사용해야 함
                        name: file.name || "No name",
                        price: file.price || 0,
                    }));

                    // 찜 목록에 해당하는 파일만 필터링
                    const filteredFiles = formattedFiles.filter((file) => parsedFavorites[file.id]);
                    setFavoriteFiles(filteredFiles); // 찜한 파일만 설정
                })
                .catch((error) => console.error("파일을 가져오는 중 오류 발생:", error))
                .finally(() => setIsLoading(false)); // 파일을 가져온 후 로딩 상태 해제
        } else {
            setIsLoading(false); // 찜 목록이 없으면 로딩 상태 해제
        }
    }, [loggedInUserId]); // loggedInUserId가 변경될 때마다 실행

    const handleRemoveFavorite = (id) => {
        const favoritesKey = `favorites_${loggedInUserId}`;
        const storedFavorites = JSON.parse(localStorage.getItem(favoritesKey)) || {};

        // 찜 목록에서 해당 파일의 상태를 변경
        const updatedFavorites = { ...storedFavorites, [id]: false };
        localStorage.setItem(favoritesKey, JSON.stringify(updatedFavorites));

        // 화면에서 찜한 파일 목록에서 제거
        setFavoriteFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
    };

    if (isLoading) {
        return <FileListSkeleton />; // 로딩 중일 때 스켈레톤 UI 표시
    }

    if (!favoriteFiles.length) return <p>찜한 파일이 없습니다.</p>;

    return (
        <>
            <h2 className="sr-only">찜한 제품 리스트</h2>
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
