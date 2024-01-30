import { initialState, reducer, AppContext } from "./store/store";
import NotFound from "./components/notFound/notFound";
import { useReducer } from "react";
import DictionaryPage from './pages/dictionary/dictionaryPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Root from "./components/root/root";
import Home from "./pages/home";
import About from "./pages/about/about";
import StudyHome from "./pages/studyHome/studyHome";
import CommonStat from "./pages/commonStat/commonStat";
import TestDictionary from "./pages/testDictionary/testDictionary";
import Dictionaries from "./pages/dictionaries/dictionaries";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <NotFound/>,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'study',
        element: <StudyHome />,
        children: [
          {
            path: 'dictionaries',
            element: <Dictionaries/>
          },
          {
            path: 'stat',
            element: <CommonStat />
          },
          {
            path: 'dictionary',
            element: <TestDictionary />
          }
        ]
      },
      {
        path: 'dictionary',
        children: [
          {
            index: true,
            element: <DictionaryPage/>,
          },
          {
            path: ':id/edit',
            element: <div>Placeholder</div>,
          },
          {
            path: 'create',
            element: <div>Placeholder</div>,
          },
        ],
      }
    ]
  }
])

export default function App () {
  const [userState, userDispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={{userState, userDispatch}}>
      <RouterProvider router={router} />
    </AppContext.Provider>
  )
}