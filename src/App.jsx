import {
    createBrowserRouter,
    createRoutesFromElements,
    Navigate,
    Route,
    RouterProvider,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayouy";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Navigate to="/all" replace />} />
                <Route path="/all" element={<HomePage />} />
                <Route path="/:categoryId" element={<CategoryPage />} />
                <Route path="/products/:productId" element={<ProductDetailsPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        )
    );
    return <RouterProvider router={router} />;
}

export default App;
