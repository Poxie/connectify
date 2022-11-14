export const usePhotoIndex = () => {
    const url = new URL(window.location.href);
    const search = new URLSearchParams(url.search);
    const photo = search.get('photo');
    if(!photo) return undefined;
    const index = parseInt(photo);
    return index;
}