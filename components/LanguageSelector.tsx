import type { Language } from "@/lib/translations";

type LanguageSelectorProps = {
  language: Language;
  onChange: (language: Language) => void;
};

export default function LanguageSelector({
  language,
  onChange,
}: LanguageSelectorProps) {
  return (
    <select
      value={language}
      onChange={(e) =>
        onChange(e.target.value as Language)
      }
      className="rounded-md border border-white/20 bg-black/60 px-3 py-2 text-white"
    >
      <option value="es">🇪🇸 ES</option>
      <option value="en">🇬🇧 EN</option>
      <option value="nl">🇳🇱 NL</option>
    </select>
  );
}