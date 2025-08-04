import { useState } from 'react'
import styles from './doubao.module.css'
import { useNavigate } from 'react-router-dom'

const DouBao = () => {
  const navigate = useNavigate()
  const [inputText, setInputText] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const maxLength = 500

  const handleTextChange = (e) => {
    const text = e.target.value
    if (text.length <= maxLength) {
      setInputText(text)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = () => {
    if (inputText.trim()) {
      console.log('开始生成图片:', inputText)
      // 这里添加生成图片的逻辑
    }
  }

  return (
    <div className={styles.container}>
      {/* 头部 */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className={styles.title}>AI 生图</h1>
      </div>

      {/* 内容区域 */}
      <div className={styles.content}>
        {/* 文本输入区域 */}
        <div className={styles.inputSection}>
          <textarea
            className={styles.textInput}
            placeholder="请输入图片描述，例如：一只可爱的卡通猫咪，戴着帽子，卡通风格上色书"
            value={inputText}
            onChange={handleTextChange}
            maxLength={maxLength}
          />
          <div className={styles.charCounter}>
            {inputText.length}/{maxLength}
          </div>
        </div>

        {/* 参考图片上传区域 */}
        <div className={styles.uploadSection}>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageUpload}
            className={styles.fileInput}
          />
          <label htmlFor="imageUpload" className={styles.uploadArea}>
            {selectedImage ? (
              <img src={selectedImage} alt="参考图片" className={styles.previewImage} />
            ) : (
              <div className={styles.uploadPlaceholder}>
                <div className={styles.uploadIcon}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2" />
                    <polyline points="21,15 16,10 5,21" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
                <p className={styles.uploadText}>添加参考图（可选）</p>
              </div>
            )}
          </label>
        </div>

        {/* 底部工具栏 */}
        <div className={styles.toolbar}>
          <div className={styles.toolItem}>
            <div className={styles.toolIcon}>😊</div>
            <span className={styles.toolLabel}>Emoji</span>
          </div>
          <div className={styles.toolItem}>
            <div className={styles.toolIcon}>🎯</div>
            <span className={styles.toolLabel}>变成高手</span>
          </div>
          <div className={styles.toolItem}>
            <div className={styles.toolIcon}>🎨</div>
            <span className={styles.toolLabel}>描画</span>
          </div>
          <div className={styles.toolItem}>
            <div className={styles.toolIcon}>👤</div>
            <span className={styles.toolLabel}>卡通</span>
          </div>
          <div className={styles.toolItem}>
            <div className={styles.toolIcon}>💬</div>
            <span className={styles.toolLabel}>像素</span>
          </div>
        </div>

        {/* 生成按钮 */}
        <button
          className={styles.generateBtn}
          onClick={handleGenerate}
          disabled={!inputText.trim()}
        >
          开始生成
        </button>
      </div>
    </div>
  )
}

export default DouBao