"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getMyOrderIds, setMyOrderIds } from "@/lib/my-orders";

const ACTIVE_STATUSES = ["nouvelle", "en_preparation", "prete"];

export function MyOrdersNavLink() {
  const [activeCount, setActiveCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      const ids = getMyOrderIds();
      if (ids.length === 0) {
        if (!cancelled) setActiveCount(0);
        return;
      }

      const supabase = createClient();
      const { data } = await supabase.from("orders").select("id, status").in("id", ids);

      const stillTracked = (data ?? []).map((o) => o.id);
      const active = (data ?? []).filter((o) => ACTIVE_STATUSES.includes(o.status));

      // drop ids that were deleted (served + cleaned up) or otherwise gone
      if (stillTracked.length !== ids.length) {
        setMyOrderIds(stillTracked);
      }

      if (!cancelled) setActiveCount(active.length);
    }

    refresh();
    const interval = setInterval(refresh, 15000);
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);

    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  if (!activeCount) return null;

  return (
    <Link href="/mes-commandes" className="hover:text-blanc-casse transition-colors">
      Vos commandes en cours ({activeCount})
    </Link>
  );
}
