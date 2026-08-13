"use client";

import type { MatchCategory } from "@/lib/types";
import { categories } from "@/lib/categories";
<LiveMatches categories={categories} />

const WHATSAPP_LINK = "PASTE_YOUR_WHATSAPP_LINK_HERE";

function MatchImageCard({
  match,
}: {
  match: {
    image?: string;
    title?: string;
    teams?: string;
  };
}) {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="match-image-card"
      aria-label={match.title || match.teams || "Live Game"}
    >
      <img
        src={match.image || "/images/default-match.jpg"}
        alt={match.title || match.teams || "Live Game"}
        className="match-card-image"
      />
    </a>
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

  // Only first 3 cards
  const matches = categories
    .flatMap((category) => category.matches || [])
    .slice(0, 3);

  return (
    <section className="sports-matches-section" id="live-matches">
      <div className="container">

        <div className="title-wrapper" data-aos="fade-up">
          <h2 className="section-title">
            Live Games
          </h2>

          {subtitle ? (
            <p className="section-subtitle">{subtitle}</p>
          ) : null}
        </div>

        <div className="matches-image-grid" data-aos="fade-up">
          {matches.map((match, index) => (
            <MatchImageCard
              key={`${match.title}-${index}`}
              match={match}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
