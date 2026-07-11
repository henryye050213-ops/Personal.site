"use client";

import { useEffect, useState } from "react";
import { ParticlePortrait } from "./ParticlePortrait";

const directions = [
  {
    no: "01",
    title: "AI 聚合平台",
    status: "已验证",
    tone: "verified",
    text: "从真实需求出发完成产品与商业闭环，单月营收达到六位数。",
  },
  {
    no: "02",
    title: "保研与留学辅导",
    status: "运营中",
    tone: "active",
    text: "联合清北及其他头部 985 学长学姐，提供真实经验支持与一对一辅导。",
  },
  {
    no: "03",
    title: "电商视觉制作",
    status: "进行中",
    tone: "working",
    text: "为电商企业制作 SKU 图、商品图及其他电商视觉素材。",
  },
  {
    no: "04",
    title: "俄罗斯跨境电商",
    status: "探索中",
    tone: "exploring",
    text: "研究俄罗斯市场的真实需求、供应链、渠道与跨区域合作机会。",
  },
  {
    no: "05",
    title: "全球年轻行动者社群",
    status: "筹备中",
    tone: "soon",
    text: "连接来自世界各地，有想法且愿意行动的创业者、开发者、创作者与学生。",
  },
];

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setContactOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = contactOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [contactOpen]);

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Henry Ye 首页">
          H<span>Y</span>
        </a>
        <nav aria-label="主要导航">
          <a href="#about">关于我</a>
          <a href="#now">正在做</a>
          <a href="#future">未来</a>
          <button type="button" onClick={() => setContactOpen(true)}>联系我</button>
        </nav>
        <a className="x-link" href="https://x.com/HenryY54001" target="_blank" rel="noreferrer" aria-label="在 X 上关注 Henry Ye">𝕏</a>
      </header>

      <section className="hero section-shell" id="top">
        <div className="hero-copy reveal">
          <p className="eyebrow">SERIAL ENTREPRENEUR · AI BUILDER</p>
          <h1>Henry Ye</h1>
          <p className="hero-role">连续创业者 · AI 产品商业化实践者</p>
          <p className="hero-lead">
            用 AI、资源与行动，<br />把真实需求变成可被市场验证的产品。
          </p>
          <p className="hero-note">
            大学期间，从一次没有走到最后的创业重新出发。做成过单月营收六位数的 AI 产品，也在持续探索新的可能。
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#now">看看我在做什么 <ArrowIcon /></a>
            <button className="button ghost" type="button" onClick={() => setContactOpen(true)}>和我聊聊</button>
          </div>
        </div>
        <div className="portrait-wrap reveal delay-one">
          <div className="portrait-halo" aria-hidden="true" />
          <ParticlePortrait src="/assets/henry-avatar.png" />
          <p className="particle-tip">移动鼠标，扰动粒子</p>
        </div>
        <div className="ink-horizon" aria-hidden="true"><i /><i /><i /></div>
      </section>

      <section className="result section-shell reveal" aria-labelledby="result-title">
        <div className="result-mark">验证</div>
        <div>
          <p className="eyebrow">VERIFIED COMMERCIAL RESULT</p>
          <h2 id="result-title">单月六位数</h2>
          <p>成功运营一个 AI 聚合平台，完成从真实需求、产品落地到商业化变现的完整验证。</p>
        </div>
        <div className="result-line" aria-hidden="true"><span /><b /><b /><b /><b /></div>
      </section>

      <section className="about section-shell" id="about">
        <div className="section-heading reveal">
          <p className="eyebrow">ABOUT · 01</p>
          <h2>关于我</h2>
        </div>
        <div className="about-grid">
          <div className="about-story reveal">
            <p>
              大学期间，我曾创办公司并担任 CEO。第一次创业最终没有继续下去，却让我更早接触到团队、产品、资源与商业的真实运转。
            </p>
            <p>
              2026 年 6 月，我选择重新从零开始。目前，我持续推进 AI 产品、教育服务、电商视觉与跨境市场等方向。
            </p>
            <div className="skills" aria-label="核心能力">
              <span>AI 应用</span><span>资源整合</span><span>项目执行</span>
            </div>
          </div>
          <blockquote className="values reveal delay-one">
            <span>“</span>
            创业不只是创造收入，更是发现真实的问题，并用新的产品与服务，让世界向更好的方向前进。
            <cite>MY VALUE · 让世界变得更好</cite>
          </blockquote>
        </div>
      </section>

      <section className="now section-shell" id="now">
        <div className="section-heading reveal">
          <p className="eyebrow">CURRENT DIRECTIONS · 02</p>
          <h2>正在做</h2>
          <p>不同阶段，同一种方法：从真实需求出发，用行动完成验证。</p>
        </div>
        <div className="direction-grid">
          {directions.map((item, index) => (
            <article className={`direction-card reveal delay-${(index % 3) + 1}`} key={item.title}>
              <div className="card-top"><span>{item.no}</span><span className={`status ${item.tone}`}>{item.status}</span></div>
              <div className={`card-symbol symbol-${index + 1}`} aria-hidden="true"><span /></div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="future" id="future">
        <div className="future-bg" aria-hidden="true"><span /><span /><span /></div>
        <div className="section-shell future-content">
          <div className="section-heading reveal">
            <p className="eyebrow">NEXT HORIZON · 03</p>
            <h2>向更远处出发</h2>
          </div>
          <p className="future-lead reveal">
            持续发现真实需求，整合合适资源，<br />把想法转化为可以被市场验证的产品与服务。
          </p>
          <div className="future-points reveal delay-one">
            <span><b>01</b> 验证新的商业机会</span>
            <span><b>02</b> 探索俄罗斯跨境市场</span>
            <span><b>03</b> 连接全球年轻行动者</span>
          </div>
          <p className="future-note reveal">寻找值得长期合作的人，一起做对世界有价值的事。</p>
        </div>
      </section>

      <section className="connect section-shell" id="contact">
        <div className="connect-copy reveal">
          <p className="eyebrow">GET IN TOUCH · 04</p>
          <h2>一起做点真实的事情</h2>
          <p>欢迎项目合作、产品交流、联合创业、投资与资源对接。也欢迎来自世界各地的年轻行动者来认识彼此。</p>
          <button className="button primary" type="button" onClick={() => setContactOpen(true)}>打开联系方式 <ArrowIcon /></button>
        </div>
        <div className="social-list reveal delay-one">
          <a href="https://x.com/HenryY54001" target="_blank" rel="noreferrer"><b>𝕏</b><span><small>实时动态</small>@HenryY54001</span><ArrowIcon /></a>
          <button type="button" onClick={() => setContactOpen(true)}><b>微</b><span><small>个人微信</small>Henry·葉</span><ArrowIcon /></button>
          <button type="button" onClick={() => setContactOpen(true)}><b>阅</b><span><small>微信公众号</small>瑞评社 Ray Review</span><ArrowIcon /></button>
        </div>
      </section>

      <footer>
        <span>Henry Ye</span>
        <p>AI · 创业 · 商业观察 · 个人成长</p>
        <a href="#top">回到顶部 ↑</a>
      </footer>

      {contactOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setContactOpen(false);
        }}>
          <section className="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-title">
            <button className="modal-close" type="button" onClick={() => setContactOpen(false)} aria-label="关闭联系方式">×</button>
            <div className="modal-head">
              <p className="eyebrow">CONNECT WITH HENRY</p>
              <h2 id="contact-title">选择一种方式认识我</h2>
              <p>项目合作、交流想法，或者只是来打个招呼。</p>
            </div>
            <div className="qr-grid">
              <article>
                <img src="/assets/wechat-qr.jpg" alt="Henry Ye 的个人微信二维码" />
                <h3>个人微信</h3>
                <p>请备注：姓名 + 所在城市 + 想交流的方向</p>
              </article>
              <article>
                <img src="/assets/ray-review-qr.jpg" alt="瑞评社 Ray Review 公众号二维码" />
                <h3>瑞评社 Ray Review</h3>
                <p>AI、创业、商业观察与个人成长</p>
              </article>
            </div>
            <a className="modal-x" href="https://x.com/HenryY54001" target="_blank" rel="noreferrer">也可以在 X 上找到我 · @HenryY54001 <ArrowIcon /></a>
          </section>
        </div>
      )}
    </main>
  );
}
