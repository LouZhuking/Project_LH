<!-- @ts-nocheck -->
<script lang="ts">
// @ts-nocheck
import { defineComponent } from 'vue'
import UserIcon from '../components/icons/UserIcon.vue'
import LockIcon from '../components/icons/LockIcon.vue'
import EyeIcon from '../components/icons/EyeIcon.vue'
import EyeOffIcon from '../components/icons/EyeOffIcon.vue'
import WechatIcon from '../components/icons/WechatIcon.vue'
import QQIcon from '../components/icons/QQIcon.vue'
import CheckIcon from '../components/icons/CheckIcon.vue'

export default defineComponent({
  name: 'LoginView',
  components: {
    UserIcon,
    LockIcon,
    EyeIcon,
    EyeOffIcon,
    WechatIcon,
    QQIcon,
    CheckIcon,
  },
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        rememberMe: false,
      },
      showPassword: false,
      isLoading: false,
    }
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    async handleLogin() {
      if (!this.loginForm.username || !this.loginForm.password) {
        return
      }
      this.isLoading = true
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        console.log('登录成功', this.loginForm)
      } catch (error) {
        console.error('登录失败:', error)
      } finally {
        this.isLoading = false
      }
    },
  },
})
</script>

<template>
<!-- eslint-disable -->
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <!-- 主登录卡片 -->
    <div class="login-card fade-in-up">
      <!-- Logo 和标题区域 -->
      <div class="header-section">
        <div class="logo-container float">
          <img src="../assets/images/cloud-logo.svg" alt="HomeCloud" class="logo" />
        </div>
        <h1 class="title">私有云登录</h1>
        <p class="subtitle">欢迎使用 HomeCloud 私有云服务</p>
      </div>

      <!-- 登录表单 -->
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username" class="form-label">用户名</label>
          <input
            id="username"
            v-model="loginForm.username"
            type="text"
            class="input-field"
            placeholder="请输入用户名"
            required
          />
          <div class="input-icon">
            <UserIcon />
          </div>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">密码</label>
          <input
            id="password"
            v-model="loginForm.password"
            :type="showPassword ? 'text' : 'password'"
            class="input-field"
            placeholder="请输入密码"
            required
          />
          <div class="input-icon">
            <LockIcon />
          </div>
          <button
            type="button"
            @click="togglePassword"
            class="password-toggle"
          >
            <EyeIcon v-if="!showPassword" />
            <EyeOffIcon v-else />
          </button>
        </div>

        <div class="form-options">
          <label class="checkbox-container">
            <input v-model="loginForm.rememberMe" type="checkbox" />
            <span class="checkmark"></span>
            记住我
          </label>
          <a href="#" class="forgot-password">忘记密码？</a>
        </div>

        <button
          type="submit"
          class="btn btn-primary login-btn"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">登录</span>
          <div v-else class="loading-spinner"></div>
        </button>
      </form>

      <!-- 其他登录方式 -->
      <div class="divider">
        <span>或</span>
      </div>

      <div class="social-login">
        <button class="btn btn-secondary social-btn">
          <WechatIcon />
          微信登录
        </button>
        <button class="btn btn-secondary social-btn">
          <QQIcon />
          QQ登录
        </button>
      </div>

      <!-- 底部链接 -->
      <div class="footer-links">
        <a href="#">注册账号</a>
        <span>•</span>
        <a href="#">客服支持</a>
      </div>
    </div>

    <!-- 右侧信息面板 -->
    <div class="info-panel fade-in-up">
      <div class="info-content">
        <h2>安全可靠的私有云服务</h2>
        <ul class="feature-list">
          <li>
            <CheckIcon />
            <span>企业级数据安全保护</span>
          </li>
          <li>
            <CheckIcon />
            <span>多端同步，随时访问</span>
          </li>
          <li>
            <CheckIcon />
            <span>海量存储空间</span>
          </li>
          <li>
            <CheckIcon />
            <span>7x24小时技术支持</span>
          </li>
        </ul>
        <div class="illustration">
          <img src="../assets/images/cloud-illustration.svg" alt="Cloud Services" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  left: -150px;
  animation: float 6s ease-in-out infinite;
}

.circle-2 {
  width: 200px;
  height: 200px;
  top: 50%;
  right: -100px;
  animation: float 8s ease-in-out infinite reverse;
}

.circle-3 {
  width: 150px;
  height: 150px;
  bottom: -75px;
  left: 30%;
  animation: float 10s ease-in-out infinite;
}

.login-card {
  flex: 1;
  max-width: 480px;
  margin: auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 48px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;
}

.header-section {
  text-align: center;
  margin-bottom: 40px;
}

.logo-container {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #ff8a65 0%, #ff7043 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(255, 138, 101, 0.4);
}

.logo {
  width: 40px;
  height: 40px;
  filter: brightness(0) invert(1);
}

.title {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 16px;
  color: #6b7280;
}

.login-form {
  margin-bottom: 32px;
}

.form-group {
  position: relative;
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.input-field {
  padding-left: 50px;
  padding-right: 50px;
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}

.password-toggle {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.3s;
}

.password-toggle:hover {
  color: #ff8a65;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  font-size: 14px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #374151;
}

.checkbox-container input {
  margin-right: 8px;
}

.forgot-password {
  color: #ff8a65;
  text-decoration: none;
  font-weight: 500;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  height: 56px;
  font-size: 18px;
  position: relative;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.divider {
  text-align: center;
  margin: 32px 0;
  position: relative;
  color: #9ca3af;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
}

.divider span {
  background: rgba(255, 255, 255, 0.95);
  padding: 0 16px;
  position: relative;
}

.social-login {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
}

.social-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 48px;
}

.footer-links {
  text-align: center;
  font-size: 14px;
  color: #6b7280;
}

.footer-links a {
  color: #ff8a65;
  text-decoration: none;
  margin: 0 8px;
}

.footer-links a:hover {
  text-decoration: underline;
}

.info-panel {
  flex: 1;
  max-width: 600px;
  padding: 80px 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.info-content {
  color: white;
  text-align: center;
}

.info-content h2 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 32px;
  line-height: 1.2;
}

.feature-list {
  list-style: none;
  margin-bottom: 48px;
  text-align: left;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.feature-list li {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-size: 18px;
}

.feature-list li svg {
  margin-right: 12px;
  color: #ffcc80;
}

.illustration {
  margin-top: 40px;
}

.illustration img {
  max-width: 100%;
  height: auto;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .login-container {
    flex-direction: column;
  }
  
  .info-panel {
    order: -1;
    max-width: none;
    padding: 40px 24px;
  }
  
  .info-content h2 {
    font-size: 28px;
  }
  
  .login-card {
    max-width: none;
    margin: 0 24px 24px;
    padding: 32px 24px;
  }
}

@media (max-width: 768px) {
  .social-login {
    flex-direction: column;
  }
  
  .title {
    font-size: 28px;
  }
  
  .feature-list {
    text-align: center;
  }
  
  .form-options {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}
</style>
