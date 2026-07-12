"use client";

import { useState } from "react";
import { ParticlePortrait } from "./ParticlePortrait";
import { MotionController } from "./MotionController";

const directions = [
  { title: "AI 聚合平台", status: "已验证", tone: "verified", text: "整合优质 AI 工具，完成产品与商业闭环" },
  { title: "保研与留学辅导", status: "运营中", tone: "active", text: "联合头部高校学长学姐，提供一对一辅导" },
  { title: "电商视觉制作", status: "进行中", tone: "working", text: "为电商企业制作 SKU 图与商品视觉素材" },
  { title: "俄罗斯跨境电商", status: "探索中", tone: "exploring", text: "研究当地需求、供应链与渠道合作机会" },
  { title: "全球年轻行动者社群", status: "筹备中", tone: "soon", text: "连接全球有想法且愿意行动的年轻人" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main id="top">
      <MotionController />
      <header className="site-header">
        <div className="site-header-inner page-width">
          <a href="#top" className="site-logo" aria-label="返回首页">YE</a>
          <button
            className="nav-toggle"
            type="button"
            aria-label="切换主要导航"
            aria-expanded={menuOpen}
            aria-controls="site-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span /><span /><span />
          </button>
          <nav id="site-nav" className={`site-nav${menuOpen ? " is-open" : ""}`} aria-label="主要导航">
            <a href="#top" className="nav-active" onClick={() => setMenuOpen(false)}>首页</a>
            <a href="#now" onClick={() => setMenuOpen(false)}>正在做</a>
            <a href="#future" onClick={() => setMenuOpen(false)}>未来方向</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>关于我</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>联系我</a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="hero-texture" aria-hidden="true" />
        <div className="page-width hero-grid">
          <div className="hero-copy">
            <h1><span>Henry Ye</span></h1>
            <h2>连续创业者 · AI 产品商业化实践者</h2>
            <i className="title-rule" />
            <p>用 AI、资源与行动，把真实需求变成可被市场验证的产品。</p>
            <div className="hero-links">
              <a className="hero-link-primary" href="#now" data-magnetic>查看正在做 <span>→</span></a>
              <a className="hero-link-secondary" href="#contact" data-magnetic>联系我 <span>→</span></a>
            </div>
          </div>
          <div className="portrait-area">
            <div className="faded-portrait" aria-hidden="true" />
            <ParticlePortrait src="/assets/henry-avatar.png" />
          </div>
        </div>
        <div className="hero-landscape" aria-hidden="true" />
      </section>

      <section className="proof page-width reveal-up" aria-label="核心成果" data-reveal>
        <div className="proof-icon"><span>✓</span></div>
        <div className="proof-label"><b>已验证的商业结果</b><i /></div>
        <div className="proof-main">
          <h2>单月六位数</h2>
          <p>AI 聚合平台单月营收达到六位数</p>
        </div>
        <div className="proof-chart" aria-hidden="true"><i /><b /><b /><b /><b /><b /></div>
      </section>

      <section className="about-section" id="about">
        <SectionIntro kicker="ABOUT / 关于我" title="About me." subtitle="相信技术、行动与长期主义，能够把真实问题变成更好的答案。" />
        <div className="about page-width">
          <div className="about-copy reveal-left" data-reveal>
          <SectionTitle title="关于我" />
          <p>我相信技术的价值在于解决真实问题，也相信全球协作能放大年轻人的可能。</p>
          <p>大学期间经历第一次创业，从产品到增长、从 0 到 1，再从 1 到 N。我持续在 AI 与全球市场的交叉点构建可验证的商业模式。</p>
          <h3>我的价值观</h3>
          <div className="value-list">
            <span><b>⌁</b>长期主义</span><span><b>◎</b>结果导向</span><span><b>⊕</b>全球视野</span>
          </div>
          </div>
          <div className="journey reveal-right" data-reveal>
          <h3>我的旅程</h3>
          <ol>
            <li><time>大学期间</time><span>开始第一次创业尝试，探索内容、产品与商业的结合</span></li>
            <li><time>2026.06</time><span>重新从零出发，聚焦 AI 产品与商业化验证</span></li>
            <li><time>现在</time><span>拓展教育服务、电商视觉与跨境市场方向</span></li>
            <li><time>未来</time><span>连接更多年轻行动者，创造长期影响力</span></li>
          </ol>
          </div>
        </div>
      </section>

      <section className="projects" id="now">
        <SectionIntro kicker="IN PROGRESS / 正在做" title="In progress." subtitle="把想法放进市场，在真实反馈中持续验证与迭代。" />
        <div className="projects-content page-width">
          <div className="project-grid">
          {directions.map((item, index) => (
            <article className="project-card reveal-up" data-reveal style={{ "--reveal-order": index } as React.CSSProperties} key={item.title}>
              <h3>{item.title}</h3>
              <div className={`project-art art-${index + 1}`} role="img" aria-label={`${item.title}水墨插画`} />
              <p>{item.text}</p>
              <span className={`project-status ${item.tone}`}>{item.status}</span>
            </article>
          ))}
          </div>
          <div className="project-more"><i />持续更新中 →<i /></div>
        </div>
      </section>

      <section className="future" id="future">
        <SectionIntro kicker="WHAT'S NEXT / 未来方向" title="What&apos;s next." subtitle="连接来自世界各地的年轻行动者，建立协作网络与价值生态。" />
        <div className="page-width future-inner">
          <div className="future-copy reveal-left" data-reveal>
            <SectionTitle title="未来方向" />
            <h3>构建全球年轻行动者的<br />协作网络与价值生态</h3>
            <div className="future-values">
              <span><b>♧</b>连接<small>连接全球积极的年轻行动者</small></span>
              <span><b>⌖</b>协作<small>跨领域协作，放大彼此影响力</small></span>
              <span><b>↗</b>创造<small>用 AI 与全球资源创造长期价值</small></span>
            </div>
          </div>
          <blockquote className="reveal-right" data-reveal>一起做长期而有价值的事</blockquote>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="contact-intro page-width" data-reveal>
          <p className="contact-kicker"><i /> GET IN TOUCH / 联系 <i /></p>
          <h2>Let&apos;s talk.</h2>
          <p className="contact-lead">聊聊 AI、创业与商业，也欢迎一起做点有价值的事情。</p>
          <p className="contact-status"><i /> 当前开放合作 · Available</p>
        </div>

        <div className="contact-marquee" aria-label="合作方向">
          <div className="contact-marquee-track">
            <span>项目合作 · 产品交流 · 联合创业 · 投资与资源对接 · 认识有趣的人 · 项目合作 · 产品交流 · 联合创业 · 投资与资源对接 · 认识有趣的人 · </span>
            <span aria-hidden="true">项目合作 · 产品交流 · 联合创业 · 投资与资源对接 · 认识有趣的人 · 项目合作 · 产品交流 · 联合创业 · 投资与资源对接 · 认识有趣的人 · </span>
          </div>
        </div>

        <div className="contact-grid page-width">
          <a className="contact-item contact-email" data-reveal href="mailto:henryye050213@gmail.com">
            <small>EMAIL / 邮箱</small>
            <strong>henryye050213@gmail.com</strong>
            <span aria-hidden="true">→</span>
          </a>
          <figure className="contact-item contact-qr" data-reveal style={{ "--reveal-order": 1 } as React.CSSProperties}>
            <figcaption><small>WECHAT / 个人微信</small><strong>Henry Ye</strong></figcaption>
            <img src="/assets/wechat-qr.jpg" alt="Henry Ye 个人微信二维码" />
          </figure>
          <figure className="contact-item contact-qr" data-reveal style={{ "--reveal-order": 2 } as React.CSSProperties}>
            <figcaption><small>OFFICIAL ACCOUNT / 公众号</small><strong>瑞评社 Ray Review</strong></figcaption>
            <img src="/assets/ray-review-qr.jpg" alt="瑞评社 Ray Review 公众号二维码" />
          </figure>
          <a className="contact-item contact-x" data-reveal href="https://x.com/HenryY54001" target="_blank" rel="noreferrer">
            <small>X / 动态</small>
            <b>𝕏</b>
            <strong>@HenryY54001</strong>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <footer>瑞评社 Ray Review</footer>
    </main>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <div className="section-title"><h2>{title}</h2><i /></div>;
}

function SectionIntro({ kicker, title, subtitle }: { kicker: string; title: string; subtitle: string }) {
  return (
    <div className="section-intro page-width" data-reveal>
      <p className="section-kicker"><i /> {kicker} <i /></p>
      <h2>{title}</h2>
      <p className="section-intro-copy">{subtitle}</p>
    </div>
  );
}
