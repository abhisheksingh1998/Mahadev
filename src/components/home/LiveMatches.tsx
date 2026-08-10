"use client";

import { useWhatsAppUrl } from "@/components/SiteSettingsProvider";
import type { MatchCategory } from "@/lib/types";

function MatchCard({
  match,
}: {
  match: { teams?: string; league?: string; time?: string; status?: string };
}) {
  const whatsappUrl = useWhatsAppUrl();
  return (
    <div className="match-card">
      <div className="match-info">
        <div className="match-teams">{match.teams}</div>
        <div className="match-league">{match.league}</div>
      </div>
      <div className="match-status-badge">
        <span className="live-line" />
        <span>{match.status || "LIVE"}</span>
      </div>
      <div className="match-time">{match.time}</div>
      <div className="match-actions">
        <i className="fa-solid fa-tv icon-btn" />
        <div className="bm-badge">BM</div>
        <a href={whatsappUrl} className="btn-bet">
          make Bet
        </a>
      </div>
    </div>
  );
}

export function LiveMatches({
  title,
  subtitle,
  categories,
}: {
  title?: string;
  subtitle?: string;
  categories?: MatchCategory[];
}) {
  if (!categories?.length) return null;

  return (
    <section className="sports-matches-section" id="live-matches">
      <div className="container">
        <div className="title-wrapper" data-aos="fade-up">
          <h2 className="section-title">{title || "Live & Upcoming Matches"}</h2>
          {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
        </div>

        {categories.map((category) => (
          <div className="category-block" data-aos="fade-up" key={category.name}>
            <div className="category-header">
              <i className={`fa-solid ${category.icon || "fa-trophy"}`} />
              <span>{category.name}</span>
            </div>
            <div className="matches-list">
              {(category.matches || []).map((match) => (
                <MatchCard key={`${match.teams}-${match.time}`} match={match} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
