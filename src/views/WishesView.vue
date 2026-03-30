<template>
  <div class="page">
    <section class="card head">
      <div class="title">寄语祈愿</div>
      <div class="sub">写下你想说的话，向心中所念致意。</div>
    </section>

    <section class="card form">
      <div class="quick-templates">
        <button
          v-for="t in templates"
          :key="t"
          class="chip"
          type="button"
          @click="useTemplate(t)"
        >
          {{ t }}
        </button>
      </div>
      <div class="field">
        <label class="label">落款（可选）</label>
        <input
          class="input"
          v-model.trim="fromName"
          maxlength="12"
          placeholder="如：子女 / 家人 / 某某"
        />
      </div>

      <div class="field">
        <label class="label">寄语内容</label>
        <textarea
          class="textarea"
          v-model.trim="content"
          maxlength="160"
          placeholder="例如：愿你在天安好，清明再祭。"
        />
        <div class="counter">{{ content.length }}/160</div>
      </div>

      <div class="actions">
        <button class="btn primary" type="button" @click="submitWish">
          敬礼寄语
        </button>
        <button class="btn ghost" type="button" @click="clearAll">
          清空本页
        </button>
      </div>

      <div class="tip">
        温柔的一句话，已经足够。也可以点上方模板快速填充。
      </div>
    </section>

    <section class="card list">
      <div class="list-title">本次寄语</div>

      <div v-if="wishes.length === 0" class="empty">
        还没有寄语。写下你的心愿吧。
      </div>

      <div class="wish-item" v-for="w in wishes" :key="w.id">
        <div class="wish-meta">
          <span class="who">{{ w.from || '匿名' }}</span>
          <span class="time">{{ formatTime(w.ts) }}</span>
        </div>
        <div class="wish-text">{{ w.text }}</div>
        <button class="like-btn" type="button" @click="toggleLike(w.id)">
          {{ likedMap[w.id] ? '已点亮心灯' : '点亮心灯' }}
        </button>
      </div>
    </section>
  </div>
</template>

<script>
function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default {
  name: 'WishesView',
  data() {
    return {
      fromName: '',
      content: '',
      wishes: [],
      likedMap: {},
      templates: [
        '愿你在天安好，愿家人平安顺遂。',
        '清明时节念故人，愿思念有归处。',
        '山河无恙，愿你长眠安宁。',
      ],
    };
  },
  methods: {
    useTemplate(text) {
      this.content = text;
    },
    submitWish() {
      const text = this.content.trim();
      if (!text) return;
      this.wishes.unshift({
        id: uid(),
        from: this.fromName.trim(),
        text,
        ts: Date.now(),
      });
      this.content = '';
    },
    toggleLike(id) {
      this.likedMap = {
        ...this.likedMap,
        [id]: !this.likedMap[id],
      };
    },
    clearAll() {
      this.wishes = [];
      this.content = '';
      this.fromName = '';
    },
    formatTime(ts) {
      const d = new Date(ts);
      const pad = (n) => `${n}`.padStart(2, '0');
      return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
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

  .form{
    display:flex;
    flex-direction: column;
    gap: 12px;
  }
  .quick-templates{
    display:flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .chip{
    border-radius: 999px;
    border: 1px solid rgba(240,215,160,0.26);
    background: rgba(0,0,0,0.1);
    color: rgba(245,241,230,0.9);
    font-size: 11px;
    padding: 6px 10px;
    cursor: pointer;
  }

  .field{
    display:flex;
    flex-direction: column;
    gap: 8px;
  }

  .label{
    color: rgba(245,241,230,0.75);
    font-size: 12px;
    letter-spacing: 1px;
  }

  .input, .textarea{
    border-radius: 14px;
    padding: 12px 12px;
    background: rgba(0,0,0,0.18);
    color: rgba(245,241,230,0.95);
    border: 1px solid rgba(240,215,160,0.24);
    outline: none;
    font-weight: 700;
  }

  .input{
    height: 42px;
  }

  .textarea{
    min-height: 110px;
    resize: vertical;
    line-height: 1.5;
    font-weight: 600;
  }

  .counter{
    color: rgba(245,241,230,0.6);
    font-size: 11px;
    align-self: flex-end;
    margin-top: -2px;
  }

  .actions{
    display:flex;
    gap: 10px;
    flex-wrap: wrap;
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

  .btn.primary{
    background: linear-gradient(180deg, rgba(240,215,160,0.22), rgba(240,215,160,0.10));
    color: #f0d7a0;
  }

  .btn.ghost{
    background: rgba(0,0,0,0.10);
  }

  .tip{
    color: rgba(245,241,230,0.7);
    font-size: 12px;
    padding-top: 2px;
  }

  .list{
    display:flex;
    flex-direction: column;
    gap: 12px;
  }

  .list-title{
    font-weight: 900;
    letter-spacing: 1px;
  }

  .empty{
    color: rgba(245,241,230,0.7);
    font-size: 13px;
    padding: 18px 6px;
    text-align: center;
    border-radius: 14px;
    border: 1px dashed rgba(240,215,160,0.26);
    background: rgba(0,0,0,0.08);
  }

  .wish-item{
    border-radius: 16px;
    padding: 14px 12px;
    background: rgba(0,0,0,0.14);
    border: 1px solid rgba(240,215,160,0.14);
  }
  .like-btn{
    margin-top: 10px;
    border-radius: 999px;
    border: 1px solid rgba(240,215,160,0.26);
    background: rgba(0,0,0,0.1);
    color: #f0d7a0;
    font-size: 11px;
    padding: 6px 10px;
    cursor: pointer;
  }

  .wish-meta{
    display:flex;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 10px;
  }

  .who{
    color: #f0d7a0;
    font-weight: 900;
  }

  .time{
    color: rgba(245,241,230,0.6);
    font-size: 12px;
  }

  .wish-text{
    white-space: pre-wrap;
    line-height: 1.7;
    color: rgba(245,241,230,0.92);
    font-weight: 600;
  }

  @media (max-width: 760px){
    .head{
      flex-direction: column;
      align-items:flex-start;
    }
  }
</style>

