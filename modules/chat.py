"""Business-to-Creator Chat & Collaboration Hub for Streamlit.

Use as a standalone page:

    streamlit run modules/chat.py

Or import ``render_chat_hub`` from another Streamlit app and call it from a
page or section:

    from modules.chat import render_chat_hub
    render_chat_hub()
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from typing import Any, Literal

import streamlit as st

Role = Literal["business", "creator", "system"]
USER_ROLES = ("business", "creator")

QUICK_REPLIES: dict[str, tuple[str, str]] = {
    "Send equipment list": (
        "business",
        "Here is the current equipment list: creator lighting kit, product photography kit, and pop-up event AV kit. Which setup would you prefer?",
    ),
    "Share campaign brief": (
        "business",
        "I have shared the campaign brief. The key deliverables are short-form video, product photography, and launch-day coverage.",
    ),
    "Request availability": (
        "business",
        "Could you share your availability for the proposed production dates and your earliest delivery date?",
    ),
    "Propose $1,000 budget": (
        "business",
        "I can propose a $1,000 production budget. Does that work for the agreed scope and deliverables?",
    ),
}


def _timestamp() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _new_message(role: Role, content: str) -> dict[str, str]:
    return {"role": role, "content": content.strip(), "timestamp": _timestamp()}


def _initial_messages() -> list[dict[str, str]]:
    return [
        _new_message(
            "system",
            "Collaboration started. Keep project scope, availability, equipment, and budget decisions in this thread.",
        ),
        _new_message(
            "business",
            "Hi Maya, we are planning a skincare launch and would love to discuss your availability and production needs.",
        ),
        _new_message(
            "creator",
            "Thanks, I would be happy to explore it. Could you share the expected deliverables and target production date?",
        ),
    ]


def _ensure_state() -> None:
    if "chat_messages" not in st.session_state:
        st.session_state.chat_messages = _initial_messages()
    if "chat_role" not in st.session_state:
        st.session_state.chat_role = "business"
    if "chat_ai_enabled" not in st.session_state:
        st.session_state.chat_ai_enabled = True


def _append_message(role: Role, content: str) -> None:
    if content.strip():
        st.session_state.chat_messages.append(_new_message(role, content))


def _assistant_suggestion(messages: list[dict[str, str]]) -> str | None:
    """Return one useful mock suggestion when the conversation contains a trigger."""
    recent_text = " ".join(message["content"].lower() for message in messages[-5:])
    if any(word in recent_text for word in ("equipment", "camera", "lighting", "av")):
        return "Suggested next step: confirm the equipment list, pickup or delivery date, and who is responsible for setup."
    if any(word in recent_text for word in ("budget", "$", "cost", "fee", "rate")):
        return "Suggested agreement term: confirm the total fee, payment milestones, revision count, and any reimbursable production costs."
    if any(word in recent_text for word in ("available", "availability", "date", "deadline")):
        return "Suggested next step: agree on the shoot date, first-cut delivery date, feedback window, and final delivery date."
    if any(word in recent_text for word in ("brief", "deliverable", "scope", "reel", "video")):
        return "Suggested agreement term: write down the number of videos, aspect ratios, usage rights, revision rounds, and approval owner."
    return None


def _render_message(message: dict[str, str]) -> None:
    role = message["role"]
    label = {"business": "Business", "creator": "Content Creator", "system": "Assistant"}[role]
    avatar = {"business": "🏢", "creator": "🎥", "system": "✦"}[role]
    with st.chat_message(label.lower(), avatar=avatar):
        st.caption(f"{label} · {message['timestamp'].replace('T', ' ')[:16]} UTC")
        st.write(message["content"])


def _export_payload(messages: list[dict[str, str]]) -> dict[str, Any]:
    terms = [
        message["content"]
        for message in messages
        if message["role"] in USER_ROLES
        and any(
            keyword in message["content"].lower()
            for keyword in ("budget", "fee", "deliverable", "scope", "available", "equipment", "deadline")
        )
    ]
    return {
        "exported_at": _timestamp(),
        "title": "CreatorBridge collaboration brief",
        "participants": ["Business", "Content Creator"],
        "key_terms": terms,
        "messages": messages,
    }


def render_chat_hub(*, configure_page: bool = True) -> None:
    """Render the complete Business-to-Creator chat experience."""
    if configure_page:
        st.set_page_config(
            page_title="CreatorBridge Chat Hub",
            page_icon="💬",
            layout="centered",
        )
    _ensure_state()

    st.title("Business ↔ Creator Chat")
    st.caption("Align on scope, availability, production needs, and budget in one shared thread.")

    with st.sidebar:
        st.header("Your perspective")
        selected_label = st.radio(
            "Send messages as",
            ("Business User", "Content Creator"),
            index=USER_ROLES.index(st.session_state.chat_role),
        )
        st.session_state.chat_role = "business" if selected_label == "Business User" else "creator"
        st.session_state.chat_ai_enabled = st.toggle(
            "Enable AI suggestions",
            value=st.session_state.chat_ai_enabled,
            help="Adds a lightweight offline suggestion when relevant keywords appear.",
        )
        if st.button("Clear conversation", use_container_width=True):
            st.session_state.chat_messages = _initial_messages()
            st.rerun()

    st.subheader("Quick replies")
    quick_columns = st.columns(2)
    for index, (label, (role, content)) in enumerate(QUICK_REPLIES.items()):
        if quick_columns[index % 2].button(label, use_container_width=True):
            _append_message(role, content)
            st.rerun()

    st.divider()
    for message in st.session_state.chat_messages:
        _render_message(message)

    if st.session_state.chat_ai_enabled:
        suggestion = _assistant_suggestion(st.session_state.chat_messages)
        if suggestion and (
            not st.session_state.chat_messages
            or st.session_state.chat_messages[-1]["content"] != suggestion
        ):
            with st.chat_message("assistant", avatar="✦"):
                st.caption("AI Assistant · offline suggestion")
                st.info(suggestion)
            if st.button("Add suggestion to chat"):
                _append_message("system", suggestion)
                st.rerun()

    if prompt := st.chat_input(f"Message as {selected_label}..."):
        _append_message(st.session_state.chat_role, prompt)
        st.rerun()

    st.divider()
    st.subheader("Campaign brief export")
    st.caption("Export the conversation and detected scope decisions for your campaign planner.")
    payload = _export_payload(st.session_state.chat_messages)
    export_json = json.dumps(payload, indent=2)
    st.download_button(
        "Export Chat & Key Terms to Campaign Brief",
        data=export_json,
        file_name="creatorbridge-collaboration-brief.json",
        mime="application/json",
        use_container_width=True,
    )
    with st.expander("Preview export"):
        st.json(payload)


if __name__ == "__main__":
    render_chat_hub()
