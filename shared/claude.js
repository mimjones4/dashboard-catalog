// Workers-native Claude client. Calls the Anthropic Messages API directly with
// fetch (no SDK) so it runs on the Cloudflare Workers runtime without Node
// polyfills. Uses structured outputs so callers always get well-formed JSON.

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_MODEL = "claude-opus-4-8";

// Raised to the caller; carries an HTTP status the endpoint can surface.
export class ClaudeError extends Error {
  constructor(message, status = 502) {
    super(message);
    this.status = status;
  }
}

/**
 * Make a structured Claude call and return the parsed JSON object.
 *
 * @param {object} opts
 * @param {string} opts.apiKey        - Anthropic API key (Worker secret).
 * @param {string} [opts.model]       - Model id (defaults to claude-opus-4-8).
 * @param {string} opts.system        - System prompt.
 * @param {Array}  opts.messages      - Messages array.
 * @param {object} opts.schema        - JSON schema for output_config.format.
 * @param {string} [opts.effort]      - "high" | "medium" | "low".
 * @param {number} [opts.maxTokens]
 */
export async function structuredCall({
  apiKey,
  model = DEFAULT_MODEL,
  system,
  messages,
  schema,
  effort = "high",
  maxTokens = 16000
}) {
  if (!apiKey) {
    throw new ClaudeError("Server is missing ANTHROPIC_API_KEY.", 500);
  }

  const body = {
    model,
    max_tokens: maxTokens,
    system,
    messages,
    thinking: { type: "adaptive" },
    output_config: {
      effort,
      format: { type: "json_schema", schema }
    }
  };

  let res;
  try {
    res = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(body)
    });
  } catch (err) {
    throw new ClaudeError(`Could not reach the Claude API: ${err.message}`, 502);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let msg = `Claude API error (${res.status})`;
    try {
      const parsed = JSON.parse(text);
      if (parsed?.error?.message) msg += `: ${parsed.error.message}`;
    } catch {
      if (text) msg += `: ${text.slice(0, 200)}`;
    }
    // 401/403 are a server config problem, not the user's fault.
    const status = res.status === 401 || res.status === 403 ? 500 : res.status === 429 ? 429 : 502;
    throw new ClaudeError(msg, status);
  }

  const data = await res.json();

  if (data.stop_reason === "refusal") {
    const why = data.stop_details?.explanation || "The model declined this request.";
    throw new ClaudeError(why, 422);
  }
  if (data.stop_reason === "max_tokens") {
    throw new ClaudeError("The response was cut off (max_tokens). Please try again.", 502);
  }

  const textBlock = (data.content || []).find((b) => b.type === "text");
  if (!textBlock) {
    throw new ClaudeError("The model returned no text content.", 502);
  }
  try {
    return JSON.parse(textBlock.text);
  } catch {
    throw new ClaudeError("The model returned malformed JSON.", 502);
  }
}
