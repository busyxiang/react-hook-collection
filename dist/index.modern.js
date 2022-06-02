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
  var elementRef = props.elementRef,
      observerConfig = props.observerConfig;

  var _useState = useState(false),
      isIntersecting = _useState[0],
      setIsIntersecting = _useState[1];

  useEffect(function () {
    var node = elementRef.current;

    if (!node) {
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        setIsIntersecting(true);
      }
    }, observerConfig);
    observer.observe(node);
    return function () {
      return observer.disconnect();
    };
  }, [elementRef, observerConfig]);
  return isIntersecting;
};

var useGoogleDrivePicker = function useGoogleDrivePicker(props) {
  var appId = props.appId,
      clientId = props.clientId,
      apiKey = props.apiKey;

  var _useState = useState(false),
      pickerApiLoaded = _useState[0],
      setPickerApiLoaded = _useState[1];

  var _useState2 = useState(),
      callbackInfo = _useState2[0],
      setCallbackInfo = _useState2[1];

  var _useState3 = useState(),
      pickerConfig = _useState3[0],
      setPickerConfig = _useState3[1];

  var oauthTokenRef = useRef();

  var _useInjectScript = useInjectScript({
    url: 'https://apis.google.com/js/api.js'
  }),
      loaded = _useInjectScript.loaded;

  var scope = ['https://www.googleapis.com/auth/drive'];
  useEffect(function () {
    var loadApis = function loadApis() {
      gapi.load('auth', function () {});
      gapi.load('picker', {
        callback: handlePickerApiLoaded
      });
    };

    if (loaded) {
      loadApis();
    }
  }, [loaded]);

  var handlePickerApiLoaded = function handlePickerApiLoaded() {
    setPickerApiLoaded(true);
  };

  var handleAuth = function handleAuth() {
    gapi.auth.authorize({
      client_id: clientId,
      scope: scope,
      immediate: false
    }, handleAuthResult);
  };

  var handleAuthResult = function handleAuthResult(authResult) {
    if (authResult && !authResult.error) {
      oauthTokenRef.current = authResult.access_token;
      createPicker();
    }
  };

  var openPicker = function openPicker(config) {
    setPickerConfig(config);

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

    var _ref = pickerConfig || {},
        _ref$viewId = _ref.viewId,
        viewId = _ref$viewId === void 0 ? google.picker.ViewId.DOCS : _ref$viewId,
        _ref$viewMode = _ref.viewMode,
        viewMode = _ref$viewMode === void 0 ? google.picker.DocsViewMode.GRID : _ref$viewMode,
        multi = _ref.multi,
        supportSharedDrives = _ref.supportSharedDrives,
        mimeTypes = _ref.mimeTypes,
        _ref$locale = _ref.locale,
        locale = _ref$locale === void 0 ? 'en-US' : _ref$locale,
        setIncludeFolders = _ref.setIncludeFolders,
        setSelectFolderEnabled = _ref.setSelectFolderEnabled;

    var view = new google.picker.DocsView(viewId);
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

    var picker = new google.picker.PickerBuilder().setAppId(appId).setOAuthToken(oauthTokenRef.current).setDeveloperKey(apiKey).setLocale(locale).setCallback(handlePickerCallback).addView(view);

    if (multi) {
      picker.enableFeature(google.picker.Feature.MULTISELECT_ENABLED);
    }

    if (supportSharedDrives) {
      picker.enableFeature(google.picker.Feature.SUPPORT_DRIVES);
    }

    picker.build().setVisible(true);
  };

  var handlePickerCallback = function handlePickerCallback(result) {
    if (result.action === google.picker.Action.PICKED) {
      setCallbackInfo(result);
    }
  };

  return [openPicker, callbackInfo];
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
