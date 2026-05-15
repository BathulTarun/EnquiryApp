import { Skeleton } from "@/components/ui/skeleton";

const PageLoader = () => {
  return (
    <div className="space-y-4 p-4">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="border rounded-2xl p-4 space-y-3"
        >
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
};

export default PageLoader;