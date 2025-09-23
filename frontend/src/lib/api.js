const baseURL = "/api";

function withAuth(headers = {}) {
    try {
        const token = localStorage.getItem("token");
        return token ? { ...headers, Authorization: `Bearer ${token}` } : headers;
    } catch {
        return headers;
    }
}

async function request(path, { method = "GET", headers = {}, data, ...rest } = {}) {
    const url = `${baseURL}${path}`;
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
    const finalHeaders = withAuth(headers);

    if (!isFormData && data !== undefined) {
        finalHeaders["Content-Type"] = finalHeaders["Content-Type"] || "application/json";
    }

    const response = await fetch(url, {
        method,
        headers: finalHeaders,
        body: isFormData ? data : data !== undefined ? JSON.stringify(data) : undefined,
        ...rest,
    });

    const contentType = response.headers.get("content-type") || "";
    const isJSON = contentType.includes("application/json");
    const payload = isJSON ? await response.json().catch(() => ({})) : await response.text();

    if (!response.ok) {
        const err = new Error(payload?.error || `Request failed with status ${response.status}`);
        err.response = { status: response.status, data: payload };
        throw err;
    }

    return { data: payload, status: response.status };
}

const api = {
    get: (path, config = {}) => request(path, { method: "GET", ...(config || {}) }),
    delete: (path, config = {}) => request(path, { method: "DELETE", ...(config || {}) }),
    post: (path, data, config = {}) => request(path, { method: "POST", data, ...(config || {}) }),
    patch: (path, data, config = {}) => request(path, { method: "PATCH", data, ...(config || {}) }),
    put: (path, data, config = {}) => request(path, { method: "PUT", data, ...(config || {}) }),
};

export default api;


