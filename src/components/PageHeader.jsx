export default function PageHeader({ eyebrow, title, subtitle, action }) {
  return (
    <header className="page-head">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {subtitle ? <p className="page-sub">{subtitle}</p> : null}
      </div>
      {action ? <div className="page-head-action">{action}</div> : null}
    </header>
  )
}
