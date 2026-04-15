function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function safeUrl(url) {
    const trimmedUrl = String(url).trim();
    if (/^(https?:|mailto:|\/)/i.test(trimmedUrl)) {
        return escapeHtml(trimmedUrl);
    }
    return '#';
}

function renderInline(value) {
    const tokens = [];
    const addToken = function (html) {
        tokens.push(html);
        return `\u0000${tokens.length - 1}\u0000`;
    };

    return escapeHtml(String(value)
        .replace(/`([^`]+)`/g, (match, text) => addToken(`<code>${escapeHtml(text)}</code>`))
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => addToken(`<a href="${safeUrl(url)}" class="lpHref" target="_blank" rel="noopener noreferrer">${escapeHtml(text)}</a>`)))
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/__([^_]+)__/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/_([^_]+)_/g, '<em>$1</em>')
        .replace(/\u0000(\d+)\u0000/g, (match, index) => tokens[index]);
}

function renderList(lines, ordered) {
    const tag = ordered ? 'ol' : 'ul';
    const matcher = ordered ? /^\d+\.\s+(.+)$/ : /^[-*+]\s+(.+)$/;

    return `<${tag}>${lines.map(line => `<li>${renderInline(line.replace(matcher, '$1'))}</li>`).join('')}</${tag}>`;
}

function renderParagraph(lines) {
    return `<p>${lines.map(renderInline).join('<br>')}</p>`;
}

function isHorizontalRule(line) {
    return /^ {0,3}([-*_])(?:\s*\1){2,}\s*$/.test(line);
}

function renderLines(lines) {
    const out = [];
    let paragraph = [];
    let list = [];
    let listOrdered = false;
    const flushParagraph = function () {
        if (!paragraph.length) {
            return;
        }

        out.push(renderParagraph(paragraph));
        paragraph = [];
    };
    const flushList = function () {
        if (!list.length) {
            return;
        }

        out.push(renderList(list, listOrdered));
        list = [];
    };

    lines.forEach((line) => {
        const heading = line.match(/^(#{1,3})\s+(.+)$/);
        const unordered = /^[-*+]\s+/.test(line);
        const ordered = /^\d+\.\s+/.test(line);

        if (heading) {
            flushParagraph();
            flushList();
            out.push(`<h${heading[1].length}>${renderInline(heading[2])}</h${heading[1].length}>`);
            return;
        }
        if (isHorizontalRule(line)) {
            flushParagraph();
            flushList();
            out.push('<hr>');
            return;
        }
        if (unordered || ordered) {
            flushParagraph();
            if (list.length && listOrdered !== ordered) {
                flushList();
            }
            listOrdered = ordered;
            list.push(line);
            return;
        }

        flushList();
        paragraph.push(line);
    });

    flushParagraph();
    flushList();
    return out.join('');
}

function renderMarkdown(value) {
    const source = String(value || '').replace(/\r\n/g, '\n').trim();

    if (!source) {
        return '';
    }

    return source.split(/\n{2,}/).map((block) => {
        const lines = block.split('\n');
        return renderLines(lines);
    }).join('');
}

module.exports = renderMarkdown;
