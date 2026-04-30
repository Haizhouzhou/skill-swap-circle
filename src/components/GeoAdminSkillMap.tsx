import { FormEvent, useEffect, useMemo, useState } from "react";
import { ExternalLink, MapPin, Search } from "lucide-react";
import { AREA_CONNECTIONS } from "@/mock/areaConnections";
import { CITIES } from "@/mock/constants";
import type { AreaConnection } from "@/mock/types";

const GEO_ADMIN_ORIGIN = "https://map.geo.admin.ch";
const DEFAULT_SEARCH = "Bern, BE";

type ViewerMode = "map" | "embed";

type FeatureMessage = {
  title: string;
  detail?: string;
};

export function GeoAdminSkillMap() {
  const [viewerMode, setViewerMode] = useState<ViewerMode>("map");
  const [activeSearch, setActiveSearch] = useState(DEFAULT_SEARCH);
  const [draftSearch, setDraftSearch] = useState(DEFAULT_SEARCH);
  const [selectedConnection, setSelectedConnection] = useState<AreaConnection>(AREA_CONNECTIONS[0]);
  const [assetOrigin, setAssetOrigin] = useState("");
  const [featureMessage, setFeatureMessage] = useState<FeatureMessage | null>(null);

  useEffect(() => {
    setAssetOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    const handleFeatureMessage = (event: MessageEvent) => {
      if (event.origin !== GEO_ADMIN_ORIGIN) return;

      const feature = extractFeatureMessage(event.data);
      if (feature) {
        setFeatureMessage(feature);
      }
    };

    window.addEventListener("message", handleFeatureMessage);
    return () => window.removeEventListener("message", handleFeatureMessage);
  }, []);

  const mapSrc = useMemo(() => {
    const overlayUrl = assetOrigin ? `${assetOrigin}/skillswap-connections.kml` : undefined;
    return buildGeoAdminMapSrc({ searchTerm: activeSearch, viewerMode, overlayUrl });
  }, [activeSearch, assetOrigin, viewerMode]);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextSearch = draftSearch.trim();
    if (nextSearch.length > 0) {
      setActiveSearch(nextSearch);
    }
  };

  const chooseCity = (city: string, canton: string) => {
    const searchTerm = `${city}, ${canton}`;
    setDraftSearch(searchTerm);
    setActiveSearch(searchTerm);
  };

  const chooseConnection = (connection: AreaConnection) => {
    const searchTerm = `${connection.sourceCity}, Switzerland`;
    setSelectedConnection(connection);
    setDraftSearch(searchTerm);
    setActiveSearch(searchTerm);
  };

  return (
    <div className="card-soft overflow-hidden">
      <div className="grid xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <div className="flex flex-col gap-3 border-b border-borderSoft/40 bg-card p-4 md:flex-row md:items-center md:justify-between">
            <form onSubmit={submitSearch} className="flex min-w-0 flex-1 gap-2">
              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mutedInk" />
                <input
                  value={draftSearch}
                  onChange={(event) => setDraftSearch(event.target.value)}
                  className="h-11 w-full rounded-full border border-borderSoft bg-cream pl-10 pr-4 text-sm text-ink placeholder:text-mutedInk focus:outline-none focus:ring-2 focus:ring-sage/40"
                  placeholder="Search an address, city, or place"
                />
              </div>
              <button
                type="submit"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-moss text-cream transition hover:bg-ink focus:outline-none focus:ring-2 focus:ring-sage/40"
                aria-label="Center map on search"
              >
                <MapPin className="h-4 w-4" />
              </button>
            </form>

            <div className="inline-flex h-10 shrink-0 rounded-full border border-borderSoft bg-cream p-1 text-xs text-mutedInk">
              <button
                type="button"
                onClick={() => setViewerMode("map")}
                className={`rounded-full px-3 transition ${viewerMode === "map" ? "bg-moss text-cream" : "hover:text-ink"}`}
              >
                Full
              </button>
              <button
                type="button"
                onClick={() => setViewerMode("embed")}
                className={`rounded-full px-3 transition ${viewerMode === "embed" ? "bg-moss text-cream" : "hover:text-ink"}`}
              >
                Clean
              </button>
            </div>
          </div>

          <iframe
            key={mapSrc}
            src={mapSrc}
            title="Skillswap activity map on map.geo.admin.ch"
            className="h-[420px] w-full border-0 md:h-[520px]"
            allow="geolocation"
          />
        </div>

        <aside className="border-t border-borderSoft/40 bg-cream/60 p-4 xl:border-l xl:border-t-0">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-mutedInk">Centered on</p>
            <h3 className="mt-1 font-serif text-2xl text-ink">{activeSearch}</h3>
            <a
              href={mapSrc}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm text-moss hover:text-ink"
            >
              Open in GeoAdmin <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="mt-6">
            <p className="text-xs uppercase tracking-[0.18em] text-mutedInk">Cities</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {CITIES.map(({ city, canton }) => (
                <button
                  key={`${city}-${canton}`}
                  type="button"
                  onClick={() => chooseCity(city, canton)}
                  className="chip transition hover:border-moss hover:bg-card"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs uppercase tracking-[0.18em] text-mutedInk">Swap Threads</p>
            <div className="mt-3 space-y-2">
              {AREA_CONNECTIONS.slice(0, 5).map((connection) => {
                const selected = selectedConnection === connection;
                return (
                  <button
                    key={`${connection.sourceCity}-${connection.targetCity}`}
                    type="button"
                    onClick={() => chooseConnection(connection)}
                    className={`w-full rounded-lg border p-3 text-left transition ${
                      selected
                        ? "border-moss bg-card shadow-sm"
                        : "border-borderSoft/50 bg-card/60 hover:border-moss"
                    }`}
                  >
                    <span className="block text-sm font-medium text-ink">
                      {connection.sourceCity} to {connection.targetCity}
                    </span>
                    <span className="mt-1 block text-xs text-mutedInk">
                      {connection.weight} swaps / {connection.topCategories.join(", ")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-borderSoft/40 bg-card p-3">
            <p className="text-xs uppercase tracking-[0.18em] text-mutedInk">Feature Info</p>
            {featureMessage ? (
              <div className="mt-2">
                <p className="font-serif text-lg text-ink">{featureMessage.title}</p>
                {featureMessage.detail && <p className="mt-1 text-sm text-mutedInk">{featureMessage.detail}</p>}
              </div>
            ) : (
              <p className="mt-2 text-sm text-mutedInk">No map feature selected yet.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function buildGeoAdminMapSrc({
  searchTerm,
  viewerMode,
  overlayUrl,
}: {
  searchTerm: string;
  viewerMode: ViewerMode;
  overlayUrl?: string;
}) {
  const params = new URLSearchParams({
    lang: "en",
    topic: "ech",
    bgLayer: "ch.swisstopo.pixelkarte-farbe",
    featureInfo: "default",
    swisssearch: searchTerm,
    swisssearch_autoselect: "true",
  });

  if (viewerMode === "embed") {
    params.set("noSimpleZoom", "true");
  }

  if (overlayUrl) {
    params.set("layers", `KML|${overlayUrl}`);
  }

  return `${GEO_ADMIN_ORIGIN}/#/${viewerMode}?${params.toString()}`;
}

function extractFeatureMessage(data: unknown): FeatureMessage | null {
  if (!isRecord(data)) return null;

  const payload = isRecord(data.payload) ? data.payload : data;
  const feature = getFirstFeature(payload);
  const properties = getProperties(feature) ?? getProperties(payload);
  if (!properties) return null;

  const title =
    getString(properties, "name") ??
    getString(properties, "label") ??
    getString(properties, "title") ??
    getString(feature, "name") ??
    "Map feature";

  const detail =
    getString(properties, "description") ??
    getString(properties, "html") ??
    getString(properties, "detail") ??
    getString(properties, "latestSkill");

  return {
    title: stripHtml(title),
    detail: detail ? stripHtml(detail) : undefined,
  };
}

function getFirstFeature(value: Record<string, unknown>): Record<string, unknown> {
  const features = value.features;
  if (Array.isArray(features) && isRecord(features[0])) {
    return features[0];
  }

  if (isRecord(value.feature)) {
    return value.feature;
  }

  return value;
}

function getProperties(value: Record<string, unknown>): Record<string, unknown> | null {
  return isRecord(value.properties) ? value.properties : null;
}

function getString(value: Record<string, unknown>, key: string) {
  const candidate = value[key];
  return typeof candidate === "string" && candidate.trim().length > 0 ? candidate : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
