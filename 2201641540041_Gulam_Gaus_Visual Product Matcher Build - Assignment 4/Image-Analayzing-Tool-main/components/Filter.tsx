import { Divide, Filter as FilterIcon } from "lucide-react";

type Props = {
  value: number;
  setValue: (v: number) => void;
};

export default function Filter({ value, setValue }: Props) {
  return (
    <div>
      <div className="flex justify-center items-center w-full mt-6">
        <div className="flex flex-col w-full sm:w-1/2 bg-white border border-gray-200 rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700 font-semibold text-sm">
              Min Similarity
            </span>
            <span className="text-blue-600 font-bold text-sm">
              {(value * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full accent-blue-600 h-2 rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
