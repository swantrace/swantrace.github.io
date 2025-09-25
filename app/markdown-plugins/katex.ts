import type MarkdownIt from "markdown-it";
import katex from "katex";

// KaTeX plugin for markdown-it
// Supports both inline math $..$ and display math $$..$$
export function katexPlugin(md: MarkdownIt) {
  // Inline math: $...$
  md.inline.ruler.before(
    "escape",
    "math_inline",
    function math_inline(state, silent) {
      const start = state.pos;
      
      if (state.src[start] !== "$") {
        return false;
      }

      // Look for closing $
      let pos = start + 1;
      while (pos < state.posMax && state.src[pos] !== "$") {
        pos++;
      }

      if (pos >= state.posMax) {
        return false;
      }

      // Don't match $$ (that's block math)
      if (pos === start + 1 || (pos < state.posMax - 1 && state.src[pos + 1] === "$")) {
        return false;
      }

      const content = state.src.slice(start + 1, pos);
      
      if (!silent) {
        try {
          const rendered = katex.renderToString(content, {
            throwOnError: false,
            displayMode: false,
          });
          
          const token = state.push("math_inline", "span", 0);
          token.content = content;
          token.markup = "$";
          token.map = [start, pos + 1];
          
          // Store rendered HTML
          token.attrSet("class", "katex-inline");
          token.meta = { rendered };
        } catch (err) {
          // On error, just show the raw content
          const token = state.push("text", "", 0);
          token.content = `$${content}$`;
        }
      }

      state.pos = pos + 1;
      return true;
    }
  );

  // Block math: $$...$$
  md.block.ruler.before(
    "fence",
    "math_block",
    function math_block(state, start, end, silent) {
      const startLine = state.getLines(start, start + 1, 0, false);
      
      if (!startLine.startsWith("$$")) {
        return false;
      }

      let nextLine = start + 1;
      let endLine = -1;
      
      // Look for closing $$
      while (nextLine < end) {
        const line = state.getLines(nextLine, nextLine + 1, 0, false);
        if (line.trim() === "$$") {
          endLine = nextLine;
          break;
        }
        nextLine++;
      }

      if (endLine === -1) {
        return false;
      }

      // Extract content between $$ markers
      const content = state.getLines(start + 1, endLine, 0, false);

      if (!silent) {
        try {
          const rendered = katex.renderToString(content, {
            throwOnError: false,
            displayMode: true,
          });

          const token = state.push("math_block", "div", 0);
          token.content = content;
          token.markup = "$$";
          token.map = [start, endLine + 1];
          
          // Store rendered HTML
          token.attrSet("class", "katex-display");
          token.meta = { rendered };
        } catch (err) {
          // On error, show raw content
          const token = state.push("paragraph_open", "p", 1);
          const textToken = state.push("text", "", 0);
          textToken.content = `$$\n${content}\n$$`;
          state.push("paragraph_close", "p", -1);
        }
      }

      state.line = endLine + 1;
      return true;
    }
  );

  // Render inline math
  md.renderer.rules.math_inline = function (tokens, idx) {
    const token = tokens[idx];
    return token.meta?.rendered || `$${token.content}$`;
  };

  // Render block math
  md.renderer.rules.math_block = function (tokens, idx) {
    const token = tokens[idx];
    return token.meta?.rendered || `<div class="math-block">$$\n${token.content}\n$$</div>`;
  };
}