const Picture = ({ sources, alt, loading = "eager", className, fetchpriority }) => {
  const fallback = sources.png || sources.jpg || Object.values(sources)[0];

  return (
    <picture className={className}>
      {sources.avif && <source srcSet={sources.avif} type="image/avif" />}
      {sources.webp && <source srcSet={sources.webp} type="image/webp" />}

      <img
        src={fallback}
        alt={alt}
        loading={loading}
        fetchPriority={fetchpriority}
      />
    </picture>
  );
};

export default Picture;

// const images = useGetAllImages('hero');

// {images.map(img => (
//   <Picture key={img.name} sources={img.sources} alt={img.name} />
// ))}