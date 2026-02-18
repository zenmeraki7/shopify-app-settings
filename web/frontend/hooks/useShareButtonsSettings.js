import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { stableStringify } from "../utils/stableStringify";
import { useAuthFetch } from "./useAuthFetch";

const DEFAULTS = {
  enabled: true,
  buttonStyle: "icon_text",
  shape: "round",
  theme: "light",
  spacing: 8,
  alignment: "left",
  brandColor: { hue: 210, saturation: 70, brightness: 50 },
  stickyOnScroll: false,
  mobileOnly: false,
  animation: { enabled: true, type: "none", speedMs: 180 },
  placement: "below_description",
  rules: { minPrice: 0, hideSoldOut: false, excludedCollectionIds: [] },
  platforms: {
    whatsapp: true,
    instagram: true,
    messenger: true,
    facebook: true,
    pinterest: true,
    twitter: true,
    email: true,
    copy: true,
  },
};

export function useShareButtonsSettings() {
  const authFetch = useAuthFetch();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [saved, setSaved] = useState(DEFAULTS);
  const [draft, setDraft] = useState(DEFAULTS);

  const savedKey = useMemo(() => stableStringify(saved), [saved]);
  const draftKey = useMemo(() => stableStringify(draft), [draft]);
  const dirty = savedKey !== draftKey;

  const abortRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (abortRef.current) abortRef.current.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const res = await authFetch("/api/settings/share-buttons", {
        method: "GET",
        signal: ac.signal,
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Failed to load settings (${res.status})`);
      }

      const data = await res.json();
      const settings = normalize(data?.settings);

      setSaved(settings);
      setDraft(settings);
    } catch (e) {
      if (e?.name !== "AbortError") {
        setError(e?.message || "Failed to load settings");
        setSaved(DEFAULTS);
        setDraft(DEFAULTS);
      }
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    load();
    return () => abortRef.current?.abort?.();
  }, [load]);

  const discard = useCallback(() => {
    setDraft(saved);
  }, [saved]);

  const save = useCallback(async () => {
    setSaving(true);
    setError(null);

    try {
      const res = await authFetch("/api/settings/share-buttons", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const msg =
          data?.error ||
          (Array.isArray(data?.details) ? data.details.join(", ") : null) ||
          `Failed to save (${res.status})`;
        throw new Error(msg);
      }

      setSaved(draft);
      return { ok: true };
    } catch (e) {
      const msg = e?.message || "Failed to save settings";
      setError(msg);
      return { ok: false, error: msg };
    } finally {
      setSaving(false);
    }
  }, [authFetch, draft]);

  return {
    loading,
    saving,
    error,
    saved,
    draft,
    setDraft,
    dirty,
    load,
    save,
    discard,
  };
}

function normalize(input) {
  const s = input && typeof input === "object" ? input : {};
  return {
    enabled: !!s.enabled,
    buttonStyle: oneOf(s.buttonStyle, ["icon_only", "icon_text", "floating_bar"], DEFAULTS.buttonStyle),
    shape: oneOf(s.shape, ["round", "square", "pill"], DEFAULTS.shape),
    theme: oneOf(s.theme, ["light", "dark"], DEFAULTS.theme),
    spacing: clampInt(s.spacing, 0, 24, DEFAULTS.spacing),
    alignment: oneOf(s.alignment, ["left", "center", "right"], DEFAULTS.alignment),

    brandColor: {
      hue: clampInt(s?.brandColor?.hue, 0, 360, DEFAULTS.brandColor.hue),
      saturation: clampInt(s?.brandColor?.saturation, 0, 100, DEFAULTS.brandColor.saturation),
      brightness: clampInt(s?.brandColor?.brightness, 0, 100, DEFAULTS.brandColor.brightness),
    },

    stickyOnScroll: !!s.stickyOnScroll,
    mobileOnly: !!s.mobileOnly,

    animation: {
      enabled: !!s?.animation?.enabled,
      type: oneOf(s?.animation?.type, ["none", "fade", "slide", "pop"], DEFAULTS.animation.type),
      speedMs: clampInt(s?.animation?.speedMs, 0, 2000, DEFAULTS.animation.speedMs),
    },

    placement: oneOf(s.placement, ["above_atc", "below_description", "floating"], DEFAULTS.placement),

    rules: {
      minPrice: clampNumber(s?.rules?.minPrice, 0, 1e12, DEFAULTS.rules.minPrice),
      hideSoldOut: !!s?.rules?.hideSoldOut,
      excludedCollectionIds: Array.isArray(s?.rules?.excludedCollectionIds)
        ? s.rules.excludedCollectionIds.map(String).filter(Boolean)
        : [],
    },

    platforms: {
      whatsapp: boolOrDefault(s?.platforms?.whatsapp, DEFAULTS.platforms.whatsapp),
      instagram: boolOrDefault(s?.platforms?.instagram, DEFAULTS.platforms.instagram),
      messenger: boolOrDefault(s?.platforms?.messenger, DEFAULTS.platforms.messenger),
      facebook: boolOrDefault(s?.platforms?.facebook, DEFAULTS.platforms.facebook),
      pinterest: boolOrDefault(s?.platforms?.pinterest, DEFAULTS.platforms.pinterest),
      twitter: boolOrDefault(s?.platforms?.twitter, DEFAULTS.platforms.twitter),
      email: boolOrDefault(s?.platforms?.email, DEFAULTS.platforms.email),
      copy: boolOrDefault(s?.platforms?.copy, DEFAULTS.platforms.copy),
    },
  };
}

function oneOf(v, allowed, fallback) {
  return allowed.includes(v) ? v : fallback;
}
function clampInt(v, min, max, fallback) {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  const x = Math.round(n);
  return Math.max(min, Math.min(max, x));
}
function clampNumber(v, min, max, fallback) {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}
function boolOrDefault(v, fallback) {
  return typeof v === "boolean" ? v : fallback;
}
