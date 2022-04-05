import { useState, useEffect, useRef } from 'react';

import useInjectScript from './useInjectScript';

export type GoogleDrivePickerConfig = {
  viewId: google.picker.ViewId;
  viewMode: google.picker.DocsViewMode;
  setIncludeFolders?: boolean;
  setSelectFolderEnabled?: boolean;
  supportSharedDrives?: boolean;
  multi?: boolean;
  mimeTypes?: string[];
  locale?: string;
};

type Props = {
  appId: string;
  clientId: string;
  apiKey: string;
};

export const useGoogleDrivePicker = (
  props: Props,
): [
  (config?: GoogleDrivePickerConfig) => void,
  google.picker.ResponseObject | undefined,
] => {
  const { appId, clientId, apiKey } = props;

  const [pickerApiLoaded, setPickerApiLoaded] = useState(false);
  const [callbackInfo, setCallbackInfo] =
    useState<google.picker.ResponseObject>();
  const [pickerConfig, setPickerConfig] = useState<GoogleDrivePickerConfig>();

  const oauthTokenRef = useRef<string>();

  const { loaded } = useInjectScript({
    url: 'https://apis.google.com/js/api.js',
  });

  const scope = ['https://www.googleapis.com/auth/drive'];

  useEffect(() => {
    const loadApis = () => {
      gapi.load('auth', () => {});
      gapi.load('picker', { callback: handlePickerApiLoaded });
    };

    if (loaded) {
      loadApis();
    }
  }, [loaded]);

  const handlePickerApiLoaded = () => {
    setPickerApiLoaded(true);
  };

  const handleAuth = () => {
    gapi.auth.authorize(
      {
        client_id: clientId,
        scope,
        immediate: false,
      },
      handleAuthResult,
    );
  };

  const handleAuthResult = (authResult: {
    access_token: string;
    error: string;
  }) => {
    if (authResult && !authResult.error) {
      oauthTokenRef.current = authResult.access_token;
      createPicker();
    }
  };

  const openPicker = (config?: GoogleDrivePickerConfig) => {
    setPickerConfig(config);

    if (!oauthTokenRef.current) {
      handleAuth();
      return;
    }

    createPicker();
  };

  const createPicker = () => {
    if (!pickerApiLoaded || !oauthTokenRef.current) {
      return;
    }

    const {
      viewId = google.picker.ViewId.DOCS,
      viewMode = google.picker.DocsViewMode.GRID,
      multi,
      supportSharedDrives,
      mimeTypes,
      locale = 'en-US',
      setIncludeFolders,
      setSelectFolderEnabled,
    } = pickerConfig || {};

    const view = new google.picker.DocsView(viewId);
    view.setMode(viewMode);

    if (setIncludeFolders) {
      view.setIncludeFolders(true);
    }

    if (setSelectFolderEnabled) {
      view.setSelectFolderEnabled(true);
    }

    if (mimeTypes && mimeTypes.length > 0) {
      view.setMimeTypes(mimeTypes.join(','));
    }

    const picker = new google.picker.PickerBuilder()
      .setAppId(appId)
      .setOAuthToken(oauthTokenRef.current)
      .setDeveloperKey(apiKey)
      .setLocale(locale)
      .setCallback(handlePickerCallback)
      .addView(view);

    if (multi) {
      picker.enableFeature(google.picker.Feature.MULTISELECT_ENABLED);
    }

    if (supportSharedDrives) {
      picker.enableFeature(google.picker.Feature.SUPPORT_DRIVES);
    }

    picker.build().setVisible(true);
  };

  const handlePickerCallback = (result: google.picker.ResponseObject) => {
    if (result.action === google.picker.Action.PICKED) {
      setCallbackInfo(result);
    }
  };

  return [openPicker, callbackInfo];
};
