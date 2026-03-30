<template>
  <div class="page">
    <section class="card head">
      <div class="title">敬香献花</div>
      <div class="sub">点击按钮模拟祭拜动作（不做任何数据持久化）。</div>
    </section>

    <section class="card grid2">
      <div class="panel">
        <div class="panel-title">点香</div>
        <div class="panel-desc">一缕清香，敬奉思念。</div>

        <div class="stats">
          <div class="stat">
            <div class="stat-label">点香次数</div>
            <div class="stat-value">{{ incenseCount }}</div>
          </div>
        </div>

        <div class="actions">
          <button class="btn primary" type="button" @click="onIncense">
            点燃清香
          </button>
          <button class="btn ghost" type="button" @click="resetAll">
            重来
          </button>
        </div>
      </div>

      <div class="panel">
        <div class="panel-title">献花</div>
        <div class="panel-desc">以花为礼，愿你安好。</div>

        <div class="stats">
          <div class="stat">
            <div class="stat-label">献花次数</div>
            <div class="stat-value">{{ flowerCount }}</div>
          </div>
        </div>

        <div class="actions">
          <button class="btn primary" type="button" @click="onFlower">
            献上一束花
          </button>
          <div class="minor">
            <span>小提示：</span>
            <span class="minor-emph">香与花越多，祈愿越浓。</span>
          </div>
        </div>
      </div>
    </section>

    <section class="card altar">
      <div class="altar-title">祭坛回响</div>
      <div class="altar-sub">
        <span>当前敬拜总计：</span>
        <span class="gold">{{ totalCount }}</span>
        <span>次</span>
        <span class="sep-dot">·</span>
        <span>仪式阶段：</span>
        <span class="gold">{{ ritualLevelText }}</span>
      </div>
      <div class="ritual-progress">
        <div class="ritual-progress-inner" :style="{ width: ritualProgress + '%' }"></div>
      </div>
      <div class="feedback" v-if="feedbackText">{{ feedbackText }}</div>

      <div class="altar-stage">
      <div class="altar-items">
      <div class="char">香炉</div>
      <div class="char">花盏</div>
      <div class="char small">愿</div>
      </div>

      <div class="incense-row" v-if="incenseBurstCount === 1">
        <span
          v-for="n in 1"
          :key="'incense-' + n"
          class="incense"
        >
          🕯
        </span>
      </div>

      <div class="flower-row" v-if="flowerBurstCount > 0" :key="'flower-burst-' + flowerBurstToken">
        <span
          v-for="n in flowerBurstCount"
          :key="'flower-' + n"
          class="flower"
        >
          🌸
        </span>
      </div>

        <div class="wish-line" v-if="wishPreset">
          当前心愿：<span class="gold">{{ wishPreset }}</span>
        </div>
      </div>

      <div class="altar-footer">
        <div class="field">
          <label class="label">选择一个心愿（可选）</label>
          <select class="select" v-model="wishPreset">
            <option :value="''">不选择</option>
            <option value="平安顺遂">平安顺遂</option>
            <option value="家人安康">家人安康</option>
            <option value="学业有成">学业有成</option>
            <option value="事业顺利">事业顺利</option>
            <option value="愿你在天安好">愿你在天安好</option>
          </select>
        </div>

        <router-link class="btn ghost wide" to="/wishes">继续寄语祈愿</router-link>
      </div>
      <div class="recent-actions" v-if="recentActions.length">
        <div class="recent-title">最近回响</div>
        <div class="recent-item" v-for="a in recentActions" :key="a.id">{{ a.text }}</div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'TributeView',
  data() {
    return {
      incenseCount: 0,
      flowerCount: 0,
      flowerBurstCount: 0,
      flowerBurstToken: 0,
      incenseBurstCount: 0,
      wishPreset: '',
      smokeVisible: false,
      smokeToken: 0,
      smokeTimer: null,
      incenseTimer: null,
      flowerTimer: null,
      feedbackText: '',
      feedbackTimer: null,
      recentActions: [],
    };
  },
  computed: {
    totalCount() {
      return this.incenseCount + this.flowerCount;
    },
    ritualLevelText() {
      if (this.totalCount >= 12) return '圆满';
      if (this.totalCount >= 6) return '渐入';
      if (this.totalCount >= 1) return '启心';
      return '未启';
    },
    ritualProgress() {
      return Math.min(100, Math.floor((this.totalCount / 12) * 100));
    },
  },
  beforeUnmount() {
    if (this.smokeTimer) clearTimeout(this.smokeTimer);
    if (this.incenseTimer) clearTimeout(this.incenseTimer);
    if (this.flowerTimer) clearTimeout(this.flowerTimer);
    if (this.feedbackTimer) clearTimeout(this.feedbackTimer);
  },
  methods: {
    pushAction(text) {
      this.recentActions.unshift({ id: `${Date.now()}-${Math.random()}`, text });
      if (this.recentActions.length > 4) this.recentActions.pop();
    },
    showFeedback(text) {
      if (this.feedbackTimer) clearTimeout(this.feedbackTimer);
      this.feedbackText = text;
      this.feedbackTimer = setTimeout(() => {
        this.feedbackText = '';
      }, 900);
    },
    onIncense() {
      this.incenseCount += 1;
      this.incenseBurstCount = 1;
      this.showFeedback('清香已敬上');
      this.pushAction('点燃一炷清香');
      if (this.incenseTimer) clearTimeout(this.incenseTimer);
      this.incenseTimer = setTimeout(() => {
        this.incenseBurstCount = 0;
      }, 500);
    },
    onFlower() {
      this.flowerCount += 1;
      this.flowerBurstToken += 1;
      this.flowerBurstCount = 3;
      this.showFeedback('花束已献上');
      this.pushAction('献上一束鲜花');
      if (this.flowerTimer) clearTimeout(this.flowerTimer);
      this.flowerTimer = setTimeout(() => {
        this.flowerBurstCount = 0;
      }, 500);
    },
    resetAll() {
      this.incenseCount = 0;
      this.flowerCount = 0;
      this.flowerBurstCount = 0;
      this.incenseBurstCount = 0;
      this.wishPreset = '';
      this.smokeVisible = false;
      this.feedbackText = '';
      this.recentActions = [];
      if (this.smokeTimer) clearTimeout(this.smokeTimer);
      if (this.incenseTimer) clearTimeout(this.incenseTimer);
      if (this.flowerTimer) clearTimeout(this.flowerTimer);
      if (this.feedbackTimer) clearTimeout(this.feedbackTimer);
    },
  },
};
</script>

<style scoped>
  .page{
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .card{
    background:
      radial-gradient(900px 260px at 20% 0%, rgba(240,215,160,0.16), transparent 60%),
      linear-gradient(180deg, rgba(245,241,230,0.06), rgba(245,241,230,0.03));
    border: 1px solid rgba(240,215,160,0.18);
    border-radius: 18px;
    padding: 16px;
    box-shadow: 0 18px 44px rgba(0,0,0,0.25);
    position: relative;
    overflow: hidden;
  }

  .head{
    display:flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
  }
  .title{
    font-size: 18px;
    font-weight: 900;
    letter-spacing: 1px;
  }
  .sub{
    color: rgba(245,241,230,0.7);
    font-size: 12px;
  }

  .grid2{
    display:grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .panel{
    border-radius: 16px;
    background: rgba(0,0,0,0.14);
    border: 1px solid rgba(240,215,160,0.14);
    padding: 14px 12px;
  }

  .panel-title{
    font-weight: 900;
    letter-spacing: 1px;
    font-size: 14px;
    margin-bottom: 6px;
  }

  .panel-desc{
    color: rgba(245,241,230,0.8);
    font-size: 12px;
    margin-bottom: 14px;
    line-height: 1.5;
  }

  .stats{
    margin-bottom: 14px;
  }

  .stat{
    display:flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 10px;
  }

  .stat-label{
    color: rgba(245,241,230,0.7);
    font-size: 12px;
  }

  .stat-value{
    font-size: 28px;
    font-weight: 900;
    color: #f0d7a0;
    letter-spacing: 1px;
  }

  .actions{
    display:flex;
    flex-direction: column;
    gap: 10px;
  }

  .btn{
    border-radius: 14px;
    padding: 12px 14px;
    border: 1px solid rgba(240,215,160,0.28);
    background: rgba(0,0,0,0.12);
    color: rgba(245,241,230,0.9);
    font-weight: 800;
    letter-spacing: 1px;
    cursor: pointer;
  }

  .btn.wide{
    width: 100%;
    display:flex;
    justify-content:center;
  }

  .btn.primary{
    background: linear-gradient(180deg, rgba(240,215,160,0.22), rgba(240,215,160,0.10));
    color: #f0d7a0;
  }

  .btn.ghost{
    background: rgba(0,0,0,0.10);
  }

  .minor{
    font-size: 12px;
    color: rgba(245,241,230,0.7);
    line-height: 1.5;
  }
  .minor-emph{
    color: rgba(240,215,160,0.95);
    font-weight: 800;
  }

  .altar{
    display:flex;
    flex-direction: column;
    gap: 12px;
  }

  .altar-title{
    font-weight: 900;
    letter-spacing: 1px;
  }

  .altar-sub{
    color: rgba(245,241,230,0.75);
    font-size: 12px;
  }
  .sep-dot{
    margin: 0 6px;
    color: rgba(245,241,230,0.45);
  }
  .ritual-progress{
    margin-top: 10px;
    height: 8px;
    border-radius: 999px;
    background: rgba(0,0,0,0.28);
    border: 1px solid rgba(240,215,160,0.14);
    overflow: hidden;
  }
  .ritual-progress-inner{
    height: 100%;
    background: linear-gradient(90deg, rgba(240,215,160,0.35), rgba(240,215,160,0.9));
    transition: width 220ms ease;
  }
  .feedback{
    margin-top: 10px;
    color: #f0d7a0;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 1px;
  }

  .gold{ color: #f0d7a0; font-weight: 900; }

  .altar-stage{
    border-radius: 16px;
    padding: 18px 14px;
    border: 1px solid rgba(240,215,160,0.14);
    background:
      repeating-linear-gradient(90deg, rgba(245,241,230,0.05) 0, rgba(245,241,230,0.05) 1px, transparent 1px, transparent 12px),
      rgba(0,0,0,0.12);
    position: relative;
    overflow: hidden;
    min-height: 140px;
  }

  .incense-row{
    display:flex;
    justify-content:center;
    gap: 6px;
    font-size: 22px;
    filter: drop-shadow(0 0 6px rgba(240,215,160,0.55));
    position: absolute;
    left: 50%;
    top: 56%;
    transform: translate(-50%, -50%);
    z-index: 2;
    pointer-events: none;
  }

  .incense{
    transform-origin: bottom center;
    animation: flower-pop 260ms ease-out;
  }

  .flower-row{
    display:flex;
    justify-content:center;
    gap: 6px;
    font-size: 22px;
    filter: drop-shadow(0 0 6px rgba(240,215,160,0.45));
    position: absolute;
    left: 50%;
    top: 56%;
    transform: translate(-50%, -50%);
    z-index: 2;
    pointer-events: none;
  }

  .flower{
    transform-origin: bottom center;
    animation: flower-pop 260ms ease-out;
  }

  .flower-row .flower:nth-child(2){ animation-delay: 80ms; }
  .flower-row .flower:nth-child(3){ animation-delay: 160ms; }

  @keyframes flower-pop{
    0%{ transform: translateY(10px) scale(0.4); opacity: 0; }
    60%{ transform: translateY(-6px) scale(1.06); opacity: 1; }
    100%{ transform: translateY(-10px) scale(1); opacity: 0.92; }
  }

  .altar-stage:after{
    content:"";
    position:absolute;
    right:-40px;
    top:-50px;
    width: 220px;
    height: 220px;
    background: radial-gradient(circle at 30% 30%, rgba(240,215,160,0.18), transparent 55%);
    filter: blur(2px);
    pointer-events:none;
  }

  .smoke-wrap{
    position:absolute;
    left: 50%;
    top: 46%;
    transform: translate(-50%, -50%);
    width: 240px;
    height: 160px;
    pointer-events:none;
  }

  .smoke{
    position:absolute;
    bottom: 20px;
    left: 50%;
    width: 120px;
    height: 46px;
    border-radius: 999px;
    background: rgba(245,241,230,0.14);
    filter: blur(1px);
    opacity: 0;
    transform: translateX(-50%) scale(0.7);
    animation: rise 1.6s ease-out forwards;
  }

  .smoke.s1{ animation-delay: 0ms; background: rgba(245,241,230,0.14); }
  .smoke.s2{ animation-delay: 120ms; width: 140px; height: 52px; background: rgba(240,215,160,0.12); }
  .smoke.s3{ animation-delay: 240ms; width: 110px; height: 40px; background: rgba(45,58,90,0.16); }

  @keyframes rise{
    0%{ opacity: 0; transform: translateX(-50%) translateY(12px) scale(0.6); }
    10%{ opacity: 0.8; }
    60%{ opacity: 0.45; }
    100%{ opacity: 0; transform: translateX(calc(-50% + 18px)) translateY(-70px) scale(1.15); }
  }

  .altar-items{
    display:flex;
    align-items:center;
    justify-content: space-around;
    position: relative;
    z-index: 1;
    margin-top: 8px;
  }

  .char{
    width: 96px;
    height: 66px;
    border-radius: 16px;
    display:flex;
    align-items:center;
    justify-content:center;
    background: rgba(0,0,0,0.16);
    border: 1px solid rgba(240,215,160,0.14);
    color: rgba(245,241,230,0.9);
    font-weight: 900;
    letter-spacing: 2px;
  }
  .char.small{
    width: 54px;
    color: #f0d7a0;
    letter-spacing: 3px;
  }

  .wish-line{
    position: absolute;
    left: 14px;
    bottom: 12px;
    color: rgba(245,241,230,0.8);
    font-size: 12px;
    z-index: 1;
  }

  .altar-footer{
    display:flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }
  .recent-actions{
    margin-top: 10px;
    border-top: 1px dashed rgba(240,215,160,0.2);
    padding-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .recent-title{
    font-size: 12px;
    color: rgba(245,241,230,0.72);
  }
  .recent-item{
    font-size: 12px;
    color: rgba(245,241,230,0.88);
  }

  .field{
    display:flex;
    flex-direction: column;
    gap: 8px;
    min-width: 260px;
    flex: 1;
  }

  .label{
    color: rgba(245,241,230,0.75);
    font-size: 12px;
    letter-spacing: 1px;
  }

  .select{
    height: 42px;
    border-radius: 14px;
    padding: 0 12px;
    background: rgba(0,0,0,0.18);
    color: rgba(245,241,230,0.95);
    border: 1px solid rgba(240,215,160,0.24);
    outline: none;
    font-weight: 700;
  }

  @media (max-width: 760px){
    .grid2{ grid-template-columns: 1fr; }
    .head{
      flex-direction: column;
      align-items:flex-start;
    }
    .altar-items{ gap: 10px; }
    .char{ width: 86px; }
    .char.small{ width: 48px; }
  }
</style>

