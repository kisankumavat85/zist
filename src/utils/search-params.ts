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
