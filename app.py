"""CreatorBridge AI Campaign Director & Real-Time ROI Simulator.

Run locally with:
    streamlit run app.py

The recommendation engine is intentionally deterministic and offline-first so
the demo works without an API key. Replace ``parse_campaign_with_llm`` with an
LLM adapter later without changing the Streamlit UI or return shape.
"""

from __future__ import annotations

import json
import re
from dataclasses import asdict, dataclass
from typing import Any

import streamlit as st

from modules.chat import render_chat_hub


@dataclass(frozen=True)
class InventoryItem:
    name: str
    category: str
    price: float
    reach: int
    engagement_rate: float
    keywords: tuple[str, ...]
    description: str


INVENTORY: dict[str, list[InventoryItem]] = {
    "Equipment": [
        InventoryItem(
            "Creator lighting kit",
            "Equipment",
            450,
            5_000,
            0.035,
            ("video", "reel", "content", "studio", "lighting"),
            "Two LED panels, stands, and modifiers for clean product footage.",
        ),
        InventoryItem(
            "Pop-up event AV kit",
            "Equipment",
            1_200,
            12_000,
            0.045,
            ("pop-up", "event", "launch", "audio", "av"),
            "Compact sound, display, and capture setup for a live activation.",
        ),
        InventoryItem(
            "Product photography kit",
            "Equipment",
            700,
            7_000,
            0.04,
            ("product", "photo", "photography", "skincare", "packaging"),
            "Macro lens, tabletop surface, and softbox for product stills.",
        ),
    ],
    "Decor": [
        InventoryItem(
            "Minimal brand pop-up set",
            "Decor",
            1_500,
            9_000,
            0.05,
            ("pop-up", "event", "launch", "decor", "activation"),
            "Modular plinths, signage, florals, and a branded welcome moment.",
        ),
        InventoryItem(
            "Sustainable display package",
            "Decor",
            950,
            6_000,
            0.045,
            ("eco", "sustainable", "green", "display", "skincare"),
            "Reusable recycled-paper display pieces and low-waste styling.",
        ),
    ],
    "Crew": [
        InventoryItem(
            "Short-form video crew",
            "Crew",
            2_400,
            18_000,
            0.055,
            ("video", "reel", "content", "crew", "film"),
            "Director, camera operator, and editor for social-first deliverables.",
        ),
        InventoryItem(
            "Event production crew",
            "Crew",
            1_800,
            13_000,
            0.05,
            ("pop-up", "event", "launch", "crew", "production"),
            "Producer and on-site coordinator for a smooth event day.",
        ),
        InventoryItem(
            "Creator seeding crew",
            "Crew",
            1_350,
            10_000,
            0.06,
            ("creator", "influencer", "seeding", "pr", "unboxing"),
            "Outreach and coordination for a focused creator gifting wave.",
        ),
    ],
    "PR": [
        InventoryItem(
            "Launch PR package",
            "PR",
            1_750,
            15_000,
            0.04,
            ("launch", "press", "pr", "awareness", "event"),
            "Press list, launch note, and targeted outreach to relevant editors.",
        ),
        InventoryItem(
            "Creator seeding package",
            "PR",
            1_250,
            11_000,
            0.06,
            ("creator", "influencer", "seeding", "unboxing", "pr"),
            "Curated creator shortlist, gifting coordination, and follow-ups.",
        ),
        InventoryItem(
            "Community PR package",
            "PR",
            750,
            6_000,
            0.05,
            ("community", "local", "awareness", "social"),
            "Local community outreach and lightweight social amplification.",
        ),
    ],
}


def extract_budget(prompt: str, budget: float | None) -> float:
    """Return the explicit budget field, or infer a currency amount from text."""
    if budget and budget > 0:
        return float(budget)
    matches = re.findall(r"(?:[$€£₹]|usd|inr|rs\.?)?\s*([\d,]+(?:\.\d+)?)\s*(?:k|000)?", prompt.lower())
    if not matches:
        return 10_000.0
    raw = matches[-1].replace(",", "")
    amount = float(raw)
    if re.search(r"\bk\b", prompt.lower()):
        amount *= 1_000
    return amount


def parse_campaign_requirements(prompt: str) -> dict[str, Any]:
    """Extract simple requirements from natural language without an API call."""
    text = prompt.lower()
    video_count = 0
    count_match = re.search(r"(\d+)\s+(?:promotional\s+)?videos?|(\d+)\s+reels?", text)
    if count_match:
        video_count = int(next(value for value in count_match.groups() if value))
    return {
        "needs_event": any(word in text for word in ("event", "pop-up", "popup", "activation", "launch party")),
        "needs_video": any(word in text for word in ("video", "reel", "film", "content")),
        "needs_product_photos": any(word in text for word in ("photo", "photography", "product shot")),
        "needs_eco": any(word in text for word in ("eco", "sustainable", "green", "low-waste")),
        "needs_pr": any(word in text for word in ("pr", "press", "awareness", "launch", "media")),
        "needs_creators": any(word in text for word in ("creator", "influencer", "seeding", "ugc")),
        "video_count": video_count,
    }


def choose_item(items: list[InventoryItem], requirements: dict[str, Any]) -> InventoryItem:
    """Choose the best matching inventory item, with a stable fallback."""
    text = " ".join(key for key, enabled in requirements.items() if enabled)
    scored = sorted(
        items,
        key=lambda item: sum(keyword in text for keyword in item.keywords),
        reverse=True,
    )
    return scored[0]


def recommend_and_simulate_campaign(
    prompt: str,
    budget: float | None = None,
) -> dict[str, Any]:
    """Recommend a service package and return a serializable ROI simulation."""
    if not prompt.strip():
        raise ValueError("Campaign goal cannot be empty.")

    requirements = parse_campaign_requirements(prompt)
    user_budget = extract_budget(prompt, budget)
    selected: list[InventoryItem] = []

    if requirements["needs_event"]:
        selected.extend(
            [
                next(item for item in INVENTORY["Equipment"] if item.name == "Pop-up event AV kit"),
                next(item for item in INVENTORY["Decor"] if item.name == "Minimal brand pop-up set"),
                next(item for item in INVENTORY["Crew"] if item.name == "Event production crew"),
            ]
        )
    elif requirements["needs_video"]:
        selected.append(next(item for item in INVENTORY["Equipment"] if item.name == "Creator lighting kit"))
        selected.append(next(item for item in INVENTORY["Crew"] if item.name == "Short-form video crew"))

    if requirements["needs_product_photos"]:
        selected.append(next(item for item in INVENTORY["Equipment"] if item.name == "Product photography kit"))
    if requirements["needs_eco"]:
        selected.append(next(item for item in INVENTORY["Decor"] if item.name == "Sustainable display package"))
    if requirements["needs_pr"] or requirements["needs_event"]:
        selected.append(
            choose_item(INVENTORY["PR"], {"needs_creators": requirements["needs_creators"], "needs_pr": True})
        )
    elif requirements["needs_creators"]:
        selected.append(next(item for item in INVENTORY["PR"] if item.name == "Creator seeding package"))

    if not selected:
        selected = [
            next(item for item in INVENTORY["Crew"] if item.name == "Short-form video crew"),
            next(item for item in INVENTORY["PR"] if item.name == "Community PR package"),
        ]

    unique_items = list({item.name: item for item in selected}.values())
    multiplier = max(1, requirements["video_count"])
    if requirements["video_count"] > 1:
        video_crew = next((item for item in unique_items if item.name == "Short-form video crew"), None)
        if video_crew:
            extra_cost = video_crew.price * min(multiplier - 1, 3) * 0.35
        else:
            extra_cost = 0
    else:
        extra_cost = 0

    total_cost = round(sum(item.price for item in unique_items) + extra_cost, 2)
    reach = int(sum(item.reach for item in unique_items) * (1 + max(0, multiplier - 1) * 0.28))
    weighted_engagement = sum(item.reach * item.engagement_rate for item in unique_items)
    engagement_rate = weighted_engagement / max(1, sum(item.reach for item in unique_items))
    projected_revenue = round(reach * engagement_rate * 1.35, 2)
    roi = round(((projected_revenue - total_cost) / total_cost) * 100, 1) if total_cost else 0.0

    return {
        "campaign_goal": prompt.strip(),
        "budget": user_budget,
        "total_estimated_cost": total_cost,
        "remaining_budget": round(user_budget - total_cost, 2),
        "over_budget": total_cost > user_budget,
        "requirements": requirements,
        "projected_metrics": {
            "estimated_reach": reach,
            "engagement_rate": round(engagement_rate * 100, 2),
            "projected_revenue": projected_revenue,
            "projected_roi": roi,
        },
        "recommendations": {
            category: [asdict(item) for item in unique_items if item.category == category]
            for category in INVENTORY
        },
    }


def render_recommendations(plan: dict[str, Any]) -> None:
    """Render one recommendation category as a compact Streamlit section."""
    for category, items in plan["recommendations"].items():
        if not items:
            continue
        st.subheader(category)
        for item in items:
            st.markdown(f"**{item['name']}** — ${item['price']:,.0f}")
            st.caption(item["description"])


def render_app() -> None:
    st.set_page_config(
        page_title="CreatorBridge Campaign Director",
        page_icon="🌸",
        layout="wide",
    )

    with st.sidebar:
        st.header("CreatorBridge")
        page = st.radio(
            "Open workspace",
            ("AI Campaign Director", "Chat & Collaboration Hub"),
            label_visibility="collapsed",
        )

    if page == "Chat & Collaboration Hub":
        render_chat_hub(configure_page=False)
        return

    st.title("AI Campaign Director")
    st.caption("Turn a campaign idea into a practical service package and a live ROI estimate.")

    with st.sidebar:
        st.header("Campaign inputs")
        budget = st.number_input("Budget (USD)", min_value=0.0, value=10_000.0, step=500.0)
        st.caption("Estimates are planning projections, not guarantees.")

    prompt = st.text_area(
        "What are you trying to achieve?",
        placeholder="Launch a new eco-friendly skincare line with a pop-up event and 3 promotional videos within a $10,000 budget",
        height=120,
    )

    if st.button("Generate AI Campaign Plan", type="primary", use_container_width=True):
        try:
            st.session_state["campaign_plan"] = recommend_and_simulate_campaign(prompt, budget)
        except ValueError as error:
            st.error(str(error))

    plan = st.session_state.get("campaign_plan")
    if not plan:
        st.info("Describe your campaign above to generate a recommended package.")
        return

    if plan["over_budget"]:
        st.warning(
            f"This package is ${abs(plan['remaining_budget']):,.0f} over your ${plan['budget']:,.0f} budget. "
            "Remove an item or increase the budget before accepting it."
        )

    metrics = plan["projected_metrics"]
    metric_columns = st.columns(4)
    metric_columns[0].metric("Estimated cost", f"${plan['total_estimated_cost']:,.0f}")
    metric_columns[1].metric("Projected reach", f"{metrics['estimated_reach']:,}")
    metric_columns[2].metric("Engagement rate", f"{metrics['engagement_rate']:.2f}%")
    metric_columns[3].metric("Projected ROI", f"{metrics['projected_roi']:.1f}%")

    st.divider()
    render_recommendations(plan)

    if st.button("Accept & Add to Budget Planner", disabled=plan["over_budget"]):
        st.session_state["accepted_campaign"] = plan
        st.success("Campaign plan accepted and added to the budget planner.")
        st.code(json.dumps(plan, indent=2), language="json")


if __name__ == "__main__":
    render_app()
