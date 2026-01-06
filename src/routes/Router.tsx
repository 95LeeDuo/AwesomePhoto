import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Frame from "@/pages/Frame";
import SelectPhoto from "@/pages/SelectPhoto";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>홈 페이지</div>,
  },
  {
    path: "/frame",
    element: <Frame />,
  },
  {
    path: "select-photo",
    element: <SelectPhoto />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}

/*
 * ========================================
 * 📚 Data Router 주요 기능 정리
 * ========================================
 *
 * 1️⃣ loader - 페이지 렌더링 전 데이터 로드
 * ----------------------------------------
 * {
 *   path: "frame",
 *   element: <Frame />,
 *   loader: async () => {
 *     const res = await fetch("/api/data");
 *     return res.json();
 *   },
 * }
 * → 컴포넌트에서: const data = useLoaderData();
 *
 *
 * 2️⃣ action - 폼 제출 처리
 * ----------------------------------------
 * {
 *   path: "frame",
 *   element: <Frame />,
 *   action: async ({ request }) => {
 *     const formData = await request.formData();
 *     await saveData(formData);
 *     return redirect("/");
 *   },
 * }
 * → 컴포넌트에서: <Form method="post"> 사용
 *
 *
 * 3️⃣ errorElement - 에러 발생 시 표시할 컴포넌트
 * ----------------------------------------
 * {
 *   path: "frame",
 *   element: <Frame />,
 *   errorElement: <ErrorPage />,
 * }
 * → 에러 컴포넌트에서: const error = useRouteError();
 *
 *
 * 4️⃣ lazy - 컴포넌트 지연 로딩 (코드 스플리팅)
 * ----------------------------------------
 * {
 *   path: "frame",
 *   lazy: () => import("@/pages/Frame"),
 * }
 *
 *
 * 5️⃣ 유용한 Hooks
 * ----------------------------------------
 * useNavigation()    - 로딩 상태 확인 (navigation.state)
 * useLoaderData()    - loader 데이터 가져오기
 * useActionData()    - action 결과 가져오기
 * useRouteError()    - 에러 정보 가져오기
 * useParams()        - URL 파라미터 (/frame/:id)
 * useSearchParams()  - 쿼리스트링 (?page=1)
 *
 */

