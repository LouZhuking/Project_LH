import useTitle from '@/hooks/useTitle'
import styles from './User.module.css'
import {
  useState
} from 'react'
import {
  Image,
  Cell,
  CellGroup,
  ActionSheet,
  Popup,
  Loading,
  Button
} from 'react-vant'
import Icon from '@/Icon'
import {
  SettingO
} from '@react-vant/icons'
import { useNavigate } from 'react-router-dom'


const User = () => {
  // 饮食记录区
  const [totalCalories, setTotalCalories] = useState(0)
  // 用户信息
  const [showActionSheet, setShowActionSheet] = useState(false);

  const navigate = useNavigate()

  const handleAction = (e) => {
    // console.log(e);
    if (e.type === 1) {
      // console.log('AI生成头像'); 
      const text = `
              昵称: ${userInfo.nickname}
              slogan: ${userInfo.slogan}
              avatar: ${userInfo.avatar}
      `
      navigate('/doubao', { state: { text } });
    } else if (e.type === 2) {
      // console.log('上传头像');

    }
  }


  const actions = [
    {
      name: 'AI生成头像',
      color: '#007AFF',
      type: 1
    },
    {
      name: '上传头像',
      color: '#123123',
      type: 2
    }
  ]


  const [userInfo, setUserInfo] = useState({
    nickname: '施瓦辛格',
    slogan: '路漫漫其修远兮，吾将上下而求索',
    avatar: 'https://pic1.zhimg.com/v2-1e3c09ff6d13c233c11c60c17212e4b7_r.jpg?source=1def8aca'
  })


  // 饮食记录图标数据
  const mealIcons = [
    { type: "icon-zaocan", title: "早餐" },
    { type: "icon-wucan", title: "午餐" },
    { type: "icon-wancan", title: "晚餐" },
    { type: "icon-a-50-62_fuzhi-04", title: "加餐" },
    { type: "icon-iconx", title: "饮水" },
    { type: "icon-weight0", title: "记体重" }
  ]

  useTitle('用户中心')
  return (
    // 用户中心容器
    <div className={styles.userContainer}>
      {/* 顶部导航栏区域 */}
      <div className={styles.userHeader}>
        {/* 左侧头像 */}
        <div className={styles.userAvatar}>
          <Image
            round
            width="60px"
            height="60px"
            fit="cover"
            src={userInfo.avatar}
            style={{ cursor: 'pointer', border: '4px solid #fff' }}
            onClick={() => setShowActionSheet(true)}
          />
        </div>
        {/* 右侧用户信息 */}
        <div className={styles.userInfo}>
          <div className={styles.nickname}>{userInfo.nickname}</div>
          <div className={styles.slogan}>{userInfo.slogan}</div>
        </div>
        {/* 右侧修改信息 */}
        <div className={styles.userLogin}>
          <Button color='linear-gradient(to right, #ff6034, #ee0a24)' type="primary" size="small" onClick={() => navigate('/login')}>
            <span className={styles.userLoginText}>退出</span>
          </Button>
        </div>

      </div>
      {/* 饮食记录区Coze智能拍照识别卡路里 */}
      <div className={styles.userRecord}>
        {/* 饮食记录区 */}
        <div className={styles.userRecordTitle}>
          <span className={styles.calory}>已进食 <span className={styles.caloryNum}>{totalCalories}</span>/-- 大卡</span>
        </div>
        {/* 饮食记录区内容*/}
        {/* 记得加下划线 */}
        <div className={styles.userRecordContent}>
          {/*  蛋白 碳水 脂肪 饮水  */}
          <div className={styles.userRecordItem}>
            <div className={styles.userRecordItemTitle} style={{ backgroundColor: '#FDF6EC' }}>
              <span>蛋白(g)</span>
              <span className={styles.userRecordItemNum}>10</span>
            </div>
          </div>
          <div className={styles.userRecordItem}>
            <div className={styles.userRecordItemTitle} style={{ backgroundColor: '#F2F5FC' }}>
              <span>碳水(g)</span>
              <span className={styles.userRecordItemNum}>10</span>
            </div>
          </div>
          <div className={styles.userRecordItem}>
            <div className={styles.userRecordItemTitle} style={{ backgroundColor: '#FBEDED' }}>
              <span>脂肪(g)</span>
              <span className={styles.userRecordItemNum}>10</span>
            </div>
          </div>
          <div className={styles.userRecordItem}>
            <div className={styles.userRecordItemTitle} style={{ backgroundColor: '#E9F7F8' }}>
              <span>饮水(ml)</span>
              <span className={styles.userRecordItemNum}>10 <span className={styles.userRecordItemNumUnit}>/2000</span></span>
            </div>
          </div>
        </div>
        {/* 饮食记录区底部图标 */}
        {/* 点击图标跳转Coze智能拍照识别卡路里页面 */}
        <div className={styles.userRecordIcon}>
          {mealIcons.map((item, index) => (
            <div key={index} className={styles.iconText} onClick={() => navigate('/coze')}>
              <Icon type={item.type} size={20} color="#020202" />
              <span className={styles.iconTextTitle}>{item.title}</span>
            </div>
          ))}
        </div>
      </div>
      {/* 任务栏框 */}
      <div className="mt3">
        <CellGroup inset>
          <Cell title="分享keep" icon={<Icon type="icon-a-132_biaoqing05" size={20} />} isLink />
          <Cell title="偏好设置" icon={<Icon type="icon-a-132_biaoqing03" size={20} />} isLink />
          <Cell title="反馈中心" icon={<Icon type="icon-a-132_biaoqing04" size={20} />} isLink />
          <Cell title="身体数据" icon={<Icon type="icon-a-132_biaoqing01" size={20} />} isLink />
        </CellGroup>
        <CellGroup inset className="mt2">
          <Cell title="教练记" icon={<Icon type="icon-a-132_biaoqing02" size={20} />} isLink />
        </CellGroup>
        <CellGroup inset className="mt2">
          <Cell title="操作指南" icon={<Icon type="icon-a-132_biaoqing18" size={20} />} isLink />
          <Cell title="语言设置/Language" icon={<Icon type="icon-a-132_biaoqing17" size={20} />} isLink />
          <Cell title="RM计算器" icon={<Icon type="icon-a-132_biaoqing12" size={20} />} isLink />
          <Cell title="回收站" icon={<Icon type="icon-a-132_biaoqing10" size={20} />} isLink />
          <Cell title="微信公众号" icon={<Icon type="icon-a-132_biaoqing08" size={20} />} isLink />
          <Cell title="小工具" icon={<Icon type="icon-a-132_biaoqing14" size={20} />} isLink />
          <Cell title="缓存" icon={<Icon type="icon-a-132_biaoqing13" size={20} />} isLink />
        </CellGroup>
        <CellGroup inset className="mt2">
          <Cell title="设置" icon={<SettingO />} isLink />
        </CellGroup>
      </div>
      {/* 动作面板 */}
      <ActionSheet
        visible={showActionSheet}
        cancelText='取消'
        onCancel={() => setShowActionSheet(false)}
        actions={actions}
        onSelect={(e) => handleAction(e)}
      />
    </div>
  )
}

export default User