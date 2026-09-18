interface ProjectLoadErrorProps {
  readonly message: string;
}

/*** Renders a persistent project-loading error without taking down the surrounding PKGViz UI. */
export default function ProjectLoadError({ message }: ProjectLoadErrorProps) {
  return (
    <div role="alert" className="flex flex-1 items-center justify-center p-6">
      <div className="max-w-xl rounded-md border border-red-300 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
        <p className="text-sm font-medium text-red-800 dark:text-red-200">Unable to load project</p>
        <p className="mt-1 break-all text-xs text-red-700 dark:text-red-300">{message}</p>
      </div>
    </div>
  );
}
