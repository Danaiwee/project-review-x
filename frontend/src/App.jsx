import { Navigate, Route, Routes } from "react-router-dom";

import { useUserStore } from "./stores/useUserStore";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";
import NotificationPage from "./pages/NotificationPage";
import ProfilePage from "./pages/ProfilePage";
import LeftSidebar from "./compoenents/LeftSidebar";
import RightSidebar from "./compoenents/RightSidebar";
import BookmarkPage from "./pages/BookmarkPage";
import { useEffect } from "react";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return null;

  console.log("authUser", authUser);

  return (
    <div className='flex max-w-6xl mx-auto'>
      {authUser && <LeftSidebar />}

      <Routes>
        <Route
          path='/'
          element={authUser ? <HomePage /> : <Navigate to='/signin' />}
        />
        <Route
          path='/signup'
          element={!authUser ? <SignupPage /> : <Navigate to='/' />}
        />
        <Route
          path='/signin'
          element={!authUser ? <SigninPage /> : <Navigate to='/' />}
        />
        <Route
          path='/notifications'
          element={authUser ? <NotificationPage /> : <Navigate to='/signin' />}
        />
        <Route
          path='/profile'
          element={authUser ? <ProfilePage /> : <Navigate to='/signin' />}
        />

        <Route
          path='/bookmark'
          element={authUser ? <BookmarkPage /> : <Navigate to='/bookmark' />}
        />
      </Routes>

      {authUser && <RightSidebar />}
    </div>
  );
};

export default App;
