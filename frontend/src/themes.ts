export interface ThemeInfo {
    id: string
    label: string
    swatch: string
    swatchAlt: string
}

export const THEMES: ThemeInfo[] = [
    {
        id: 'pink-navy',
        label: 'Pink & Navy',
        swatch: '#ee1f53',
        swatchAlt: '#1b1d40',
    },
    {
        id: 'green-dark',
        label: 'Green Dark',
        swatch: '#22c55e',
        swatchAlt: '#0d1310',
    },
    {
        id: 'ocean',
        label: 'Ocean',
        swatch: '#0891b2',
        swatchAlt: '#0c4a6e',
    },
    {
        id: 'nord',
        label: 'Nord',
        swatch: '#88c0d0',
        swatchAlt: '#2e3440',
    },
    {
        id: 'sunset',
        label: 'Sunset',
        swatch: '#ef476f',
        swatchAlt: '#7c3a5c',
    },
    {
        id: 'lavender',
        label: 'Lavender',
        swatch: '#8b5cf6',
        swatchAlt: '#4c3575',
    },
]

export type ThemeId = (typeof THEMES)[number]['id']

export const DEFAULT_THEME: ThemeId = 'pink-navy'
