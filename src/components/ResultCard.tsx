import { useI18n } from '../i18n/t'
import type { CardData } from '../result/renderCard'
import type { MessageKey } from '../i18n/t'

const LOGO = import.meta.env.BASE_URL + 'logo/cisbox-o.svg'

/** HTML-Variante der Ergebniskarte (Anzeige). Gleiche Daten wie renderCard.ts. */
export function ResultCard({ data }: { data: CardData }) {
  const { t, num, duration, date } = useI18n()
  return (
    <div className="rc">
      <div className="rc-head">
        <img src={LOGO} alt="" width={24} height={24} />
        <span>{t('card.brand')}</span>
      </div>
      <div className="rc-topic">{t('card.topicLine', { topic: data.topic, difficulty: data.difficulty })}</div>
      <div className="rc-score">
        <span className="rc-num">{num(data.score)}</span>
        <span className="rc-of">
          {t('card.points')} {t('card.of', { max: num(data.maxScore) })}
        </span>
      </div>
      <div className="rc-row">
        <span className="rc-pct">{num(data.percent)} %</span>
        <span className="rc-tier">{t(('rating.' + data.tier) as MessageKey)}</span>
      </div>
      <div className="rc-meta">
        <span>
          {t('result.duration')}: {duration(data.durationMs)}
        </span>
        <span>
          {t('result.date')}: {date(data.at)}
        </span>
      </div>
      <div className="rc-foot">{t('card.footer')}</div>
    </div>
  )
}
