import React, { useEffect, useState } from "react";
import pb from "../lib/pocketbase";
import getPbImageURL from "../lib/getPbImageURL";


const FavoriteFiles = () => {
    const [favorites, setFavorites] = useState(() => {
        const storedFavorites = localStorage.getItem("favorites");
        return storedFavorites ? JSON.parse(storedFavorites) : {};
    });
    const [favoriteFiles, setFavoriteFiles] = useState([]);

    useEffect(() => {
        const fetchFavoriteFiles = async () => {
            try {
                const fileIds = Object.keys(favorites).filter((id) => favorites[id]);
                const files = await Promise.all(
                    fileIds.map((id) => pb.collection("files").getOne(id))
                );
                setFavoriteFiles(files.map(file => ({
                    id: file.id,
                    imageUrl: getPbImageURL(file, "photo"),
                    name: file.name || "No name",
                    price: file.price || 0,
                })));
            } catch (error) {
                console.error("Error fetching favorite files:", error);
            }
        };

        fetchFavoriteFiles();
    }, [favorites]);

    if (!favoriteFiles.length) return <p>No favorite files.</p>;

    return (
        <>
            <h2 className="sr-only">제품 리스트</h2>
            <ul className="grid grid-cols-2 gap-2 md:gap-4 md:mb-6 md:grid-cols-4 lg:gap-6 lg:col-start-2 lg:row-end-6 lg:row-span-6 lg:mb-0">
                {favoriteFiles.map((file, index) => (
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
                        
                    </li>
                ))}
            </ul>
        </>
    );
};


export default FavoriteFiles