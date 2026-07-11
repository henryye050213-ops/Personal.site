"use client";

import { useEffect, useState } from "react";
import { ParticlePortrait } from "./ParticlePortrait";

const directions = [
  { title: "AI 聚合平台", status: "已验证", tone: "verified", text: "整合优质 AI 工具，完成产品与商业闭环" },
  { title: "保研与留学辅导", status: "运营中", tone: "active", text: "联合头部高校学长学姐，提供一对一辅导" },
  { title: "电商视觉制作", status: "进行中", tone: "working", text: "为电商企业制作 SKU 图与商品视觉素材" },
  { title: "俄罗斯跨境电商", status: "探索中", tone: "exploring", text: "研究当地需求、供应链与渠道合作机会" },
  { title: "全球年轻行动者社群", status: "筹备中", tone: "soon", text: "连接全球有想法且愿意行动的年轻人" },
];

export default function Home() {
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setContactOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = contactOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [contactOpen]);

  return (
    <main id="top">
      <header className="site-header page-width">
        <a href="#top" className="nav-active">首页</a>
        <a href="#now">正在做</a>
        <a href="#future">未来方向</a>
        <a href="#about">关于我</a>
        <button type="button" onClick={() => setContactOpen(true)}>联系我</button>
      </header>

      <section className="hero">
        <div className="page-width hero-grid">
          <div className="hero-copy">
            <h1>Henry Ye</h1>
            <h2>连续创业者 · AI 产品商业化实践者</h2>
            <i className="title-rule" />
            <p>用 AI、资源与行动，把真实需求变成可被市场验证的产品。</p>
            <div className="hero-links">
              <a href="#now">查看正在做 →</a>
              <button type="button" onClick={() => setContactOpen(true)}>联系我 →</button>
            </div>
          </div>
          <div className="portrait-area">
            <ParticlePortrait src="/assets/henry-avatar.png" />
            <span className="portrait-seal">海墨<br />初青</span>
            <small>移动鼠标 · 扰动粒子</small>
          </div>
        </div>
        <div className="hero-landscape" aria-hidden="true" />
      </section>

      <section className="proof page-width" aria-label="核心成果">
        <div className="proof-icon"><span>✓</span></div>
        <div className="proof-label"><b>已验证的商业结果</b><i /></div>
        <div className="proof-main">
          <h2>单月六位数</h2>
          <p>AI 聚合平台单月营收达到六位数</p>
        </div>
        <div className="proof-chart" aria-hidden="true"><i /><b /><b /><b /><b /><b /></div>
      </section>

      <section className="about page-width" id="about">
        <div className="about-copy">
          <SectionTitle title="关于我" />
          <p>我相信技术的价值在于解决真实问题，也相信全球协作能放大年轻人的可能。</p>
          <p>大学期间经历第一次创业，从产品到增长、从 0 到 1，再从 1 到 N。我持续在 AI 与全球市场的交叉点构建可验证的商业模式。</p>
          <h3>我的价值观</h3>
          <div className="value-list">
            <span><b>⌁</b>长期主义</span><span><b>◎</b>结果导向</span><span><b>⊕</b>全球视野</span>
          </div>
        </div>
        <div className="journey">
          <h3>我的旅程</h3>
          <ol>
            <li><time>大学期间</time><span>开始第一次创业尝试，探索内容、产品与商业的结合</span></li>
            <li><time>2026.06</time><span>重新从零出发，聚焦 AI 产品与商业化验证</span></li>
            <li><time>现在</time><span>拓展教育服务、电商视觉与跨境市场方向</span></li>
            <li><time>未来</time><span>连接更多年轻行动者，创造长期影响力</span></li>
          </ol>
        </div>
      </section>

      <section className="projects page-width" id="now">
        <SectionTitle title="正在做" />
        <div className="project-grid">
          {directions.map((item, index) => (
            <article className="project-card" key={item.title}>
              <h3>{item.title}</h3>
              <div className={`project-art art-${index + 1}`} role="img" aria-label={`${item.title}水墨插画`} />
              <p>{item.text}</p>
              <span className={`project-status ${item.tone}`}>{item.status}</span>
            </article>
          ))}
        </div>
        <div className="project-more"><i />持续更新中 →<i /></div>
      </section>

      <section className="future" id="future">
        <div className="page-width future-inner">
          <div className="future-copy">
            <SectionTitle title="未来方向" />
            <h3>构建全球年轻行动者的<br />协作网络与价值生态</h3>
            <div className="future-values">
              <span><b>♧</b>连接<small>连接全球积极的年轻行动者</small></span>
              <span><b>⌖</b>协作<small>跨领域协作，放大彼此影响力</small></span>
              <span><b>↗</b>创造<small>用 AI 与全球资源创造长期价值</small></span>
            </div>
          </div>
          <blockquote>一起做长期而有价值的事</blockquote>
        </div>
      </section>

      <section className="contact page-width" id="contact">
        <div className="contact-copy">
          <SectionTitle title="联系我" />
          <p>欢迎交流合作、项目探讨<br />或加入全球年轻行动者社群</p>
          <button type="button" onClick={() => setContactOpen(true)}>✉&nbsp;&nbsp;打开联系方式</button>
        </div>
        <button className="contact-qr-placeholder" type="button" onClick={() => setContactOpen(true)}><span />微信</button>
        <button className="contact-qr-placeholder" type="button" onClick={() => setContactOpen(true)}><span />公众号</button>
        <a className="contact-x" href="https://x.com/HenryY54001" target="_blank" rel="noreferrer"><b>𝕏</b><span>X / @HenryY54001<small>关注我的最新动态</small></span></a>
      </section>

      <footer>瑞评社 Ray Review</footer>

      {contactOpen && (
        <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setContactOpen(false)}>
          <section className="contact-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <button className="modal-close" type="button" onClick={() => setContactOpen(false)} aria-label="关闭联系方式">×</button>
            <p className="modal-kicker">CONNECT WITH HENRY</p>
            <h2 id="modal-title">选择一种方式认识我</h2>
            <div className="qr-grid">
              <article><img src="/assets/wechat-qr.jpg" alt="Henry Ye 个人微信二维码" /><h3>个人微信</h3><p>请备注：姓名 + 所在城市 + 想交流的方向</p></article>
              <article><img src="/assets/ray-review-qr.jpg" alt="瑞评社 Ray Review 公众号二维码" /><h3>瑞评社 Ray Review</h3><p>AI、创业、商业观察与个人成长</p></article>
            </div>
            <a href="https://x.com/HenryY54001" target="_blank" rel="noreferrer">也可以在 X 上找到我 · @HenryY54001 ↗</a>
          </section>
        </div>
      )}
    </main>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <div className="section-title"><h2>{title}</h2><i /></div>;
}
