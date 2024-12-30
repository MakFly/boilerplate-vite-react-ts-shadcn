interface ApiOptions {
  token?: string;
  baseUrl?: string;
}

export const useApi = (options?: ApiOptions) => {
  const baseUrl = ""; // On laisse vide car on utilise le proxy

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

  const post = async <T>(
    endpoint: string,
    data: unknown,
    isMultipart = false
  ): Promise<T> => {
    const reqHeaders = Object.fromEntries(
      Object.entries({ ...headers }).filter(([, value]) => value !== undefined)
    );
    let body: string | FormData;

    if (isMultipart) {
      // On supprime le Content-Type pour FormData
      // Le navigateur le définira automatiquement avec le boundary
      delete reqHeaders["Content-Type"];
      body = data as FormData;
    } else {
      body = JSON.stringify(data);
    }

    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers: reqHeaders,
      body,
    });

    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  };

  const postById = async <T>(
    endpoint: string,
    id: string | number,
    data: unknown,
    isMultipart = false
  ): Promise<T> => {
    const reqHeaders = Object.fromEntries(
      Object.entries({ ...headers }).filter(([, value]) => value !== undefined)
    );
    let body: string | FormData;

    if (isMultipart) {
      delete reqHeaders["Content-Type"];
      body = data as FormData;
    } else {
      body = JSON.stringify(data);
    }

    const response = await fetch(`${baseUrl}${endpoint}/${id}`, {
      method: "POST",
      headers: reqHeaders,
      body,
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
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur serveur:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  const patch = async <T>(
    endpoint: string,
    id: string | number,
    data: unknown
  ): Promise<T> => {
    const response = await fetch(`${baseUrl}${endpoint}/${id}`, {
      method: "PATCH",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  const uploadImages = async <T>(
    endpoint: string,
    id: string | number,
    images: File[]
  ): Promise<T> => {
    const formData = new FormData();
    images.forEach((file) => {
      formData.append("images[]", file);
    });

    const response = await fetch(`${baseUrl}${endpoint}/${id}/images`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Upload error:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

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
    postById,
    put,
    patch,
    uploadImages,
    delete: remove,
  };
};
