import json
import re
import sys
import html
from datetime import datetime, timezone
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError
import xml.etree.ElementTree as ET

RSS_URL = "https://news.google.com/rss?hl=es&gl=ES&ceid=ES:es"
OUTPUT_PATH = "news.json"
LIMIT = 8

NS = {
    "media": "http://search.yahoo.com/mrss/"
}

def fetch_text(url: str) -> str:
    req = Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (compatible; FacileNewsBot/1.0)"
        }
    )
    with urlopen(req, timeout=20) as response:
        return response.read().decode("utf-8", errors="replace")

def normalize_spaces(text: str) -> str:
    return re.sub(r"\s+", " ", (text or "")).strip()

def split_title_parts(title: str):
    return [p.strip() for p in (title or "").split(" - ") if p.strip()]

def normalize_text(text: str) -> str:
    import unicodedata
    text = unicodedata.normalize("NFD", text or "")
    text = "".join(ch for ch in text if unicodedata.category(ch) != "Mn")
    text = text.lower().replace("&amp;", "and")
    return re.sub(r"[^a-z0-9]+", "", text)

def extract_source(title: str) -> str:
    parts = split_title_parts(title)
    if not parts:
        return "Google Noticias"

    last = normalize_text(parts[-1])
    if last in ("googlenews", "google"):
        if len(parts) >= 2:
            return parts[-2]
        return "Google Noticias"

    if len(parts) >= 2:
        return parts[-1]

    return "Google Noticias"

def extract_clean_title(title: str) -> str:
    parts = split_title_parts(title)
    if not parts:
        return "Titular no disponible"

    last = normalize_text(parts[-1])

    if last in ("googlenews", "google"):
        if len(parts) >= 3:
            return " - ".join(parts[:-2]).strip() or title
        if len(parts) >= 2:
            return parts[0]
        return title

    if len(parts) >= 2:
        return " - ".join(parts[:-1]).strip() or title

    return title

def strip_html_tags(raw_html: str) -> str:
    if not raw_html:
        return ""
    no_tags = re.sub(r"<[^>]+>", " ", raw_html)
    return normalize_spaces(html.unescape(no_tags))

def extract_first_non_google_link(raw_html: str, fallback_link: str) -> str:
    if raw_html:
        links = re.findall(r'href=["\']([^"\']+)["\']', raw_html, flags=re.I)
        for link in links:
            if "news.google.com" not in link:
                return link
    return fallback_link

def extract_image(item: ET.Element, description_html: str) -> str:
    media_content = item.find("media:content", NS)
    if media_content is not None and media_content.get("url"):
        return media_content.get("url")

    media_thumb = item.find("media:thumbnail", NS)
    if media_thumb is not None and media_thumb.get("url"):
        return media_thumb.get("url")

    enclosure = item.find("enclosure")
    if enclosure is not None and enclosure.get("url"):
        return enclosure.get("url")

    img_match = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', description_html or "", flags=re.I)
    if img_match:
        return img_match.group(1)

    raw_url_img = re.search(r'(https?://[^"\')\s]+\.(?:jpg|jpeg|png|webp|gif))', description_html or "", flags=re.I)
    if raw_url_img:
        return raw_url_img.group(1)

    return ""

def parse_rss(xml_text: str):
    root = ET.fromstring(xml_text)
    channel = root.find("channel")
    if channel is None:
        return []

    items = []
    for item in channel.findall("item")[:LIMIT]:
        raw_title = item.findtext("title", default="") or ""
        raw_link = item.findtext("link", default="") or ""
        raw_pub_date = item.findtext("pubDate", default="") or ""
        raw_description = item.findtext("description", default="") or ""

        clean_title = extract_clean_title(raw_title)
        source = extract_source(raw_title)
        link = extract_first_non_google_link(raw_description, raw_link)
        image = extract_image(item, raw_description)
        summary = strip_html_tags(raw_description)[:260].strip()

        items.append({
            "title": clean_title or "Titular no disponible",
            "source": source or "Google Noticias",
            "summary": summary,
            "image": image,
            "link": link or raw_link or "about:blank",
            "pubDate": raw_pub_date
        })

    return items

def main():
    try:
        xml_text = fetch_text(RSS_URL)
        items = parse_rss(xml_text)

        if not items:
            raise RuntimeError("No se encontraron items en el RSS")

        payload = {
            "updatedAt": datetime.now(timezone.utc).isoformat(),
            "source": "google-news-rss",
            "query": "",
            "items": items
        }

        with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)

        print(f"OK: generado {OUTPUT_PATH} con {len(items)} noticias.")
        return 0

    except (URLError, HTTPError, ET.ParseError, RuntimeError, Exception) as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return 1

if __name__ == "__main__":
    raise SystemExit(main())
