export default function Logo({ light = false }) {
  return (
    <div className={`brand-logo ${light ? 'brand-logo--light' : ''}`}>
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill={light ? '#2DD4BF' : '#0B1220'} />
          <path
            d="M8 22V10h4.2l5.6 8.4V10H22v12h-4.2L12.2 13.6V22H8z"
            fill={light ? '#042F2E' : '#2DD4BF'}
          />
        </svg>
      </span>
      <span className="brand-name">
        Nexora <em>CRM</em>
      </span>
    </div>
  )
}
