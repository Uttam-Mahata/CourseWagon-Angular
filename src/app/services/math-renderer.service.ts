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

    // Convert multiline equations to use MathJax
    let processed = content.replace(/\$\$([\s\S]*?)\$\$/g, (match, equation) => {
      // If equation contains multiple lines, use MathJax
      if (equation.includes('\n')) {
        // Wrap multiline equations in a div with a special class for MathJax
        return `<div class="mathjax-block tex2jax_process">\n$$${equation}$$\n</div>`;
      }
      return match; // Keep the original $$ delimiters for KaTeX to handle
    });

    // Add proper spacing around equations for better rendering
    processed = processed
      // Add spacing around block equations if not already present
      .replace(/([^\n])\$\$/g, '$1\n$$')
      .replace(/\$\$([^\n])/g, '$$\n$1')
      // Clean up excessive newlines
      .replace(/\n{3,}/g, '\n\n');

    return processed;
  }
  
  /**
   * Manually trigger MathJax rendering after component updates
   * This should be called in ngAfterViewInit or after content changes
   */
  renderMathJax(): void {
    if (typeof window !== 'undefined' && (window as any).MathJax) {
      const MathJax = (window as any).MathJax;
      setTimeout(() => {
        MathJax.typesetPromise && MathJax.typesetPromise();
      }, 100);
    }
  }
} 