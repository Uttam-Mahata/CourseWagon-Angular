import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MathRendererService {
  
  constructor() { }

  /**
   * Process markdown content to handle math expressions
   * Uses a mixed approach:
   * - KaTeX for inline and simple equations
   * - MathJax for multiline/complex equations
   * 
   * @param content Markdown content with LaTeX expressions
   * @returns Processed content
   */
  processContent(content: string): string {
    if (!content) return '';

    // First, preserve any escaped dollar signs
    // Corrected: ensure backslash before dollar sign is properly matched for replacement.
    let processed = content.replace(/\\\$/g, '___ESCAPED_DOLLAR___');

    // Enhanced regex for multiline environments
    // This list includes common LaTeX environments that imply multiline display
    // or are specifically targeted for MathJax rendering.
    const multilineEnvsArray = [
      'align', 'align\\*', 'alignat', 'alignat\\*', 'aligned',
      'gather', 'gather\\*', 'gathered',
      'multline', 'multline\\*',
      'cases', 'dcases', 
      'eqnarray', 'eqnarray\\*',
      'equation', 'equation\\*',
      // Added common matrix environments
      'matrix', 'pmatrix', 'bmatrix', 'Bmatrix', 'vmatrix', 'Vmatrix', 'smallmatrix'
    ];
    // Case insensitive regex to match \begin{environment}
    const multilineRegex = new RegExp(`\\\\begin\{(${multilineEnvsArray.join('|')})\}`, 'i');

    // Updated regex to capture $$...$$ or \[...\]
    // The callback parameters are:
    // match: The entire matched string (e.g., "$$content$$" or "\[content\]")
    // _g1: The first capturing group (the whole match again, due to outer parens in regex, ignored)
    // contentDollar: Content within $$...$$ (if matched, otherwise undefined)
    // contentBracket: Content within \[...\] (if matched, otherwise undefined)
    processed = processed.replace(/(\$\$([\s\S]*?)\$\$|\\[([\s\S]*?)\\])/g, (match, _g1, contentDollar, contentBracket) => {
      const equation = contentDollar || contentBracket; // Get content from appropriate group
      
      // Determine original delimiters
      const originalDelimiters = match.startsWith('$$') 
        ? { open: '$$', close: '$$' } 
        : { open: '\\[', close: '\\]' };

      if (equation.includes('\n') || multilineRegex.test(equation)) {
        // Preserve original delimiters inside the wrapper
        // Ensure newlines are added correctly for readability of the generated HTML
        return `<div class="mathjax-block tex2jax_process">\n${originalDelimiters.open}${equation.trim()}${originalDelimiters.close}\n</div>`;
      }
      return match; // Return original match if not multiline (for KaTeX etc.)
    });

    // Fix table content to ensure LaTeX delimiters are preserved and spaced correctly for Markdown
    // This regex looks for $...$ within table cells | ... $...$ ... |
    processed = processed.replace(/\|\s*\$(.*?)\$\s*\|/g, '| \\$$1\\$ |');

    // Add proper spacing around block equations for better rendering if not already present
    // Ensures block equations are on their own lines.
    // Handles both $$...$$ and \[...\] delimiters.
    processed = processed
      .replace(/([^\n])\$\$/g, '$1\n$$')      // Add newline before $$
      .replace(/\$\$([^\n])/g, '$$\n$1')      // Add newline after $$
      .replace(/([^\n])\\\[/g, '$1\n\\[')    // Add newline before \[
      .replace(/\\\]([^\n])/g, '\\]\n$1')    // Add newline after \]
      .replace(/\n{3,}/g, '\n\n');       // Reduce multiple newlines to a maximum of two

    // This regex seems to be a general catch-all for inline math.
    // It re-wraps anything that looks like $equation$ with $equation$.
    processed = processed.replace(/\$([\s\S]*?)\$/g, (match, equation) => {
      return `$${equation}$`;
    });
    
    // Restore escaped dollar signs
    // Corrected: ensure this matches the replacement pattern.
    processed = processed.replace(/___ESCAPED_DOLLAR___/g, '\\$');

    return processed;
  }
  
  /**
   * Manually trigger MathJax rendering after component updates.
   * This should be called in Angular component lifecycle hooks like ngAfterViewInit 
   * or after dynamic content changes where MathJax needs to re-scan the DOM.
   */
  renderMathJax(): void {
    if (typeof window !== 'undefined' && (window as any).MathJax) {
      const MathJax = (window as any).MathJax;
      // Using a timeout allows the DOM to update before MathJax scans it.
      setTimeout(() => {
        MathJax.typesetPromise && MathJax.typesetPromise();
      }, 100); // 100ms delay, adjust if necessary
    }
  }
}