import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, CheckCircle2 } from "lucide-react";
import { LocationService } from "@/services/location.service";
import { Address } from "@/types/common";

export interface LocationResult {
  id ?: number;
  address1: string;
  address2: string;
  city: string;
  state: string;
  stateId?: number;
  pincode: string;
  landmark: string;
  lat: number;
  lng: number;
  verified: boolean;
}

interface LocationSearchProps {
  onSelect: (location: LocationResult) => void;
}



const LocationSearch = ({ onSelect }: LocationSearchProps) => {
  const [query, setQuery] = useState("");
  // const [suggestions, setSuggestions] = useState<typeof MOCK_LOCATIONS>([]);
  const [suggestions, setSuggestions] = useState<Address[]>([]);
const [selected, setSelected] = useState<Address | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  // const [selected, setSelected] = useState<LocationResult | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const [states, setStates] = useState<any[]>([]);

  
useEffect(() => {
  LocationService.getStates().then((data) => {
    setStates(data);
  });
}, []);

const getStateId = (stateName: string) => {
  const normalize = (str: string) =>
    str.toLowerCase().replace(/[^a-z]/g, "");

  return states.find(
    (s) => normalize(s.Name) === normalize(stateName)
  );
};



  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

const handleSearch = (value: string) => {
  setQuery(value);
  setSelected(null);

  if (debounceRef.current) {
    clearTimeout(debounceRef.current);
  }

  if (value.length >= 2) {
    debounceRef.current = setTimeout(async () => {
      const results = await LocationService.search(value);
      setSuggestions(results);
      setShowSuggestions(true);
    }, 300); // ⏱ 300ms delay
  } else {
    setSuggestions([]);
    setShowSuggestions(false);
  }
};

//   const handleSelectSuggestion = (loc: Address) => {
//   setQuery(loc.label);
//   setSelected(loc);
//   setShowSuggestions(false);
//   const matchedState = getStateId(loc.state);

//   onSelect({
//     id: loc.id,
//     address1: loc.address1,
//     address2: loc.address2,
//     city: loc.city,
//     state: matchedState?.Name || loc.state,
//     stateId: matchedState ? Number(matchedState.ID) : 0,
//     pincode: loc.pincode,
//     landmark: loc.landmark,
//     lat: loc.lat,
//     lng: loc.lng,
//     verified: loc.verified
//   });
// };
const handleSelectSuggestion = async (loc: Address) => {
  setShowSuggestions(false);

  // fetch full place details
  const details = await LocationService.getPlaceDetails(
    loc.placeId || ""
  );

  const fullLocation: Address = {
    ...loc,
    ...details,
  };

  setQuery(fullLocation.label);
  setSelected(fullLocation);

  const matchedState = getStateId(fullLocation.state);

  onSelect({
    id: fullLocation.id,
    address1: fullLocation.address1,
    address2: fullLocation.address2,
    city: fullLocation.city,
    state: matchedState?.Name || fullLocation.state,
    stateId: matchedState
      ? Number(matchedState.ID)
      : 0,
    pincode: fullLocation.pincode,
    landmark: fullLocation.landmark,
    lat: fullLocation.lat,
    lng: fullLocation.lng,
    verified: true,
  });
};
  return (
    <div className="space-y-3">
      <div ref={containerRef} className="relative">
        <Label>Search Location</Label>
        <div className="relative mt-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search your location "
            className="pl-9"
            onFocus={() => query.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
          />
        </div>

        {showSuggestions && suggestions && (
          <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-52 overflow-y-auto">
            {suggestions.map((loc, i) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => handleSelectSuggestion(loc)}
                className="flex items-start gap-2 w-full px-3 py-2.5 text-left hover:bg-accent transition-colors text-sm"
              >
                <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <div>
                  <span className="font-medium text-foreground">{loc.label}</span>
                  <span className="block text-xs text-muted-foreground">{loc.address1}, {loc.city} - {loc.pincode}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="flex items-start gap-2 p-3 rounded-md bg-primary/5 border border-primary/20">
          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <div className="text-sm">
            <span className="font-medium text-foreground">Selected Location</span>
            <span className="block text-muted-foreground">
              {selected.address1}, {selected.city} - {selected.pincode}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
