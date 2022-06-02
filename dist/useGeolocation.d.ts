declare type LatLngLiteral = {
    lat: number;
    lng: number;
};
declare const useGeolocation: () => {
    currentPosition: LatLngLiteral | undefined;
};
export default useGeolocation;
