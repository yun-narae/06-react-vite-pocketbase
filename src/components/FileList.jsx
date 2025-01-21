import React, { useState, useEffect } from "react";
import pb from "../lib/pocketbase";
import getPbImageURL from "../lib/getPbImageURL";
import FileListSkeleton from "./FileListSkeleton";
import { useNavigate } from "react-router-dom";

const FileList = ({ isLoggedIn, loggedInUserId, isLoading, setIsLoading }) => {
    const navigate = useNavigate();
    const [ fileData, setFileData ] = useState([]); // 실제 데이터 상태
    const [ dataloading, setDataLoading ] = useState(true); // 로딩 상태, 데이터 로딩을 나타내기 위한 상태
    const [favorites, setFavorites] = useState(() => {
        const storedFavorites = localStorage.getItem(`favorites_${loggedInUserId}`);
        return storedFavorites ? JSON.parse(storedFavorites) : {};
    });

    const toggleFavorite = (id) => {
        // 로그인 상태가 아니면 알림을 띄우고 종료
        if (!isLoggedIn || !loggedInUserId) {
            alert("로그인이 필요합니다.");
            navigate("/login");
            return;
        }

        setFavorites((prev) => {
            const updatedFavorites = { ...prev, [id]: !prev[id] };
            localStorage.setItem(`favorites_${loggedInUserId}`, JSON.stringify(updatedFavorites)); // LocalStorage에 저장

            return updatedFavorites;
        });
    };

    useEffect(() => {
        const fetchFiles = async () => {
            setIsLoading(true); // API 호출 전에 로딩 상태 시작
            setDataLoading(true); // 데이터 로딩 상태 true로 설정

            try {
                const files = await pb.collection("files").getFullList(1, { autoCancel: false });

                setFileData(files.map(file => ({
                    id: file.id,
                    imageUrl: getPbImageURL(file, "photo"),
                    name: file.name || "No name",
                    price: file.price || 0,
                })));
            } catch (error) {
                console.error("Error fetching files:", error);
            } finally {
                setIsLoading(false); // 전체 로딩 상태 해제
                setDataLoading(false); // 데이터 로딩 완료, 대기 상태 해제
            }
        };

        fetchFiles();
    }, [loggedInUserId]);

    // 데이터 로딩 중이면 스켈레톤 UI 표시
    if (dataloading || isLoading) {
        return <FileListSkeleton />;
    }

    // 데이터가 로드 완료된 후 fileData가 비어 있을 경우만 "No files available." 메시지 표시
    if (fileData.length === 0) {
        return <p>제품이 비어있습니다.</p>;
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
