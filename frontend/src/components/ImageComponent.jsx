const ImageComponent = ({ src, alt }) => (
  <img src={src.replace(".jpg", ".webp")} alt={alt} loading="lazy" />
);
export default ImageComponent;
