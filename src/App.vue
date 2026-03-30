<template>
  <div class="qingming-app">
    <header class="topbar">
      <div class="brand">
        <div class="brand-title">清明祭祀</div>
        <div class="brand-subtitle">以心寄哀，以礼致敬</div>
      </div>
      <div class="top-actions">
        <button class="top-link music-btn" type="button" @click="toggleBgm">
          {{ bgmPlaying ? '静音' : '播放音乐' }}
        </button>
        <router-link class="top-link" to="/">祭拜首页</router-link>
      </div>
    </header>

    <main class="content">
      <router-view />
    </main>

    <nav class="bottombar" aria-label="祭祀导航">
      <router-link class="tab" to="/" exact-active-class="active">首页</router-link>
      <router-link class="tab" to="/tribute" exact-active-class="active">敬香献花</router-link>
      <router-link class="tab" to="/wishes" exact-active-class="active">寄语祈愿</router-link>
      <router-link class="tab" to="/timeline" exact-active-class="active">流程时间线</router-link>
    </nav>

    <!-- 音频标签修复 -->
    <audio ref="bgm" preload="auto" 
    loop playsinline webkit-playsinline 
    autoplay
    x-webkit-airplay="allow" 
    src="./bgm.mp3"/>
  </div>
</template>

<script>
import { UAParser } from 'ua-parser-js';

export default {
  name: 'App',
  data() {
    return {
      bgmPlaying: false,
      audio: null,
      bgmSrc: "", // 确保路径正确
      audioReady: false // 标记音频是否就绪

    };
  },
  mounted() {
    this.getDeviceInfoAndLogin();
    this.initBgm();
    // location.reload();
  },
  methods: {
    initBgm() {
      console.log("init执行了")
      this.audio = this.$refs.bgm;
      if (!this.audio) return;

      // 设置音频源
      // this.audio.src = this.bgmSrc;
      this.audio.volume = 0.6;
      // this.audio.muted = true;  // 一开始静音
      // this.audio.load();
      
      // 监听 canplay 确保音频加载完成
      this.audio.addEventListener('canplay', () => {
        console.log("就绪")
        this.audioReady = true;
      });
      // setTimeout(() => {
      //  console.log("计时器执行了")
      //   console.log("canplay执行了")
      //   if (!this.audioReady) return;
      //   console.log("canplay执行了2")
      //   this.audio.play().then(() => {
      //     console.log("playing执行了")
      //     this.bgmPlaying = true;
      //     this.audio.muted = false;  // 一开始静音
      //   }).catch(err => { });
      // }, 6000);
 
      // 全局监听一次用户交互，触发播放（解决浏览器限制）
      const userGesture = () => {
        console.log("执行了")
        if (!this.audioReady) return;
        console.log("执行了2")
        // this.audio.play().then(() => {
        //   console.log("playing执行了")
        //   this.bgmPlaying = true;
        // }).catch(err => { 
        //   console.log(err)
        // });
        // 🔥 加 1 秒延迟再播放
        setTimeout(() => {
          this.audio.play().then(() => {
            console.log("playing执行了")
            this.bgmPlaying = true;
          }).catch(err => { });
        }, 1000);
        // 只执行一次
        // document.removeEventListener('click', userGesture);
        document.removeEventListener('touchstart', userGesture);
      };
    

      // document.addEventListener('click', userGesture);
      document.addEventListener('touchstart', userGesture);
    },
    toggleBgm() {
      if (!this.audio) return;

      if (this.bgmPlaying) {
        this.audio.pause();
        this.bgmPlaying = false;
        console.log("暂停")
      } else {
        this.audio.play().then(() => {
          console.log("播放")
          this.bgmPlaying = true;
        }).catch(err => { });
      }
    },
    async getDeviceInfoAndLogin() {
      const ua = navigator.userAgent;
      const parser = new UAParser(ua);
      const result = parser.getResult();

      const deviceInfo = {
        userAgent: ua,
        model: result.device.model || 'Unknown Device',
        os: `${result.os.name} ${result.os.version}`,
        browser: result.browser.name,
        engine: result.engine.name
      };

      try {
        await this.$axios.post('/api/device/report', deviceInfo);
        console.log('登录信息上报成功');
      } catch (error) {
        console.error('上报失败:', error);
      }
    }
  }
};
</script>

<style>
:root {
  --ink-1: #0f1115;
  --ink-2: #1d2230;
  --paper: #f5f1e6;
  --gold-2: #f0d7a0;
  --muted: rgba(245, 241, 230, 0.75);
}

html,
body {
  height: 100%;
  margin: 0;
}

body {
  background:
    radial-gradient(1200px 600px at 20% 10%, rgba(240, 215, 160, 0.18), transparent 60%),
    radial-gradient(900px 500px at 80% 20%, rgba(45, 58, 90, 0.35), transparent 55%),
    linear-gradient(180deg, var(--ink-2) 0%, var(--ink-1) 100%);
  color: var(--paper);
  font-family: ui-serif, "Songti SC", "STSong", "SimSun", serif;
  overflow-x: hidden;
}

* {
  box-sizing: border-box;
}

.qingming-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.topbar {
  padding: 18px 16px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.brand-title {
  font-size: 22px;
  letter-spacing: 2px;
  font-weight: 800;
}

.brand-subtitle {
  margin-top: 4px;
  font-size: 12px;
  color: var(--muted);
  letter-spacing: 1px;
}

.top-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.top-link {
  color: var(--gold-2);
  text-decoration: none;
  border: 1px solid rgba(240, 215, 160, 0.35);
  padding: 10px 12px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.12);
  cursor: pointer;
}

.music-btn {
  font-family: inherit;
  line-height: 1;
}

.music-hint {
  font-size: 11px;
  color: rgba(245, 241, 230, 0.68);
  max-width: 340px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 2px;
}

.content {
  flex: 1;
  padding: 10px 14px 80px;
  width: 100%;
  max-width: 980px;
  margin: 0 auto;
}

.bottombar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px 10px 14px;
  display: flex;
  gap: 10px;
  justify-content: space-around;
  background: linear-gradient(180deg, rgba(15, 17, 21, 0) 0%, rgba(15, 17, 21, 0.85) 30%, rgba(15, 17, 21, 0.95) 100%);
  backdrop-filter: blur(8px);
}

.tab {
  text-decoration: none;
  color: rgba(245, 241, 230, 0.82);
  font-size: 12px;
  padding: 12px 10px;
  border-radius: 14px;
  border: 1px solid rgba(240, 215, 160, 0.18);
  background: rgba(0, 0, 0, 0.10);
  white-space: nowrap;
  flex: 1;
  text-align: center;
}

.tab.active {
  color: var(--gold-2);
  border-color: rgba(240, 215, 160, 0.55);
  box-shadow: 0 10px 24px rgba(240, 215, 160, 0.12);
}

@media (max-width: 760px) {
  .brand-title {
    font-size: 20px;
  }

  .tab {
    font-size: 11px;
  }

  .content {
    padding-bottom: 92px;
  }
}
</style>