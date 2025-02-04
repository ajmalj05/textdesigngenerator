import React, { useState, useCallback } from 'react';
import { Copy, Sparkles, Globe2 } from 'lucide-react';

// Language scripts and their transformations
const scripts = {
  latin: {
    name: 'Latin',
    transformations: {
      bold: (text: string) => text.split('').map(char => {
        const code = char.charCodeAt(0);
        return code >= 65 && code <= 90 ? String.fromCharCode(code + 119809) :
               code >= 97 && code <= 122 ? String.fromCharCode(code + 119743) : char;
      }).join(''),
      italic: (text: string) => text.split('').map(char => {
        const code = char.charCodeAt(0);
        return code >= 65 && code <= 90 ? String.fromCharCode(code + 119847) :
               code >= 97 && code <= 122 ? String.fromCharCode(code + 119841) : char;
      }).join(''),
      cursive: (text: string) => text.split('').map(char => {
        const code = char.charCodeAt(0);
        return code >= 65 && code <= 90 ? String.fromCharCode(code + 119951) :
               code >= 97 && code <= 122 ? String.fromCharCode(code + 119945) : char;
      }).join(''),
      fancy: (text: string) => text.split('').map(char => {
        const code = char.charCodeAt(0);
        return code >= 65 && code <= 90 ? String.fromCharCode(code + 120159) :
               code >= 97 && code <= 122 ? String.fromCharCode(code + 120153) : char;
      }).join(''),
      fraktur: (text: string) => text.split('').map(char => {
        const fraktur: { [key: string]: string } = {
          'A': '𝔄', 'B': '𝔅', 'C': 'ℭ', 'D': '𝔇', 'E': '𝔈', 'F': '𝔉', 'G': '𝔊', 'H': 'ℌ',
          'I': 'ℑ', 'J': '𝔍', 'K': '𝔎', 'L': '𝔏', 'M': '𝔐', 'N': '𝔑', 'O': '𝔒', 'P': '𝔓',
          'Q': '𝔔', 'R': 'ℜ', 'S': '𝔖', 'T': '𝔗', 'U': '𝔘', 'V': '𝔙', 'W': '𝔚', 'X': '𝔛',
          'Y': '𝔜', 'Z': 'ℨ', 'a': '𝔞', 'b': '𝔟', 'c': '𝔠', 'd': '𝔡', 'e': '𝔢', 'f': '𝔣',
          'g': '𝔤', 'h': '𝔥', 'i': '𝔦', 'j': '𝔧', 'k': '𝔨', 'l': '𝔩', 'm': '𝔪', 'n': '𝔫',
          'o': '𝔬', 'p': '𝔭', 'q': '𝔮', 'r': '𝔯', 's': '𝔰', 't': '𝔱', 'u': '𝔲', 'v': '𝔳',
          'w': '𝔴', 'x': '𝔵', 'y': '𝔶', 'z': '𝔷'
        };
        return fraktur[char] || char;
      }).join(''),
      doubleStruck: (text: string) => text.split('').map(char => {
        const doubles: { [key: string]: string } = {
          'A': '𝔸', 'B': '𝔹', 'C': 'ℂ', 'D': '𝔻', 'E': '𝔼', 'F': '𝔽', 'G': '𝔾', 'H': 'ℍ',
          'I': '𝕀', 'J': '𝕁', 'K': '𝕂', 'L': '𝕃', 'M': '𝕄', 'N': 'ℕ', 'O': '𝕆', 'P': 'ℙ',
          'Q': 'ℚ', 'R': 'ℝ', 'S': '𝕊', 'T': '𝕋', 'U': '𝕌', 'V': '𝕍', 'W': '𝕎', 'X': '𝕏',
          'Y': '𝕐', 'Z': 'ℤ', 'a': '𝕒', 'b': '𝕓', 'c': '𝕔', 'd': '𝕕', 'e': '𝕖', 'f': '𝕗',
          'g': '𝕘', 'h': '𝕙', 'i': '𝕚', 'j': '𝕛', 'k': '𝕜', 'l': '𝕝', 'm': '𝕞', 'n': '𝕟',
          'o': '𝕠', 'p': '𝕡', 'q': '𝕢', 'r': '𝕣', 's': '𝕤', 't': '𝕥', 'u': '𝕦', 'v': '𝕧',
          'w': '𝕨', 'x': '𝕩', 'y': '𝕪', 'z': '𝕫'
        };
        return doubles[char] || char;
      }).join(''),
      circled: (text: string) => text.split('').map(char => {
        const circled: { [key: string]: string } = {
          'A': 'Ⓐ', 'B': 'Ⓑ', 'C': 'Ⓒ', 'D': 'Ⓓ', 'E': 'Ⓔ', 'F': 'Ⓕ', 'G': 'Ⓖ', 'H': 'Ⓗ',
          'I': 'Ⓘ', 'J': 'Ⓙ', 'K': 'Ⓚ', 'L': 'Ⓛ', 'M': 'Ⓜ', 'N': 'Ⓝ', 'O': 'Ⓞ', 'P': 'Ⓟ',
          'Q': 'Ⓠ', 'R': 'Ⓡ', 'S': 'Ⓢ', 'T': 'Ⓣ', 'U': 'Ⓤ', 'V': 'Ⓥ', 'W': 'Ⓦ', 'X': 'Ⓧ',
          'Y': 'Ⓨ', 'Z': 'Ⓩ', 'a': 'ⓐ', 'b': 'ⓑ', 'c': 'ⓒ', 'd': 'ⓓ', 'e': 'ⓔ', 'f': 'ⓕ',
          'g': 'ⓖ', 'h': 'ⓗ', 'i': 'ⓘ', 'j': 'ⓙ', 'k': 'ⓚ', 'l': 'ⓛ', 'm': 'ⓜ', 'n': 'ⓝ',
          'o': 'ⓞ', 'p': 'ⓟ', 'q': 'ⓠ', 'r': 'ⓡ', 's': 'ⓢ', 't': 'ⓣ', 'u': 'ⓤ', 'v': 'ⓥ',
          'w': 'ⓦ', 'x': 'ⓧ', 'y': 'ⓨ', 'z': 'ⓩ'
        };
        return circled[char] || char;
      }).join('')
    }
  },
  cyrillic: {
    name: 'Cyrillic',
    transformations: {
      normal: (text: string) => {
        const cyrillic: { [key: string]: string } = {
          'a': 'а', 'b': 'б', 'v': 'в', 'g': 'г', 'd': 'д', 'e': 'е', 'yo': 'ё',
          'zh': 'ж', 'z': 'з', 'i': 'и', 'j': 'й', 'k': 'к', 'l': 'л', 'm': 'м',
          'n': 'н', 'o': 'о', 'p': 'п', 'r': 'р', 's': 'с', 't': 'т', 'u': 'у',
          'f': 'ф', 'h': 'х', 'ts': 'ц', 'ch': 'ч', 'sh': 'ш', 'sch': 'щ', 'y': 'ы',
          'e': 'э', 'yu': 'ю', 'ya': 'я'
        };
        return text.toLowerCase().split('').map(char => cyrillic[char] || char).join('');
      },
      fancy: (text: string) => {
        const fancyCyrillic: { [key: string]: string } = {
          'а': 'α', 'б': 'в', 'в': 'ʙ', 'г': 'г', 'д': '∂', 'е': 'є', 'ё': 'ё',
          'ж': 'ж', 'з': 'з', 'и': 'и', 'й': 'й', 'к': 'к', 'л': 'л', 'м': 'м',
          'н': 'н', 'о': 'σ', 'п': 'п', 'р': 'я', 'с': 'с', 'т': 'т', 'у': 'у',
          'ф': 'ф', 'х': 'х', 'ц': 'ц', 'ч': 'ч', 'ш': 'ш', 'щ': 'щ', 'ы': 'ы',
          'э': 'э', 'ю': 'ю', 'я': 'я'
        };
        return text.split('').map(char => fancyCyrillic[char.toLowerCase()] || char).join('');
      }
    }
  },
  greek: {
    name: 'Greek',
    transformations: {
      normal: (text: string) => {
        const greek: { [key: string]: string } = {
          'a': 'α', 'b': 'β', 'g': 'γ', 'd': 'δ', 'e': 'ε', 'z': 'ζ', 'h': 'η',
          'th': 'θ', 'i': 'ι', 'k': 'κ', 'l': 'λ', 'm': 'μ', 'n': 'ν', 'x': 'ξ',
          'o': 'ο', 'p': 'π', 'r': 'ρ', 's': 'σ', 't': 'τ', 'u': 'υ', 'ph': 'φ',
          'ch': 'χ', 'ps': 'ψ', 'w': 'ω'
        };
        return text.toLowerCase().split('').map(char => greek[char] || char).join('');
      },
      fancy: (text: string) => {
        const fancyGreek: { [key: string]: string } = {
          'α': 'ά', 'β': 'ϐ', 'γ': 'ϒ', 'δ': 'Δ', 'ε': 'έ', 'ζ': 'ζ', 'η': 'ή',
          'θ': 'ϑ', 'ι': 'ί', 'κ': 'ϰ', 'λ': 'Λ', 'μ': 'ϻ', 'ν': 'ν', 'ξ': 'ξ',
          'ο': 'ό', 'π': 'Π', 'ρ': 'ϱ', 'σ': 'ς', 'τ': 'τ', 'υ': 'ύ', 'φ': 'ϕ',
          'χ': 'χ', 'ψ': 'ψ', 'ω': 'ώ'
        };
        return text.split('').map(char => fancyGreek[char.toLowerCase()] || char).join('');
      }
    }
  },
  japanese: {
    name: 'Japanese',
    transformations: {
      hiragana: (text: string) => {
        const hiragana: { [key: string]: string } = {
          'a': 'あ', 'i': 'い', 'u': 'う', 'e': 'え', 'o': 'お',
          'ka': 'か', 'ki': 'き', 'ku': 'く', 'ke': 'け', 'ko': 'こ',
          'sa': 'さ', 'shi': 'し', 'su': 'す', 'se': 'せ', 'so': 'そ',
          'ta': 'た', 'chi': 'ち', 'tsu': 'つ', 'te': 'て', 'to': 'と',
          'na': 'な', 'ni': 'に', 'nu': 'ぬ', 'ne': 'ね', 'no': 'の',
          'ha': 'は', 'hi': 'ひ', 'fu': 'ふ', 'he': 'へ', 'ho': 'ほ',
          'ma': 'ま', 'mi': 'み', 'mu': 'む', 'me': 'め', 'mo': 'も',
          'ya': 'や', 'yu': 'ゆ', 'yo': 'よ',
          'ra': 'ら', 'ri': 'り', 'ru': 'る', 're': 'れ', 'ro': 'ろ',
          'wa': 'わ', 'wo': 'を', 'n': 'ん'
        };
        return text.toLowerCase().split('').map(char => hiragana[char] || char).join('');
      },
      katakana: (text: string) => {
        const katakana: { [key: string]: string } = {
          'a': 'ア', 'i': 'イ', 'u': 'ウ', 'e': 'エ', 'o': 'オ',
          'ka': 'カ', 'ki': 'キ', 'ku': 'ク', 'ke': 'ケ', 'ko': 'コ',
          'sa': 'サ', 'shi': 'シ', 'su': 'ス', 'se': 'セ', 'so': 'ソ',
          'ta': 'タ', 'chi': 'チ', 'tsu': 'ツ', 'te': 'テ', 'to': 'ト',
          'na': 'ナ', 'ni': 'ニ', 'nu': 'ヌ', 'ne': 'ネ', 'no': 'ノ',
          'ha': 'ハ', 'hi': 'ヒ', 'fu': 'フ', 'he': 'ヘ', 'ho': 'ホ',
          'ma': 'マ', 'mi': 'ミ', 'mu': 'ム', 'me': 'メ', 'mo': 'モ',
          'ya': 'ヤ', 'yu': 'ユ', 'yo': 'ヨ',
          'ra': 'ラ', 'ri': 'リ', 'ru': 'ル', 're': 'レ', 'ro': 'ロ',
          'wa': 'ワ', 'wo': 'ヲ', 'n': 'ン'
        };
        return text.toLowerCase().split('').map(char => katakana[char] || char).join('');
      }
    }
  },
  arabic: {
    name: 'Arabic',
    transformations: {
      normal: (text: string) => {
        const arabic: { [key: string]: string } = {
          'a': 'ا', 'b': 'ب', 't': 'ت', 'th': 'ث', 'j': 'ج', 'h': 'ح',
          'kh': 'خ', 'd': 'د', 'dh': 'ذ', 'r': 'ر', 'z': 'ز', 's': 'س',
          'sh': 'ش', 'S': 'ص', 'D': 'ض', 'T': 'ط', 'Z': 'ظ', '3': 'ع',
          'gh': 'غ', 'f': 'ف', 'q': 'ق', 'k': 'ك', 'l': 'ل', 'm': 'م',
          'n': 'ن', 'h': 'ه', 'w': 'و', 'y': 'ي'
        };
        return text.toLowerCase().split('').map(char => arabic[char] || char).join('');
      },
      decorative: (text: string) => {
        const decorativeArabic: { [key: string]: string } = {
          'ا': 'ﺍ', 'ب': 'ﺏ', 'ت': 'ﺕ', 'ث': 'ﺙ', 'ج': 'ﺝ', 'ح': 'ﺡ',
          'خ': 'ﺥ', 'د': 'ﺩ', 'ذ': 'ﺫ', 'ر': 'ﺭ', 'ز': 'ﺯ', 'س': 'ﺱ',
          'ش': 'ﺵ', 'ص': 'ﺹ', 'ض': 'ﺽ', 'ط': 'ﻁ', 'ظ': 'ﻅ', 'ع': 'ﻉ',
          'غ': 'ﻍ', 'ف': 'ﻑ', 'ق': 'ﻕ', 'ك': 'ﻙ', 'ل': 'ﻝ', 'م': 'ﻡ',
          'ن': 'ﻥ', 'ه': 'ﻩ', 'و': 'ﻭ', 'ي': 'ﻱ'
        };
        return text.split('').map(char => decorativeArabic[char] || char).join('');
      }
    }
  },
  sanskrit: {
    name: 'Sanskrit (Devanagari)',
    transformations: {
      devanagari: (text: string) => {
        const devanagari: { [key: string]: string } = {
          'a': 'अ', 'aa': 'आ', 'i': 'इ', 'ii': 'ई', 'u': 'उ', 'uu': 'ऊ',
          'e': 'ए', 'ai': 'ऐ', 'o': 'ओ', 'au': 'औ', 'k': 'क', 'kh': 'ख',
          'g': 'ग', 'gh': 'घ', 'ng': 'ङ', 'ch': 'च', 'chh': 'छ', 'j': 'ज',
          'jh': 'झ', 'ny': 'ञ', 't': 'ट', 'th': 'ठ', 'd': 'ड', 'dh': 'ढ',
          'n': 'न', 'p': 'प', 'ph': 'फ', 'b': 'ब', 'bh': 'भ', 'm': 'म',
          'y': 'य', 'r': 'र', 'l': 'ल', 'v': 'व', 'sh': 'श', 's': 'स',
          'h': 'ह'
        };
        return text.toLowerCase().split('').map(char => devanagari[char] || char).join('');
      }
    }
  },
  korean: {
    name: 'Korean (Hangul)',
    transformations: {
      hangul: (text: string) => {
        const hangul: { [key: string]: string } = {
          'a': 'ㅏ', 'ya': 'ㅑ', 'eo': 'ㅓ', 'yeo': 'ㅕ', 'o': 'ㅗ', 'yo': 'ㅛ',
          'u': 'ㅜ', 'yu': 'ㅠ', 'eu': 'ㅡ', 'i': 'ㅣ', 'g': 'ㄱ', 'n': 'ㄴ',
          'd': 'ㄷ', 'r': 'ㄹ', 'm': 'ㅁ', 'b': 'ㅂ', 's': 'ㅅ', 'ng': 'ㅇ',
          'j': 'ㅈ', 'ch': 'ㅊ', 'k': 'ㅋ', 't': 'ㅌ', 'p': 'ㅍ', 'h': 'ㅎ'
        };
        return text.toLowerCase().split('').map(char => hangul[char] || char).join('');
      }
    }
  },
  english: {
    name: 'English',
    transformations: {
      normal: (text: string) => text,
      uppercase: (text: string) => text.toUpperCase(),
      lowercase: (text: string) => text.toLowerCase(),
      titlecase: (text: string) => text.replace(/\b\w/g, (char) => char.toUpperCase()),
      reverse: (text: string) => text.split('').reverse().join('')
    }
  },
  malayalam: {
    name: 'Malayalam',
    transformations: {
      normal: (text: string) => {
        const malayalam: { [key: string]: string } = {
          'a': 'അ', 'aa': 'ആ', 'i': 'ഇ', 'ii': 'ഈ', 'u': 'ഉ', 'uu': 'ഊ',
          'e': 'എ', 'ee': 'ഏ', 'ai': 'ഐ', 'o': 'ഒ', 'oo': 'ഓ', 'au': 'ഔ',
          'k': 'ക', 'kh': 'ഖ', 'g': 'ഗ', 'gh': 'ഘ', 'ng': 'ങ',
          'c': 'ച', 'ch': 'ഛ', 'j': 'ജ', 'jh': 'ഝ', 'ny': 'ഞ',
          't': 'ട', 'th': 'ഠ', 'd': 'ഡ', 'dh': 'ഢ', 'n': 'ണ',
          'p': 'പ', 'ph': 'ഫ', 'b': 'ബ', 'bh': 'ഭ', 'm': 'മ',
          'y': 'യ', 'r': 'ര', 'l': 'ല', 'v': 'വ', 'sh': 'ശ', 's': 'സ',
          'h': 'ഹ'
        };
        return text.toLowerCase().split('').map(char => malayalam[char] || char).join('');
      },
      fancy: (text: string) => {
        const fancyMalayalam: { [key: string]: string } = {
          'അ': 'ആ', 'ആ': 'ഇ', 'ഇ': 'ഈ', 'ഉ': 'ഊ', 'എ': 'ഏ', 'ഏ': 'ഐ',
          'ഒ': 'ഓ', 'ഓ': 'ഔ', 'ക': 'ഖ', 'ഖ': 'ഗ', 'ഗ': 'ഘ', 'ങ': 'ച',
          'ച': 'ഛ', 'ഛ': 'ജ', 'ജ': 'ഝ', 'ഞ': 'ട', 'ട': 'ഠ', 'ഠ': 'ഡ',
          'ഡ': 'ഢ', 'ണ': 'ത', 'ത': 'ഥ', 'ഥ': 'ദ', 'ദ': 'ധ', 'ന': 'പ',
          'പ': 'ഫ', 'ഫ': 'ബ', 'ബ': 'ഭ', 'മ': 'യ', 'യ': 'ര', 'ര': 'ല',
          'ല': 'വ', 'വ': 'ശ', 'ശ': 'ഷ', 'ഷ': 'സ', 'സ': 'ഹ', 'ഹ': 'ള'
        };
        return text.split('').map(char => fancyMalayalam[char] || char).join('');
      }
    }
  }
};

const decorations = [
  { prefix: '★彡 ', suffix: ' 彡★', color: 'text-pink-500' },
  { prefix: '⋆｡°✩ ', suffix: ' ✩°｡⋆', color: 'text-purple-500' },
  { prefix: '꧁༺ ', suffix: ' ༻꧂', color: 'text-blue-500' },
  { prefix: '•°¯`•• ', suffix: ' ••´¯°•', color: 'text-green-500' },
  { prefix: '◦•●❤ ', suffix: ' ❤●•◦', color: 'text-red-500' },
  { prefix: '『', suffix: '』', color: 'text-yellow-500' },
  { prefix: '【', suffix: '】', color: 'text-indigo-500' },
  { prefix: '〖', suffix: '〗', color: 'text-orange-500' },
  { prefix: '⊱', suffix: '⊰', color: 'text-teal-500' },
  { prefix: '✿', suffix: '✿', color: 'text-rose-500' },
  { prefix: '❀', suffix: '❀', color: 'text-cyan-500' },
  { prefix: '༺♥༻', suffix: '༺♥༻', color: 'text-pink-600' },
  { prefix: '◈', suffix: '◈', color: 'text-purple-600' },
  { prefix: '❂', suffix: '❂', color: 'text-blue-600' },
  { prefix: '✾', suffix: '✾', color: 'text-emerald-500' }
];
function App() {
  const [text, setText] = useState('');
  const [selectedScript, setSelectedScript] = useState('latin');
  const [selectedDecoration, setSelectedDecoration] = useState(0);

  const copyToClipboard = useCallback(async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  }, []);

  const currentScript = scripts[selectedScript as keyof typeof scripts];
  const transformedText = Object.entries(currentScript.transformations).map(([key, fn]) => ({
    style: key,
    text: fn(text)
  }));

  const decoratedText = decorations[selectedDecoration].prefix + 
    text + 
    decorations[selectedDecoration].suffix;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center mb-8">
          <h1 className="text-4xl font-bold flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            <Sparkles className="w-8 h-8 text-purple-600" />
             Text Design Generator
            <Globe2 className="w-8 h-8 text-pink-600" />
          </h1>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="script"
                className="block text-lg font-medium text-gray-700"
              >
                Select Script
              </label>
              <select
                id="script"
                value={selectedScript}
                onChange={(e) => setSelectedScript(e.target.value)}
                className="w-full p-4 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm"
              >
                {Object.entries(scripts).map(([key, { name }]) => (
                  <option key={key} value={key}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="input"
                className="block text-lg font-medium text-gray-700"
              >
                Enter Text
              </label>
              <input
                id="input"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type something..."
                className="w-full p-4 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">
              Decorations
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {decorations.map((decoration, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDecoration(index)}
                  className={`p-3 rounded-lg text-center transition-all transform hover:scale-105 ${
                    selectedDecoration === index
                      ? `${decoration.color} bg-white shadow-lg`
                      : 'bg-white hover:shadow-md'
                  }`}
                >
                  {decoration.prefix}T{decoration.suffix}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Transformed Text
            </h2>
            <div className="grid gap-4">
              {transformedText.map(({ style, text: transformedStr }) => (
                <div
                  key={style}
                  className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      {style.charAt(0).toUpperCase() + style.slice(1)}:
                    </span>
                    <p className="mt-1 text-lg text-gray-900">
                      {transformedStr || 'Type something...'}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(transformedStr)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Copy className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              ))}

              <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Decorated:
                  </span>
                  <p className={`mt-1 text-lg ${decorations[selectedDecoration].color}`}>
                     {decoratedText || 'Type something...'}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(decoratedText)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Copy className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
          
        </div>
        
      </div>
      
    </div>
    
  );
}

export default App;