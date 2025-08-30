import { AlertTriangle } from "lucide-react";

export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 border border-red-300 bg-red-50 text-red-800 px-4 py-3 rounded-lg">
      <AlertTriangle className="w-5 h-5 shrink-0" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
