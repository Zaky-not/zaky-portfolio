import { createContext, useContext, useMemo, useState, useCallback } from 'react'
import translations from '../data/translations.js'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('id')

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'id' ? 'en' : 'id'))
  }, [])

  const value = useMemo(
    () => ({
      lang,
      setLang,
      toggleLang,
      t: translations[lang],
    }),
    [lang]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
