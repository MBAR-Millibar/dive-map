/**
 * Alpine adapter for the Dive Map:
 *
 *   <div class="mbar-dive-map" x-data="mbarDiveMap({ selected: [...], names: {...}, interactive: false })">
 *       <div x-ref="canvas" wire:ignore></div>
 *   </div>
 *
 * `selected` may be an entangled Livewire property: the map repaints when it
 * changes, and with `interactive: true` clicking a country toggles it there.
 * `community` (divers per country) and `wishlist` repaint the same way when
 * they change; with `editing: 'wishlist'` a click toggles the wishlist instead.
 * Register it with `window.mbarDiveMap = mbarDiveMap` or `Alpine.data('mbarDiveMap', mbarDiveMap)`.
 */
import { createDiveMap, normalizeCodes } from './core.js';

/**
 * @param {import('./core.js').DiveMapOptions} [options]
 */
export function mbarDiveMap({ selected = [], names = {}, interactive = false, autoFocus = true, community = {}, communityLabel, wishlist = [], editing = 'visited' } = {}) {
    return {
        selected,
        community,
        wishlist,
        editing,
        map: null,

        init() {
            this.map = createDiveMap(this.$refs.canvas, {
                selected: this.selected,
                names,
                interactive,
                autoFocus,
                community: this.community,
                communityLabel,
                onChange: (codes) => {
                    this.selected = codes;
                },
                wishlist: this.wishlist,
                editing: this.editing,
                onWishlistChange: (codes) => {
                    this.wishlist = codes;
                },
            });

            this.$watch('selected', () => this.map?.setSelected(this.codes()));
            this.$watch('community', () => this.map?.setCommunity(this.community));
            this.$watch('wishlist', () => this.map?.setWishlist(normalizeCodes(this.wishlist)));
            this.$watch('editing', () => this.map?.setEditing(this.editing));

            return this.map.ready;
        },

        destroy() {
            this.map?.destroy();
            this.map = null;
        },

        codes() {
            return normalizeCodes(this.selected);
        },
    };
}

export default mbarDiveMap;
