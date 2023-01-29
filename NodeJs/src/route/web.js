// khi truy cap vao webside thi no chay vao file nay dau tien...
import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/crud', homeController.getCRUD);

    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.displayGetCRUD);

    router.get('/edit-crud', homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD);// update user...
    router.get('/delete-crud', homeController.deleteCRUD);// delete user...

    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUser);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);


    // khai báo router

    return app.use("/", router)
    // có nghĩa là bắt đầu bằng dấu / và sử dụng tất cả các file router mà ta khai báo...
}

module.exports = initWebRoutes;