const AVATAR_COLORS = [
    '#1b1d40',
    '#7c3aed',
    '#0369a1',
    '#b45309',
    '#0f766e',
    '#9d174d',
    '#4338ca',
    '#047857',
]

export function avatarColor(id: number) {
    return AVATAR_COLORS[id % AVATAR_COLORS.length]
}
