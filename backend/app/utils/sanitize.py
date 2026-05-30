import bleach

ALLOWED_TAGS = [
    "p", "br", "strong", "em", "u", "ol", "ul", "li",
    "pre", "code", "blockquote", "h1", "h2", "h3", "h4", "h5", "h6",
    "span", "div", "a",
]
ALLOWED_ATTRS = {
    "a": ["href", "title", "target"],
    "span": ["class"],
    "div": ["class"],
    "code": ["class"],
}


def sanitize_html(text: str) -> str:
    return bleach.clean(
        text,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRS,
        strip=True,
    )
