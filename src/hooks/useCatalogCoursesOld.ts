import useSWR from "swr";
import { fetchCatalogCourses } from "@/lib/catalogService";
import { CatalogCourseInterface } from "@/types/courseData";

// const ITEMS_PER_PAGE = 12;

export function useCatalogCourses() {
//   const {
//     data: visibleCourses,
//     error,
//     isLoading,
//   } = useSWR<CatalogCourseInterface[]>("catalog-courses", fetchCatalogCourses, {
//     shouldRetryOnError: false,
//   });

//   const [visibleCourses, setVisibleCourses] = useState<CourseInterface[]>([]);
//   const [loadingMore, setLoadingMore] = useState(false);

//   useEffect(() => {
//     if (allCourses) {
//       setVisibleCourses(allCourses.slice(0, ITEMS_PER_PAGE));
//     }
//   }, [allCourses]);

//   const loadMoreCourses = () => {
//     if (!allCourses || loadingMore) return;

//     setLoadingMore(true);

//     const start = visibleCourses.length;
//     const end = start + ITEMS_PER_PAGE;
//     const nextChunk = allCourses.slice(start, end);

//     if (nextChunk.length === 0) {
//       setLoadingMore(false);
//       return;
//     }

//     setTimeout(() => {
//       setVisibleCourses((prev) => [...prev, ...nextChunk]);
//       setLoadingMore(false);
//     }, 1500);
//   };
    setTimeout(() => {
          
        }, 1500);

  return {
    visibleCourses,
    isLoading,
    error,
  };
}
