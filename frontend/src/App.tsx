import React from "react";
import { useTranslation } from "react-i18next";
import "./i18n";

function App() {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <h1>{t("app.title")}</h1>
      <p>{t("app.welcome")}</p>
      <button onClick={() => i18n.changeLanguage("es")}>ES</button>
      <button onClick={() => i18n.changeLanguage("en")}>EN</button>
    </div>
  );
}

export default App;