"use client";
import { useState, useMemo, useEffect, useRef, memo } from "react";
import Map, { Marker, NavigationControl, GeolocateControl, ScaleControl, Popup, MapRef, Source, Layer } from "react-map-gl/maplibre";
import maplibregl, { LngLatBounds } from "maplibre-gl";
import { POI, Location } from "@/types";
import { getCategoryConfig } from "@/data/categories";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Star, MapPin as MapPinIcon } from "lucide-react";
interface MapProps {
apiKey: string;
pois: POI[];
onSelectPoi: (poi: POI | null) => void;
selectedPoi: POI | null;
userLocation: Location | null;
routeGeometry: any | null;
mapStyleType: "streets-v2" | "hybrid";
}
// 1. MEMOIZATION DU PIN INDIVIDUEL
const MapMarker = memo(({ poi, isSelected, onClick, onHover }: { poi: POI, isSelected: boolean, onClick: (e: any) => void, onHover: (p: POI | null) => void }) => {
const config = getCategoryConfig(poi.poi_category);
return (
<Marker
longitude={poi.location.longitude}
latitude={poi.location.latitude}
anchor="bottom"
onClick={onClick}
>
<div
onMouseEnter={() => onHover(poi)}
onMouseLeave={() => onHover(null)}
className="relative flex flex-col items-center cursor-pointer group transform-gpu"
style={{ zIndex: isSelected ? 50 : 10 }}
>
{isSelected ? (
<div className="relative">
<div className="absolute inset-0 bg-red-500 rounded-full opacity-75 animate-ping"></div>
<div className="relative z-10 text-red-600 drop-shadow-lg scale-125 transition-transform duration-200">
<MapPinIcon size={48} fill="#ef4444" className="text-red-900" />
<div className="absolute top-[14px] left-[14px] w-5 h-5 bg-white rounded-full flex items-center justify-center">
<div className="w-2 h-2 bg-red-600 rounded-full" />
</div>
</div>
</div>
) : (
<>
<div
className="flex items-center justify-center w-8 h-8 rounded-full shadow-lg border-2 border-white transition-transform duration-200 group-hover:scale-125 bg-zinc-900 will-change-transform"
style={{ backgroundColor: config.color }}
>
<div className="text-white drop-shadow-md">
{config.icon}
</div>
</div>
<div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] mt-[-1px]" style={{ borderTopColor: config.color }}></div>
</>
)}
</div>
</Marker>
);
});
MapMarker.displayName = "MapMarker";
// --- COMPOSANT CARTE ---
const MapComponent = ({ apiKey, pois, onSelectPoi, selectedPoi, userLocation, routeGeometry, mapStyleType }: MapProps) => {
const mapRef = useRef<MapRef>(null);
const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
const [viewState, setViewState] = useState({
longitude: 11.516,
latitude: 3.866,
zoom: 13.5
});
const [hoveredPoi, setHoveredPoi] = useState<POI | null>(null);
const handleHover = (poi: POI | null) => {
if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
if (poi) {
setHoveredPoi(poi);
} else {
hoverTimeoutRef.current = setTimeout(() => setHoveredPoi(null), 100);
}
};
useEffect(() => {
if (userLocation && mapRef.current && !routeGeometry) {
mapRef.current.flyTo({ center: [userLocation.longitude, userLocation.latitude], zoom: 15, duration: 1200 });
}
}, [userLocation, routeGeometry]);
useEffect(() => {
if (selectedPoi && mapRef.current && !routeGeometry) {
mapRef.current.flyTo({ center: [selectedPoi.location.longitude, selectedPoi.location.latitude], zoom: 16, duration: 1000 });
}
}, [selectedPoi, routeGeometry]);
useEffect(() => {
if (routeGeometry && mapRef.current) {
const coords = routeGeometry.coordinates;
const bounds = new LngLatBounds(coords[0], coords[0]);
for (const coord of coords) bounds.extend(coord as [number, number]);
mapRef.current.fitBounds(bounds, {
        padding: { top: 80, bottom: 80, right: 50, left: window.innerWidth > 768 ? 420 : 50 },
        duration: 1500
    });
}
}, [routeGeometry]);
const pins = useMemo(() => {
return pois.map((poi) => (
<MapMarker
key={poi.poi_id}
poi={poi}
isSelected={selectedPoi?.poi_id === poi.poi_id}
onHover={handleHover}
onClick={(e) => {
e.originalEvent.stopPropagation();
onSelectPoi(poi);
}}
/>
));
}, [pois, selectedPoi?.poi_id, onSelectPoi]);
return (
<Map
ref={mapRef}
{...viewState}
onMove={evt => setViewState(evt.viewState)}
style={{ width: "100%", height: "100%" }}
mapStyle={`https://api.maptiler.com/maps/${mapStyleType}/style.json?key=${apiKey}`}
attributionControl={false}
onClick={() => onSelectPoi(null)}
mapLib={maplibregl}
reuseMaps={true}
cooperativeGestures={true}
maxTileCacheSize={100}
>
<GeolocateControl position="bottom-right" />
<NavigationControl position="bottom-right" showCompass={false} />
<ScaleControl />
{routeGeometry && (
      <Source id="route-source" type="geojson" data={routeGeometry}>
         <Layer
           id="route-outline"
           type="line"
           paint={{
             'line-color': '#ffffff',
             'line-width': 8,
             'line-opacity': 0.8
           }}
           layout={{ 'line-cap': 'round', 'line-join': 'round' }}
         />
         <Layer
           id="route-line"
           type="line"
           paint={{
             'line-color': '#9400D3',
             'line-width': 5,
             'line-opacity': 1
           }}
           layout={{ 'line-cap': 'round', 'line-join': 'round' }}
         />
      </Source>
   )}

  {userLocation && (
    <Marker longitude={userLocation.longitude} latitude={userLocation.latitude}>
       <div className="relative flex items-center justify-center w-6 h-6 transform-gpu">
          <span className="absolute w-12 h-12 bg-blue-500 rounded-full opacity-30 animate-ping"></span>
          <span className="absolute w-6 h-6 bg-blue-500/40 rounded-full border border-blue-500/50 backdrop-blur-sm"></span>
          <span className="absolute w-3.5 h-3.5 bg-blue-600 rounded-full border-2 border-white shadow-sm z-10"></span>
       </div>
    </Marker>
  )}

  {pins}

  <AnimatePresence>
    {hoveredPoi && !selectedPoi && (
      <Popup
        longitude={hoveredPoi.location.longitude}
        latitude={hoveredPoi.location.latitude}
        anchor="top"
        closeButton={false}
        offset={12}
        className="z-50 pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="flex gap-2 p-0 min-w-[180px] shadow-xl rounded-lg bg-white overflow-hidden"
        >
           <div className="relative w-10 h-10 shrink-0 bg-zinc-100">
              {hoveredPoi.poi_images_urls && hoveredPoi.poi_images_urls[0] && (
                 <Image
                   src={hoveredPoi.poi_images_urls[0]}
                   alt=""
                   fill
                   className="object-cover"
                   sizes="40px"
                   quality={50}
                 />
              )}
           </div>
           <div className="flex flex-col justify-center py-1 pr-2">
             <h4 className="font-bold text-xs text-zinc-900 leading-tight line-clamp-1">{hoveredPoi.poi_name}</h4>
             <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-medium">
               <Star size={9} className="text-yellow-500 fill-current" />
               <span>{hoveredPoi.rating}</span>
               <span>•</span>
               <span>{getCategoryConfig(hoveredPoi.poi_category).label}</span>
             </div>
           </div>
        </motion.div>
      </Popup>
    )}
  </AnimatePresence>
</Map>
);
};
// Export par défaut propre pour Next.js Dynamic Imports
export default memo(MapComponent);