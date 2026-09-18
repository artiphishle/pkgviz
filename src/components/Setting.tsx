import React from 'react';

/*** Renders a settings row. */
const Setting: React.FC<SettingProps> = ({ children }) => {
  return (
    <div className="ml-[.8rem] px-[.8rem] py-2  bg-white dark:bg-neutral-900 border-b border-b-neutral-200 dark:border-b-neutral-800">
      {children}
    </div>
  );
};

Setting.displayName = 'Setting';

export default Setting;

interface SettingProps {
  readonly children: React.ReactNode;
}
