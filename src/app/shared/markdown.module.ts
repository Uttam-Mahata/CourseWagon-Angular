import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import 'prismjs';
import 'prismjs/components/prism-typescript.min.js';
import 'prismjs/components/prism-python.min.js';
import 'prismjs/components/prism-java.min.js';
import 'prismjs/components/prism-javascript.min.js';
import 'prismjs/components/prism-css.min.js';
import 'prismjs/components/prism-markup.min.js';

@NgModule({
  imports: [
    CommonModule,
    MarkdownModule.forChild()
  ],
  exports: [
    MarkdownModule
  ]
})
export class SharedMarkdownModule { }
