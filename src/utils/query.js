export function queryFetch(data, api) {
    if (!api || !data) return null;
    const keys = Object.keys(data);
    const fetchedData = {};
    let anyData = false;
    keys.forEach((val) => {
        const param = api.getQueryParam(val);
        if (param) {
            anyData = true;
            fetchedData[val] = param;
        }
    });
    return anyData && fetchedData;
}

export function querySet(data, api) {
    if (!api || !data) return null;
    api.setQueryParams(data);
    return true;
}
