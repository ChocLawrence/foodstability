import { Component, OnInit, ViewChild } from '@angular/core';
import { CoreService } from '../../core/core.service';
import { DatePipe } from '@angular/common';
import { EmployeesService } from '../../services/employees.service';
import _ from 'lodash';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {


  public loadingData = false;
  public employees:any[] = [];
  public limit = 10;
  public employeesCount = 0;
  public animationType = 'wanderingCubes';


  constructor(public _core: CoreService,
    private datePipe: DatePipe,
    private employeesService: EmployeesService) { }

  ngOnInit(): void {
    this.getEmployees();
  }


  getEmployees() {
    this.loadingData = true;

    this.employeesService
      .getEmployees()
      .then(employees => {
        console.log('employees',employees)
        //this.employeesCount = employees.count;
        let subs= this._core.normalizeKeys(employees);
        this.employees = _.orderBy(employees, ['createdat'], ['desc']);
        
        this.loadingData = false;
      })
      .catch(e => {
        this.loadingData = false;
        this._core.handleError(e);
      });
  }


}
