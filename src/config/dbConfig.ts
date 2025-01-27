import { DataSource } from "typeorm"

class DBconnection {
   private connect() {
        return new DataSource({
            type: "mysql",
            host: "localhost",
            port: 3306,
            username: "root",
            password: "", 
            database: "lms", 
            entities: [], 
            synchronize: true, 
            logging: true,
        });

    }
    establishConnection() {
        this.connect().initialize()
            .then(() => {
                console.log("database connected succesfully");

            }).catch((err) => {
                console.log('Unable to connect to the database:', err);

            })
    }
}

export default DBconnection