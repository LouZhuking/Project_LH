import {
  useState,
  useEffect
} from 'react'
import {
  Tabbar
} from 'react-vant'
import {
  Outlet,
  useNavigate,
  useLocation
} from 'react-router-dom'
import {
  HomeO,
  Comment,
  Fire,
  YouzanShield,
  UserO
} from '@react-vant/icons';
// 菜单栏配置
const tabs = [
  { icon: <HomeO />, title: '首页', path: '/home' },
  { icon: <Comment />, title: 'AI', path: '/chat' },
  { icon: <Fire />, title: '运动', path: '/sport' },
  { icon: <YouzanShield />, title: '动作', path: '/movement' },
  { icon: <UserO />, title: '用户', path: '/user' },
]


const MainLayout = () => {
  const [active, setActive] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // console.log(location.pathname, '////');

    // es6的使用power
    // 查找数组中第一个符合条件的元素的索引
    const index = tabs.findIndex(
      tab => location.pathname.startsWith(tab.path)
    )
    // 激活标签索引
    setActive(index)
  }, [])

  return (
    <div className=
      'flex flex-col h-screen'
      style={{ paddingBottom: "50px" }}>
      <div className='flex-1'>
        <Outlet />
      </div>
      {/* tabbar */}
      <Tabbar value={active} onChange={
        (key) => {
          setActive(key)
          navigate(tabs[key].path) // 路由跳转
        }
      }>
        {tabs.map((key, index) => (
          <Tabbar.Item
            key={index}
            icon={key.icon}
          >
            {key.title}
          </Tabbar.Item>
        ))}

      </Tabbar>
    </div>
  )
}

export default MainLayout