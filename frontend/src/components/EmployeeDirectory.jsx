import { Component } from 'react';
import EmployeeTable from './EmployeeTable';
import EmployeeFooter from './EmployeeFooter';

class EmployeeDirectory extends Component {
    constructor() {
        super();
        this.state = {
            name: "Employee Directory",
            employees: [],
            employeesCopy: [],
            deletionErrorMessage: ''
        }

        this.onHandleSelectionChange = this.onHandleSelectionChange.bind(this);
    }

    componentDidMount() {
        const getEmployees = async () => {
            await fetch("/graphql", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `query {
                    employeeList {
                        id
                        firstName
                        lastName
                        age
                        dateOfJoining
                        title
                        department
                        employeeType
                        currentStatus
                        }
                    }`
                })
            })
                .then(res => res.json())
                .then(body => {
                    body.data.employeeList.forEach(employee => {
                        employee.dateOfJoining = new Date(employee.dateOfJoining);
                    });
                    this.setState({
                        employees: body.data.employeeList,
                        employeesCopy: body.data.employeeList
                    });
                })
                .catch(e => console.log(e))

        }

        getEmployees();
    }

    /*  viewDetails = async (id) => {
         try {
           const response = await fetch(`/graphql`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
               query: `query {
                 employeeDetails(id: "${id}") {
                   _id
                   firstName
                   lastName
                   age
                   dateOfJoining
                   title
                   department
                   employeeType
                 }
               }`,
             }),
           });
     
           const json = await response.json();
           console.log(json.data);
     
           if (json.data && json.data.employeeDetails) {
             this.setState({
               employeeDetails: json.data.employeeDetails,
               loading: false,
             });
           }
         } catch (error) {
           console.error('Error fetching employee details:', error);
         }
       };
      */
    /* employeeDelete = async (id) => {
        console.log("delete id: ", id);
    
        const variables = { id };
        await fetch("/graphql", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            query: `mutation deleteEmployee($id: Int) {
              deleteEmployee(id: $id) {
                _id
              }
            }`,
            variables,
          }),
        });
    
        //this.fetchEmployees();
    }; */

    static createEmployee = (employee) => {
        console.log(employee, 'employee');
        fetch('/graphql', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                query: `mutation Mutation($employee: EmployeeInputs) {
            employeeAdd(employee: $employee) {
              id
              firstName
              lastName
              age
              dateOfJoining
              title
              department
              employeeType
              currentStatus
          }
        }`,
                variables: { employee },
            }),
        })
            .then((res) => res.json()).then((body) => {
                if (body && body.data && body.data.employeeAdd) {
                    const newEmployee = body.data.employeeAdd;
                    if (newEmployee.dateOfJoining) {
                        newEmployee.dateOfJoining = new Date(newEmployee.dateOfJoining);
                    }
                    const { employees } = this.state;
                    const newEmployeeArray = [...employees, newEmployee];
                    this.setState({ employees: newEmployeeArray });
                } else {
                    console.error('Error:', body);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    onHandleSelectionChange(event) {
        const employeeType = event.target.value;
        this.setState({ employeeType: employeeType });

        if (employeeType !== "AllEmployee") {
            const filteredEmployees = (this.state.employeesCopy).filter(
                (employee) => employee.employeeType === employeeType
            );

            this.setState({ employees: filteredEmployees });
        } else {
            this.setState({ employees: this.state.employeesCopy });
        }
    }

    deleteEmployee = (id) => {
        fetch("/graphql", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                query: `
                mutation DeleteEmployee($deleteEmployeeId: Int) {
                    deleteEmployee(id: $deleteEmployeeId) {
                        id
                        firstName
                        lastName
                        age
                        dateOfJoining
                        title
                        department
                        employeeType
                        currentStatus
                    }
                  }
        `,
                variables: { deleteEmployeeId: id },
            }),
        })
            .then((res) => res.json())
            .then((body) => {
                if (body && body.data && body.data.deleteEmployee) {
                    const deletedEmployee = body.data.deleteEmployee;

                    if (deletedEmployee.currentStatus) {
                        // Check if employee's currentStatus is active
                        this.setState({ deletionErrorMessage: "CAN’T DELETE EMPLOYEE – STATUS ACTIVE" });
                    } else {
                        // If the employee's currentStatus is not active, proceed to delete
                        const updatedEmployees = this.state.employees.filter(
                            (employee) => employee.id !== deletedEmployee.id
                        );
                        this.setState({ employees: updatedEmployees, deletionErrorMessage: '' });
                    }
                }
            })
            .catch((error) => {
                console.error('Error deleting employee:', error);
            });
    };


    render() {
        const { deletionErrorMessage } = this.state;
        return (
            <div>
                {/* <EmployeeSearch /> */}
                <div className='searchBox'>
                    <label htmlFor="employeeType">Employee Type: </label>
                    <select name="employeeType" value={this.state.employeeType} onChange={this.onHandleSelectionChange}>
                        <option value="AllEmployee">All Employees</option>
                        <option value="FullTime">FullTime Employees</option>
                        <option value="PartTime">PartTime Employees</option>
                        <option value="Contract">Contract Employees</option>
                        <option value="Seasonal">Seasonal Employees</option>
                    </select>
                </div>
                <div>
                    {deletionErrorMessage && (
                        <div className="error-banner">
                            {deletionErrorMessage}
                        </div>
                    )}
                    <EmployeeTable employeeList={this.state.employees} viewDetails={this.viewDetails} deleteEmployee={this.deleteEmployee} />
                </div>
                <EmployeeFooter />
            </div>
        );
    }
}

export default EmployeeDirectory;