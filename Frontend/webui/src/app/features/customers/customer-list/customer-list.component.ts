import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent, GridOptions, themeQuartz } from 'ag-grid-community';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../models/customer.model';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, AgGridAngular],
  template: `
  <div class="customer-card">
    <header class="card-header">
      <div class="header-content">
        <div class="icon-wrapper">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div class="header-text">
          <div class="title">Customer Management</div>
          <div class="subtitle">View, filter, sort and edit customer records with AI assistance</div>
        </div>
      </div>
    </header>

    <div class="toolbar">
      <div class="search-container">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input
          class="ai-input"
          type="text"
          placeholder="Ask AI to filter, sort, or analyze data... (e.g., 'show inactive customers', 'sort by orders descending')"
          (keyup.enter)="runAiPrompt($event.target.value)" />
        <div class="ai-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
          </svg>
          AI
        </div>
      </div>
    </div>

    <div class="grid-wrapper">
      <ag-grid-angular
        class="ag-custom-grid"
        style="width: 100%; height: 500px;"
        [rowData]="rowData"
        [columnDefs]="columnDefs"
        [defaultColDef]="defaultColDef"
        [pagination]="true"
        [paginationPageSize]="20"
        [animateRows]="true"
        (gridReady)="onGridReady($event)"
        (cellValueChanged)="onCellValueChanged($event)">
      </ag-grid-angular>
    </div>

    <div *ngIf="lastAggregations" class="aggregations">
      <div class="agg-header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="20" x2="12" y2="10"></line>
          <line x1="18" y1="20" x2="18" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="16"></line>
        </svg>
        <strong>Data Insights</strong>
      </div>
      <div class="agg-list">
        <div *ngFor="let k of aggregationKeys()" class="agg-item">
          <span class="agg-key">{{ k }}</span>
          <span class="agg-value">{{ formatAggregationValue(lastAggregations[k]) }}</span>
        </div>
      </div>
    </div>
  </div>
`
  ,
  styles: [`
    :host {
      display: block;
      padding: 0;
      margin: 0;
      box-sizing: border-box;
      background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%);
      min-height: 100vh;
    }

    .customer-card {
      max-width: 100%;
      margin: 0;
      background: #ffffff;
      border-radius: 0;
      box-shadow: none;
      overflow: hidden;
      min-height: 100vh;
    }

    .card-header {
      padding: 28px 32px;
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
      color: #fff;
      position: relative;
      overflow: hidden;
    }

    .card-header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -10%;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
      border-radius: 50%;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 16px;
      position: relative;
      z-index: 1;
    }

    .icon-wrapper {
      width: 56px;
      height: 56px;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .header-text {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .card-header .title {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .card-header .subtitle {
      font-size: 14px;
      opacity: 0.92;
      font-weight: 400;
    }

    .toolbar {
      padding: 24px 32px;
      background: linear-gradient(180deg, #f0f4f8 0%, #ffffff 100%);
      border-bottom: 1px solid #d1d5db;
    }

    .search-container {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: 16px;
      color: #9ca3af;
      pointer-events: none;
      z-index: 1;
    }

    .ai-input {
      width: 100%;
      padding: 14px 120px 14px 48px;
      border-radius: 12px;
      border: 2px solid #e5e7eb;
      font-size: 14px;
      background: #ffffff;
      transition: all 0.2s ease;
      font-weight: 400;
    }

    .ai-input::placeholder {
      color: #9ca3af;
    }

    .ai-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1), 0 4px 12px rgba(59, 130, 246, 0.15);
      background: #ffffff;
    }

    .ai-badge {
      position: absolute;
      right: 10px;
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
      color: white;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 4px;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
      pointer-events: none;
    }

    .grid-wrapper {
      padding: 24px 32px 32px 32px;
      background: #f9fafb;
    }

    .aggregations {
      padding: 24px 32px 28px 32px;
      border-top: 2px solid #e5e7eb;
      background: linear-gradient(180deg, #ffffff 0%, #f0f4f8 100%);
    }

    .agg-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      color: #1f2937;
      font-size: 14px;
    }

    .agg-header svg {
      color: #3b82f6;
    }

    .agg-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .agg-item {
      background: linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%);
      padding: 16px 20px;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
      transition: all 0.2s ease;
    }

    .agg-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
      border-color: #3b82f6;
    }

    .agg-key {
      font-weight: 600;
      color: #6b7280;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .agg-value {
      color: #1f2937;
      font-size: 20px;
      font-weight: 700;
    }

    @media (max-width: 768px) {
      :host {
        padding: 0;
      }

      .customer-card {
        border-radius: 0;
      }

      .card-header {
        padding: 20px;
      }

      .header-content {
        gap: 12px;
      }

      .icon-wrapper {
        width: 48px;
        height: 48px;
      }

      .card-header .title {
        font-size: 20px;
      }

      .toolbar {
        padding: 16px 20px;
      }

      .ai-input {
        padding: 12px 100px 12px 44px;
        font-size: 13px;
      }

      .grid-wrapper {
        padding: 16px 20px 20px 20px;
      }

      .aggregations {
        padding: 16px 20px 20px 20px;
      }

      .agg-list {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CustomerListComponent {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private service = inject(CustomerService);
  rowData: Customer[] = [];
  theme = themeQuartz;
  private cdr = inject(ChangeDetectorRef);
  private gridApi!: GridApi;

  private lastAiOptions: { columnState?: any; aggregations?: any } = {};
  lastAggregations: Record<string, any> | null = null;

  columnDefs: ColDef[] = [
    {
      field: 'customerId',
      headerName: 'ID',
      filter: 'agNumberColumnFilter',
      editable: false,
      width: 80,
      filterParams: {
        allowedFilterOptions: ['equals', 'notEqual', 'lessThan', 'lessThanOrEqual', 'greaterThan', 'greaterThanOrEqual', 'inRange'],
        inRangeInclusive: true
      }
    },
    {
      field: 'customerName',
      filter: 'agTextColumnFilter',
      editable: true
    },
    {
      field: 'customerEmail',
      filter: 'agTextColumnFilter',
      editable: true,
      filterParams: {
        allowedFilterOptions: ['contains', 'notContains', 'equals', 'notEqual', 'startsWith', 'endsWith']
      }
    },
    {
      field: 'customerPhone',
      filter: 'agTextColumnFilter',
      editable: true,
      filterParams: {
        allowedFilterOptions: ['contains', 'notContains', 'equals', 'notEqual', 'startsWith', 'endsWith']
      }
    },
    {
      field: 'dob',
      filter: 'agDateColumnFilter',
      editable: true,
      filterParams: {
        browserDatePicker: true,
        allowedFilterOptions: ['equals', 'notEqual', 'lessThan', 'greaterThan', 'inRange'],
        comparator: (filterDate: Date, cellValue: string) => {
          const cellDate = new Date(cellValue);
          if (cellDate < filterDate) return -1;
          if (cellDate > filterDate) return 1;
          return 0;
        }
      },
      valueFormatter: p => new Date(p.value).toLocaleDateString()
    },
    {
      field: 'totalOrders',
      filter: 'agNumberColumnFilter',
      editable: true,
      filterParams: {
        allowedFilterOptions: ['equals', 'notEqual', 'lessThan', 'lessThanOrEqual', 'greaterThan', 'greaterThanOrEqual', 'inRange'],
        inRangeInclusive: true
      }
    },
    {
      field: 'isActive',
      headerName: 'Is Active',
      filter: 'agSetColumnFilter',
      editable: true,
      valueFormatter: p => p.value ? 'Yes' : 'No',
      filterParams: {
        values: [true, false],
        valueFormatter: (p: any) => p.value ? 'Yes' : 'No'
      }
    }
  ];


  defaultColDef: ColDef = {
    sortable: true,
    resizable: true
  };


  onCellValueChanged(event: any) {
    if (!isPlatformBrowser(this.platformId)) return;
    if (event.oldValue === event.newValue) return;

    this.service.update(event.data).subscribe({
      next: () => {
      },
      error: err => console.error(err)
    });
  }


  deleteCustomer(customer: Customer) {
    if (!confirm(`Delete ${customer.customerName}?`)) return;

    this.service.delete(customer.customerId).subscribe({
      next: () => {
        this.gridApi.applyTransaction({
          remove: [customer]
        });
      },
      error: err => console.error(err)
    });
  }

  runAiPrompt(prompt: string) {
    if (!prompt || !this.gridApi) return;

    this.http.post<any>('http://localhost:5285/api/ai/interpret', { prompt })
      .subscribe({
        next: (res) => {
          if (res.filterModel && Object.keys(res.filterModel).length > 0) {
            this.gridApi.setFilterModel(res.filterModel);
          }

          if (Array.isArray(res.columnState) && res.columnState.length > 0) {
            this.gridApi.applyColumnState({
              state: res.columnState,
              applyOrder: true
            });
          }

          if (res.sortModel && res.sortModel.length > 0) {
            this.gridApi.applyColumnState({
              state: res.sortModel.map((s: any) => ({
                colId: s.colId,
                sort: s.sort
              })),
              defaultState: { sort: null }
            });
          }

          this.lastAiOptions.aggregations = res.aggregations ?? null;

          setTimeout(() => {
            this.computeAggregations();
            this.cdr.detectChanges();
          }, 200);
        },
        error: (err) => console.error('AI Error:', err)
      });
  }

  computeAggregations() {
    if (!this.lastAiOptions.aggregations) {
      this.lastAggregations = null;
      return;
    }

    const result: any = {};
    const aggs = this.lastAiOptions.aggregations;

    this.gridApi.forEachNodeAfterFilter(node => {
      if (node.data) {
        for (const col in aggs) {
          for (const fn of aggs[col]) {
            const key = `${col}_${fn}`;
            result[key] ??= [];
            const val = Number(node.data[col]);
            if (!isNaN(val)) {
              result[key].push(val);
            }
          }
        }
      }
    });

    const final: any = {};
    for (const key in result) {
      const values = result[key];
      if (!values || values.length === 0) {
        final[key] = 0;
        continue;
      }

      if (key.endsWith('_sum')) final[key] = values.reduce((a: number, b: number) => a + b, 0);
      if (key.endsWith('_avg')) final[key] = values.reduce((a: number, b: number) => a + b, 0) / values.length;
      if (key.endsWith('_min')) final[key] = Math.min(...values);
      if (key.endsWith('_max')) final[key] = Math.max(...values);
      if (key.endsWith('_count')) final[key] = values.length;
    }

    this.lastAggregations = final;
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    this.service.getAll().subscribe({
      next: (res: any) => {
        console.log('CUSTOMERS:', res);
        this.rowData = res;
        this.cdr.detectChanges();
      },
      error: err => console.error(err)
    });
  }


  aggregationKeys(): string[] {
    return this.lastAggregations ? Object.keys(this.lastAggregations) : [];
  }

  formatAggregationValue(value: any): string {
    if (value == null) return '';
    if (typeof value === 'number') return value.toString();
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

}
