// app/loading.tsx

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-slate-950">
      <div className="relative h-24 w-24">
        <span className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800"></span>

        <span className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin"></span>

        <span className="absolute inset-3 rounded-full border-4 border-transparent border-r-indigo-400 animate-spin [animation-duration:1.4s] [animation-direction:reverse]"></span>

        <span className="absolute inset-7 rounded-full bg-indigo-600 animate-pulse"></span>
      </div>
    </div>
  );
}