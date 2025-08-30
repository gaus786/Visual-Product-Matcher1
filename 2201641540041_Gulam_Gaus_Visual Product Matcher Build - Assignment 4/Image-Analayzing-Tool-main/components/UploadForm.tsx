import { Upload, Image as ImageIcon } from "lucide-react";
import React from "react";

export type UploadFormProps = {
  image: string | null;
  setImage: (img: string | null) => void;
  setDominantColor: (color: string | null) => void;
  setFile: (file: File | null) => void;
  analyzed: boolean;
  inferredColor: string | null;
  inferredCategory: string | null;
  inferredName: string;
  onAnalyze?: () => void;
  onSearch: () => void;
  onSave: () => void;
  analyzing?: boolean;
};

const UploadForm: React.FC<UploadFormProps> = (props) => {
  const {
    image,
    setImage,
    setDominantColor,
    setFile,
    analyzed,
    inferredColor,
    inferredCategory,
    inferredName,
    onAnalyze,
    onSearch,
    onSave,
    analyzing,
  } = props;

  const extractDominantColor = (src: string) => {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let r = 0,
          g = 0,
          b = 0,
          count = 0;
        const step = 10 * 4;
        for (let i = 0; i < data.length; i += step) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        if (count > 0) {
          r = Math.round(r / count);
          g = Math.round(g / count);
          b = Math.round(b / count);
          setDominantColor(
            `#${r.toString(16).padStart(2, "0")}${g
              .toString(16)
              .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
          );
        }
      };
      img.onerror = () => setDominantColor(null);
      img.src = src;
    } catch {
      setDominantColor(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        setImage(dataUrl);
        extractDominantColor(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImage(url);
    if (!url) return;
    fetch("/api/fetch-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    })
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        if (data?.dataUrl) extractDominantColor(data.dataUrl);
      })
      .catch(() => {});
  };

  return (
    <div className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 flex flex-col gap-8 w-full max-w-2xl mx-auto border border-gray-200 dark:border-gray-700">
      {/* Upload Inputs */}
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <label className="flex-1 flex items-center gap-3 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 cursor-pointer bg-white/60 dark:bg-gray-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-all shadow-sm hover:shadow-md">
          <Upload className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <span className="text-gray-700 dark:text-gray-200 text-sm font-medium">
            Upload Image
          </span>
        </label>

        <div className="flex-1 flex items-center gap-3 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500 bg-white/60 dark:bg-gray-800/60 transition-all shadow-sm hover:shadow-md">
          <ImageIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <input
            type="url"
            placeholder="Paste image URL"
            className="flex-1 outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 bg-transparent"
            value={image && image.startsWith("http") ? image : ""}
            onChange={handleUrlChange}
          />
        </div>
      </div>

      {/* Preview + Analysis */}
      {image && (
        <div className="w-full flex flex-col items-center gap-4">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Uploaded Image
          </span>
          <img
            src={image}
            alt="Preview"
            className="max-h-64 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 object-contain transition-transform hover:scale-[1.03]"
          />

          {analyzed && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full text-sm">
              <div className="bg-white/80 dark:bg-gray-800/70 p-3 rounded-lg border shadow-sm">
                <span className="block font-semibold text-gray-900 dark:text-white">
                  Name
                </span>
                {inferredName || "N/A"}
              </div>
              <div className="bg-white/80 dark:bg-gray-800/70 p-3 rounded-lg border shadow-sm">
                <span className="block font-semibold text-gray-900 dark:text-white">
                  Category
                </span>
                {inferredCategory || "N/A"}
              </div>
              <div className="bg-white/80 dark:bg-gray-800/70 p-3 rounded-lg border shadow-sm flex items-center gap-2">
                <span className="font-semibold text-gray-900 dark:text-white">
                  Color
                </span>
                {inferredColor ? (
                  <>
                    <span className="px-2 py-0.5 text-xs rounded-full border bg-gray-50 dark:bg-gray-700 shadow-sm">
                      {inferredColor}
                    </span>
                    <span
                      className="inline-block w-5 h-5 rounded-full border shadow"
                      style={{ backgroundColor: inferredColor }}
                    />
                  </>
                ) : (
                  "N/A"
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Buttons */}
      {/* Buttons */}
      <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
        {onAnalyze && (
          <button
            className={`px-6 py-2.5 rounded-xl font-medium text-white flex items-center gap-2 shadow-lg transition-all ${
              analyzing
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl"
            }`}
            onClick={onAnalyze}
            disabled={!image || analyzing}
          >
            {analyzing && (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {analyzing ? "Processing..." : "Identify Details"}
          </button>
        )}

        <button
          className="px-6 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all"
          onClick={onSearch}
          disabled={!image || !analyzed}
        >
          Search Matches
        </button>

        <button
          className="px-6 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 shadow-lg hover:shadow-xl transition-all"
          onClick={onSave}
          disabled={!image || !analyzed}
        >
          Add to Collection
        </button>
      </div>
    </div>
  );
};

export default UploadForm;
