// 이미지 관련
export default function getPbImageURL(item,fileName = 'field'){
    return `${import.meta.env.VITE_PB_API}/files/${item.collectionId}/${item.id}/${item.field}`
  }