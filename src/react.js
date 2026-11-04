'use client';

/**
 * React adapter for the Dive Map:
 *
 *   <DiveMap selected={['MT', 'EG']} names={{ MT: 'Malta' }} className="h-64 w-full" />
 *
 * Client-only: the map is drawn in an effect, so it renders an empty box on
 * the server. In Next.js it also works behind
 * `dynamic(() => import('@millibar/dive-map/react'), { ssr: false })`.
 * Plain JavaScript (no JSX), so it needs no build step.
 */
import { createElement, useEffect, useRef } from 'react';
import { createDiveMap, defaultCommunityLabel, normalizeCodes, normalizeCommunity } from './core.js';

/**
 * @typedef {object} DiveMapProps
 * @property {import('./core.js').CountrySelection} [selected] The countries to highlight.
 * @property {Record<string, string>} [names] Country names by code, for the tooltips and dots.
 * @property {boolean} [interactive] Clicking a country toggles it (calls onChange).
 * @property {(codes: string[]) => void} [onChange] Called with the new codes after a click.
 * @property {boolean} [autoFocus] Zoom in on the countries when the map is first drawn with some (default true).
 * @property {Record<string, number>} [community] Divers per country, drawn in the soft community colour under the selected countries.
 * @property {(count: number) => string} [communityLabel] The tooltip text for a community country's count (default `${n} divers`).
 * @property {import('./core.js').CountrySelection} [wishlist] Countries the diver wants to dive, drawn in the wish colour.
 * @property {'visited' | 'wishlist'} [editing] Which list a click toggles (default 'visited').
 * @property {(codes: string[]) => void} [onWishlistChange] Called with the new wishlist after a click changes it.
 * @property {string} [className] Classes for the wrapper, which needs a height.
 */

/**
 * @param {DiveMapProps} props
 */
export function DiveMap({
    selected = [],
    names = {},
    interactive = false,
    onChange,
    className,
    autoFocus = true,
    community,
    communityLabel,
    wishlist = [],
    editing = 'visited',
    onWishlistChange,
}) {
    const canvasRef = useRef(null);
    const mapRef = useRef(null);
    const latest = useRef({ selected, names, onChange, community, communityLabel, wishlist, editing, onWishlistChange });
    latest.current = { selected, names, onChange, community, communityLabel, wishlist, editing, onWishlistChange };

    const selectedKey = normalizeCodes(selected).join(',');
    const wishlistKey = normalizeCodes(wishlist).join(',');
    const communityKey = Object.entries(normalizeCommunity(community))
        .sort(([a], [b]) => (a < b ? -1 : 1))
        .map(([code, count]) => `${code}:${count}`)
        .join(',');

    useEffect(() => {
        const map = createDiveMap(canvasRef.current, {
            selected: latest.current.selected,
            names: latest.current.names,
            interactive,
            autoFocus,
            community: latest.current.community,
            communityLabel: (count) => (latest.current.communityLabel ?? defaultCommunityLabel)(count),
            onChange: (codes) => latest.current.onChange?.(codes),
            wishlist: latest.current.wishlist,
            editing: latest.current.editing,
            onWishlistChange: (codes) => latest.current.onWishlistChange?.(codes),
        });
        mapRef.current = map;

        return () => {
            map.destroy();
            mapRef.current = null;
        };
    }, [interactive, autoFocus]);

    useEffect(() => {
        mapRef.current?.setSelected(latest.current.selected);
    }, [selectedKey]);

    useEffect(() => {
        mapRef.current?.setCommunity(latest.current.community);
    }, [communityKey]);

    useEffect(() => {
        mapRef.current?.setWishlist(latest.current.wishlist);
    }, [wishlistKey]);

    useEffect(() => {
        mapRef.current?.setEditing(editing);
    }, [editing]);

    useEffect(() => {
        mapRef.current?.setNames(names);
    }, [names]);

    return createElement(
        'div',
        { className: className ? `mbar-dive-map ${className}` : 'mbar-dive-map' },
        createElement('div', { ref: canvasRef, style: { width: '100%', height: '100%' } }),
    );
}

export default DiveMap;
