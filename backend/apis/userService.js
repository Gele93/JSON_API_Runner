import { log } from "../logger.js";

const users = [
    {
        id: 1,
        name: "Alice Johnson",
        email: "alice@example.com",
        age: 28,
    },
    {
        id: 2,
        name: "Bob Smith",
        email: "bob@example.com",
        age: 34,
    },
    {
        id: 3,
        name: "Carol Davis",
        email: "carol@example.com",
        age: 25,
    },
    {
        id: 4,
        name: "David Lee",
        email: "david@example.com",
        age: 42,
    },
    {
        id: 5,
        name: "Eve Turner",
        email: "eve@example.com",
        age: 30,
    }
];

export const createUserProfile = async (paramsData) => {
    const name = paramsData.find(p => p.name === "name").value
    const email = paramsData.find(p => p.name === "email").value
    const age = Number(paramsData.find(p => p.name === "age").value)
    const id = users.sort((a, b) => b.id - a.id)[0].id + 1
    const newUser = {
        id,
        name,
        email,
        age
    }
    users.push(newUser)
    return [newUser]
}


export const getUserProfile = async (paramsData) => {
    const userParams = paramsData.find(p => p.name === "user").value
    const params = userParams
        .split(",")
        .map(u => u.trim())

    const users = []

    for (const param of params) {
        if (findById(param)) {
            users.push(findById(param))
            continue
        }
        if (findByEmail(param)) {
            users.push(findByEmail(param))
            continue
        }
        if (findByName(param)) {
            users.push(...findByName(param))
            continue
        }
    }

    if (users.length > 0)
        log("User(s) found successfully")

    return users
}

const findById = (id) => users.find(u => u.id === Number(id))

const findByEmail = (email) => users.find(u => u.email === email)

const findByName = (name) => users.filter(u => u.name.toLowerCase().includes(name.toLowerCase()))


