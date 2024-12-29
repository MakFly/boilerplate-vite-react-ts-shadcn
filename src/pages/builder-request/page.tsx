import React, { useState } from "react";
import { Copy, Play, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const RequestDisplay = () => {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState("{}");
  const [body, setBody] = useState("");
  const [copied, setCopied] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState("cors");

  const parseCurlCommand = (curlCommand) => {
    try {
      // Clean up the command while preserving content within quotes
      let command = curlCommand.replace(/\\\n\s*/g, " ").trim();

      if (command.startsWith("curl ")) {
        command = command.slice(5);
      }

      const parsed = {
        method: "GET",
        url: "",
        headers: {},
        body: "",
      };

      // Split by spaces while preserving quoted content
      const parts = command.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];

      let i = 0;
      while (i < parts.length) {
        const part = parts[i];

        // Handle URL (first non-flag argument)
        if (!part.startsWith("-") && !parsed.url) {
          parsed.url = part.replace(/^['"]|['"]$/g, "");
        }
        // Handle method
        else if (part === "-X" || part === "--request") {
          i++;
          if (i < parts.length) {
            parsed.method = parts[i].replace(/^['"]|['"]$/g, "");
          }
        }
        // Handle headers
        else if (part === "-H" || part === "--header") {
          i++;
          if (i < parts.length) {
            const headerValue = parts[i].replace(/^['"]|['"]$/g, "");
            const separatorIndex = headerValue.indexOf(":");
            if (separatorIndex !== -1) {
              const key = headerValue.slice(0, separatorIndex).trim();
              const value = headerValue.slice(separatorIndex + 1).trim();
              parsed.headers[key] = value;
            }
          }
        }
        // Handle data
        else if (part === "-d" || part === "--data") {
          i++;
          if (i < parts.length) {
            parsed.body = parts[i].replace(/^['"]|['"]$/g, "");
            if (!parsed.method || parsed.method === "GET") {
              parsed.method = "POST";
            }
          }
        }
        i++;
      }

      return parsed;
    } catch (error) {
      console.error("Error parsing cURL command:", error);
      return null;
    }
  };

  const handleUrlChange = (e) => {
    const value = e.target.value;

    if (value.trim().toLowerCase().startsWith("curl ")) {
      const parsed = parseCurlCommand(value);
      if (parsed) {
        setUrl(parsed.url || "");
        setMethod(parsed.method || "GET");

        // Preserve formatting of headers JSON
        const formattedHeaders = JSON.stringify(parsed.headers, null, 2);
        setHeaders(formattedHeaders);

        if (parsed.body) {
          try {
            // Try to parse and format JSON body
            const jsonBody = JSON.parse(parsed.body);
            setBody(JSON.stringify(jsonBody, null, 2));
          } catch {
            // If not JSON, keep as is
            setBody(parsed.body);
          }
        } else {
          setBody("");
        }
      }
    } else {
      setUrl(value);
    }
  };

  const executeRequest = async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      let headerObj = {};
      try {
        headerObj = JSON.parse(headers);
      } catch (e) {
        throw new Error("Invalid headers JSON format");
      }

      headerObj["Origin"] = "https://www.smythstoys.com";

      const requestOptions = {
        method,
        headers: headerObj,
        mode,
        credentials: "include",
      };

      if ((method === "POST" || method === "PUT") && body) {
        try {
          const bodyObj = JSON.parse(body);
          requestOptions.body = JSON.stringify(bodyObj);
        } catch (e) {
          requestOptions.body = body;
        }
      }

      const res = await fetch(url, requestOptions);

      if (mode === "no-cors") {
        setResponse({
          status: "Success",
          statusText: "Request completed in no-cors mode",
          headers: {},
          data: "Response content not available in no-cors mode",
        });
        return;
      }

      const responseHeaders = {};
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      let data;
      const contentType = res.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        data = await res.text();
        try {
          data = JSON.parse(data);
        } catch (e) {
          // Keep as text if parsing fails
        }
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        data,
      });
    } catch (err) {
      setError(err.message || "Failed to execute request");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateCurl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="w-full p-6 grid grid-cols-2 gap-6">
      {/* Colonne de gauche - Formulaire */}
      <div className="space-y-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold">HTTP Request Builder</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">CORS Mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="cors">cors</option>
              <option value="no-cors">no-cors</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            URL or cURL Command
          </label>
          <textarea
            value={url}
            onChange={handleUrlChange}
            className="w-full p-2 border rounded font-mono text-sm"
            placeholder="Enter URL or paste cURL command"
            rows={5}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Headers (JSON)</label>
          <textarea
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
            className="w-full p-2 border rounded font-mono text-sm"
            rows={10}
          />
        </div>

        {(method === "POST" || method === "PUT") && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Request Body (JSON)
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-2 border rounded font-mono text-sm"
              rows={4}
            />
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={executeRequest}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Play size={16} />
            )}
            {isLoading ? "Executing..." : "Execute Request"}
          </button>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <Copy size={16} />
            {copied ? "Copied!" : "Copy cURL"}
          </button>
        </div>

        {error && (
          <Alert className="bg-red-50 border-red-200">
            <AlertDescription className="text-red-800">
              Error: {error}
            </AlertDescription>
          </Alert>
        )}

        {copied && (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription>
              cURL command copied to clipboard!
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Colonne de droite - Réponse */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Response</h2>
        <div className="h-[calc(100vh-200px)] overflow-y-auto">
          {response && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-100 rounded">
                <div className="mb-2">
                  <span className="font-medium">Status:</span> {response.status}{" "}
                  {response.statusText}
                </div>
                <div className="mb-2">
                  <span className="font-medium">Headers:</span>
                  <pre className="text-sm mt-1">
                    {JSON.stringify(response.headers, null, 2)}
                  </pre>
                </div>
                <div>
                  <span className="font-medium">Body:</span>
                  <pre className="text-sm mt-1">
                    {typeof response.data === "string"
                      ? response.data
                      : JSON.stringify(response.data, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestDisplay;
