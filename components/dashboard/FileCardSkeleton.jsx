export const FileCardSkeleton = () => (
  <div
    className="flex p-4 flex-col items-center justify-between rounded-xl border border-gray-200 dark:border-gray-800
      bg-white dark:bg-gray-900 w-full h-[200px]"
  >
    <div className="w-[70px] h-[70px] rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse" />
    <div className="w-full space-y-2">
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
      <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-2/3 mx-auto" />
    </div>
  </div>
);
