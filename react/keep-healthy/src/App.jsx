import './App.css'
import {
  Suspense,
  lazy
} from 'react'
import {
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import Loading from '@/components/loading'
import MainLayout from '@/components/MainLayout'
import BlankLayout from '@/components/BlankLayout'

const Home = lazy(() => import('@/pages/home'))
const Chat = lazy(() => import('@/pages/chat'))
const Sport = lazy(() => import('@/pages/sport'))
const Movement = lazy(() => import('@/pages/movement'))
const User = lazy(() => import('@/pages/user'))
const Search = lazy(() => import('@/pages/search'))
const DouBao = lazy(() => import('@/pages/doubao'))
const Coze = lazy(() => import('@/pages/coze'))

function App() {

  return (
    <>
      <Suspense fallback={<Loading />}>
        {/* 带有tabbar的layout */}
        <Routes>
          <Route element={<MainLayout />}>
            <Route path='/' element={<Navigate to='/home' />} />
            <Route path='/home' element={<Home />} />
            <Route path='/chat' element={<Chat />} />
            <Route path='/sport' element={<Sport />} />
            <Route path='/movement' element={<Movement />} />
            <Route path='/user' element={<User />} />
            {/* 登录鉴权组件 */}
            {/* 以及引入coze工作流组件 */}
          </Route>
          {/* 空的Layout */}
          <Route element={<BlankLayout />}>
            <Route path='/search' element={<Search />} />
            <Route path='/doubao' element={<DouBao />} />
            <Route path='/coze' element={<Coze />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}

export default App
