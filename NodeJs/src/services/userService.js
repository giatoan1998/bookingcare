import db from "../models/index";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try{
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        }catch(e) {
            reject(e);
        }
    })
    // ham nay de luon tra ra kq...
}

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);

            if(isExist) {
                // người dùng đã tồn tại
                let user = await db.User.findOne({
                    attributes:['email', 'roleId', 'password'],
                    where: {email: email},
                    raw: true,
                });

                if(user) {
                    // so sánh password...
                    let check = await bcrypt.compareSync(password, user.password);
                    // check trả về true or false
                    console.log(check);
                    if(check) {
                        userData.errCode = 0;
                        userData.errMessage = 'Ok...';
                        delete user.password;
                        userData.user = user;
                    }else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                    }
                }else {
                    userData.errCode = 2;
                    userData.errMessage = `User is not found!`;
                }
            }else {
                userData.errCode = 1;
                userData.errMessage = `Your email is incorrect!`;
            }

            resolve(userData);
        }catch(e) {
            reject(e);
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {email: userEmail}
            })

            if(user) {
                resolve(true);
            }else{
                resolve(false);
            }
        }catch(e) {
            reject(e);
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';

            if(userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }

            if(userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users);

        }catch(e) {
            reject(e);
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkUserEmail(data.email);

            // kiểm tra email đã tồn tại hay chưa...
            if(check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Your email is already in used!'
                })
            }else{
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phonenumber: data.phonenumber,
                gender: data.gender === 1 ? true : false,
                roleId: data.roleId
            })
        }

            resolve({
                errCode: 0,
                message: 'OK'
            })

        }catch(e) {
            reject(e);
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let user = await db.User.findOne({
            where: {id: userId}
        });

        if(!user) {
            resolve({
                errCode: 2,
                errMessage: 'User not found.'
            })
        }

        await db.User.destroy({
            where: {id: userId}
        });

        resolve({
            errCode: 0,
            message: "The user is deleted."
        })
    })
}

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if(!data.id){
                resolve({
                    errCode: 2,
                    errMessage: "Missing required parameters"
                })
            }
            let user = await db.User.findOne({
                where: {id: data.id},
                raw: false,
            })

            if(user){
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;

                await user.save();
                resolve({
                    errCode: 0,
                    message: "Update the user succeeds."
                });
            }
            else{
                resolve({
                    errCode: 1,
                    errMessage: "The user not found"
                });
            }
        }catch(e){
            reject(e);
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
}