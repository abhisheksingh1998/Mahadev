"use client";

import type { MatchCategory } from "@/lib/types";

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
    <div className="match-image-card">
      <img
        src={match.image || "/images/default-match.jpg"}
        alt={match.title || match.teams || "Match"}
        className="match-card-image"
      />

      <div className="match-card-overlay">
        <h3>{match.title || match.teams}</h3>
      </div>
    </div>
  );
}

// Home page match cards
export const categories: MatchCategory[] = [
  {
    name: "Sports",
    icon: "fa-trophy",
    matches: [
      {
        image: "/images/cricket.jpg",
        title: "Cricket",
      },
      {
        image: "/images/teen-patti.jpg",
        title: "Teen Patti",
      },
      {
        image: "/images/casino.jpg",
        title: "Live Casino",
      },
    ],
  },
];

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

  // Take only first 3 matches
  const matches = categories
    .flatMap((category) => category.matches || [])
    .slice(0, 3);

  return (
    <section className="sports-matches-section" id="live-matches">
      <div className="container">

        <div className="title-wrapper" data-aos="fade-up">
          <h2 className="section-title">
            {title || "Live Games"}
          </h2>

          {subtitle ? (
            <p className="section-subtitle">{subtitle}</p>
          ) : null}
        </div>

        <div className="matches-image-grid" data-aos="fade-up">
          {matches.map((match, index) => (
            <MatchImageCard
              key={`${match.teams}-${match.time}-${index}`}
              match={match}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
