import React, { Component } from "react";
import { useParams } from "react-router-dom";
import EmployeeFooter from "./EmployeeFooter";

class EmployeeInformation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employeeData: {},
            isLoading: true
        };
    }

    // This function will run as soon as the EmployeeDirectory component is inserted into the DOM
    componentDidMount() {
        const id = this.props.id;

        if (id && id !== null) {
            // Fetching the list of employees from the GraphQL server using GraphQL Query and updating it in the state's employees property
            fetch("/graphql", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    query: `
      query getEmployeeById($getEmployeeById: Int) {
          getEmployeeById(id: $getEmployeeById) {
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
                    variables: { getEmployeeById: parseInt(id) },
                }),
            })
                .then((res) => res.json())
                .then((body) => {
                    /* body.data.employeeList.forEach(employee => {
                      employee.dateOfJoining = new Date(employee.dateOfJoining);
                    }); */
                    body.data.getEmployeeById.dateOfJoining = new Date(body.data.getEmployeeById.dateOfJoining).toLocaleDateString('fr-CA')
                    console.log(body);
                    this.setState({
                        employeeData: body.data.getEmployeeById,
                        isLoading: false
                    });
                    // setTimeout(() => {
                    //     this.setState({ isLoading: false });
                    //   }, 200);
                });
        }
    }

    calculateRetirementDate = () => {
        const retirementAge = 65;
        const yearsUntilRetirement = retirementAge - this.state.employeeData.age;
        const todaysDate = new Date();
        let retirementYear = todaysDate.getFullYear() + yearsUntilRetirement;

        //console.log(retirementYear);

        const retirementDate = new Date(retirementYear, 11, 31);
        console.log(retirementDate);
        const remainingYears = retirementDate.getFullYear() - todaysDate.getFullYear();
        const remainingMonths = retirementDate.getMonth() - todaysDate.getMonth();
        const remainingDays = retirementDate.getDate() - todaysDate.getDate();
        console.log();

        const retirementDisplay = `${remainingDays} day(s), ${remainingMonths} month(s), ${remainingYears} year(s)`;
        return retirementDisplay;
    }

    render() {
        const { employeeData, isLoading } = this.state;

        if (isLoading) {
            return (
                <div className="loadingText">
                    <p>Loading...</p>
                    <EmployeeFooter />
                </div>
            ); // Display a loading message
        }

        return (
            <>
                <div className="employeeCreate">
                    <h2>View Employee</h2>
                    <form name="employeeAdd">
                        <div>
                            <div className="form-group">
                                <label htmlFor="firstName">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={employeeData.firstName}
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={employeeData.lastName}
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="age">
                                    Age
                                </label>
                                <input
                                    type="number"
                                    id="age"
                                    name="age"
                                    value={employeeData.age}
                                    readOnly
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="dateOfJoining">
                                    Date of Joining
                                </label>
                                <input
                                    type="date"
                                    id="dateOfJoining"
                                    name="dateOfJoining"
                                    value={employeeData.dateOfJoining}
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="title">
                                    Title
                                </label>
                                <select name="title" id="title" value={employeeData.title} readOnly>
                                    <option value="">-Select Title-</option>
                                    <option value="Employee">Employee</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Director">Director</option>
                                    <option value="VP">VP</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="department">
                                    Department
                                </label>
                                <select name="department" id="department" value={employeeData.department} readOnly>
                                    <option value="">-Select Department-</option>
                                    <option value="IT">IT</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="HR">HR</option>
                                    <option value="Engineering">Engineering</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="employeeType">
                                    Employee Type
                                </label>
                                <select name="employeeType" id="employeeType" value={employeeData.employeeType} readOnly>
                                    <option value="">-Select Employee Type-</option>
                                    <option value="FullTime">FullTime</option>
                                    <option value="PartTime">PartTime</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Seasonal">Seasonal</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="retirementAfter">
                                    Retirement After
                                </label>
                                <input
                                    type="text"
                                    id="retirementAfter"
                                    name="retirementAfter"
                                    value={this.calculateRetirementDate()}
                                    readOnly
                                />
                            </div>
                        </div>
                    </form>
                </div>
                <EmployeeFooter />
            </>
        );
    }
}

const EmpWrapper = () => {
    //Using the hook to get the ID in the URL
    const id = useParams();

    //Passing the ID we got to the EmployeeInformation component
    return <EmployeeInformation {...id} />;
};

export default EmpWrapper;
