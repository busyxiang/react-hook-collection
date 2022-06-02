/// <reference types="google.picker" />
export declare type GoogleDrivePickerConfig = {
    viewId: google.picker.ViewId;
    viewMode: google.picker.DocsViewMode;
    setIncludeFolders?: boolean;
    setSelectFolderEnabled?: boolean;
    supportSharedDrives?: boolean;
    multi?: boolean;
    mimeTypes?: string[];
    locale?: string;
};
declare type Props = {
    appId: string;
    clientId: string;
    apiKey: string;
};
export declare const useGoogleDrivePicker: (props: Props) => [(config?: GoogleDrivePickerConfig | undefined) => void, google.picker.ResponseObject | undefined];
export {};
