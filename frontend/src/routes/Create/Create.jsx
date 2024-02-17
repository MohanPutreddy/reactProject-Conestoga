import React from 'react'
import EmployeeCreate from '../../components/EmployeeCreate'
import EmployeeDirectory from '../../components/EmployeeDirectory'

function Create() {
  return (
    <EmployeeCreate createEmployee={EmployeeDirectory.createEmployee}></EmployeeCreate>
  )
}

export default Create