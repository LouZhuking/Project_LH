import {
  useRef,
  useState
} from 'react';
import {
  useUserStore
} from '@/store/useUserStore'
import {
  useNavigate
} from 'react-router-dom'
import styles from './login.module.css'

const Login = () => {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const { login, loginError } = useUserStore();
  const navigate = useNavigate();
  const [isLogging, setIsLogging] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    if (!username || !password) {
      alert("请输入用户名或密码");
      return;
    }

    try {
      setIsLogging(true);
      await login({ username, password });
      // 登录成功，跳转到首页
      navigate('/chat');
    } catch (error) {
      // 登录失败，保持在当前页面，错误信息会通过loginError显示
      console.log('登录失败:', error.message);
    } finally {
      setIsLogging(false);
    }
  }

  const handleClose = () => {
    navigate('/');
  }

  const handleSocialLogin = (platform) => {
    alert(`${platform} 登录功能开发中...`);
  }

  // 自动删除空格的处理函数
  const handleInputChange = (inputRef) => {
    if (inputRef.current) {
      // 移除所有空格
      inputRef.current.value = inputRef.current.value.replace(/\s/g, '');
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginModal}>
        {/* 关闭按钮 */}
        <button className={styles.closeButton} onClick={handleClose}>
          ✕
        </button>

        {/* 左侧图片区域 */}
        <div className={styles.loginImage}>
          <div className={styles.heroImage}></div>
        </div>

        {/* 右侧表单区域 */}
        <div className={styles.loginForm}>
          {/* MARVEL Logo */}
          <div className={styles.logo}>
            <div className={styles.logoText}>KEEP</div>
          </div>

          {/* 登录表单 */}
          <form className={styles.form} onSubmit={handleLogin}>
            {/* 错误信息提示 */}
            {loginError && (
              <div className={styles.errorMessage}>
                {loginError}
              </div>
            )}

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="username">用户名</label>
              <input
                type="text"
                id="username"
                className={styles.input}
                ref={usernameRef}
                placeholder="请输入用户名"
                required
                disabled={isLogging}
                onInput={() => handleInputChange(usernameRef)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="password">密码</label>
              <input
                type="password"
                id="password"
                className={styles.input}
                ref={passwordRef}
                placeholder="请输入密码"
                required
                disabled={isLogging}
                onInput={() => handleInputChange(passwordRef)}
              />
              <div className={styles.forgotPassword}>
                <a href="#" className={styles.forgotPasswordLink}>忘记密码？</a>
              </div>
            </div>

            <button
              type="submit"
              className={styles.loginButton}
              disabled={isLogging}
            >
              {isLogging ? '登录中...' : 'Login'}
            </button>
          </form>

          {/* 注册链接 */}
          <div className={styles.registerLink}>
            想要加入健身宇宙？ <a href="#" className={styles.registerLinkText}>立即注册</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;