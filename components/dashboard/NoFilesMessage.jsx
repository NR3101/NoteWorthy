import Image from "next/image";

export const NoFilesMessage = () => (
  <div className="col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-5 flex flex-col items-center justify-center min-h-[400px] p-8">
    <div className="relative w-24 h-24 mb-8">
      <Image
        src="/empty-files.png"
        alt="No files"
        fill
        className="object-contain opacity-80 dark:opacity-60"
      />
    </div>
    <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-700 dark:from-purple-300 dark:to-purple-500 bg-clip-text text-transparent text-center mb-3">
      No Files Found
    </h3>
    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center max-w-md">
      Upload your first PDF and start taking notes.
    </p>
  </div>
);
