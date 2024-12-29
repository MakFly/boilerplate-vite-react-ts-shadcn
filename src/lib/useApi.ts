interface ApiOptions {
  token?: string;
  baseUrl?: string;
}

export const useApi = (options?: ApiOptions) => {
  const baseUrl =
    options?.baseUrl || import.meta.env.VITE_API_URL || "http://localhost";

  const headers = {
    "Content-Type": "application/json",
    Origin: import.meta.env.ORIGIN,
    ...(options?.token && { Authorization: `Bearer ${options.token}` }),
  };

  const get = async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "GET",
      headers,
    });
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  };

  const getById = async <T>(
    endpoint: string,
    id: string | number
  ): Promise<T> => {
    const response = await fetch(`${baseUrl}${endpoint}/${id}`, {
      method: "GET",
      headers,
    });
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  };

  const post = async <T>(endpoint: string, data: unknown): Promise<T> => {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  };

  const put = async <T>(
    endpoint: string,
    id: string | number,
    data: unknown
  ): Promise<T> => {
    const response = await fetch(`${baseUrl}${endpoint}/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  };

  const remove = async (
    endpoint: string,
    id: string | number
  ): Promise<void> => {
    const response = await fetch(`${baseUrl}${endpoint}/${id}`, {
      method: "DELETE",
      headers,
    });
    if (!response.ok) throw new Error(response.statusText);
  };

  return {
    get,
    getById,
    post,
    put,
    delete: remove,
  };
};
