import React, { Component } from "react";
import { Link } from "react-router-dom";

class EmployeeRow extends Component {
    handleDelete = () => {
        const { employee, deleteEmployee } = this.props;
        deleteEmployee(employee.id);
    }
    
    render() {
        const { employee } = this.props;
        return (
            <tr>
                <td>{employee.id}</td>
                <td>{employee.firstName}</td>
                <td>{employee.lastName}</td>
                <td>{employee.age}</td>
                <td>{employee.dateOfJoining != null ? employee.dateOfJoining.toDateString() : ''}</td>
                <td>{employee.title}</td>
                <td>{employee.department}</td>
                <td>{employee.employeeType}</td>
                <td>{employee.currentStatus !== true ? "In Active" : "Active"}</td>
                <td>
                    <div className="buttonsClass">
                        <button className="btnSubmit">
                            <Link to={`/empinfo/${employee.id}`}>View</Link>
                        </button>
                        <button className="btnSubmit">Edit</button>
                        <button className="btnSubmit" onClick={this.handleDelete}>Delete</button>
                    </div>    
                </td>
            </tr>
        );
    }
}

export default EmployeeRow;