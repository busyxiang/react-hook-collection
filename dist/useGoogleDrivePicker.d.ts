/// <reference types="google.picker" />
/// <reference types="google.accounts" />
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
    onFilePicked: (result: google.picker.ResponseObject) => void;
};
export declare const useGoogleDrivePicker: (props: Props) => {
    openPicker: (config?: GoogleDrivePickerConfig | undefined) => void;
    loaded: boolean;
    isLoggedIn: boolean;
    handleMakeDocumentShareable: (document: google.picker.DocumentObject) => Promise<void>;
};
export {};
