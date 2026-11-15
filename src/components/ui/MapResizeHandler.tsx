import { useMap } from "react-leaflet";
import { useEffect } from "react";

export default function MapResizeHandler() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });
    observer.observe(container);

    // por si el primer layout aún no estaba listo
    const t = setTimeout(() => map.invalidateSize(), 0);

    return () => {
      observer.disconnect();
      clearTimeout(t);
    };
  }, [map]);

  return null;
}