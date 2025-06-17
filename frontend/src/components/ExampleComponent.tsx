import React from "react";
import { useTranslation } from "react-i18next";

export const ExampleComponent = () => {
  const { t } = useTranslation();
  return <div>{t("app.project")}</div>;
};