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
    const multilineEnvs = [
      'align', 'align\\*', 'alignat', 'alignat\\*', 'aligned',
      'gather', 'gather\\*', 'gathered',
      'multline', 'multline\\*',
      'cases', 'dcases', 
      'eqnarray', 'eqnarray\\*',
      'equation', 'equation\\*' // Added equation and dcases
    ].join('|');
    // Case insensitive regex to match \begin{environment}
    const multilineRegex = new RegExp(`\\\\begin\{(${multilineEnvs})\}`, 'i');

    // Process display math blocks ($$ ... $$)
    processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (match, equation) => {
      // If equation contains multiple lines OR uses a known multiline LaTeX environment
      if (equation.includes('\n') || multilineRegex.test(equation)) {
        // Wrap with a div and classes for MathJax processing
        // .trim() removes leading/trailing whitespace from the equation itself
        return `<div class="mathjax-block tex2jax_process">\n$$${equation.trim()}$$</div>`;
      }
      // If not multiline by the above criteria, return the original match.
      return match; 
    });

    // Fix table content to ensure LaTeX delimiters are preserved and spaced correctly for Markdown
    // This regex looks for $...$ within table cells | ... $...$ ... |
    processed = processed.replace(/\|\s*\$(.*?)\$\s*\|/g, '| \\$$1\\$ |');

    // Add proper spacing around block equations for better rendering if not already present
    // Ensures block equations are on their own lines.
    // Corrected regex patterns for newlines.
    processed = processed
      .replace(/([^\n])\$\$/g, '$1\n$$') // Add newline before $$ if not preceded by one
      .replace(/\$\$([^\n])/g, '$$\n$1') // Add newline after $$ if not followed by one
      .replace(/\n{3,}/g, '\n\n');    // Reduce multiple newlines to a maximum of two

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