import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Label, MultiDataSet } from 'ng2-charts';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';
import { AppStateWithIngreso } from './ingreso-egreso.reducer';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [
  ]
})
export class EstadisticaComponent implements OnInit {

  ingresos: number;
  egresos: number;
  ingresosTotal: number;
  egresosTotal: number;

  public doughnutChartLabels: Label[];
  public doughnutChartData: MultiDataSet;

  constructor(private store: Store<AppStateWithIngreso>) {
    this.ingresos = 0;
    this.egresos = 0;
    this.ingresosTotal = 0;
    this.egresosTotal = 0;
    this.doughnutChartLabels = ['Ingresos', 'Egresos'];
    this.doughnutChartData = [[0, 0]];
  }

  ngOnInit(): void {
    this.store.select('ingresosEgresos').subscribe(({items}) => {
      
      // this.egresos = items.filter(egreso => egreso.tipo === 'egreso').length;
      // this.ingresos = items.filter(ingreso => ingreso.tipo === 'ingreso').length;
      // this.egresosTotal = items.reduce((total, egreso) => {
      //   if (egreso.tipo === 'egreso') {
      //     total += egreso.monto;
      //   }
      //   return total;
      // }, 0);
      // this.ingresosTotal = items.reduce((total, ingreso) => {
      //   if (ingreso.tipo === 'ingreso') {
      //     total += ingreso.monto;
      //   }
      //   return total;
      // }, 0);

      this.generarEstadistica(items);

    });
  }

  generarEstadistica(items: IngresoEgreso[]) {
    this.ingresos = 0;
    this.egresos = 0;
    this.ingresosTotal = 0;
    this.egresosTotal = 0;

    for (let item of items) {
      if (item.tipo === 'ingreso') {
        this.ingresos += 1;
        this.ingresosTotal += item.monto;
      } else {
        this.egresos += 1;
        this.egresosTotal += item.monto;
      }
    }
    this.doughnutChartData = [[this.ingresosTotal, this.egresosTotal]];
  }

}
