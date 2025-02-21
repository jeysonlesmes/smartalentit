
export const objectToQueryParams = (obj: Record<string, any>, prefix = ''): string => {
  const queryParts: string[] = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key) && !['', undefined, null].includes(obj[key])) {
      const value = obj[key];
      const paramKey = prefix ? `${prefix}[${key}]` : key;

      if (Array.isArray(value)) {
        value.forEach((val) => {
          queryParts.push(`${encodeURIComponent(paramKey)}=${encodeURIComponent(val)}`);
        });
      } else if (typeof value === 'object' && value !== null) {
        queryParts.push(objectToQueryParams(value, paramKey));
      } else {
        queryParts.push(`${encodeURIComponent(paramKey)}=${encodeURIComponent(value)}`);
      }
    }
  }

  return queryParts.join('&');
}