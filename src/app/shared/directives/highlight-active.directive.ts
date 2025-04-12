import { AfterViewChecked, AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appHighlightActive]',
})
export class HighlightActiveDirective implements AfterViewInit, OnInit, OnChanges, AfterViewChecked{

  @Input() selector: string;
  @Input() initFirst: boolean = false;
  @Input() updateView: boolean = false;
  @Output() renderComplete = new EventEmitter();
  @Output() onEnter = new EventEmitter();
  private index: number = 0;
  private isLoaded = false;

  constructor(private el: ElementRef) { }

  get activeIndex() {
    return this.index;
  }

  ngOnInit(): void { }

  ngAfterViewChecked () {
    const isItemsLoaded = this.el.nativeElement.querySelectorAll(this.selector);
    console.log('***')
    if (this.initFirst && isItemsLoaded?.length && !this.isLoaded) {
      this.isLoaded = true;
      this.changeIndex(0);
    }
  }

  ngAfterViewInit(): void {  }

  ngOnChanges(changes: SimpleChanges): void {  }

  @HostListener('document:keyup', ['$event'])
  initKeyUp(event: KeyboardEvent) {
    console.log('event', event)

    if (event.key === 'ArrowRight') {
      this.changeIndex(1);
    } else if (event.key === 'ArrowLeft') {
      this.changeIndex(-1);
    } else if (event.key === 'Enter') {
      const items = [...this.el.nativeElement.querySelectorAll(this.selector)];
      const index = items.findIndex((e: Element) => e.classList.contains('active'));
      this.onEnter.emit(index);
    }

  }

  changeIndex(shift: -1 | 1 | 0) {

    const items = [...this.el.nativeElement.querySelectorAll(this.selector)];
    console.log('items', items)
    if (!items.length) {
      return;
    }
    const index = items.findIndex((e: Element) => e.classList.contains('active'));

    this.index = index === -1 ? 0 : index;
    items[this.index].classList.remove('active');
    this.index += shift;

    if (this.index < 0) {
      this.index = items.length - 1;
    }

    if (this.index > items.length - 1) {
      this.index = 0;
    }
    items[this.index].classList.toggle('active');
    
    (items[this.index] as HTMLDivElement).scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest"});
  }
}
