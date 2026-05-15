"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "dark" | "light";
type Lang = "ar" | "en";

interface AppContextType {
  theme: Theme;
  lang: Lang;
  toggleTheme: () => void;
  setLang: (l: Lang) => void;
}

const AppContext = createContext<AppContextType>({
  theme: "dark", lang: "ar", toggleTheme: () => {}, setLang: () => {},
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [lang, setLang] = useState<Lang>("ar");

  useEffect(() => {
    const saved = localStorage.getItem("shafee-theme") as Theme;
    if (saved) setTheme(saved);
    const savedLang = localStorage.getItem("shafee-lang") as Lang;
    if (savedLang) setLang(savedLang);
  }, []);

  useEffect(() => {
    document.documentElement.className = theme;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    localStorage.setItem("shafee-theme", theme);
    localStorage.setItem("shafee-lang", lang);
  }, [theme, lang]);

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  return (
    <AppContext.Provider value={{ theme, lang, toggleTheme, setLang }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
