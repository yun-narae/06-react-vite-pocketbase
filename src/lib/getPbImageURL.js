export default function getPbImageURL(item, fileName = 'field') {
  const baseURL = import.meta.env.MODE === "development"
      ? "http://127.0.0.1:8090/api" // 로컬 개발 환경
      : import.meta.env.VITE_PB_API; // 배포 환경

  return `${baseURL}/files/${item.collectionId}/${item.id}/${item.field}`;
}