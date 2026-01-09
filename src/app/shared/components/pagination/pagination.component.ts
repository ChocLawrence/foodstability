import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() paginationData: any;
  @Input() alignment: 'left' | 'center' | 'right' = 'center';
  @Output() pageChange = new EventEmitter<number>();

  currentPage: number = 1;
  lastPage: number = 1;
  total: number = 0;
  from: number = 0;
  to: number = 0;
  perPage: number = 10;
  pages: (number | string)[] = [];

  ngOnInit(): void {
    this.updatePagination();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['paginationData']) {
      this.updatePagination();
    }
  }

  updatePagination(): void {
    if (this.paginationData) {
      this.currentPage = this.paginationData.current_page || 1;
      this.lastPage = this.paginationData.last_page || 1;
      this.total = this.paginationData.total || 0;
      this.from = this.paginationData.from || 0;
      this.to = this.paginationData.to || 0;
      this.perPage = this.paginationData.per_page || 10;
      this.generatePages();
    }
  }

  generatePages(): void {
    this.pages = [];
    const totalPages = this.lastPage;
    const current = this.currentPage;

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        this.pages.push(i);
      }
    } else {
      // Always show first page
      this.pages.push(1);

      if (current <= 4) {
        // Show pages 1-5, then ellipsis, then last page
        for (let i = 2; i <= 5; i++) {
          this.pages.push(i);
        }
        this.pages.push('...');
        this.pages.push(totalPages);
      } else if (current >= totalPages - 3) {
        // Show first page, ellipsis, then last 5 pages
        this.pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          this.pages.push(i);
        }
      } else {
        // Show first page, ellipsis, current-1, current, current+1, ellipsis, last page
        this.pages.push('...');
        this.pages.push(current - 1);
        this.pages.push(current);
        this.pages.push(current + 1);
        this.pages.push('...');
        this.pages.push(totalPages);
      }
    }
  }

  goToPage(page: number | string, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    if (typeof page === 'number' && page >= 1 && page <= this.lastPage && page !== this.currentPage) {
      this.currentPage = page;
      this.pageChange.emit(page);
    }
  }

  previousPage(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    if (this.currentPage > 1) {
      const newPage = this.currentPage - 1;
      this.currentPage = newPage;
      this.pageChange.emit(newPage);
    }
  }

  nextPage(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    if (this.currentPage < this.lastPage) {
      const newPage = this.currentPage + 1;
      this.currentPage = newPage;
      this.pageChange.emit(newPage);
    }
  }

  isEllipsis(page: number | string): boolean {
    return page === '...';
  }
}
