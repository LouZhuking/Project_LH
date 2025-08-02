import useTitle from '@/hooks/useTitle'
import styles from './chat.module.css'
import {
  useEffect,
  useState
} from 'react'
import Icon from '@/Icon'
import {
  chat
} from '@/llm'
import {
  Loading,
} from 'react-vant'
import {
  ChatO,
  UserO
} from '@react-vant/icons'

const Chat = () => {
  useTitle('AI教练')

  const [text, setText] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(true) // 控制快捷操作栏显示
  const [showMainContent, setShowMainContent] = useState(true) // 控制主内容区域显示
  // 数据驱动界面
  // 静态界面
  const [messages, setMessages] = useState([
    // 会出现情况出现将下标导航挤掉
    {
      id: 2,
      content: "hello~~",
      role: "user",
    },
    {
      id: 1,
      content: "hello, I am your assistant~~",
      role: "assistant",
    },

  ])

  const handleChat = async () => {
    // 当输入为空的时候不输出
    if (text.trim() === "") return
    // 1. 不能让用户重复点击按钮
    setIsSending(true)
    setText("")
    // 隐藏快捷操作栏（用户首次提交后）
    setShowQuickActions(false)
    setShowMainContent(false)
    // 2. 用户发送的可以立马上去
    // 会产生闭包陷阱
    setMessages((prev) => {
      return [
        ...prev,
        {
          role: 'user',
          content: text,
        }
      ]
    })
    const newMessage = await chat([{
      role: 'user',
      content: text
    }])
    setMessages((prev) => {
      return [
        ...prev,
        newMessage.data
      ]
    })
    setIsSending(false)
  }

  useEffect(() => {
    const fetchChat = async () => {
      const res = await chat([
        {
          role: 'user',
          content: ''
        }
      ]);
      // console.log(res);
    }
    fetchChat()
  }, [])





  return (
    <div className={styles.chatContainer}>
      {/* 顶部导航栏 */}
      <div className={styles.topHeader}>
        <div className={styles.leftIcon} onClick={() => {
          setShowMainContent(true)
          setShowQuickActions(true)
        }}>
          <Icon type="icon-a-134_nianbao" size={24} />
        </div>
        <div className={styles.centerTitle}>
          <div className={styles.upgradeBtn}>升级</div>
        </div>
        <div className={styles.rightIcons}>
          <span className={styles.bellIcon}>🔔</span>
          <span className={styles.moreIcon}>⌄</span>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className={`${styles.mainContent} ${!showMainContent ? styles.hidden : ''}`}>
        {/* AI问候卡片 */}
        <div className={styles.greetingCard}>
          <div className={styles.quoteIcon}>💬</div>
          <div className={styles.greetingText}>
            Hi，我是 Keep AI 教练卡卡，请问有什么可以帮到你？
          </div>
        </div>

        {/* 功能卡片网格 */}
        <div className={styles.functionsGrid}>
          {/* 第一行 */}
          <div className={styles.functionCard}>
            <div className={styles.cardIcon}>📅</div>
            <div className={styles.cardTitle}>生成计划</div>
            <div className={styles.cardDesc}>个性定制，打造最适合你的训练方案</div>
          </div>

          <div className={styles.functionCard}>
            <div className={styles.cardIcon}>🍽️</div>
            <div className={styles.cardTitle}>记饮食</div>
            <div className={styles.cardDesc}>拍照打卡，智能识别，轻松记录每一餐</div>
          </div>

          {/* 第二行 */}
          <div className={styles.functionCard}>
            <div className={styles.cardIcon}>⚖️</div>
            <div className={styles.cardTitle}>饮食评价</div>
            <div className={styles.cardDesc}>突破瓶颈，全面分析你的饮食安排是否合理</div>
          </div>

          <div className={styles.functionCard}>
            <div className={styles.cardIcon}>📊</div>
            <div className={styles.cardTitle}>记体重</div>
            <div className={styles.cardDesc}>上称拍个照，体重记录从未如此简单</div>
          </div>


        </div>
      </div>

      {/* 对话区域 */}
      <div className={styles.ChatArea}>
        {
          messages.map((msg, index) => (
            <div key={index} className={
              msg.role === 'user' ?
                styles.messageRight :
                styles.messageLeft
            }>
              {
                msg.role === 'assistant' ?
                  <ChatO /> :
                  <UserO />
              }
              {msg.content}
            </div>
          ))
        }
      </div>

      {/* 底部快捷操作栏 */}
      <div className={`${styles.quickActions} ${!showQuickActions ? styles.hidden : ''}`}>
        <div className={styles.actionItem}>
          <span className={styles.actionIcon}>📝</span>
          <span className={styles.actionText}>生成计划</span>
        </div>
        <div className={styles.actionItem}>
          <span className={styles.actionIcon}>🍽️</span>
          <span className={styles.actionText}>记饮食</span>
        </div>
        <div className={styles.actionItem}>
          <span className={styles.actionIcon}>⚖️</span>
          <span className={styles.actionText}>饮食评价</span>
        </div>
        <div className={styles.actionItem}>
          <span className={styles.actionIcon}>📊</span>
          <span className={styles.actionText}>记体重</span>
        </div>
      </div>

      {/* 输入区域 */}
      <div className={styles.inputArea}>
        <div className={styles.inputContainer}>
          <input
            value={text}
            // 输入框内容变化时的响应逻辑，将输入值更新到组件状态中
            onChange={(e) => setText(e.target.value)}
            placeholder='询问你的专属ai教练'
            className={styles.input}
          />
          <button disabled={isSending} type='primary' onClick={handleChat} className={styles.cameraBtn}>📷</button>
        </div>
        {isSending && <div className="fixed-loading"><Loading type="ball" /></div>}
      </div>
    </div>
  )
}

export default Chat