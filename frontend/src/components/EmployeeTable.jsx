import React from "react";
import { Component } from 'react';
import EmployeeRow from './EmployeeRow';
import { Table } from 'react-bootstrap';

class EmployeeTable extends Component {
    render() {
        const { employeeList, viewDetails, deleteEmployee}  = this.props;
        //console.log(employeeList, "employeeList");
        const EmployeesRow = employeeList.map(employee => {
            return(
                <EmployeeRow employee={employee} key={employee.id} viewDetails={viewDetails} deleteEmployee={deleteEmployee}/>
            );
        });
        return (
            <div>
                <Table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Age</th>
                            <th>DOJ</th>
                            <th>Title</th>
                            <th>Department</th>
                            <th>Employee Type</th>
                            <th>Current Status</th>
                            <th>Edit / Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {EmployeesRow}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default EmployeeTable;