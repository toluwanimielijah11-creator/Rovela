export interface EmojiCategory {
  id: string;
  label: string;
  icon: string;
  emojis: string[];
}

export const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    id: 'smileys',
    label: 'Smileys & Emotion',
    icon: '😀',
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
      '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😋',
      '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐',
      '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌',
      '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧',
      '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐',
      '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦',
      '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞',
      '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿',
      '💀', '💩', '🤡', '👻', '👽', '🤖'
    ],
  },
  {
    id: 'gestures',
    label: 'People & Gestures',
    icon: '👋',
    emojis: [
      '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞',
      '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍',
      '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝',
      '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂',
      '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄'
    ],
  },
  {
    id: 'hearts',
    label: 'Hearts & Emotions',
    icon: '❤️',
    emojis: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
      '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '💌',
      '💋', '💯', '💢', '💥', '💫', '💦', '💨', '🕳️', '💬', '💭'
    ],
  },
  {
    id: 'animals',
    label: 'Animals & Nature',
    icon: '🐱',
    emojis: [
      '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
      '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆',
      '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋',
      '🐌', '🐞', '🐜', '🦟', '🐢', '🐍', '🦎', '🐙', '🦑', '🦐',
      '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🦈', '🐊', '🐅',
      '🌸', '🌺', '🌹', '🌷', '🌼', '🌻', '🌞', '🌙', '⭐', '⚡',
      '🔥', '💧', '🌈', '☀️', '🌤️', '⛅', '🌥️', '☁️', '🌧️', '⛈️'
    ],
  },
  {
    id: 'food',
    label: 'Food & Drink',
    icon: '🍕',
    emojis: [
      '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐',
      '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🥑', '🥦',
      '🌽', '🥕', '🥔', '🥐', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳',
      '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🌭', '🍔', '🍟', '🍕',
      '🥪', '🥙', '🌮', '🌯', '🥗', '🍝', '🍜', '🍲', '🍛', '🍣',
      '🍱', '🥟', '🍤', '🍙', '🍚', '🍦', '🍧', '🍨', '🍩', '🍪',
      '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯', '🍼',
      '☕', '🫖', '🍵', '🧃', '🥤', '🧋', '🍺', '🍻', '🥂', '🍷'
    ],
  },
  {
    id: 'activities',
    label: 'Activities & Sports',
    icon: '⚽',
    emojis: [
      '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱',
      '🏓', '🏸', '🏒', '🏏', '⛳', '🏹', '🎣', '🤿', '🥊', '🥋',
      '🛹', '🛼', '🛷', '⛸️', '🎿', '🏋️', '🤼', '🤸', '🧗', '🎮',
      '🎲', '🧩', '♟️', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹',
      '🥁', '🎷', '🎺', '🎸', '🪕', '🎻', '🏆', '🥇', '🥈', '🥉'
    ],
  },
  {
    id: 'travel',
    label: 'Travel & Places',
    icon: '🚀',
    emojis: [
      '🚗', '🚕', '🚙', '🚌', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚',
      '🛵', '🏍️', '🚲', '🛴', '🚨', '🚅', '🚄', '🚆', '🚇', '✈️',
      '🛫', '🛬', '💺', '🛰️', '🚀', '🛸', '🚁', '🛶', '⛵', '🚤',
      '🛳️', '⛴️', '🚢', '⚓', '🗺️', '🗽', '🗼', '🏰', '🎡', '🎢',
      '🏖️', '🏝️', '🏜️', '🌋', '⛰️', '🏔️', '🏕️', '⛺', '🏠', '🏢'
    ],
  },
  {
    id: 'objects',
    label: 'Objects & Symbols',
    icon: '💡',
    emojis: [
      '💡', '🔦', '🕯️', '📱', '💻', '🖥️', '⌨️', '📷', '📸', '📹',
      '📺', '📻', '⏰', '⏱️', '⏳', '📡', '🔋', '🔌', '💎', '🔑',
      '🔒', '🔓', '🔔', '🔕', '📦', '🎁', '🎈', '🎉', '🎊', '🎀',
      '🪄', '🔮', '🧿', '🏷️', '🔖', '✉️', '📧', '📦', '📫', '✏️',
      '📌', '📍', '📎', '✂️', '📁', '📂', '📅', '📊', '📈', '📉'
    ],
  },
  {
    id: 'symbols',
    label: 'Symbols & Flags',
    icon: '✨',
    emojis: [
      '✨', '⭐', '🌟', '💫', '⚡', '☄️', '💥', '🔥', '🔮', '💯',
      '⚠️', '⛔', '🚫', '✅', '✔️', '❌', '❎', '➕', '➖', '➗',
      '❓', '❔', '❕', '❗', '💤', '🎵', '🎶', '🟣', '🟣', '⚪',
      '🏳️', '🏴', '🏁', '🚩', '🇺🇸', '🇬🇧', '🇨🇦', '🇫🇷', '🇩🇪', '🇯🇵'
    ],
  },
];

export interface StickerItem {
  id: string;
  name: string;
  imageUrl: string;
  packId: string;
  isFavorite?: boolean;
}

export interface StickerPack {
  id: string;
  name: string;
  icon: string;
  stickers: StickerItem[];
}

export const INITIAL_STICKER_PACKS: StickerPack[] = [
  {
    id: 'rovela-vibes',
    name: 'Rovela Vibes',
    icon: '💜',
    stickers: [
      {
        id: 'st-1',
        name: 'Heart Glasses',
        imageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200&auto=format&fit=crop&q=80',
        packId: 'rovela-vibes',
        isFavorite: true,
      },
      {
        id: 'st-2',
        name: 'Sparkle Energy',
        imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=200&auto=format&fit=crop&q=80',
        packId: 'rovela-vibes',
        isFavorite: true,
      },
      {
        id: 'st-3',
        name: 'Neon Glow',
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&auto=format&fit=crop&q=80',
        packId: 'rovela-vibes',
      },
      {
        id: 'st-4',
        name: 'Purple Wave',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
        packId: 'rovela-vibes',
      },
      {
        id: 'st-5',
        name: 'Liquid Bloom',
        imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=200&auto=format&fit=crop&q=80',
        packId: 'rovela-vibes',
      },
      {
        id: 'st-6',
        name: 'Electric Vibes',
        imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=200&auto=format&fit=crop&q=80',
        packId: 'rovela-vibes',
      },
    ],
  },
  {
    id: 'cute-animals',
    name: 'Playful Pets',
    icon: '🐱',
    stickers: [
      {
        id: 'st-7',
        name: 'Happy Cat',
        imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&auto=format&fit=crop&q=80',
        packId: 'cute-animals',
        isFavorite: true,
      },
      {
        id: 'st-8',
        name: 'Sleepy Kitty',
        imageUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=200&auto=format&fit=crop&q=80',
        packId: 'cute-animals',
      },
      {
        id: 'st-9',
        name: 'Curious Puppy',
        imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&auto=format&fit=crop&q=80',
        packId: 'cute-animals',
      },
      {
        id: 'st-10',
        name: 'Cool Shiba',
        imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=200&auto=format&fit=crop&q=80',
        packId: 'cute-animals',
      },
    ],
  },
];
