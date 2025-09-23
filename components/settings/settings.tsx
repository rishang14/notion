import React from "react";
import Settingform from "./settingform";
import CustomDialogTrigger from "../global/customdialogtrigger";

interface SettingsProps {
  children: React.ReactNode;
}

const Settings: React.FC<SettingsProps> = ({ children }) => {
  return (
    <CustomDialogTrigger header="Settings" content={<Settingform />}>
      {children}
    </CustomDialogTrigger>
  );
};

export default Settings;
