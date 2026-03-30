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
        <span class="music-hint" v-if="bgmStatus">{{ bgmStatus }}</span>
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

    <audio
      ref="bgm"
      preload="auto"
      autoplay
      loop
      playsinline
      crossorigin="anonymous"
      :src="bgmSrc"
    />
  </div>
</template>

<script>
import { UAParser } from 'ua-parser-js';
export default {
  name: 'App',
  data() {
    return {
      bgmSrc: '/bgm.mp3',
      bgmFallbackSrc: '/bgm.mp3',
      bgmTriedFallback: false,
      bgmPlaying: false,
      bgmArmed: false,
      bgmStatus: '',
    };
  },
  mounted(){
    this.getDeviceInfoAndLogin();
    this.initBgm();
  },
  beforeUnmount() {
    window.removeEventListener('pointerdown', this.armBgmOnce, { capture: true });
    const el = this.$refs.bgm;
    if (el) {
      el.removeEventListener('error', this.onBgmError);
      el.removeEventListener('canplay', this.onBgmCanPlay);
    }
  },
  methods:{
    onBgmCanPlay() {
      if (!this.bgmPlaying) this.bgmStatus = '已加载，点“播放音乐”开始';
    },
    onBgmError() {
      const el = this.$refs.bgm;
      const code = el && el.error ? el.error.code : 'unknown';
      if (!this.bgmTriedFallback) {
        this.bgmTriedFallback = true;
        this.bgmSrc = this.bgmFallbackSrc;
        this.bgmStatus = '在线音频不可用，切换到本地音乐…';
        this.$nextTick(async () => {
          const audio = this.$refs.bgm;
          if (!audio) return;
          audio.load();
          try {
            await audio.play();
            this.bgmPlaying = true;
            this.bgmStatus = '正在播放（本地音乐）';
          } catch (e) {
            this.bgmPlaying = false;
            this.bgmStatus = '本地音乐未找到：请放置 public/bgm.mp3';
          }
        });
        return;
      }
      this.bgmStatus = `音频加载失败（code=${code}）`;
      this.bgmPlaying = false;
    },
    async initBgm() {
      const el = this.$refs.bgm;
      if (!el) return;
      this.bgmStatus = '正在加载音乐…';
      el.addEventListener('error', this.onBgmError);
      el.addEventListener('canplay', this.onBgmCanPlay);
      el.volume = 0.6;
      try {
        // 先尝试“有声音自动播放”
        el.muted = false;
        await el.play();
        this.bgmPlaying = true;
        this.bgmStatus = '已自动播放';
      } catch (e) {
        // 被拦截时降级为静音自动播放
        try {
          el.muted = true;
          await el.play();
          this.bgmPlaying = true;
          this.bgmStatus = '已自动播放（静音），点一下页面开启声音';
          window.addEventListener('pointerdown', this.armBgmOnce, { capture: true, once: true });
        } catch (e2) {
          this.bgmPlaying = false;
          this.bgmStatus = '浏览器阻止自动播放，点一下页面开始播放';
          window.addEventListener('pointerdown', this.armBgmOnce, { capture: true, once: true });
        }
      }
    },
    async armBgmOnce() {
      if (this.bgmArmed) return;
      this.bgmArmed = true;
      const el = this.$refs.bgm;
      if (!el) return;
      try {
        el.muted = false;
        el.volume = Math.max(el.volume || 0, 0.6);
        await el.play();
        this.bgmPlaying = true;
        this.bgmStatus = '正在播放';
      } catch (e) {
        this.bgmPlaying = false;
        this.bgmStatus = '播放失败（可能是链接不可用/网络拦截）';
      }
    },
    async toggleBgm() {
      const el = this.$refs.bgm;
      if (!el) return;
      if (this.bgmPlaying) {
        el.pause();
        this.bgmPlaying = false;
        this.bgmStatus = '已暂停';
        return;
      }
      try {
        el.muted = false;
        el.volume = Math.max(el.volume || 0, 0.6);
        await el.play();
        this.bgmPlaying = true;
        this.bgmStatus = '正在播放';
      } catch (e) {
        this.bgmPlaying = false;
        this.bgmStatus = '播放失败（请换一个音频链接）';
      }
    },
    async getDeviceInfoAndLogin(){
      // 1. 获取浏览器提供的原始User-Agent字符串
      const ua = navigator.userAgent;
      // 2. 解析详细信息
      const parser = new UAParser(ua);
      const result = parser.getResult();
      
      // 构造要发送给后端的数据
      const deviceInfo = {
        userAgent: ua,
        // 设备型号 (例如: iPhone 15, Pixel 8, Windows PC)
        model: result.device.model || 'Unknown Device',
        // 操作系统名称与版本 (例如: iOS 17.4.1, Windows 11)
        os: `${result.os.name} ${result.os.version}`,
        // 浏览器名称 (例如: Chrome, Safari)
        browser: result.browser.name,
        
        // 引擎版本
        engine: result.engine.name
      };
      // 3. 调用后端Java接口上报
      try {
        await this.$axios.post('/api/device/report', deviceInfo);
        console.log("登录信息上报成功");
      } catch (error) {
        console.error("上报失败:", error);
      }
    }
  }
};
</script>

<style>
  :root{
    --ink-1:#0f1115;
    --ink-2:#1d2230;
    --paper:#f5f1e6;
    --gold-2:#f0d7a0;
    --muted: rgba(245, 241, 230, 0.75);
  }

  html, body {
    height: 100%;
    margin: 0;
  }

  body{
    background:
      radial-gradient(1200px 600px at 20% 10%, rgba(240,215,160,0.18), transparent 60%),
      radial-gradient(900px 500px at 80% 20%, rgba(45,58,90,0.35), transparent 55%),
      linear-gradient(180deg, var(--ink-2) 0%, var(--ink-1) 100%);
    color: var(--paper);
    font-family: ui-serif, "Songti SC", "STSong", "SimSun", serif;
    overflow-x: hidden;
  }

  *{ box-sizing: border-box; }

  .qingming-app{
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .topbar{
    padding: 18px 16px 12px;
    display:flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .brand-title{
    font-size: 22px;
    letter-spacing: 2px;
    font-weight: 800;
  }

  .brand-subtitle{
    margin-top: 4px;
    font-size: 12px;
    color: var(--muted);
    letter-spacing: 1px;
  }

  .top-actions{
    display:flex;
    align-items:center;
    gap: 10px;
  }

  .top-link{
    color: var(--gold-2);
    text-decoration: none;
    border: 1px solid rgba(240,215,160,0.35);
    padding: 10px 12px;
    border-radius: 999px;
    background: rgba(0,0,0,0.12);
    cursor: pointer;
  }

  .music-btn{
    font-family: inherit;
    line-height: 1;
  }

  .music-hint{
    font-size: 11px;
    color: rgba(245,241,230,0.68);
    max-width: 340px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 2px;
  }

  .content{
    flex: 1;
    padding: 10px 14px 80px;
    width: 100%;
    max-width: 980px;
    margin: 0 auto;
  }

  .bottombar{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 10px 10px 14px;
    display:flex;
    gap: 10px;
    justify-content: space-around;
    background: linear-gradient(180deg, rgba(15,17,21,0) 0%, rgba(15,17,21,0.85) 30%, rgba(15,17,21,0.95) 100%);
    backdrop-filter: blur(8px);
  }

  .tab{
    text-decoration: none;
    color: rgba(245,241,230,0.82);
    font-size: 12px;
    padding: 12px 10px;
    border-radius: 14px;
    border: 1px solid rgba(240,215,160,0.18);
    background: rgba(0,0,0,0.10);
    white-space: nowrap;
    flex: 1;
    text-align: center;
  }

  .tab.active{
    color: var(--gold-2);
    border-color: rgba(240,215,160,0.55);
    box-shadow: 0 10px 24px rgba(240,215,160,0.12);
  }

  @media (max-width: 760px){
    .brand-title{ font-size: 20px; }
    .tab{ font-size: 11px; }
    .content{ padding-bottom: 92px; }
  }
</style>
