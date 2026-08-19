import React, { useState, useEffect, useCallback, useRef } from "react";
import { ShoppingBasket, Plus, Minus, X, ChefHat, Clock, CheckCircle2, ArrowLeft, Utensils, Send } from "lucide-react";

// --- Supabase (guinguette-am) ---------------------------------------------
// Clé publique (publishable/anon) : sans danger côté client, protégée par les
// policies RLS définies sur le projet Supabase. Peut être surchargée via .env
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://mmmaxslemmbcdqmkqhhj.supabase.co";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_fqCjYs2E6c6jOZEwV9iCmw_PrQI6EkX";

async function sb(path, opts = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...opts,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Supabase ${res.status}: ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

// --- Palette (Charte graphique La Guinguette A&M) --------------------------
const C = {
  bordeaux: "#7A2E2E",
  bordeauxDark: "#5C2222",
  creme: "#F3E9DA",
  boisFonce: "#4A3627",
  boisClair: "#A9744F",
  vertBabyfoot: "#2F5D3A",
  jauneVelux: "#E8B04B",
  blancCasse: "#FBF6EE",
  noirEncre: "#231F1C",
};

const FONT_TITLE = "'Caveat', cursive";
const FONT_BODY = "'Lora', serif";
const FONT_UI = "'Poppins', sans-serif";

function FontLoader() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Lora:ital,wght@0,400;0,500;1,400&family=Poppins:wght@400;500;600;700&display=swap');
    `}</style>
  );
}

// A soft skylight (velux) glow — the page's signature element
function VeluxGlow({ style }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "70%",
        maxWidth: 640,
        height: 260,
        background: `radial-gradient(ellipse at top, ${C.jauneVelux}55 0%, ${C.jauneVelux}22 35%, transparent 70%)`,
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}

function euros(n) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

const STATUS_META = {
  nouvelle: { label: "Nouvelle", color: C.bordeaux },
  en_preparation: { label: "En préparation", color: C.jauneVelux },
  prete: { label: "Prête", color: C.vertBabyfoot },
  servie: { label: "Servie", color: C.boisClair },
  annulee: { label: "Annulée", color: "#999" },
};
const NEXT_STATUS = { nouvelle: "en_preparation", en_preparation: "prete", prete: "servie" };

// ---------------------------------------------------------------------------
// CLIENT VIEW — La Carte
// ---------------------------------------------------------------------------
function CarteView({ onGoKitchen }) {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState({}); // item.id -> qty
  const [cartOpen, setCartOpen] = useState(false);
  const [tableLabel, setTableLabel] = useState("");
  const [sending, setSending] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [cats, its] = await Promise.all([
          sb("categories?select=*&order=position.asc"),
          sb("items?select=*&active=eq.true&order=position.asc"),
        ]);
        setCategories(cats);
        setItems(its);
      } catch (e) {
        setError("Impossible de charger la carte. Vérifie ta connexion et réessaie.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const itemsByCategory = categories.map((cat) => ({
    ...cat,
    items: items.filter((i) => i.category_id === cat.id),
  })).filter((c) => c.items.length > 0);

  const cartLines = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({ item: items.find((i) => i.id === id), qty }))
    .filter((l) => l.item);

  const total = cartLines.reduce((sum, l) => sum + l.item.price * l.qty, 0);
  const cartCount = cartLines.reduce((sum, l) => sum + l.qty, 0);

  function addToCart(id) {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  }
  function removeFromCart(id) {
    setCart((c) => {
      const next = { ...c, [id]: Math.max(0, (c[id] || 0) - 1) };
      return next;
    });
  }

  async function sendOrder() {
    if (cartLines.length === 0) return;
    setSending(true);
    try {
      const [order] = await sb("orders?select=*", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({
          table_label: tableLabel.trim() || "Sans nom",
          status: "nouvelle",
        }),
      });
      const orderItemsPayload = cartLines.map((l) => ({
        order_id: order.id,
        item_id: l.item.id,
        item_name_snapshot: l.item.name,
        unit_price_snapshot: l.item.price,
        quantity: l.qty,
      }));
      await sb("order_items", {
        method: "POST",
        body: JSON.stringify(orderItemsPayload),
      });
      setConfirmedOrder({ tableLabel: tableLabel.trim() || "Sans nom", lines: cartLines, total });
      setCart({});
      setTableLabel("");
      setCartOpen(false);
    } catch (e) {
      alert("La commande n'est pas partie en cuisine. Réessaie dans un instant.");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.creme, fontFamily: FONT_BODY, color: C.boisFonce }}>
        Chargement de la carte…
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.creme, fontFamily: FONT_BODY, color: C.bordeaux, padding: 24, textAlign: "center" }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.creme, fontFamily: FONT_BODY, color: C.noirEncre, position: "relative", overflowX: "hidden" }}>
      <FontLoader />
      <VeluxGlow />

      {/* Header */}
      <header style={{ position: "relative", padding: "40px 20px 24px", textAlign: "center" }}>
        <button
          onClick={onGoKitchen}
          style={{ position: "absolute", top: 16, right: 16, background: "transparent", border: "none", color: C.boisClair, fontFamily: FONT_UI, fontSize: 12, cursor: "pointer", opacity: 0.6 }}
          aria-label="Accès cuisine"
        >
          <ChefHat size={20} />
        </button>
        <h1 style={{ fontFamily: FONT_TITLE, fontSize: 56, color: C.bordeaux, margin: 0, lineHeight: 1 }}>
          La Guinguette A&amp;M
        </h1>
        <p style={{ fontFamily: FONT_UI, fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", color: C.vertBabyfoot, marginTop: 8, fontWeight: 600 }}>
          Grande salle · Babyfoot · Velux
        </p>
      </header>

      {/* Menu */}
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px 140px" }}>
        {itemsByCategory.map((cat) => (
          <section key={cat.id} style={{ marginBottom: 36 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <h2 style={{ fontFamily: FONT_TITLE, fontSize: 30, color: C.boisFonce, margin: 0 }}>{cat.name}</h2>
              <div style={{ flex: 1, height: 1, background: `repeating-linear-gradient(90deg, ${C.boisClair}, ${C.boisClair} 6px, transparent 6px, transparent 12px)` }} />
            </div>
            <div>
              {cat.items.map((item) => {
                const qty = cart[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      background: C.blancCasse,
                      borderRadius: 14,
                      padding: "14px 16px",
                      marginBottom: 10,
                      boxShadow: "0 1px 3px rgba(74,54,39,0.1)",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: FONT_UI, fontWeight: 600, fontSize: 16, color: C.noirEncre }}>{item.name}</div>
                      {item.description ? (
                        <div style={{ fontSize: 13, color: C.boisClair, marginTop: 2, fontStyle: "italic" }}>{item.description}</div>
                      ) : null}
                      <div style={{ fontFamily: FONT_UI, fontWeight: 700, fontSize: 14, color: C.bordeaux, marginTop: 6 }}>{euros(item.price)}</div>
                    </div>

                    {qty === 0 ? (
                      <button
                        onClick={() => addToCart(item.id)}
                        style={{
                          background: C.bordeaux, color: "white", border: "none", borderRadius: 999,
                          width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: "pointer", flexShrink: 0,
                        }}
                        aria-label={`Ajouter ${item.name}`}
                      >
                        <Plus size={18} />
                      </button>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                        <button onClick={() => removeFromCart(item.id)} style={{ background: C.creme, border: `1px solid ${C.boisClair}55`, borderRadius: 999, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} aria-label={`Retirer ${item.name}`}>
                          <Minus size={14} color={C.boisFonce} />
                        </button>
                        <span style={{ fontFamily: FONT_UI, fontWeight: 700, minWidth: 16, textAlign: "center" }}>{qty}</span>
                        <button onClick={() => addToCart(item.id)} style={{ background: C.vertBabyfoot, border: "none", borderRadius: 999, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} aria-label={`Ajouter ${item.name}`}>
                          <Plus size={14} color="white" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </main>

      {/* Floating cart button */}
      {cartCount > 0 && !cartOpen && (
        <button
          onClick={() => setCartOpen(true)}
          style={{
            position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)",
            background: C.bordeaux, color: "white", border: "none", borderRadius: 999,
            padding: "14px 24px", display: "flex", alignItems: "center", gap: 10,
            fontFamily: FONT_UI, fontWeight: 600, fontSize: 15, cursor: "pointer",
            boxShadow: "0 6px 20px rgba(122,46,46,0.4)",
          }}
        >
          <ShoppingBasket size={20} />
          {cartCount} article{cartCount > 1 ? "s" : ""} · {euros(total)}
        </button>
      )}

      {/* Cart drawer */}
      {cartOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(35,31,28,0.5)", display: "flex", alignItems: "flex-end", zIndex: 50 }} onClick={() => setCartOpen(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: C.blancCasse, width: "100%", maxHeight: "85vh", overflowY: "auto", borderRadius: "20px 20px 0 0", padding: 20, boxShadow: "0 -6px 24px rgba(0,0,0,0.2)" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontFamily: FONT_TITLE, fontSize: 28, color: C.bordeaux, margin: 0 }}>Ta commande</h3>
              <button onClick={() => setCartOpen(false)} style={{ background: "transparent", border: "none", cursor: "pointer" }}>
                <X size={22} color={C.boisFonce} />
              </button>
            </div>

            {cartLines.map((l) => (
              <div key={l.item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${C.boisClair}22` }}>
                <div style={{ fontFamily: FONT_UI, fontSize: 15 }}>
                  <span style={{ fontWeight: 700 }}>{l.qty}×</span> {l.item.name}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: FONT_UI, fontWeight: 600, color: C.bordeaux }}>{euros(l.item.price * l.qty)}</span>
                  <button onClick={() => removeFromCart(l.item.id)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                    <Minus size={16} color={C.boisClair} />
                  </button>
                </div>
              </div>
            ))}

            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT_UI, fontWeight: 700, fontSize: 18, marginTop: 14, color: C.noirEncre }}>
              <span>Total</span>
              <span>{euros(total)}</span>
            </div>

            <div style={{ marginTop: 16 }}>
              <label style={{ fontFamily: FONT_UI, fontSize: 13, color: C.boisFonce, display: "block", marginBottom: 6 }}>
                Numéro de table ou prénom
              </label>
              <input
                value={tableLabel}
                onChange={(e) => setTableLabel(e.target.value)}
                placeholder="Ex : Table 4"
                style={{
                  width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 10,
                  border: `1px solid ${C.boisClair}55`, fontFamily: FONT_BODY, fontSize: 15, outline: "none",
                }}
              />
            </div>

            <button
              onClick={sendOrder}
              disabled={sending}
              style={{
                width: "100%", marginTop: 16, background: C.vertBabyfoot, color: "white", border: "none",
                borderRadius: 12, padding: "14px", fontFamily: FONT_UI, fontWeight: 700, fontSize: 16,
                cursor: sending ? "default" : "pointer", opacity: sending ? 0.7 : 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              <Send size={18} />
              {sending ? "Envoi en cuisine…" : "Envoyer en cuisine"}
            </button>
          </div>
        </div>
      )}

      {/* Confirmation */}
      {confirmedOrder && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(35,31,28,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: 20 }} onClick={() => setConfirmedOrder(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: C.blancCasse, borderRadius: 20, padding: 28, maxWidth: 340, textAlign: "center" }}>
            <CheckCircle2 size={40} color={C.vertBabyfoot} style={{ marginBottom: 10 }} />
            <h3 style={{ fontFamily: FONT_TITLE, fontSize: 30, color: C.bordeaux, margin: "0 0 6px" }}>C'est parti !</h3>
            <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: C.boisFonce, margin: "0 0 16px" }}>
              La commande de <strong>{confirmedOrder.tableLabel}</strong> est en cuisine — {euros(confirmedOrder.total)}.
            </p>
            <button
              onClick={() => setConfirmedOrder(null)}
              style={{ background: C.bordeaux, color: "white", border: "none", borderRadius: 999, padding: "10px 24px", fontFamily: FONT_UI, fontWeight: 600, cursor: "pointer" }}
            >
              Continuer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// KITCHEN VIEW — Écran Cuisine
// ---------------------------------------------------------------------------
function KitchenView({ onBack }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  const load = useCallback(async () => {
    try {
      const data = await sb(
        "orders?select=*,order_items(*)&status=in.(nouvelle,en_preparation,prete)&order=created_at.asc"
      );
      setOrders(data);
      setError(null);
    } catch (e) {
      setError("Connexion à la cuisine interrompue…");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    timerRef.current = setInterval(load, 4000);
    return () => clearInterval(timerRef.current);
  }, [load]);

  async function advance(order) {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    setOrders((os) => os.map((o) => (o.id === order.id ? { ...o, status: next } : o)));
    try {
      await sb(`orders?id=eq.${order.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: next }),
      });
    } catch (e) {
      load();
    }
  }

  const columns = ["nouvelle", "en_preparation", "prete"];

  return (
    <div style={{ minHeight: "100vh", background: C.boisFonce, fontFamily: FONT_UI, color: C.blancCasse, position: "relative" }}>
      <FontLoader />
      <header style={{ padding: "20px 20px 16px", display: "flex", alignItems: "center", gap: 14, borderBottom: `1px solid ${C.boisClair}44` }}>
        <button onClick={onBack} style={{ background: "transparent", border: "none", color: C.blancCasse, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: FONT_UI, fontSize: 13, opacity: 0.8 }}>
          <ArrowLeft size={18} /> Carte
        </button>
        <ChefHat size={24} color={C.jauneVelux} />
        <h1 style={{ fontFamily: FONT_TITLE, fontSize: 32, margin: 0, color: C.jauneVelux }}>Écran Cuisine</h1>
        {error && <span style={{ marginLeft: "auto", color: "#e88", fontSize: 12 }}>{error}</span>}
      </header>

      {loading ? (
        <div style={{ padding: 40, textAlign: "center", opacity: 0.7 }}>Chargement des commandes…</div>
      ) : orders.length === 0 ? (
        <div style={{ padding: 60, textAlign: "center", opacity: 0.6, fontFamily: FONT_BODY, fontSize: 16 }}>
          Aucune commande en cours — la salle est calme.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, padding: 20 }}>
          {columns.map((status) => {
            const colOrders = orders.filter((o) => o.status === status);
            const meta = STATUS_META[status];
            return (
              <div key={status}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: meta.color, display: "inline-block" }} />
                  <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: 0.5, textTransform: "uppercase", opacity: 0.85 }}>
                    {meta.label} ({colOrders.length})
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {colOrders.map((order) => (
                    <OrderCard key={order.id} order={order} onAdvance={() => advance(order)} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function OrderCard({ order, onAdvance }) {
  const meta = STATUS_META[order.status];
  const next = NEXT_STATUS[order.status];
  const minutesAgo = Math.max(0, Math.round((Date.now() - new Date(order.created_at).getTime()) / 60000));

  return (
    <div style={{ background: C.blancCasse, color: C.noirEncre, borderRadius: 14, padding: 16, borderLeft: `5px solid ${meta.color}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <span style={{ fontFamily: FONT_UI, fontWeight: 700, fontSize: 15 }}>{order.table_label}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, opacity: 0.6 }}>
          <Clock size={13} /> {minutesAgo} min
        </span>
      </div>
      <div style={{ marginBottom: 12 }}>
        {order.order_items.map((oi) => (
          <div key={oi.id} style={{ fontFamily: FONT_BODY, fontSize: 14, display: "flex", justifyContent: "space-between" }}>
            <span><strong>{oi.quantity}×</strong> {oi.item_name_snapshot}</span>
          </div>
        ))}
      </div>
      {next && (
        <button
          onClick={onAdvance}
          style={{
            width: "100%", background: C.vertBabyfoot, color: "white", border: "none", borderRadius: 8,
            padding: "8px", fontFamily: FONT_UI, fontWeight: 600, fontSize: 13, cursor: "pointer",
          }}
        >
          {order.status === "prete" ? "Marquer servie" : `Passer à « ${STATUS_META[next].label} »`}
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
export default function GuinguetteAM() {
  const [view, setView] = useState("carte"); // "carte" | "cuisine"
  return view === "carte" ? (
    <CarteView onGoKitchen={() => setView("cuisine")} />
  ) : (
    <KitchenView onBack={() => setView("carte")} />
  );
}
