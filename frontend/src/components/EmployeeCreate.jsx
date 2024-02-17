import { Component } from 'react';
import EmployeeFooter from './EmployeeFooter';

class EmployeeCreate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            successMessage: '',
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    FormValiation = (form) => {

        //Error List array, for the toggling of css class to show the error
        let errorList = [];
        //console.log(form);
        if (form.age.value === "" || isNaN(form.age.value) || !(form.age.value >= 20 && form.age.value <= 65)) {
            errorList.push("age");
        }
        if (form.firstName.value === "" || !isNaN(form.firstName.value)) {
            errorList.push("firstName");
        }
        if (form.lastName.value === "" || !isNaN(form.lastName.value)) {
            errorList.push("lastName");
        }
        if (form.dateOfJoining.value === "") {
            errorList.push("dateOfJoining");
        }
        if (form.title.value === "") {
            errorList.push("title");
        }
        if (form.department.value === "") {
            errorList.push("department");
        }
        if (form.employeeType.value === "") {
            errorList.push("employeeType");
        }
        if (errorList.length !== 0) {
            errorList.forEach(error => {
                document.getElementById(error).classList.add("input-red");
            });
            return 0;
        }
        return 1;
    };

    handleSubmit = async (event) => {
        event.preventDefault();
        const form = document.forms.employeeAdd;

        //To clear css for fields which have failed validation
        let errorList = ["age", "firstName", "lastName", "dateOfJoining", "title", "department", "employeeType"];
        errorList.forEach(error => {
            document.getElementById(error).classList.remove("input-red");
        });

        if (this.FormValiation(form)) {
            try {
                await this.props.createEmployee({
                    firstName: form.firstName.value,
                    lastName: form.lastName.value,
                    age: parseInt(form.age.value),
                    dateOfJoining: new Date(form.dateOfJoining.value),
                    title: form.title.value,
                    department: form.department.value,
                    employeeType: form.employeeType.value,
                    currentStatus: true
                });

                // Show success message
                this.setState({ successMessage: 'Employee added successfully' });

                //Form reset
                form.firstName.value = '';
                form.lastName.value = '';
                form.age.value = '';
                form.dateOfJoining.value = '';
                form.title.value = '';
                form.department.value = '';
                form.employeeType.value = '';
            } catch (error) {
                console.error('Error adding employee:', error);
            }

        }
    }

    render() {
        if (this.state.successMessage) {
            return (
                <div className="SuccessMessage">
                    <p>{this.state.successMessage}</p>
                </div>
            )
        }
        return (

            <>
                <div className="employeeCreate">
                    <h2>Add New Employee</h2>
                    <form name="employeeAdd" onSubmit={this.handleSubmit}>
                        <div>
                            <div>
                                <label htmlFor="firstName">First Name</label>
                                <input type="text" name="firstName" id="firstName" />
                            </div>
                            <div>
                                <label htmlFor="lastName">Last Name</label>
                                <input type="text" name="lastName" id="lastName" />
                            </div>
                            <div>
                                <label htmlFor="age">Age</label>
                                <input type="number" name="age" id="age" />
                            </div>
                            <div>
                                <label htmlFor="dateOfJoining">Date of Joining</label>
                                <input type="date" name="dateOfJoining" id="dateOfJoining" />
                            </div>
                            <div>
                                <label htmlFor="title">Title</label>
                                <select name="title" id="title">
                                    <option value="Employee" defaultValue>Employee</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Director">Director</option>
                                    <option value="VP">VP</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="department">Department</label>
                                <select name="department" id="department">
                                    <option value="IT">IT</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="HR" defaultValue>HR</option>
                                    <option value="Engineering">Engineering</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="employeeType">Employee Type</label>
                                <select name="employeeType" id="employeeType">
                                    <option value="FullTime">FullTime</option>
                                    <option value="PartTime">PartTime</option>
                                    <option value="Contract" defaultValue>Contract</option>
                                    <option value="Seasonal">Seasonal</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="btnSubmit">Add Employee</button>
                    </form >
                </div >
                <EmployeeFooter />
            </>
        );
    }
}

export default EmployeeCreate;