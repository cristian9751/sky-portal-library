import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import en from "../locales/en.json"
import es from "../locales/es.json"
import fr from "../locales/fr.json"
import de from "../locales/de.json"
export const LANGS = ["es", "en", "fr", "de"] as const;
export type Lang = (typeof LANGS)[number];
type Dict = typeof en;
export const DICTS: Record<Lang, Dict> = { en, es, fr, de };

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Dict }>({ lang: "es", setLang: () => {}, t: es });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");
  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved && LANGS.includes(saved)) setLangState(saved);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };
  return <Ctx.Provider value={{ lang, setLang, t: DICTS[lang] }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
