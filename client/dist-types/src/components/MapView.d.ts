export interface MapMarker {
    id: string;
    lat: number;
    lng: number;
    label: string;
}
/** Map component. Renders a live Google map iframe when a browser key is set;
 *  otherwise a non-interactive fallback with coordinates. */
export declare function MapView({ markers, height, }: {
    markers: MapMarker[];
    height?: string;
}): import("react").JSX.Element;
//# sourceMappingURL=MapView.d.ts.map