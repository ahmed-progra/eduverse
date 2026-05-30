import json
from typing import AsyncGenerator

from anthropic import AsyncAnthropic

from app.core.config import settings

SYSTEM_PROMPT = """You are EduBot, an expert educational AI assistant for the EduVerse learning platform. Your role is to help students understand concepts, answer questions, and guide their learning journey.

Guidelines:
- Be encouraging and supportive
- Explain concepts clearly with examples
- Ask clarifying questions when needed
- Never give direct answers to exam questions
- Adapt explanations to the student's level
- Use markdown formatting for clarity
- Reference lesson content when available
- Keep responses focused and educational"""


def get_anthropic_client() -> AsyncAnthropic:
    return AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)


async def generate_chat_response(
    message: str,
    history: list[dict] | None = None,
    lesson_context: str | None = None,
) -> AsyncGenerator[str, None]:
    client = get_anthropic_client()

    messages = []
    if history:
        for msg in history:
            messages.append({
                "role": msg.get("role", "user"),
                "content": msg.get("content", ""),
            })

    user_content = message
    if lesson_context:
        user_content = f"[Lesson Context]\n{lesson_context}\n\n[Student Question]\n{message}"

    messages.append({"role": "user", "content": user_content})

    async with client.messages.stream(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        system=SYSTEM_PROMPT,
        messages=messages,
    ) as stream:
        async for text in stream.text_stream:
            yield text


async def generate_summary(lesson_content: list | dict | str) -> str:
    client = get_anthropic_client()

    content_str = json.dumps(lesson_content) if isinstance(lesson_content, (list, dict)) else str(lesson_content)

    response = await client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=512,
        system="You are an educational content summarizer. Summarize the following lesson content in approximately 150 words. Focus on key concepts and learning objectives. Use clear, concise language.",
        messages=[
            {
                "role": "user",
                "content": f"Summarize this lesson content in ~150 words:\n\n{content_str}",
            }
        ],
    )
    return response.content[0].text
