import React, { useState, useEffect } from "react";
import pb from "../lib/pocketbase";
import getPbImageURL from "../lib/getPbImageURL";

const FileList = () => {
    const [fileData, setFileData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const files = await pb.collection("files").getFullList(1, { autoCancel: false });
                setFileData(files.map(file => ({
                    imageUrl: getPbImageURL(file, "photo"),
                    name: file.name || "No name",
                    price: file.price || 0,
                })));
            } catch (error) {
                console.error("Error fetching files:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFiles();
    }, []);

    if (isLoading) return <p>Loading files...</p>;
    if (!fileData.length) return <p>No files available.</p>;

    return (
        <div className="mt-6">
            <h2 className="sr-only">제품 리스트</h2>
            <ul className="grid grid-cols-2 gap-2 md:gap-4 md:mb-6 md:grid-cols-4 lg:gap-6 lg:col-start-2 lg:row-end-6 lg:row-span-6 lg:mb-0">
                {fileData.map((file, index) => (
                    <li key={index} className="cursor-pointer">
                        <figure className="rounded-xl overflow-hidden mb-2">
                            <img src={file.imageUrl} alt={file.name} className="w-full" />
                            {/* isLoggedIn으로 로그인 되어있다면 a링크 통해서 상세로 없으면 로그인 하는 페이지로*/}
                        </figure>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold dark:text-white">{file.name}</span>
                            <span className="text-sm font-bold text-zinc-600 dark:text-slate-400">{file.price}원</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FileList;
