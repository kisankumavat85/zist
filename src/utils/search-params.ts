export const createQueryString = ({
  searchParams,
  name,
  value,
}: {
  searchParams: URLSearchParams;
  name: string;
  value: string;
}) => {
  const _searchParams = new URLSearchParams(searchParams.toString());
  _searchParams.set(name, value);
  return _searchParams.toString();
};

export const convertToSearchParams = (
  params: Record<string, string | number>,
) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });

  return searchParams;
};
