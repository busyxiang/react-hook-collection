import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

var useMounted = function useMounted() {
  var _useState = useState(false),
      mounted = _useState[0],
      setMounted = _useState[1];

  useEffect(function () {
    setMounted(true);
    return function () {
      return setMounted(false);
    };
  }, []);
  return mounted;
};

var useLocalStorage = function useLocalStorage(_ref) {
  var key = _ref.key,
      defaultValue = _ref.defaultValue;

  var _useState = useState(function () {
    try {
      var item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.log(error);
      return defaultValue;
    }
  }),
      storedValue = _useState[0],
      setStoredValue = _useState[1];

  var setValue = function setValue(value) {
    try {
      var valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  var removeValue = function removeValue() {
    localStorage.removeItem(key);
  };

  return [storedValue, setValue, removeValue];
};

var useInjectScript = function useInjectScript(props) {
  var url = props.url,
      onLoad = props.onLoad;

  var _useState = useState(false),
      loaded = _useState[0],
      setLoaded = _useState[1];

  var _useState2 = useState(false),
      error = _useState2[0],
      setError = _useState2[1];

  useEffect(function () {
    var script = document.createElement('script');
    script.src = url;
    script.async = true;

    script.onload = function () {
      onLoad === null || onLoad === void 0 ? void 0 : onLoad();
      setLoaded(true);
    };

    script.onerror = function () {
      setError(true);
    };

    document.body.append(script);
    return function () {
      document.body.removeChild(script);
    };
  }, [url, onLoad]);
  return {
    loaded: loaded,
    error: error
  };
};

var useNetworkStatus = function useNetworkStatus() {
  var _useState = useState(false),
      online = _useState[0],
      setOnline = _useState[1];

  useEffect(function () {
    var handleUpdateToOnline = function handleUpdateToOnline() {
      return setOnline(true);
    };

    var handleUpdateToOffline = function handleUpdateToOffline() {
      return setOnline(true);
    };

    window.addEventListener('online', handleUpdateToOnline);
    window.addEventListener('offline', handleUpdateToOffline);
    return function () {
      window.removeEventListener('online', handleUpdateToOnline);
      window.removeEventListener('offline', handleUpdateToOffline);
    };
  }, []);
  return online;
};

var useWindowSize = function useWindowSize() {
  var _useState = useState({
    width: window.innerWidth,
    height: window.innerHeight
  }),
      windowSize = _useState[0],
      setWindowSize = _useState[1];

  useEffect(function () {
    var handleResize = function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return function () {
      return window.removeEventListener('resize', handleResize);
    };
  }, []);
  return windowSize;
};

var useToggle = function useToggle(initialValue) {
  var _useState = useState(!!initialValue),
      on = _useState[0],
      setOn = _useState[1];

  var toggle = useCallback(function () {
    setOn(function (prev) {
      return !prev;
    });
  }, []);
  var reset = useCallback(function () {
    if (initialValue !== undefined) {
      setOn(initialValue);
    }
  }, [initialValue]);
  return [on, toggle, reset];
};

var useClosure = function useClosure() {
  var _useState = useState(false),
      isOpen = _useState[0],
      setIsOpen = _useState[1];

  var onOpen = useCallback(function () {
    setIsOpen(true);
  }, []);
  var onClose = useCallback(function () {
    setIsOpen(false);
  }, []);
  var onToggle = useCallback(function () {
    setIsOpen(function (prev) {
      return !prev;
    });
  }, []);
  return {
    isOpen: isOpen,
    onOpen: onOpen,
    onClose: onClose,
    onToggle: onToggle
  };
};

var useIntersectionObserver = function useIntersectionObserver(props) {
  var element = props.element,
      observerConfig = props.observerConfig;

  var _useState = useState(false),
      isIntersecting = _useState[0],
      setIsIntersecting = _useState[1];

  useEffect(function () {
    if (!element) {
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      setIsIntersecting(entries[0].isIntersecting);
    }, observerConfig);
    observer.observe(element);
    return function () {
      return observer.disconnect();
    };
  }, [element, observerConfig]);
  return isIntersecting;
};

var useGoogleDrivePicker = function useGoogleDrivePicker(props) {
  var appId = props.appId,
      clientId = props.clientId,
      apiKey = props.apiKey,
      onFilePicked = props.onFilePicked;

  var _useState = useState(false),
      pickerApiLoaded = _useState[0],
      setPickerApiLoaded = _useState[1];

  var oauthTokenRef = useRef();
  var pickerRef = useRef();
  var configRef = useRef();

  var _useInjectScript = useInjectScript({
    url: 'https://apis.google.com/js/api.js'
  }),
      gapiLoaded = _useInjectScript.loaded;

  var _useInjectScript2 = useInjectScript({
    url: 'https://accounts.google.com/gsi/client'
  }),
      loaded = _useInjectScript2.loaded;

  useEffect(function () {
    var loadApis = function loadApis() {
      gapi.load('picker', {
        callback: handlePickerApiLoaded
      });
    };

    if (gapiLoaded) {
      loadApis();
    }
  }, [gapiLoaded]);

  var handlePickerApiLoaded = function handlePickerApiLoaded() {
    setPickerApiLoaded(true);
  };

  var handleAuth = function handleAuth() {
    if (!loaded) {
      return;
    }

    var client = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/drive',
      callback: function callback(res) {
        if (res && res.access_token) {
          oauthTokenRef.current = res.access_token;
          createPicker();
        }
      }
    });
    client.requestAccessToken();
  };

  var openPicker = function openPicker(config) {
    configRef.current = config;

    if (!oauthTokenRef.current) {
      handleAuth();
      return;
    }

    createPicker();
  };

  var createPicker = function createPicker() {
    if (!pickerApiLoaded || !oauthTokenRef.current) {
      return;
    }

    var _ref = configRef.current || {},
        viewId = _ref.viewId,
        viewMode = _ref.viewMode,
        multi = _ref.multi,
        supportSharedDrives = _ref.supportSharedDrives,
        mimeTypes = _ref.mimeTypes,
        _ref$locale = _ref.locale,
        locale = _ref$locale === void 0 ? 'en-US' : _ref$locale,
        setIncludeFolders = _ref.setIncludeFolders,
        setSelectFolderEnabled = _ref.setSelectFolderEnabled,
        additionalViews = _ref.additionalViews;

    var view = new google.picker.DocsView(viewId);
    viewMode && view.setMode(viewMode);

    if (setIncludeFolders) {
      view.setIncludeFolders(true);
    }

    if (setSelectFolderEnabled) {
      view.setSelectFolderEnabled(true);
    }

    if (mimeTypes && mimeTypes.length > 0) {
      view.setMimeTypes(mimeTypes.join(','));
    }

    var picker = new google.picker.PickerBuilder().setAppId(appId).setOAuthToken(oauthTokenRef.current).setDeveloperKey(apiKey).setLocale(locale).setCallback(handlePickerCallback).addView(view);
    additionalViews === null || additionalViews === void 0 ? void 0 : additionalViews.forEach(function (view) {
      var innerView = new google.picker.DocsView(view);
      picker.addView(innerView);
    });

    if (multi) {
      picker.enableFeature(google.picker.Feature.MULTISELECT_ENABLED);
    }

    if (supportSharedDrives) {
      picker.enableFeature(google.picker.Feature.SUPPORT_DRIVES);
    }

    var buildPicker = picker.build();
    buildPicker.setVisible(true);
    pickerRef.current = buildPicker;
  };

  var handlePickerCallback = function handlePickerCallback(result) {
    if (result.action === google.picker.Action.PICKED) {
      var _pickerRef$current, _pickerRef$current2;

      onFilePicked(result);
      (_pickerRef$current = pickerRef.current) === null || _pickerRef$current === void 0 ? void 0 : _pickerRef$current.setVisible(false);
      (_pickerRef$current2 = pickerRef.current) === null || _pickerRef$current2 === void 0 ? void 0 : _pickerRef$current2.dispose();
      pickerRef.current = undefined;
    } else if (result.action === google.picker.Action.CANCEL) {
      var _pickerRef$current3, _pickerRef$current4;

      (_pickerRef$current3 = pickerRef.current) === null || _pickerRef$current3 === void 0 ? void 0 : _pickerRef$current3.setVisible(false);
      (_pickerRef$current4 = pickerRef.current) === null || _pickerRef$current4 === void 0 ? void 0 : _pickerRef$current4.dispose();
      pickerRef.current = undefined;
    }
  };

  var handleMakeDocumentShareable = function handleMakeDocumentShareable(document) {
    try {
      if (!oauthTokenRef.current) {
        return Promise.resolve();
      }

      return Promise.resolve(fetch("https://www.googleapis.com/drive/v3/files/" + document.id + "/permissions", {
        method: 'POST',
        headers: {
          Authorization: "Bearer " + oauthTokenRef.current
        },
        body: JSON.stringify({
          role: 'reader',
          type: 'anyone'
        })
      })).then(function () {});
    } catch (e) {
      return Promise.reject(e);
    }
  };

  return {
    openPicker: openPicker,
    loaded: pickerApiLoaded,
    isLoggedIn: !!oauthTokenRef.current,
    handleMakeDocumentShareable: handleMakeDocumentShareable
  };
};

// A type of promise-like that resolves synchronously and supports only one observer

const _iteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator"))) : "@@iterator";

const _asyncIteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator"))) : "@@asyncIterator";

// Asynchronously call a function and send errors to recovery continuation
function _catch(body, recover) {
	try {
		var result = body();
	} catch(e) {
		return recover(e);
	}
	if (result && result.then) {
		return result.then(void 0, recover);
	}
	return result;
}

// Asynchronously await a promise and pass the result to a finally continuation
function _finallyRethrows(body, finalizer) {
	try {
		var result = body();
	} catch (e) {
		return finalizer(true, e);
	}
	if (result && result.then) {
		return result.then(finalizer.bind(null, false), finalizer.bind(null, true));
	}
	return finalizer(false, result);
}

var useFetch = function useFetch(config) {
  var url = config.url,
      requestConfig = config.requestConfig;

  var _useState = useState(),
      data = _useState[0],
      setData = _useState[1];

  var _useState2 = useState(false),
      loading = _useState2[0],
      setLoading = _useState2[1];

  var _useState3 = useState(false),
      error = _useState3[0],
      setError = _useState3[1];

  useEffect(function () {
    handleLoadData();
  }, []);
  var handleLoadData = useCallback(function () {
    try {
      setLoading(true);

      var _temp2 = _finallyRethrows(function () {
        return _catch(function () {
          return Promise.resolve(fetch(url, requestConfig)).then(function (res) {
            return Promise.resolve(res.json()).then(function (parsedData) {
              setData(parsedData);
            });
          });
        }, function () {
          setError(true);
        });
      }, function (_wasThrown, _result) {
        setLoading(false);
        if (_wasThrown) throw _result;
        return _result;
      });

      return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  }, [url]);
  return {
    data: data,
    loading: loading,
    error: error,
    refetch: handleLoadData
  };
};

var useClipboard = function useClipboard(props) {
  var text = props.text,
      successDurationInSeconds = props.successDurationInSeconds;

  var _useState = useState(false),
      isCopied = _useState[0],
      setIsCopied = _useState[1];

  var onCopy = useCallback(function () {
    navigator.clipboard.writeText(text);
    setIsCopied(true);

    if (successDurationInSeconds) {
      setTimeout(function () {
        return setIsCopied(false);
      }, successDurationInSeconds * 1000);
    }
  }, [text, successDurationInSeconds]);
  return {
    isCopied: isCopied,
    onCopy: onCopy
  };
};

var useValue = function useValue(props) {
  var value = props.value,
      onChange = props.onChange;
  var valueRef = useRef(value);
  useEffect(function () {
    if (valueRef.current !== value) {
      valueRef.current = value;
      onChange(value);
    }
  }, [value]);
  return valueRef.current;
};

var useInterval = function useInterval(props) {
  var intervalInSeconds = props.intervalInSeconds,
      callback = props.callback;
  useEffect(function () {
    var intervalId = setInterval(callback, intervalInSeconds ? intervalInSeconds * 1000 : undefined);
    return function () {
      return clearInterval(intervalId);
    };
  }, [intervalInSeconds]);
};

var useTimeout = function useTimeout(props) {
  var callback = props.callback,
      delayInSeconds = props.delayInSeconds;
  useEffect(function () {
    var timeoutId = setTimeout(callback, delayInSeconds * 1000);
    return function () {
      return clearTimeout(timeoutId);
    };
  }, [delayInSeconds]);
};

var useAudio = function useAudio(props) {
  var url = props.url,
      initialState = props.initialState;

  var _useState = useState(!!initialState),
      isPlaying = _useState[0],
      setIsPlaying = _useState[1];

  var audio = useMemo(function () {
    var audio = new Audio(url);

    if (initialState) {
      audio.play();
    }

    return audio;
  }, [url, initialState]);
  useEffect(function () {
    var handleAudioEnded = function handleAudioEnded() {
      return setIsPlaying(false);
    };

    audio.addEventListener('ended', handleAudioEnded);
    return function () {
      audio.removeEventListener('ended', handleAudioEnded);
    };
  }, [audio]);
  var onPlay = useCallback(function () {
    audio.play();
    setIsPlaying(true);
  }, [audio]);
  var onPause = useCallback(function () {
    audio.pause();
    setIsPlaying(false);
  }, [audio]);
  var onToggle = useCallback(function () {
    isPlaying ? onPause() : onPlay();
  }, [audio, isPlaying]);
  return {
    isPlaying: isPlaying,
    onPlay: onPlay,
    onPause: onPause,
    onToggle: onToggle
  };
};

var useLazyFetch = function useLazyFetch(props) {
  var url = props.url,
      requestConfig = props.requestConfig;

  var _useState = useState(),
      data = _useState[0],
      setData = _useState[1];

  var _useState2 = useState(false),
      loading = _useState2[0],
      setLoading = _useState2[1];

  var _useState3 = useState(false),
      error = _useState3[0],
      setError = _useState3[1];

  useEffect(function () {
    handleLoadData();
  }, []);
  var handleLoadData = useCallback(function () {
    try {
      setLoading(true);

      var _temp2 = _finallyRethrows(function () {
        return _catch(function () {
          return Promise.resolve(fetch(url, requestConfig)).then(function (res) {
            return Promise.resolve(res.json()).then(function (parsedData) {
              setData(parsedData);
            });
          });
        }, function () {
          setError(true);
        });
      }, function (_wasThrown, _result) {
        setLoading(false);
        if (_wasThrown) throw _result;
        return _result;
      });

      return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  }, [url]);
  return [handleLoadData, {
    data: data,
    loading: loading,
    error: error
  }];
};

export { useAudio, useClipboard, useClosure, useFetch, useGoogleDrivePicker, useInjectScript, useIntersectionObserver, useInterval, useLazyFetch, useLocalStorage, useMounted, useNetworkStatus, useTimeout, useToggle, useValue, useWindowSize };
//# sourceMappingURL=index.modern.js.map
