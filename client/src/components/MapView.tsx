import { IoLocationOutline } from "react-icons/io5";

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  label: string;
}

const MAPS_KEY = import.meta.env.VITE_MAPS_BROWSER_KEY as string | undefined;

/** Map component. Renders a live Google map iframe when a browser key is set;
 *  otherwise a non-interactive fallback with coordinates. */
export function MapView({
  markers,
  height = "100%",
}: {
  markers: MapMarker[];
  height?: string;
}) {
  if (!MAPS_KEY) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-outline-variant bg-surface-container-low p-6 text-center text-on-surface-variant"
        style={{ height }}
      >
        <IoLocationOutline size={28} />
        <p className="text-sm font-medium">Map preview unavailable</p>
        <p className="text-xs">
          Set VITE_MAPS_BROWSER_KEY to enable interactive maps.
        </p>
        <ul className="mt-2 space-y-1 text-xs">
          {markers.slice(0, 6).map((m) => (
            <li key={m.id}>
              📍 {m.label} ({m.lat.toFixed(3)}, {m.lng.toFixed(3)})
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const center = markers[0] ?? { lat: 0, lng: 0 };
  const src =
    markers.length === 1
      ? `https://www.google.com/maps/embed/v1/place?key=${MAPS_KEY}&q=${center.lat},${center.lng}&zoom=14`
      : `https://www.google.com/maps/embed/v1/view?key=${MAPS_KEY}&center=${center.lat},${center.lng}&zoom=11`;

  return (
    <iframe
      title="Map"
      className="rounded-lg border-0"
      style={{ width: "100%", height }}
      loading="lazy"
      src={src}
    />
  );
}
