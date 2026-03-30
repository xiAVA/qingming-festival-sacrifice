<template>
  <div class="page">
    <section class="card head">
      <div class="title">流程时间线</div>
      <div class="sub">照着顺序走一遍，心会更安。</div>
    </section>

    <section class="card timeline">
      <div class="timeline-title">祭拜顺序</div>

      <div class="steps">
        <div class="step" v-for="(s, idx) in steps" :key="s.key">
          <div class="step-dot">
            <span class="step-num">{{ idx + 1 }}</span>
          </div>
          <div class="step-body">
            <div class="step-title">{{ s.title }}</div>
            <div class="step-desc">{{ s.desc }}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="card chant">
      <div class="chant-top">
        <div class="chant-title">随手一段祭词</div>
        <button class="btn tiny" type="button" @click="nextChant">换一句</button>
      </div>
      <div class="chant-text">「{{ currentChant }}」</div>
      <div class="chant-actions">
        <router-link class="btn ghost" to="/tribute">回到敬香献花</router-link>
        <router-link class="btn primary" to="/wishes">继续寄语祈愿</router-link>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'TimelineView',
  data() {
    return {
      steps: [
        { key: 's1', title: '心起清明', desc: '停一停，向所念深深一礼。' },
        { key: 's2', title: '点香入意', desc: '以一缕清烟，寄去你的牵挂。' },
        { key: 's3', title: '献花表礼', desc: '愿花开有声，思念不散。' },
        { key: 's4', title: '寄语祈愿', desc: '写下想说的话，让祝福落地。' },
      ],
      chants: [
        '愿清风拂去尘世的喧嚣，余思长存。',
        '把未说完的牵挂，轻轻放在香烟后面。',
        '愿你在远方安好，愿我在近处守望。',
        '愿一切温柔都能抵达，愿一切安宁都能相随。',
      ],
      chantIndex: 0,
    };
  },
  computed: {
    currentChant() {
      return this.chants[this.chantIndex] || '';
    },
  },
  methods: {
    nextChant() {
      this.chantIndex = (this.chantIndex + 1) % this.chants.length;
    },
  },
};
</script>

<style scoped>
  .page{
    display:flex;
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

  .timeline-title, .chant-title{
    font-weight: 900;
    letter-spacing: 1px;
    margin-bottom: 12px;
  }

  .steps{
    display:flex;
    flex-direction: column;
    gap: 12px;
  }

  .step{
    display:flex;
    gap: 12px;
    align-items: flex-start;
    padding: 12px 12px;
    border-radius: 16px;
    border: 1px solid rgba(240,215,160,0.14);
    background: rgba(0,0,0,0.14);
  }

  .step-dot{
    width: 44px;
    height: 44px;
    border-radius: 14px;
    border: 1px solid rgba(240,215,160,0.22);
    background: rgba(0,0,0,0.14);
    display:flex;
    align-items:center;
    justify-content:center;
    flex: 0 0 auto;
  }

  .step-num{
    color: #f0d7a0;
    font-weight: 900;
  }

  .step-title{
    font-weight: 900;
    letter-spacing: 1px;
    margin-bottom: 6px;
  }

  .step-desc{
    color: rgba(245,241,230,0.8);
    font-size: 12px;
    line-height: 1.6;
  }

  .chant-top{
    display:flex;
    align-items:center;
    justify-content: space-between;
    gap: 12px;
  }

  .btn{
    text-decoration:none;
    border-radius: 14px;
    padding: 12px 14px;
    border: 1px solid rgba(240,215,160,0.28);
    background: rgba(0,0,0,0.12);
    color: rgba(245,241,230,0.9);
    font-weight: 800;
    letter-spacing: 1px;
    cursor: pointer;
  }

  .btn.tiny{
    padding: 10px 12px;
    font-size: 12px;
  }

  .btn.primary{
    background: linear-gradient(180deg, rgba(240,215,160,0.22), rgba(240,215,160,0.10));
    color: #f0d7a0;
  }

  .btn.ghost{
    background: rgba(0,0,0,0.10);
  }

  .chant-text{
    margin-top: 10px;
    font-size: 14px;
    color: rgba(245,241,230,0.92);
    line-height: 1.8;
    padding: 14px 12px;
    border-radius: 16px;
    border: 1px solid rgba(240,215,160,0.14);
    background: rgba(0,0,0,0.14);
  }

  .chant-actions{
    display:flex;
    gap: 10px;
    margin-top: 12px;
    flex-wrap: wrap;
  }

  @media (max-width: 760px){
    .head{
      flex-direction: column;
      align-items:flex-start;
    }
    .chant-actions .btn{ flex: 1; }
  }
</style>

