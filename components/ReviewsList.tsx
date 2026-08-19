import type { Review } from "@/lib/types";

export function ReviewsList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-noir/60">Aucun avis pour le moment.</p>;
  }

  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-noir/70">
        Note moyenne : <span className="font-semibold text-bois">{average.toFixed(1)} / 5</span>{" "}
        ({reviews.length} avis)
      </p>
      <div className="flex flex-col gap-3">
        {reviews.map((review) => (
          <div key={review.id} className="border border-bois/15 rounded-sm p-4 bg-blanc-casse">
            <div className="flex items-center justify-between">
              <span className="text-velux text-lg leading-none">
                {"★".repeat(review.rating)}
                <span className="text-bois/20">{"★".repeat(5 - review.rating)}</span>
              </span>
              <span className="text-xs text-noir/50">
                {new Date(review.created_at).toLocaleDateString("fr-FR")}
              </span>
            </div>
            {review.customer_name && (
              <p className="text-sm font-medium text-bois mt-1">{review.customer_name}</p>
            )}
            {review.comment && <p className="text-sm text-noir/70 mt-1">{review.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
