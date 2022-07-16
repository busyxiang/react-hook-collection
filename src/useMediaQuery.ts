import { useEffect, useState } from 'react';

type UseMediaQueryProps = {
  query: string | string[];
};

const useMediaQuery = (props: UseMediaQueryProps) => {
  const { query } = props;

  const queries = Array.isArray(query) ? query : [query];

  const [value, setValue] = useState(() => {
    return queries.map((query) => ({
      media: query,
      matches: window.matchMedia(query).matches,
    }));
  });

  useEffect(() => {
    setValue(
      queries.map((query) => ({
        media: query,
        matches: window.matchMedia(query).matches,
      })),
    );

    const matchMediaQueries = queries.map((query) => window.matchMedia(query));

    matchMediaQueries.forEach((media) =>
      media.addEventListener('change', handleOnMediaChange),
    );

    return () => {
      matchMediaQueries.forEach((media) =>
        media.removeEventListener('change', handleOnMediaChange),
      );
    };
  }, [window]);

  const handleOnMediaChange = (event: MediaQueryListEvent) => {
    setValue((prev) =>
      prev.map((item) => {
        if (item.media === event.media) {
          return { ...item, matches: event.matches };
        } else {
          return item;
        }
      }),
    );
  };

  return value.map((item) => item.matches);
};

export default useMediaQuery;
