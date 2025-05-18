import { Prisma, PrismaClient } from "../prisma/generated";

const prisma = new PrismaClient();

const department = ["IT", "HRD", "Finance", "Marketing", "Sales"];
const position = ["Head", "Manager", "Employee"];

const employee = [
  {
    userId: 1,
    name: "Ardi Supriadi",
    gender: "M",
    dob: new Date("1999-01-01"),
    departmentId: 1,
    positionId: 1,
  },
  {
    userId: 2,
    name: "Sarah Johnson",
    gender: "F",
    dob: new Date("1995-03-15"),
    departmentId: 2,
    positionId: 1,
  },
  {
    userId: 3,
    name: "Michael Chen",
    gender: "M",
    dob: new Date("1992-07-22"),
    departmentId: 3,
    positionId: 2,
  },
  {
    userId: 4,
    name: "Emily Davis",
    gender: "F",
    dob: new Date("1988-11-30"),
    departmentId: 4,
    positionId: 3,
  },
  {
    userId: 5,
    name: "James Wilson",
    gender: "M",
    dob: new Date("1991-09-05"),
    departmentId: 5,
    positionId: 2,
  },
  {
    userId: 6,
    name: "Linda Martinez",
    gender: "F",
    dob: new Date("1993-04-18"),
    departmentId: 1,
    positionId: 3,
  },
  {
    userId: 7,
    name: "Robert Taylor",
    gender: "M",
    dob: new Date("1990-12-25"),
    departmentId: 3,
    positionId: 3,
  },
  {
    userId: 8,
    name: "Jessica Brown",
    gender: "F",
    dob: new Date("1987-06-10"),
    departmentId: 2,
    positionId: 2,
  }
];

async function insertDepartment() {
  const departmentData: Prisma.DepartmentCreateInput[] = department.map((department, index) => ({
    id: index + 1,
    name: department,
  }));

  await prisma.department.createMany({
    data: departmentData,
  });
}

async function insertPosition() {
  const positionData: Prisma.PositionCreateInput[] = position.map((position, index) => ({
    id: index + 1,
    name: position,
  }));

  await prisma.position.createMany({
    data: positionData,
  });
}

async function insertEmployee() {
  const employeeData: Prisma.EmployeeCreateManyInput[] = employee.map((employee, index) => ({
    id: index + 1,
    ...employee,
    createdAt: new Date(),
    updatedAt: new Date()
  }));

  await prisma.employee.createMany({
    data: employeeData,
  });
}

async function clear() {
  await prisma.department.deleteMany();
  await prisma.position.deleteMany();
  await prisma.employee.deleteMany();
}

//clear();
//insertDepartment();
//insertPosition();
//insertEmployee();