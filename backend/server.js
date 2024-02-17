/**
 * Team 6 - Section 8
 * 1. Roshni Panth - EmployeeCreate
 * 2. Swapnil Sharma - EmployeeDirectory, EmployeeFooter, EmployeeRow, EmployeeSearch, EmployeeTable
 * 3. Anmol - GraphQL
 * 4. Mohan - Mongo DB connections  CSS
 */

import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { readFile } from 'node:fs/promises';
import { GraphQLScalarType } from 'graphql';
import { connectToDb, getDb } from './db.js'


let db;

const app = express();

app.use(express.json());

const GraphQlDateResolver = new GraphQLScalarType({
    name: 'GraphQlDate',
    description: 'A GraphQl Date Type',
    serialize(value) {
        return value.toISOString();
    },
    parseValue(value) {
        const newDate = new Date(value);
        return isNaN(newDate) ? undefined : newDate
    }
});


const employeeList = async () => {
    const employees = await db.collection('employeeList').find({}).toArray();
    return employees;
}

const getEmployeeById = async (_root, { id }) => {
    const employee = await db.collection('employeeList').findOne({ id: id });
    return employee;
}
//
const NewIDTest = async () => {
    const employee = await (db.collection('employeeList').find({}/* ,  {id:1}).sort({id:-1}).limit(1) */))
    /* .then(res => res.json())
    .then(body => {
        console.log(body);
        const largestNum = body.id;
        return largestNum;
    }) */
    console.log(employee);
}


const NewID = async () => {
    const largestNumCursor = await db.collection('employeeList').find({},  {id:1}).sort({id:-1}).limit(1)
    const largestNum = await largestNumCursor.toArray();
    //console.log("***************************", largestNum[0].id);
    //return largestNum.id + 1 || count;
    return largestNum[0].id + 1;
}


const employeeAdd = async (_root, { employee }) => {

    employee.id = await NewID();
    await NewIDTest();
    const result = await db.collection('employeeList').insertOne(employee);
    const savedEmployee = await db.collection('employeeList').findOne({ _id: result.insertedId });
    return savedEmployee;
}

const updateEmployee = async (_root, { input }) => {
 
    console.log('Input='+JSON.stringify(input));
   
    const employeeUpdate = {};
   
    if(input.title!=''){
      employeeUpdate.title=input.title;
    }
    if(input.department!=''){
      employeeUpdate.department=input.department;
    }
    if(input.currentStatus==true){
      employeeUpdate.currentStatus=true;
    }else{
      employeeUpdate.currentStatus=false;
    }
   
    console.log('Inside updateEmployee='+JSON.stringify(employeeUpdate));
   
    const result = await db.collection('employeeList').updateOne(
      { id: input.id },
      { $set: employeeUpdate },
      { returnDocument: "after" }
    );
   
    //console.log('Updated Record='+JSON.stringify(result));
    // const savedEmployee = await db.collection('employees').findOne({ _id: result.insertedId });
    return await db.collection("employeeList").findOne({ id: input.id });
}

const deleteEmployee = async (_root, { id }) => {
 
    const deletedRecord = await db.collection("employeeList").findOneAndDelete({ id: id });
    return deletedRecord.value;
  }
const typeDefs = await readFile('./schema.graphql', 'utf8');

const resolvers = {
    Query: {
        employeeList: employeeList,
        getEmployeeById: getEmployeeById
    },
    Mutation: {
        employeeAdd: employeeAdd,
        updateEmployee: updateEmployee,
        deleteEmployee: deleteEmployee
    },
    GraphQlDate: GraphQlDateResolver
}

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
});

await apolloServer.start();


app.use('/graphql', expressMiddleware(apolloServer));




connectToDb((url, err) => {
    if (!err) {
        app.listen(5003, () => {
            console.log('Express Server started on port 5003');
            console.log('GraphQl Server started on port http://localhost:5003/graphql');
            console.log('MongoDb connected to ', url);
        });
        db = getDb();
    }
});

