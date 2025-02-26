import React from 'react'

const FileListSkeleton = () => {
    return (
        <>
            <h2 className="sr-only">제품 리스트</h2>
            <ul className="grid grid-cols-2 gap-2 md:gap-4 md:mb-6 md:grid-cols-4 lg:gap-6 lg:col-start-2 lg:row-end-6 lg:row-span-6 lg:mb-0">
                {/* 업로드된 갯수만큼 */}
                {/* {[...Array(8)].map((_, index) => (
                    <li key={index} className="cursor-pointer overflow-hidden">
                        <figure className="rounded-xl overflow-hidden mb-2 flex items-center h-[180px] md:h-[240px] lg:h-[320px] skeleton dark:skeleton-dark" />
                        <div className="flex flex-col">
                            <span className="w-32 h-4 rounded skeleton dark:skeleton-dark" />
                            <span className="w-24 h-4 rounded mt-2 skeleton dark:skeleton-dark" />
                        </div>
                    </li>
                ))} */}
                {/* 2개만 */}
                <li className="cursor-pointer overflow-hidden">
                        <figure className="rounded-xl overflow-hidden mb-2 flex items-center aspect-square skeleton dark:skeleton-dark" />
                        <div className="flex flex-col">
                            <span className="w-32 h-4 rounded skeleton dark:skeleton-dark" />
                            <span className="w-24 h-4 rounded mt-2 skeleton dark:skeleton-dark" />
                        </div>
                </li>
                <li className="cursor-pointer overflow-hidden">
                        <figure className="rounded-xl overflow-hidden mb-2 flex items-center aspect-square skeleton dark:skeleton-dark" />
                        <div className="flex flex-col">
                            <span className="w-32 h-4 rounded skeleton dark:skeleton-dark" />
                            <span className="w-24 h-4 rounded mt-2 skeleton dark:skeleton-dark" />
                        </div>
                </li>
            </ul>
        </>
    );
};

export default FileListSkeleton