import { AlertCircle, CheckCircle2 } from 'lucide-react';

type AlertProps = {
  message: string;
  type: 'error' | 'success';
};

export function Alert({ message, type }: AlertProps) {
  return (
    <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
        type === 'error'
          ? 'bg-red-900/20 text-red-400 border border-red-800'
          : 'bg-green-900/20 text-green-400 border border-green-800'
      }`} >
      {type === 'error' ? (
        <AlertCircle className="w-4 h-4" />
      ) : (
        <CheckCircle2 className="w-4 h-4" />
      )}
      {message}
    </div>
  );
}