export default function useGetAllImages(folderName) {
  const modules = import.meta.glob('/src/assets/images/**/*.{png,jpg,jpeg,webp,avif}', {
    query: '?url',
    import: 'default',
    eager: true,
  });

  const imagesMap = {};

  Object.entries(modules).forEach(([path, url]) => {
    if (!path.includes(`/src/assets/images/${folderName}/`)) return;

    const fileName = path.split('/').pop();
    const [nameWithTag, format] = fileName.split('.');

    const isLqip = nameWithTag.includes('@lqip');
    const baseName = isLqip ? nameWithTag.replace('@lqip', '@1x') : nameWithTag;

    if (!imagesMap[baseName]) {
      imagesMap[baseName] = {
        name: baseName,
        sources: {},
        lqip: null,
      };
    }

    if (isLqip) {
      imagesMap[baseName].lqip = url;
      return;
    }

    imagesMap[baseName].sources[format] = url;
  });

  return Object.values(imagesMap);
}
