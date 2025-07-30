import {
  useState,
  lazy,
  Suspense,
} from 'react'
import './App.css'
import {
  Route,
  Routes,
  Navigate,
} from 'react-router-dom'
import MainLayout from '@/components/MainLayout'
import Loading from '@/components/Loading'

const Home = lazy(() => import('@/pages/Home'))
const Search = lazy(() => import('@/pages/Search'))
const Account = lazy(() => import('@/pages/Account'))

function App() {

  return (
    <>
      <Suspense fallback={<Loading />}>
        {/* 带有空的tabbar的layout */}
        <Routes>
          <Route element={<MainLayout />}>
            <Route path='/' element={<Navigate to='/home' />} />
            <Route path='/home' element={<Home />} />
            <Route path='/search' element={<Search />} />
            <Route path='/account' element={<Account />} />
          </Route>
        </Routes>
      </Suspense>

    </>
  )
}

export default App
