<template>
  <div class="page">
    <section class="card hero">
      <div class="hero-title">清明·祭拜</div>
      <div class="hero-quote">
        {{ currentQuote }}
      </div>

      <div class="countdown">
        <div class="countdown-label">距离清明还有</div>
        <div class="countdown-value">
          <span class="num">{{ countdown.days }}</span>
          <span class="unit">天</span>
          <span class="sep">·</span>
          <span class="num">{{ countdown.hours }}</span>
          <span class="unit">时</span>
          <span class="sep">·</span>
          <span class="num">{{ countdown.minutes }}</span>
          <span class="unit">分</span>
          <span class="sep">·</span>
          <span class="num">{{ countdown.seconds }}</span>
          <span class="unit">秒</span>
        </div>
        <div class="countdown-hint">提示：这里按“4月4日”计算，供展示使用。</div>
      </div>

      <div class="hero-actions">
        <router-link class="btn primary" to="/tribute">开始祭拜</router-link>
        <router-link class="btn ghost" to="/timeline">查看流程</router-link>
        <button class="btn ghost" type="button" @click="nextQuote">换一句祭语</button>
      </div>
      <div class="bless-line">
        <button class="bless-btn" type="button" @click="giveBlessing">点此献上祈愿</button>
        <span class="bless-count">已祈愿 {{ blessingCount }} 次</span>
      </div>
    </section>

    <section class="card grid">
      <div class="grid-item">
        <div class="grid-item-title">点香</div>
        <div class="grid-item-desc">以一缕清烟，传递心意。</div>
        <router-link class="link" to="/tribute">进入敬香献花</router-link>
      </div>
      <div class="grid-item">
        <div class="grid-item-title">献花</div>
        <div class="grid-item-desc">以花为礼，愿思念不散。</div>
        <router-link class="link" to="/tribute">一同献花</router-link>
      </div>
      <div class="grid-item">
        <div class="grid-item-title">寄语</div>
        <div class="grid-item-desc">写下想对你说的话。</div>
        <router-link class="link" to="/wishes">前往寄语祈愿</router-link>
      </div>
    </section>
    <section class="card status">
      <div class="status-title">今日仪式建议</div>
      <div class="status-desc">先点香，再献花，最后寄语，完整走一遍更有仪式感。</div>
      <div class="status-tags">
        <span class="tag">静心 10 秒</span>
        <span class="tag">敬香 1 次</span>
        <span class="tag">献花 1 束</span>
        <span class="tag">寄语 1 句</span>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'QingmingHome',
  data() {
    return {
      targetTs: 0,
      nowTs: Date.now(),
      timerId: null,
      quoteIndex: 0,
      blessingCount: 0,
      quotes: [
        '轻烟起处，敬意长存。',
        '春风拂纸，念想如初。',
        '花开一季，思念常在。',
        '愿你安好，愿我心安。',
      ],
    };
  },
  computed: {
    countdown() {
      const diff = Math.max(0, this.targetTs - this.nowTs);
      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      return { days, hours, minutes, seconds };
    },
    currentQuote() {
      return this.quotes[this.quoteIndex] || '';
    },
  },
  mounted() {
    this.setTarget();
    this.timerId = setInterval(() => {
      this.nowTs = Date.now();
    }, 1000);
  },
  beforeUnmount() {
    if (this.timerId) clearInterval(this.timerId);
  },
  methods: {
    nextQuote() {
      this.quoteIndex = (this.quoteIndex + 1) % this.quotes.length;
    },
    giveBlessing() {
      this.blessingCount += 1;
    },
    setTarget() {
      const now = new Date();
      const year = now.getFullYear();
      const target = new Date(year, 3, 4, 0, 0, 0, 0); // month: 3 => April
      if (now.getTime() > target.getTime()) target.setFullYear(year + 1);
      this.targetTs = target.getTime();
    },
  },
};
</script>

<style scoped>
  .page{
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .card{
    background:
      radial-gradient(800px 240px at 20% 0%, rgba(240,215,160,0.16), transparent 60%),
      linear-gradient(180deg, rgba(245,241,230,0.06), rgba(245,241,230,0.03));
    border: 1px solid rgba(240,215,160,0.18);
    border-radius: 18px;
    padding: 16px;
    box-shadow: 0 18px 44px rgba(0,0,0,0.25);
    position: relative;
    overflow: hidden;
  }

  .card:before{
    content:"";
    position:absolute;
    inset:-60px -40px auto -40px;
    height: 120px;
    background: radial-gradient(circle at 20% 30%, rgba(240,215,160,0.18), transparent 60%);
    filter: blur(2px);
    pointer-events:none;
  }

  .hero{
    padding: 22px 18px;
  }

  .hero-title{
    font-size: 20px;
    font-weight: 800;
    letter-spacing: 2px;
    margin-bottom: 8px;
  }

  .hero-quote{
    color: rgba(245,241,230,0.9);
    font-size: 13px;
    margin-bottom: 14px;
  }

  .countdown{
    border-radius: 14px;
    padding: 14px 12px;
    border: 1px solid rgba(240,215,160,0.2);
    background: rgba(0,0,0,0.16);
  }

  .countdown-label{
    color: var(--muted);
    font-size: 12px;
    margin-bottom: 8px;
  }

  .countdown-value{
    display:flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 6px 10px;
    font-weight: 800;
    letter-spacing: 1px;
  }

  .num{
    font-size: 24px;
    color: var(--gold-2);
  }
  .unit{
    font-size: 12px;
    color: rgba(245,241,230,0.85);
    margin-right: 4px;
  }
  .sep{
    color: rgba(245,241,230,0.35);
  }

  .countdown-hint{
    margin-top: 10px;
    color: rgba(245,241,230,0.65);
    font-size: 11px;
  }

  .hero-actions{
    margin-top: 16px;
    display:flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .bless-line{
    margin-top: 12px;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  .bless-btn{
    border-radius: 999px;
    border: 1px solid rgba(240,215,160,0.28);
    padding: 8px 12px;
    background: rgba(0,0,0,0.14);
    color: rgba(245,241,230,0.92);
    cursor: pointer;
  }
  .bless-count{
    font-size: 12px;
    color: rgba(245,241,230,0.75);
  }

  .btn{
    text-decoration: none;
    display:inline-flex;
    align-items:center;
    justify-content:center;
    padding: 12px 14px;
    border-radius: 14px;
    font-weight: 700;
    letter-spacing: 1px;
    border: 1px solid rgba(240,215,160,0.28);
  }

  .primary{
    background: linear-gradient(180deg, rgba(240,215,160,0.22), rgba(240,215,160,0.10));
    color: var(--gold-2);
  }

  .ghost{
    color: rgba(245,241,230,0.85);
    background: rgba(0,0,0,0.12);
  }

  .grid{
    display:grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }

  .grid-item{
    border-radius: 16px;
    padding: 14px 12px;
    background: rgba(0,0,0,0.14);
    border: 1px solid rgba(240,215,160,0.14);
  }

  .grid-item-title{
    font-weight: 900;
    letter-spacing: 1px;
    margin-bottom: 6px;
  }

  .grid-item-desc{
    color: rgba(245,241,230,0.8);
    font-size: 12px;
    margin-bottom: 12px;
    line-height: 1.5;
  }

  .link{
    color: var(--gold-2);
    text-decoration: none;
    font-weight: 700;
    font-size: 12px;
  }
  .status-title{
    font-weight: 900;
    margin-bottom: 8px;
  }
  .status-desc{
    font-size: 12px;
    color: rgba(245,241,230,0.8);
    line-height: 1.6;
  }
  .status-tags{
    margin-top: 10px;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .tag{
    font-size: 11px;
    color: #f0d7a0;
    border: 1px solid rgba(240,215,160,0.3);
    border-radius: 999px;
    padding: 4px 8px;
    background: rgba(0,0,0,0.14);
  }

  @media (max-width: 860px){
    .grid{ grid-template-columns: 1fr; }
  }
</style>

