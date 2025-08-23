declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
// react-native-version-check-expo 타입 선언
// 참고: https://github.com/kimxogus/react-native-version-check/issues/228
declare module 'react-native-version-check-expo' {
  interface UpdateNeededResult {
    isNeeded: boolean;
    storeUrl: string;
    currentVersion: string;
    latestVersion: string;
  }

  export function needUpdate(): Promise<UpdateNeededResult>;
  export function getLatestVersion(): Promise<string>;
  export function getCurrentVersion(): string;
  export function getStoreUrl(): Promise<string>;

  const VersionCheck: {
    needUpdate(): Promise<UpdateNeededResult>;
    getLatestVersion(): Promise<string>;
    getCurrentVersion(): string;
    getStoreUrl(): Promise<string>;
  };

  export default VersionCheck;
}
